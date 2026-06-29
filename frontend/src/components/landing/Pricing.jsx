import React from 'react';
import { PRICING } from '../../data/mock';

export default function Pricing() {
  return (
    <section id="pricing" className="section-light">
      <div className="max-w-[1280px] mx-auto px-6 py-24 lg:py-28 grid lg:grid-cols-2 gap-12 lg:gap-20">
        <div>
          <div className="eyebrow mb-5">Simple pricing</div>
          <h2 className="h-display text-[40px] sm:text-[48px] lg:text-[56px] text-zinc-900">
            Start free. Upgrade when deeper analysis is worth it.
          </h2>
          <p className="mt-5 max-w-[480px] text-[15px] text-zinc-500 leading-relaxed">
            The current app starts free. Premium can later add cloud sync, no ads, higher worksheet limits, and deeper AI analysis.
          </p>
        </div>
        <div className="flex flex-col gap-3">
          {PRICING.map((p) => (
            <div key={p.tag} className="bg-white border border-zinc-200 rounded-xl px-5 py-5">
              <div className="text-[10px] tracking-[0.14em] uppercase font-semibold text-zinc-500">{p.tag}</div>
              <div className="text-[15.5px] text-zinc-900 mt-1 font-medium">{p.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
