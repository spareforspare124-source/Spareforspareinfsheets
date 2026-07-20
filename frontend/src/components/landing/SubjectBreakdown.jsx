import React from 'react';
import { TrendingUp, Target } from 'lucide-react';
import Reveal from './Reveal';
import { SUBJECT_PROGRESS, subjectStats } from '../../data/landingProgress';
import { DoodleEquations } from '../decor/StudyDoodles';

/* Full per-subject breakdown near the bottom of the page — improvement,
   scores, and grade thresholds for every subject taken. The chart's lines
   and points link here. */
export default function SubjectBreakdown() {
  return (
    <section id="subjects" className="relative section-bg overflow-hidden">
      <div className="hidden lg:block absolute right-[4%] top-16"><DoodleEquations /></div>
      <div className="max-w-[1280px] mx-auto px-6 py-24 lg:py-28">
        <Reveal>
          <div className="max-w-[760px]">
            <div className="eyebrow mb-5">Subject breakdown</div>
            <h2 className="h-display text-[40px] sm:text-[50px] lg:text-[56px]">Every subject, fully accounted for.</h2>
            <p className="mt-4 text-[15.5px] text-slate-500 max-w-[600px]">
              The same view you get inside the app: improvement, averages, and exactly what it takes
              to reach the next grade in each subject you take.
            </p>
          </div>
        </Reveal>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          {SUBJECT_PROGRESS.map((s, i) => {
            const st = subjectStats(s);
            return (
              <Reveal key={s.id} delay={i * 0.08}>
                <div className="liquid-glass rounded-2xl p-6 h-full hover-lift">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full" style={{ background: s.color }} />
                      <h3 className="text-[17px] font-semibold text-slate-900">{s.subject}</h3>
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[12px] font-semibold">
                      <TrendingUp className="w-3.5 h-3.5" /> +{st.improvement}%
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2 mt-5">
                    <Stat label="First" value={`${st.first}%`} />
                    <Stat label="Latest" value={`${st.last}%`} accent />
                    <Stat label="Average" value={`${st.avg}%`} />
                  </div>
                  <div className="mt-5 rounded-xl bg-blue-50/70 border border-blue-100 px-4 py-3">
                    <div className="text-[11px] tracking-wider uppercase font-semibold text-blue-600">Predicted grade</div>
                    <div className="mt-1 flex items-baseline gap-2">
                      <span className="text-[15px] text-slate-400 line-through">{s.predictedFrom}</span>
                      <span className="text-[26px] font-semibold" style={{ color: s.color }}>{s.predictedTo}</span>
                    </div>
                  </div>
                  <div className="mt-3 flex items-start gap-2 text-[12.5px] text-slate-600">
                    <Target className="w-3.5 h-3.5 mt-0.5 shrink-0 text-slate-400" />
                    <span>Next: grade {s.nextThreshold.grade} at {s.nextThreshold.needed}</span>
                  </div>
                  <div className="mt-4 pt-4 border-t border-slate-200/60">
                    <div className="text-[11px] tracking-wider uppercase font-semibold text-slate-400 mb-2">Recent attempts</div>
                    <div className="flex flex-col gap-1.5">
                      {s.attempts.slice(-3).reverse().map((a, j) => (
                        <div key={j} className="flex items-center justify-between text-[12.5px]">
                          <span className="text-slate-600 truncate">{a.topic}</span>
                          <span className="text-slate-400 shrink-0 ml-3">{a.score}% &middot; {a.date}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </Reveal>
            );
          })}
        </div>
        <p className="text-[12px] text-slate-400 mt-6">Illustrative data — your own dashboard builds this from your real worksheets.</p>
      </div>
    </section>
  );
}

function Stat({ label, value, accent }) {
  return (
    <div className="rounded-lg border border-slate-200/70 bg-white/60 px-3 py-2 text-center">
      <div className="text-[10px] tracking-wider uppercase font-semibold text-slate-400">{label}</div>
      <div className={`text-[16px] font-semibold ${accent ? 'text-blue-600' : 'text-slate-800'}`}>{value}</div>
    </div>
  );
}
