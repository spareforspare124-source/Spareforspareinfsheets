import React from 'react';
import { PAIN_POINTS } from '../../data/mock';

export default function PainPoints() {
  return (
    <section id="testimonials" className="bg-white">
      <div className="max-w-[1280px] mx-auto px-6 py-24 lg:py-28">
        <div className="eyebrow mb-5">Student pain points</div>
        <h2 className="h-display text-[40px] sm:text-[48px] lg:text-[56px] max-w-[860px] text-zinc-900">
          Built for study problems students actually face.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          {PAIN_POINTS.map((p, i) => (
            <div key={i} className="card-soft p-6">
              <p className="text-[15.5px] font-medium text-zinc-900 leading-snug">{p.quote}</p>
              <div className="mt-6 pt-5 border-t border-zinc-100 text-[13px] text-zinc-500">{p.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
