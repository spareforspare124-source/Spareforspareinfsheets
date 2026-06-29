import React from 'react';
import { LineChart, Sigma, Sparkles, Calendar } from 'lucide-react';
import { FEATURES } from '../../data/mock';

const icons = { LineChart, Sigma, Sparkles, Calendar };

export default function Features() {
  return (
    <section id="features" className="section-light">
      <div className="max-w-[1280px] mx-auto px-6 py-24 lg:py-28">
        <div className="eyebrow mb-5">Version 1 features</div>
        <h2 className="h-display text-[40px] sm:text-[48px] lg:text-[56px] max-w-[920px] text-zinc-900">
          More than worksheets: a working study command center.
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          {FEATURES.map((f) => {
            const Icon = icons[f.icon] || Sparkles;
            return (
              <div key={f.title} className="card-soft p-6">
                <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5 text-violet-600" />
                </div>
                <h3 className="text-[16px] font-semibold text-zinc-900 mb-2">{f.title}</h3>
                <p className="text-[13.5px] text-zinc-500 leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
