import React from 'react';
import { LineChart, Brain, Target, Lightbulb, BookOpen } from 'lucide-react';
import { FEATURES } from '../../data/mock';
import Reveal from './Reveal';

const iconMap = { LineChart, Brain, Target, Lightbulb, BookOpen };
const toneClass = {
  primary: 'bg-blue-100 text-blue-700',
  secondary: 'bg-violet-100 text-violet-700',
  accent: 'bg-red-100 text-red-700',
  success: 'bg-emerald-100 text-emerald-700',
};

export default function Features() {
  return (
    <section id="features" className="section-light">
      <div className="max-w-[1280px] mx-auto px-6 py-24 lg:py-28">
        <div className="max-w-[760px]">
          <div className="eyebrow mb-5">Features</div>
          <h2 className="h-display text-[44px] sm:text-[54px] lg:text-[62px]">Everything you need to study smarter.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-12">
          {FEATURES.map((f, i) => {
            const Icon = iconMap[f.icon] || Lightbulb;
            return (
              <Reveal key={f.title} delay={(i % 3) * 0.08} y={20}>
                <div className="card-soft p-6 h-full hover-lift">
                  <div className={`w-11 h-11 rounded-xl flex items-center justify-center mb-5 ${toneClass[f.tone] || toneClass.primary}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-[18px] font-semibold text-slate-900 mb-2">{f.title}</h3>
                  <p className="text-[14.5px] text-slate-600 leading-relaxed">{f.desc}</p>
                </div>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}
