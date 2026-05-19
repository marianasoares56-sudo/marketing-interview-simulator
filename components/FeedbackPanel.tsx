'use client';

import type { Feedback } from '@/lib/types';

interface FeedbackPanelProps {
  feedback: Feedback;
  onNext: () => void;
  isLastQuestion: boolean;
}

function ScoreRing({ score }: { score: number }) {
  const color =
    score >= 8 ? 'text-green-400' : score >= 6 ? 'text-gold-400' : 'text-red-400';
  const ring =
    score >= 8 ? 'stroke-green-400' : score >= 6 ? 'stroke-gold-400' : 'stroke-red-400';
  const pct = (score / 10) * 100;
  const circumference = 2 * Math.PI * 20;
  const dash = (pct / 100) * circumference;

  return (
    <div className="flex flex-col items-center">
      <svg width="64" height="64" viewBox="0 0 48 48" className="-rotate-90">
        <circle cx="24" cy="24" r="20" fill="none" stroke="#1e2d3d" strokeWidth="4" />
        <circle
          cx="24" cy="24" r="20" fill="none"
          className={ring}
          strokeWidth="4"
          strokeDasharray={`${dash} ${circumference}`}
          strokeLinecap="round"
        />
      </svg>
      <span className={`text-2xl font-bold -mt-12 ${color}`}>{score}</span>
      <span className="text-xs text-slate-500 mt-8">/10</span>
    </div>
  );
}

export default function FeedbackPanel({ feedback, onNext, isLastQuestion }: FeedbackPanelProps) {
  return (
    <div className="bg-navy-800/60 border border-navy-600 rounded-2xl p-6 backdrop-blur-sm space-y-5 animate-fade-in">
      <div className="flex items-center justify-between">
        <h3 className="text-white font-semibold text-lg">AI Feedback</h3>
        <ScoreRing score={feedback.score} />
      </div>

      <p className="text-slate-300 text-sm leading-relaxed border-l-2 border-gold-500 pl-4 italic">
        {feedback.overallComment}
      </p>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="bg-green-950/30 border border-green-800/50 rounded-xl p-4">
          <p className="text-green-400 font-semibold text-xs uppercase tracking-widest mb-3 flex items-center gap-1">
            <span>✓</span> Strengths
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
          <p className="text-amber-400 font-semibold text-xs uppercase tracking-widest mb-3 flex items-center gap-1">
            <span>△</span> Areas to Improve
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

      <button
        onClick={onNext}
        className="w-full py-3 bg-gold-500 hover:bg-gold-400 text-navy-950 font-semibold rounded-xl text-sm transition-all shadow-lg hover:shadow-gold-500/25"
      >
        {isLastQuestion ? 'View Results Summary →' : 'Next Question →'}
      </button>
    </div>
  );
}
