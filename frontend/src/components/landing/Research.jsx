import React from 'react';
import { RESEARCH_STATS } from '../../data/mock';
import { BookMarked } from 'lucide-react';

export default function Research() {
  return (
    <section className="section-light">
      <div className="max-w-[1280px] mx-auto px-6 py-24 lg:py-28">
        <div className="max-w-[760px]">
          <div className="flex items-center gap-2 mb-5">
            <BookMarked className="w-4 h-4 text-violet-600" />
            <span className="text-[11px] tracking-[0.14em] uppercase font-semibold text-violet-700">Backed by research</span>
          </div>
          <h2 className="h-display text-[44px] sm:text-[54px] lg:text-[62px]">Methods that move the needle.</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-12">
          {RESEARCH_STATS.map((r, i) => (
            <div key={i} className="card-soft p-7">
              <div className="text-[44px] font-semibold tracking-tight text-blue-600 leading-none">{r.num}</div>
              <div className="text-[16px] font-semibold text-slate-900 mt-5">{r.title}</div>
              <p className="text-[13.5px] text-slate-600 mt-2 leading-relaxed">{r.desc}</p>
            </div>
          ))}
        </div>
        <p className="text-[12.5px] text-slate-500 mt-6 italic">Based on published educational research in cognitive science and learning.</p>
      </div>
    </section>
  );
}
