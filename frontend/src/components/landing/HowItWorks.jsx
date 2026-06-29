import React from 'react';
import { HOW_IT_WORKS } from '../../data/mock';

export default function HowItWorks() {
  return (
    <section id="how" className="section-light">
      <div className="max-w-[1280px] mx-auto px-6 py-24 lg:py-28 grid lg:grid-cols-2 gap-12 lg:gap-20">
        <div>
          <div className="eyebrow mb-5">How it works</div>
          <h2 className="h-display text-[40px] sm:text-[48px] lg:text-[56px] text-zinc-900">
            From syllabus to a smarter next worksheet.
          </h2>
          <p className="mt-5 max-w-[480px] text-[15px] text-zinc-500 leading-relaxed">
            The adaptive engine runs in your browser, creates varied practice, and saves progress locally. No external AI account or API is required.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {HOW_IT_WORKS.map((s) => (
            <div key={s.n} className="bg-white border border-zinc-200 rounded-xl px-5 py-4 flex items-center gap-5 hover:border-violet-300 transition-colors">
              <span className="text-violet-600 font-semibold text-[14px] tabular-nums">{s.n}</span>
              <span className="text-[15px] text-zinc-800 font-medium">{s.text}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
