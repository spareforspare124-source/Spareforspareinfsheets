import React from 'react';
import { Check, ArrowRight } from 'lucide-react';
import Reveal from './Reveal';

const FEATURES = [
  'Personalized worksheets for your exact syllabus',
  'Weakness analysis on every answer',
  'Accurate scores & predicted grades',
  'Custom feedback & advice after every sheet',
  'Progress tracking & streaks',
];

export default function Pricing() {
  return (
    <section id="pricing" className="section-light">
      <div className="max-w-[1280px] mx-auto px-6 py-28 lg:py-32">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center max-w-[1040px] mx-auto">
          <Reveal>
            <div>
              <div className="eyebrow mb-5">Pricing</div>
              <h2 className="h-display text-[44px] sm:text-[54px] lg:text-[60px] leading-[1.05]">Your grades deserve better. This costs nothing.</h2>
              <p className="mt-6 text-[16px] text-slate-600 leading-relaxed max-w-[520px]">
                The training that moves exam results has always sat behind a price&mdash;coaching fees, paid
                question banks, private tutors. We built InfinitySheets so the only thing standing between
                you and a better grade is the decision to start. Every feature. Every subject. Free.
              </p>
              <p className="mt-4 text-[16px] text-slate-600 leading-relaxed max-w-[520px]">
                One worksheet today is how it begins. Ten weeks from now, it looks like a grade you
                didn&rsquo;t think was yours.
              </p>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="rounded-3xl p-8 bg-slate-900 text-white border border-slate-800 shadow-2xl shadow-slate-900/20">
              <div className="text-[11px] tracking-[0.14em] uppercase font-semibold text-blue-300">Everything, free</div>
              <div className="flex items-baseline gap-2 mt-3">
                <div className="text-[48px] font-semibold tracking-tight text-white">$0</div>
                <div className="text-[14px] text-slate-400">forever</div>
              </div>
              <ul className="mt-6 flex flex-col gap-3">
                {FEATURES.map((f) => (
                  <li key={f} className="flex items-start gap-2.5">
                    <Check className="w-4 h-4 mt-0.5 text-emerald-400" strokeWidth={2.6} />
                    <span className="text-[14.5px] text-slate-200">{f}</span>
                  </li>
                ))}
              </ul>
              <a href="#signup" className="mt-8 inline-flex items-center justify-center gap-2 w-full py-3 rounded-lg text-[15px] font-medium bg-blue-500 hover:bg-blue-400 text-white transition-colors">
                Make the change <ArrowRight className="w-4 h-4" />
              </a>
              <p className="mt-4 text-[12px] text-slate-500 text-center">Supported by ads, so it stays free for everyone.</p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
