import Link from 'next/link';

const features = [
  {
    icon: '🎯',
    title: 'STAR Behavioral',
    desc: 'Practice structured behavioral answers evaluated against the Situation-Task-Action-Result framework.',
  },
  {
    icon: '📊',
    title: 'Case & Situational',
    desc: 'Tackle open-ended case questions and hypothetical scenarios requiring business judgment.',
  },
  {
    icon: '🤖',
    title: 'AI-Powered Feedback',
    desc: 'Get personalized strengths, areas for improvement, and a score after every answer.',
  },
  {
    icon: '💼',
    title: 'Job Description Mode',
    desc: 'Paste any job description to generate role-specific questions tailored to that position.',
  },
  {
    icon: '📈',
    title: 'Difficulty Levels',
    desc: 'Choose Easy (screening), Medium (core recruiting), or Hard (final round at top firms).',
  },
  {
    icon: '✍️',
    title: 'Two Answer Modes',
    desc: 'Write a free-form response or pick from multiple-choice options — both get full AI analysis.',
  },
];

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-navy-950 overflow-hidden">
      {/* Hero */}
      <section className="relative px-6 pt-20 pb-24 flex flex-col items-center text-center">
        <div
          aria-hidden
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(245,158,11,0.12) 0%, transparent 70%)',
          }}
        />

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-500/10 border border-gold-500/30 text-gold-400 text-xs font-semibold uppercase tracking-widest mb-6">
          <span className="w-1.5 h-1.5 rounded-full bg-gold-400 animate-pulse" />
          Powered by Claude AI
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold text-white leading-tight max-w-3xl mb-6">
          Ace Your Next{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-gold-400 to-gold-600">
            Interview
          </span>
        </h1>

        <p className="text-slate-400 text-lg max-w-xl mb-10 leading-relaxed">
          AI-powered behavioral, case, and situational interview practice — with detailed feedback
          personalized to your FMCG marketing background and target roles.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 items-center">
          <Link
            href="/setup"
            className="px-8 py-4 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold rounded-xl text-base shadow-lg hover:shadow-gold-500/30 transition-all"
          >
            Start Practicing →
          </Link>
          <a
            href="#features"
            className="px-8 py-4 border border-navy-600 hover:border-navy-400 text-slate-300 hover:text-white font-semibold rounded-xl text-base transition-all"
          >
            Learn More
          </a>
        </div>

        {/* Stats row */}
        <div className="mt-16 flex flex-wrap justify-center gap-10">
          {[
            { label: 'Question Types', value: '3' },
            { label: 'Difficulty Levels', value: '3' },
            { label: 'Questions per Session', value: '5' },
            { label: 'Feedback Dimensions', value: '4+' },
          ].map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-3xl font-extrabold text-gold-400">{stat.value}</div>
              <div className="text-sm text-slate-500 mt-1">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section id="features" className="px-6 py-20 max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold text-white text-center mb-3">
          Everything you need to prepare
        </h2>
        <p className="text-slate-400 text-center mb-12">
          Built for marketing professionals targeting senior leadership roles across FMCG, tech, and consulting.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f) => (
            <div
              key={f.title}
              className="bg-navy-800/50 border border-navy-700 rounded-2xl p-6 hover:border-navy-500 transition-all"
            >
              <div className="text-3xl mb-3">{f.icon}</div>
              <h3 className="text-white font-semibold mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA bottom */}
      <section className="px-6 py-20 text-center">
        <div className="max-w-xl mx-auto bg-gradient-to-br from-navy-800 to-navy-900 border border-navy-600 rounded-3xl p-10">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to practice?</h2>
          <p className="text-slate-400 mb-8">
            Generate your first set of questions in under 30 seconds.
          </p>
          <Link
            href="/setup"
            className="inline-block px-8 py-4 bg-gold-500 hover:bg-gold-400 text-navy-950 font-bold rounded-xl text-base shadow-lg hover:shadow-gold-500/30 transition-all"
          >
            Start Interview →
          </Link>
        </div>
      </section>

      <footer className="text-center text-slate-600 text-xs pb-8">
        Interview Simulator · Powered by Claude AI
      </footer>
    </main>
  );
}
