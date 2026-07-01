import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { LayoutDashboard, BookOpen, FileText, TrendingUp, Target, Sparkles, AlertCircle, GraduationCap, ChevronRight, Check, ArrowRight, X } from 'lucide-react';

const STEPS = [
  {
    icon: LayoutDashboard,
    eyebrow: 'Welcome',
    title: 'Welcome to InfinitySheets',
    body: 'A quick 5-step tour so you can hit the ground running. You can replay this anytime from Settings.',
    bullets: ['Personalized practice', 'Adaptive next steps', 'Tracks your progress'],
    tone: 'primary',
  },
  {
    icon: GraduationCap,
    eyebrow: 'Step 1',
    title: 'Add your courses',
    body: 'Open "My Courses" to add the subjects or courses you are studying. We use them to tailor recommendations.',
    bullets: ['Add a course (e.g., IB Physics HL)', 'Set a target grade', 'View progress per course'],
    tone: 'secondary',
  },
  {
    icon: FileText,
    eyebrow: 'Step 2',
    title: 'Build a worksheet',
    body: 'Go to Worksheets and choose subject, topic, difficulty, and length. We generate questions instantly.',
    bullets: ['Multiple choice or typed', 'Set duration or untimed', '5, 10, or 15 questions'],
    tone: 'accent',
  },
  {
    icon: Target,
    eyebrow: 'Step 3',
    title: 'Review weaknesses',
    body: 'Missed questions automatically appear in Mistake History. Strengths & Weaknesses shows your topic accuracy.',
    bullets: ['Retry missed questions', 'Spot weak topics fast', 'Get targeted suggestions'],
    tone: 'success',
  },
  {
    icon: TrendingUp,
    eyebrow: 'Step 4',
    title: 'Track and improve',
    body: 'Your dashboard shows readiness score, streak, daily goal, and a personalized recommended action.',
    bullets: ['Daily goal progress', 'Streak and stats', 'Smart recommendations'],
    tone: 'primary',
  },
];

const toneClass = {
  primary: { bg: 'bg-blue-100', text: 'text-blue-700', bar: 'bg-blue-500' },
  secondary: { bg: 'bg-violet-100', text: 'text-violet-700', bar: 'bg-violet-500' },
  accent: { bg: 'bg-red-100', text: 'text-red-700', bar: 'bg-red-500' },
  success: { bg: 'bg-emerald-100', text: 'text-emerald-700', bar: 'bg-emerald-500' },
};

export default function Tutorial({ onDone }) {
  const { state, finishTutorial } = useApp();
  const [i, setI] = useState(0);
  const step = STEPS[i];
  const Icon = step.icon;
  const tone = toneClass[step.tone];
  const isLast = i === STEPS.length - 1;

  const complete = () => { finishTutorial(); if (onDone) onDone(); };
  const skip = () => { finishTutorial(); if (onDone) onDone(); };

  return (
    <div className="min-h-screen flex items-center justify-center px-6 py-10 section-bg">
      <div className="w-full max-w-[920px]">
        <div className="flex items-center justify-between mb-6">
          <div className="text-[12.5px] text-slate-500">Welcome, {state.user?.name || 'student'} · Quick tour</div>
          <button onClick={skip} className="inline-flex items-center gap-1.5 text-[13px] text-slate-500 hover:text-slate-800 transition-colors">
            Skip tour <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="rounded-2xl bg-white border border-[color:var(--color-border)] overflow-hidden">
          {/* progress bar */}
          <div className="h-1 w-full bg-slate-100">
            <div className={`h-full ${tone.bar} transition-all duration-500`} style={{ width: `${((i + 1) / STEPS.length) * 100}%` }} />
          </div>

          <div className="grid md:grid-cols-[1.05fr_1fr]">
            <div className="p-8 lg:p-10">
              <div className="flex items-center gap-2 mb-5">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${tone.bg} ${tone.text}`}>
                  <Icon className="w-5 h-5" />
                </div>
                <div className="text-[10px] tracking-[0.16em] uppercase font-semibold text-slate-500">{step.eyebrow}</div>
              </div>
              <h2 className="text-[30px] sm:text-[36px] font-semibold tracking-tight text-slate-900 leading-tight">{step.title}</h2>
              <p className="mt-3 text-[15px] text-slate-600 leading-relaxed">{step.body}</p>
              <ul className="mt-6 flex flex-col gap-2.5">
                {step.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5">
                    <span className={`shrink-0 w-5 h-5 rounded-full ${tone.bg} ${tone.text} flex items-center justify-center mt-0.5`}>
                      <Check className="w-3 h-3" strokeWidth={3} />
                    </span>
                    <span className="text-[14px] text-slate-700">{b}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="bg-slate-50 border-t md:border-t-0 md:border-l border-[color:var(--color-border)] p-8 lg:p-10 flex items-center justify-center">
              <Preview index={i} />
            </div>
          </div>

          {/* footer */}
          <div className="px-6 py-5 border-t border-[color:var(--color-border)] flex items-center justify-between gap-4">
            <div className="flex items-center gap-1.5">
              {STEPS.map((s, idx) => (
                <button key={s.title || idx} onClick={() => setI(idx)} aria-label={`Go to step ${idx + 1}`}
                  className={`w-2 h-2 rounded-full transition-colors ${idx === i ? 'bg-blue-600' : (idx < i ? 'bg-blue-300' : 'bg-slate-300')}`} />
              ))}
              <span className="ml-3 text-[12.5px] text-slate-500 tabular-nums">{i + 1} / {STEPS.length}</span>
            </div>
            <div className="flex items-center gap-2">
              {i > 0 && (
                <button onClick={() => setI((v) => v - 1)} className="btn-outline-dark px-4 py-2 rounded-lg text-[13.5px] font-medium">Back</button>
              )}
              {!isLast ? (
                <button onClick={() => setI((v) => v + 1)} className="btn-violet inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13.5px] font-medium">
                  Next <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button onClick={complete} className="btn-violet inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13.5px] font-medium">
                  Get started <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Preview({ index }) {
  if (index === 0) {
    return (
      <div className="w-full max-w-[320px] rounded-xl border border-[color:var(--color-border)] bg-white p-5">
        <div className="text-[10px] tracking-[0.14em] uppercase font-semibold text-slate-500 mb-2">Your study overview</div>
        <div className="flex items-center justify-between">
          <div className="text-[18px] font-semibold tracking-tight">Ready for the next win?</div>
          <div className="w-12 h-12 rounded-full border-[5px] border-blue-100 border-t-blue-500" />
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          {['Readiness 82%', 'Streak 9d', 'Questions 428', 'Sheets 31'].map((t) => (
            <div key={t} className="rounded-md border border-slate-100 px-2.5 py-2 text-[11.5px] text-slate-700">{t}</div>
          ))}
        </div>
      </div>
    );
  }
  if (index === 1) {
    return (
      <div className="w-full max-w-[320px] flex flex-col gap-2">
        {[{ n: 'IB Physics HL', g: 'Target: 7' }, { n: 'SAT Math', g: 'Target: 780' }, { n: 'IGCSE Bio', g: 'Target: A*' }].map((c) => (
          <div key={c.n} className="rounded-xl border border-[color:var(--color-border)] bg-white px-4 py-3 flex items-center justify-between">
            <div className="min-w-0">
              <div className="text-[13.5px] font-semibold text-slate-900">{c.n}</div>
              <div className="text-[12px] text-slate-500">{c.g}</div>
            </div>
            <ChevronRight className="w-4 h-4 text-slate-400" />
          </div>
        ))}
      </div>
    );
  }
  if (index === 2) {
    return (
      <div className="w-full max-w-[320px] rounded-xl border border-[color:var(--color-border)] bg-white p-5">
        <div className="text-[11px] text-slate-500 mb-2">Question 1 of 10</div>
        <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden mb-4">
          <div className="h-full bg-blue-500" style={{ width: '10%' }} />
        </div>
        <div className="text-[14px] font-semibold mb-3">Coulomb’s law force is inversely proportional to:</div>
        <div className="flex flex-col gap-2">
          {['Distance', 'Distance squared', 'Charge', 'Charge squared'].map((o, idx) => (
            <div key={o} className={`px-3 py-2 rounded-md border text-[12.5px] ${idx === 1 ? 'border-blue-400 bg-blue-50 text-blue-800' : 'border-slate-200 text-slate-700'}`}>{String.fromCharCode(65 + idx)}. {o}</div>
          ))}
        </div>
      </div>
    );
  }
  if (index === 3) {
    return (
      <div className="w-full max-w-[320px] flex flex-col gap-3">
        {[{ t: 'Electrostatics', a: 42, b: 'bg-rose-400' }, { t: 'Optics', a: 65, b: 'bg-amber-400' }, { t: 'Mechanics', a: 88, b: 'bg-emerald-500' }].map((r) => (
          <div key={r.t} className="rounded-xl border border-[color:var(--color-border)] bg-white p-3">
            <div className="flex items-center justify-between text-[12.5px] text-slate-700"><span>{r.t}</span><span>{r.a}%</span></div>
            <div className="h-1.5 rounded-full bg-slate-100 mt-2 overflow-hidden"><div className={`h-full ${r.b}`} style={{ width: `${r.a}%` }} /></div>
          </div>
        ))}
      </div>
    );
  }
  return (
    <div className="w-full max-w-[320px] rounded-xl border border-[color:var(--color-border)] bg-white p-5">
      <div className="text-[11px] tracking-[0.14em] uppercase font-semibold text-slate-500 mb-3">Recommended action</div>
      <div className="flex items-start gap-3">
        <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center"><Sparkles className="w-4 h-4" /></div>
        <div>
          <div className="text-[14px] font-semibold text-slate-900">Complete a 10-question Electrostatics worksheet.</div>
          <div className="text-[12px] text-slate-500 mt-1">Current accuracy 42% · Physics</div>
        </div>
      </div>
      <div className="flex items-center gap-2 mt-4 text-[12.5px]">
        <span className="px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 font-medium">Goal 6/10</span>
        <span className="px-2 py-0.5 rounded-md bg-blue-100 text-blue-700 font-medium">Streak 9d</span>
      </div>
    </div>
  );
}
