'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import type { QuestionCategory, Difficulty, SessionData } from '@/lib/types';

const categories: { value: QuestionCategory; label: string; desc: string; icon: string }[] = [
  { value: 'behavioral', label: 'Behavioral', desc: 'STAR method · past experience', icon: '🎯' },
  { value: 'case', label: 'Case', desc: 'Structured problem-solving', icon: '📊' },
  { value: 'situational', label: 'Situational', desc: 'Hypothetical judgment scenarios', icon: '⚖️' },
];

const difficulties: { value: Difficulty; label: string; desc: string }[] = [
  { value: 'easy', label: 'Easy', desc: 'Screening / first round' },
  { value: 'medium', label: 'Medium', desc: 'Mid-process interviews' },
  { value: 'hard', label: 'Hard', desc: 'Final round · top firms' },
];

export default function SetupForm() {
  const router = useRouter();
  const [category, setCategory] = useState<QuestionCategory>('behavioral');
  const [difficulty, setDifficulty] = useState<Difficulty>('medium');
  const [jobDescription, setJobDescription] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleGenerate() {
    setIsLoading(true);
    setError('');
    try {
      const res = await fetch('/api/generate-questions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ category, difficulty, jobDescription }),
      });
      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? 'Failed to generate questions');
      }
      const { questions } = await res.json();
      const session: SessionData = {
        config: { category, difficulty, jobDescription },
        questions,
        answers: {},
        feedback: {},
      };
      sessionStorage.setItem('interviewSession', JSON.stringify(session));
      router.push('/interview');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-white font-semibold text-base mb-3">Question Type</h2>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {categories.map((cat) => (
            <button
              key={cat.value}
              onClick={() => setCategory(cat.value)}
              className={`p-4 rounded-xl border text-left transition-all ${
                category === cat.value
                  ? 'border-gold-500 bg-gold-500/10'
                  : 'border-navy-600 bg-navy-800/40 hover:border-navy-400'
              }`}
            >
              <div className="text-2xl mb-2">{cat.icon}</div>
              <div className="font-semibold text-white text-sm">{cat.label}</div>
              <div className="text-xs text-slate-400 mt-0.5">{cat.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-white font-semibold text-base mb-3">Difficulty</h2>
        <div className="flex gap-3">
          {difficulties.map((d) => (
            <button
              key={d.value}
              onClick={() => setDifficulty(d.value)}
              className={`flex-1 p-3 rounded-xl border text-center transition-all ${
                difficulty === d.value
                  ? 'border-gold-500 bg-gold-500/10'
                  : 'border-navy-600 bg-navy-800/40 hover:border-navy-400'
              }`}
            >
              <div className="font-semibold text-white text-sm">{d.label}</div>
              <div className="text-xs text-slate-400 mt-0.5">{d.desc}</div>
            </button>
          ))}
        </div>
      </div>

      <div>
        <h2 className="text-white font-semibold text-base mb-1">
          Job Description{' '}
          <span className="text-slate-500 font-normal text-sm">(optional)</span>
        </h2>
        <p className="text-slate-400 text-xs mb-3">
          Paste a job description or role overview to tailor questions to that specific position.
        </p>
        <textarea
          value={jobDescription}
          onChange={(e) => setJobDescription(e.target.value)}
          placeholder="Paste job description text here…"
          rows={5}
          className="w-full bg-navy-900/50 border border-navy-600 rounded-xl p-4 text-white placeholder-slate-600 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition"
        />
      </div>

      {error && (
        <div className="p-4 bg-red-950/40 border border-red-800/50 rounded-xl text-red-300 text-sm">
          {error}
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={isLoading}
        className={`w-full py-4 rounded-xl font-semibold text-base transition-all ${
          !isLoading
            ? 'bg-gold-500 hover:bg-gold-400 text-navy-950 shadow-lg hover:shadow-gold-500/30'
            : 'bg-navy-700 text-slate-500 cursor-not-allowed'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Generating questions…
          </span>
        ) : (
          'Generate Interview Questions →'
        )}
      </button>
    </div>
  );
}
