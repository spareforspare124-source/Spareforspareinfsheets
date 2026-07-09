import React from 'react';
import { HOW_IT_WORKS } from '../../data/mock';
import { ArrowDown } from 'lucide-react';
import Reveal from './Reveal';
import { DoodleLaptop } from '../decor/StudentDoodles';

export default function HowItWorks() {
  return (
    <section id="how" className="section-bg">
      <div className="max-w-[1280px] mx-auto px-6 py-28 lg:py-36 min-h-[85svh] flex flex-col justify-center">
        <Reveal>
          <div className="relative text-center max-w-[860px] mx-auto">
            <div className="eyebrow mb-5">How it works</div>
            <h2 className="h-display text-[46px] sm:text-[60px] lg:text-[70px] leading-[1.05]">From your first worksheet to mastery.</h2>
            <p className="mt-6 text-[17px] sm:text-[18px] text-slate-500 leading-relaxed max-w-[680px] mx-auto">
              A simple loop that adapts to you. Every step feeds the next, so practice becomes more targeted with time.
            </p>
            <div className="hidden lg:block absolute -left-48 top-8"><DoodleLaptop /></div>
          </div>
        </Reveal>
        <div className="mt-16 max-w-[900px] mx-auto w-full flex flex-col items-stretch">
          {HOW_IT_WORKS.map((s, i) => (
            <React.Fragment key={s.n}>
              <Reveal delay={i * 0.06}>
                <div className="card-soft px-7 py-7 flex items-start gap-6 hover-lift">
                  <div className="shrink-0 text-[44px] sm:text-[54px] font-semibold tracking-tight text-blue-500/80 leading-none tabular-nums select-none">{s.n}</div>
                  <div className="min-w-0 pt-1">
                    <div className="text-[19px] sm:text-[22px] font-semibold text-slate-900">{s.title}</div>
                    <p className="text-[15px] sm:text-[16px] text-slate-600 mt-2 leading-relaxed">{s.text}</p>
                  </div>
                </div>
              </Reveal>
              {i < HOW_IT_WORKS.length - 1 && (
                <Reveal delay={i * 0.06 + 0.05} y={10}>
                  <div className="flex justify-center py-2.5 text-blue-500">
                    <ArrowDown className="w-6 h-6" strokeWidth={2.4} />
                  </div>
                </Reveal>
              )}
            </React.Fragment>
          ))}
        </div>
      </div>
    </section>
  );
}
