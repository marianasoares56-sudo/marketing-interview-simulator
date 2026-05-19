'use client';

import { useState, useMemo } from 'react';
import type { Question } from '@/lib/types';

interface AnswerInputProps {
  question: Question;
  onSubmit: (answer: string, isMultipleChoice: boolean) => void;
  isLoading: boolean;
}

// Shuffle once per question using a seeded approach (useMemo keeps it stable)
function shuffleWithOrigins(options: string[]): { text: string; originalIndex: number }[] {
  const tagged = options.map((text, originalIndex) => ({ text, originalIndex }));
  for (let i = tagged.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [tagged[i], tagged[j]] = [tagged[j], tagged[i]];
  }
  return tagged;
}

// originalIndex 0=A(best), 1=B, 2=C, 3=D(worst) → score range
const scoreLabels: Record<number, string> = {
  0: 'strongest approach',
  1: 'good but incomplete',
  2: 'weaker approach',
  3: 'poor approach',
};

export default function AnswerInput({ question, onSubmit, isLoading }: AnswerInputProps) {
  const [mode, setMode] = useState<'text' | 'mc'>('text');
  const [textAnswer, setTextAnswer] = useState('');
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [selectedOriginalIndex, setSelectedOriginalIndex] = useState<number | null>(null);

  // Shuffle once when component mounts for this question
  const shuffledOptions = useMemo(
    () => shuffleWithOrigins(question.multipleChoice),
    [question.id] // eslint-disable-line react-hooks/exhaustive-deps
  );

  const canSubmit = mode === 'text' ? textAnswer.trim().length > 20 : selectedOption !== null;

  function handleSubmit() {
    if (!canSubmit || isLoading) return;
    const answer = mode === 'text'
      ? textAnswer.trim()
      : `[Quality: ${scoreLabels[selectedOriginalIndex!]}] ${selectedOption!}`;
    onSubmit(answer, mode === 'mc');
  }

  return (
    <div className="bg-navy-800/60 border border-navy-600 rounded-2xl p-6 backdrop-blur-sm">
      <div className="flex items-center gap-1 mb-6 bg-navy-900/60 p-1 rounded-xl w-fit">
        <button
          onClick={() => setMode('text')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            mode === 'text'
              ? 'bg-gold-500 text-navy-950 shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Write Answer
        </button>
        <button
          onClick={() => setMode('mc')}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
            mode === 'mc'
              ? 'bg-gold-500 text-navy-950 shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          Multiple Choice
        </button>
      </div>

      {mode === 'text' ? (
        <div>
          <textarea
            value={textAnswer}
            onChange={(e) => setTextAnswer(e.target.value)}
            placeholder="Write your answer here. Be specific and use examples where possible..."
            rows={7}
            className="w-full bg-navy-900/50 border border-navy-600 rounded-xl p-4 text-white placeholder-slate-500 text-sm leading-relaxed resize-none focus:outline-none focus:ring-2 focus:ring-gold-500 focus:border-transparent transition"
          />
          <p className="text-xs text-slate-500 mt-2">
            {textAnswer.trim().length} characters
            {textAnswer.trim().length < 20 && textAnswer.trim().length > 0 && (
              <span className="text-amber-400"> — write at least 20 characters</span>
            )}
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {shuffledOptions.map(({ text, originalIndex }, idx) => (
            <button
              key={idx}
              onClick={() => { setSelectedOption(text); setSelectedOriginalIndex(originalIndex); }}
              className={`w-full text-left p-4 rounded-xl border text-sm leading-relaxed transition-all ${
                selectedOption === text
                  ? 'border-gold-500 bg-gold-500/10 text-white'
                  : 'border-navy-600 bg-navy-900/40 text-slate-300 hover:border-navy-400 hover:bg-navy-800/60'
              }`}
            >
              <span className="font-semibold mr-2 text-slate-400">
                {String.fromCharCode(65 + idx)}.
              </span>
              {text}
            </button>
          ))}
        </div>
      )}

      <button
        onClick={handleSubmit}
        disabled={!canSubmit || isLoading}
        className={`mt-6 w-full py-3 rounded-xl font-semibold text-sm transition-all ${
          canSubmit && !isLoading
            ? 'bg-gold-500 hover:bg-gold-400 text-navy-950 shadow-lg hover:shadow-gold-500/25'
            : 'bg-navy-700 text-slate-500 cursor-not-allowed'
        }`}
      >
        {isLoading ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
            Analyzing your answer…
          </span>
        ) : (
          'Submit Answer'
        )}
      </button>
    </div>
  );
}
