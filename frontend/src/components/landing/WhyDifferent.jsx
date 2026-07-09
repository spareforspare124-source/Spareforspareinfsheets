import React from 'react';
import { Check, X } from 'lucide-react';
import Reveal from './Reveal';

const COMPARISON = [
  { them: 'Rereading notes until they blur together', us: 'Answering exam-style questions that stick' },
  { them: 'Highlighting feels productive, proves nothing', us: 'Every answer is marked, instantly' },
  { them: 'Practicing what you already know', us: 'Sheets tuned to your weak concepts' },
  { them: 'One-size-fits-all past papers', us: 'Difficulty tweaked to your level, per topic' },
  { them: 'No idea if you are actually ready', us: 'A live score and predicted grade' },
];

export default function WhyDifferent() {
  return (
    <section className="section-dark overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 py-28 lg:py-36 min-h-[80svh] flex flex-col justify-center">
        <Reveal>
          <div className="text-center max-w-[860px] mx-auto">
            <div className="text-[11px] tracking-[0.14em] uppercase font-semibold text-blue-300 mb-5">Why InfinitySheets?</div>
            <h2 className="h-display text-white text-[44px] sm:text-[60px] lg:text-[72px] leading-[1.05]">
              Real practice, real results.
            </h2>
            <p className="mt-7 text-[16.5px] sm:text-[18px] leading-relaxed text-slate-300 max-w-[720px] mx-auto">
              Practice sheets catered to your exact exam&mdash;the right boards, the right question
              styles, the right mark schemes&mdash;and tweaked to your level as you improve. Where
              you struggle, the sheets meet you where you are and build you up. Where you are
              strong, they push you further. That is how scores actually move.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-16 max-w-[920px] mx-auto w-full">
            <div className="rounded-3xl border border-slate-700 bg-slate-900/50 backdrop-blur overflow-hidden">
              <div className="grid grid-cols-2 border-b border-slate-700">
                <div className="px-6 py-4 text-[13px] font-semibold text-slate-400 uppercase tracking-wider">Traditional studying</div>
                <div className="px-6 py-4 text-[13px] font-semibold text-blue-300 uppercase tracking-wider border-l border-slate-700">InfinitySheets</div>
              </div>
              {COMPARISON.map((row, i) => (
                <div key={i} className={`grid grid-cols-2 ${i > 0 ? 'border-t border-slate-800' : ''}`}>
                  <div className="px-6 py-4 flex items-start gap-3">
                    <X className="w-4 h-4 mt-0.5 shrink-0 text-slate-500" />
                    <span className="text-[14px] text-slate-400 leading-snug">{row.them}</span>
                  </div>
                  <div className="px-6 py-4 flex items-start gap-3 border-l border-slate-800">
                    <Check className="w-4 h-4 mt-0.5 shrink-0 text-emerald-400" strokeWidth={2.6} />
                    <span className="text-[14px] text-slate-100 leading-snug">{row.us}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Reveal>
        <Reveal delay={0.25}>
          <div className="mt-14 grid grid-cols-2 lg:grid-cols-4 gap-3 max-w-[920px] mx-auto w-full">
            <Mini label="Adaptive" value="to your level" />
            <Mini label="Personalized" value="to your weak spots" />
            <Mini label="Instant" value="feedback & marking" />
            <Mini label="Free" value="every feature, no paywall" />
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Mini({ label, value }) {
  return (
    <div className="rounded-xl border border-slate-700 bg-slate-900/40 px-4 py-3">
      <div className="text-[10px] tracking-[0.14em] uppercase font-semibold text-slate-400">{label}</div>
      <div className="text-[14px] text-slate-100 mt-1">{value}</div>
    </div>
  );
}
