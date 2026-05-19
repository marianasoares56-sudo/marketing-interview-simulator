'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import QuestionCard from '@/components/QuestionCard';
import AnswerInput from '@/components/AnswerInput';
import FeedbackPanel from '@/components/FeedbackPanel';
import ProgressBar from '@/components/ProgressBar';
import type { SessionData, Feedback } from '@/lib/types';

export default function InterviewPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [activeFeedback, setActiveFeedback] = useState<Feedback | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [streamBuffer, setStreamBuffer] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    const raw = sessionStorage.getItem('interviewSession');
    if (!raw) {
      router.push('/setup');
      return;
    }
    const data: SessionData = JSON.parse(raw);
    setSession(data);

    const answeredCount = Object.keys(data.answers).length;
    if (answeredCount > 0 && answeredCount < data.questions.length) {
      setCurrentIndex(answeredCount);
    } else if (answeredCount === data.questions.length && data.questions.length > 0) {
      router.push('/results');
    }
  }, [router]);

  async function handleSubmitAnswer(answer: string, isMultipleChoice: boolean) {
    if (!session) return;
    setIsAnalyzing(true);
    setStreamBuffer('');
    setError('');

    const question = session.questions[currentIndex];

    try {
      const res = await fetch('/api/analyze-answer', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question, answer, isMultipleChoice }),
      });

      if (!res.ok || !res.body) {
        const errData = await res.json().catch(() => ({}));
        throw new Error((errData as { error?: string }).error ?? 'Failed to analyze answer');
      }

      // Read streamed text
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setStreamBuffer(accumulated);
      }

      // Parse the complete JSON once streaming is done
      let feedback: Feedback;
      try {
        feedback = JSON.parse(accumulated);
      } catch {
        const match = accumulated.match(/\{[\s\S]*\}/);
        if (!match) throw new Error('Could not parse feedback from response');
        feedback = JSON.parse(match[0]);
      }

      const updated: SessionData = {
        ...session,
        answers: { ...session.answers, [question.id]: answer },
        feedback: { ...session.feedback, [question.id]: feedback },
      };
      sessionStorage.setItem('interviewSession', JSON.stringify(updated));
      setSession(updated);
      setActiveFeedback(feedback);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsAnalyzing(false);
      setStreamBuffer('');
    }
  }

  function handleNext() {
    if (!session) return;
    const nextIndex = currentIndex + 1;
    if (nextIndex >= session.questions.length) {
      router.push('/results');
    } else {
      setCurrentIndex(nextIndex);
      setActiveFeedback(null);
      setError('');
    }
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="text-slate-400">Loading…</div>
      </div>
    );
  }

  const question = session.questions[currentIndex];
  const isLastQuestion = currentIndex === session.questions.length - 1;

  if (!question) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="text-slate-400">Loading question…</div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-navy-950 px-6 py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/setup')}
            className="text-slate-400 hover:text-white text-sm font-medium transition-colors"
          >
            ← New Interview
          </button>
          <span className="text-xs text-slate-500 capitalize">
            {session.config.category} · {session.config.difficulty}
          </span>
        </div>

        <ProgressBar
          current={currentIndex + (activeFeedback ? 1 : 0)}
          total={session.questions.length}
        />

        <QuestionCard question={question} questionNumber={currentIndex + 1} />

        {error && (
          <div className="p-4 bg-red-950/40 border border-red-800/50 rounded-xl text-red-300 text-sm">
            {error}
          </div>
        )}

        {/* Streaming loading state */}
        {isAnalyzing && (
          <div className="bg-navy-800/60 border border-navy-600 rounded-2xl p-6 backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-4">
              <svg className="animate-spin h-4 w-4 text-gold-400" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
              </svg>
              <span className="text-slate-400 text-sm font-medium">Analyzing your answer…</span>
            </div>
            {streamBuffer && (
              <div className="font-mono text-xs text-slate-500 bg-navy-900/50 rounded-lg p-3 max-h-32 overflow-hidden leading-relaxed">
                {streamBuffer.slice(-300)}
                <span className="animate-pulse">▌</span>
              </div>
            )}
          </div>
        )}

        {!isAnalyzing && !activeFeedback && (
          <AnswerInput
            question={question}
            onSubmit={handleSubmitAnswer}
            isLoading={false}
          />
        )}

        {!isAnalyzing && activeFeedback && (
          <FeedbackPanel
            feedback={activeFeedback}
            onNext={handleNext}
            isLastQuestion={isLastQuestion}
          />
        )}
      </div>
    </main>
  );
}
