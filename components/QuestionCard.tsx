'use client';

import type { Question } from '@/lib/types';

interface QuestionCardProps {
  question: Question;
  questionNumber: number;
}

const categoryLabels = {
  behavioral: 'Behavioral · STAR',
  case: 'Case Question',
  situational: 'Situational',
};

const categoryColors = {
  behavioral: 'bg-indigo-900/60 text-indigo-300 border-indigo-700',
  case: 'bg-emerald-900/60 text-emerald-300 border-emerald-700',
  situational: 'bg-purple-900/60 text-purple-300 border-purple-700',
};

const difficultyColors = {
  easy: 'bg-green-900/50 text-green-300 border-green-700',
  medium: 'bg-amber-900/50 text-amber-300 border-amber-700',
  hard: 'bg-red-900/50 text-red-300 border-red-700',
};

export default function QuestionCard({ question, questionNumber }: QuestionCardProps) {
  return (
    <div className="bg-navy-800/60 border border-navy-600 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex flex-wrap gap-2 mb-4">
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full border ${categoryColors[question.category]}`}
        >
          {categoryLabels[question.category]}
        </span>
        <span
          className={`text-xs font-semibold px-3 py-1 rounded-full border capitalize ${difficultyColors[question.difficulty]}`}
        >
          {question.difficulty}
        </span>
      </div>

      <p className="text-slate-200 text-sm font-medium mb-1 uppercase tracking-widest">
        Question {questionNumber}
      </p>
      <p className="text-white text-xl font-semibold leading-relaxed mb-4">
        {question.text}
      </p>

      {question.hint && (
        <div className="mt-4 p-3 bg-navy-900/50 border border-navy-600 rounded-xl">
          <p className="text-xs text-slate-400 font-medium uppercase tracking-wide mb-1">Hint</p>
          <p className="text-sm text-slate-300 italic">{question.hint}</p>
        </div>
      )}
    </div>
  );
}
