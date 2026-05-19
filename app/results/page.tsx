'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import type { SessionData, Feedback } from '@/lib/types';

const categoryLabels = {
  behavioral: 'Behavioral · STAR',
  case: 'Case Question',
  situational: 'Situational',
};

function ScoreBadge({ score }: { score: number }) {
  const color =
    score >= 8
      ? 'bg-green-900/50 text-green-300 border-green-700'
      : score >= 6
      ? 'bg-gold-500/10 text-gold-400 border-gold-600'
      : 'bg-red-900/50 text-red-300 border-red-700';
  return (
    <span className={`text-sm font-bold px-3 py-1 rounded-full border ${color}`}>
      {score}/10
    </span>
  );
}

function ResultCard({
  questionText,
  answer,
  feedback,
  index,
}: {
  questionText: string;
  answer: string;
  feedback: Feedback;
  index: number;
}) {
  const [open, setOpen] = useState(index === 0);

  return (
    <div className="bg-navy-800/50 border border-navy-700 rounded-2xl overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between p-5 text-left hover:bg-navy-700/30 transition-colors"
      >
        <div className="flex items-center gap-3 min-w-0">
          <span className="text-slate-500 text-sm font-semibold flex-shrink-0">Q{index + 1}</span>
          <p className="text-white text-sm font-medium truncate">{questionText}</p>
        </div>
        <div className="flex items-center gap-3 flex-shrink-0 ml-3">
          <ScoreBadge score={feedback.score} />
          <span className="text-slate-400 text-xs">{open ? '▲' : '▼'}</span>
        </div>
      </button>

      {open && (
        <div className="px-5 pb-5 space-y-4 border-t border-navy-700 pt-4">
          {/* Answer */}
          <div>
            <p className="text-xs text-slate-500 uppercase tracking-widest font-semibold mb-2">
              Your Answer
            </p>
            <p className="text-slate-300 text-sm leading-relaxed bg-navy-900/40 rounded-xl p-3 italic">
              &ldquo;{answer}&rdquo;
            </p>
          </div>

          {/* Overall comment */}
          <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-gold-500 pl-4 italic">
            {feedback.overallComment}
          </p>

          {/* Strengths / Improvements */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <div className="bg-green-950/30 border border-green-800/50 rounded-xl p-4">
              <p className="text-green-400 font-semibold text-xs uppercase tracking-widest mb-3">
                ✓ Strengths
              </p>
              <ul className="space-y-2">
                {feedback.strengths.map((s, i) => (
                  <li key={i} className="text-sm text-green-200 flex gap-2">
                    <span className="text-green-500 mt-0.5 flex-shrink-0">•</span>
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-amber-950/30 border border-amber-800/50 rounded-xl p-4">
              <p className="text-amber-400 font-semibold text-xs uppercase tracking-widest mb-3">
                △ Areas to Improve
              </p>
              <ul className="space-y-2">
                {feedback.improvements.map((imp, i) => (
                  <li key={i} className="text-sm text-amber-200 flex gap-2">
                    <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>
                    {imp}
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* STAR breakdown */}
          {feedback.starAnalysis && (
            <div className="bg-indigo-950/30 border border-indigo-800/50 rounded-xl p-4">
              <p className="text-indigo-400 font-semibold text-xs uppercase tracking-widest mb-3">
                STAR Framework Breakdown
              </p>
              <div className="grid grid-cols-2 gap-3">
                {(['situation', 'task', 'action', 'result'] as const).map((key) => (
                  <div key={key} className="bg-navy-900/40 rounded-lg p-3">
                    <p className="text-indigo-300 text-xs font-semibold uppercase mb-1 tracking-wide">
                      {key}
                    </p>
                    <p className="text-slate-300 text-xs leading-relaxed">
                      {feedback.starAnalysis![key]}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function ResultsPage() {
  const router = useRouter();
  const [session, setSession] = useState<SessionData | null>(null);

  useEffect(() => {
    const raw = sessionStorage.getItem('interviewSession');
    if (!raw) {
      router.push('/setup');
      return;
    }
    setSession(JSON.parse(raw));
  }, [router]);

  if (!session) {
    return (
      <div className="min-h-screen bg-navy-950 flex items-center justify-center">
        <div className="text-slate-400">Loading…</div>
      </div>
    );
  }

  const feedbackList = session.questions.map((q) => session.feedback[q.id]).filter(Boolean);
  const avgScore =
    feedbackList.length > 0
      ? Math.round(feedbackList.reduce((sum, f) => sum + f.score, 0) / feedbackList.length)
      : 0;

  const scoreLabel =
    avgScore >= 8 ? 'Strong performance' : avgScore >= 6 ? 'Solid — room to grow' : 'Needs more practice';
  const scoreColor =
    avgScore >= 8 ? 'text-green-400' : avgScore >= 6 ? 'text-gold-400' : 'text-red-400';

  return (
    <main className="min-h-screen bg-navy-950 px-6 py-12">
      <div className="max-w-3xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <p className="text-slate-400 text-sm mb-1">Interview complete</p>
          <h1 className="text-3xl font-bold text-white">Your Results</h1>
        </div>

        {/* Summary card */}
        <div className="bg-navy-800/60 border border-navy-600 rounded-2xl p-6 backdrop-blur-sm">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-6">
            <div className="text-center">
              <div className={`text-5xl font-extrabold ${scoreColor}`}>{avgScore}</div>
              <div className="text-slate-500 text-xs mt-1">avg / 10</div>
            </div>
            <div className="flex-1">
              <p className={`text-lg font-semibold mb-1 ${scoreColor}`}>{scoreLabel}</p>
              <p className="text-slate-400 text-sm">
                {session.questions.length} questions answered across{' '}
                <span className="text-white capitalize">{session.config.category}</span> ·{' '}
                <span className="text-white capitalize">{session.config.difficulty}</span> difficulty
              </p>
              {session.config.jobDescription && (
                <p className="text-xs text-slate-500 mt-1">Job description mode was active</p>
              )}
            </div>

            {/* Score distribution */}
            <div className="flex gap-1 items-end h-10">
              {feedbackList.map((f, i) => {
                const h = Math.max(4, (f.score / 10) * 40);
                const bg =
                  f.score >= 8
                    ? 'bg-green-500'
                    : f.score >= 6
                    ? 'bg-gold-500'
                    : 'bg-red-500';
                return (
                  <div
                    key={i}
                    title={`Q${i + 1}: ${f.score}/10`}
                    className={`w-4 rounded-sm ${bg} opacity-80`}
                    style={{ height: `${h}px` }}
                  />
                );
              })}
            </div>
          </div>
        </div>

        {/* Per-question results */}
        <div className="space-y-3">
          {session.questions.map((q, i) => {
            const feedback = session.feedback[q.id];
            const answer = session.answers[q.id];
            if (!feedback || !answer) return null;
            return (
              <ResultCard
                key={q.id}
                questionText={q.text}
                answer={answer}
                feedback={feedback}
                index={i}
              />
            );
          })}
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            href="/setup"
            className="flex-1 py-3 text-center bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold rounded-xl text-sm transition-all shadow-lg"
          >
            Practice Again →
          </Link>
          <Link
            href="/"
            className="flex-1 py-3 text-center border border-navy-600 hover:border-navy-400 text-slate-300 hover:text-white font-semibold rounded-xl text-sm transition-all"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </main>
  );
}
