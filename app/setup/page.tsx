import Link from 'next/link';
import SetupForm from '@/components/SetupForm';

export default function SetupPage() {
  return (
    <main className="min-h-screen bg-navy-950 px-6 py-12">
      <div className="max-w-2xl mx-auto">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-slate-400 hover:text-white text-sm font-medium mb-8 transition-colors"
        >
          ← Back
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">Configure Your Interview</h1>
          <p className="text-slate-400">
            Choose a question type, difficulty level, and optionally paste a job description to
            generate tailored questions.
          </p>
        </div>

        <div className="bg-navy-800/40 border border-navy-700 rounded-2xl p-6 backdrop-blur-sm">
          <SetupForm />
        </div>
      </div>
    </main>
  );
}
