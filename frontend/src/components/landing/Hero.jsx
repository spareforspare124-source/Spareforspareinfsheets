import React from 'react';
import { ArrowRight } from 'lucide-react';
import DashboardPreview from './DashboardPreview';
import { STATS_LANDING } from '../../data/mock';

export default function Hero() {
  return (
    <section id="top" className="relative">
      <div className="max-w-[1280px] mx-auto px-6 pt-16 lg:pt-24 pb-20 lg:pb-28">
        <div className="grid lg:grid-cols-[1.05fr_1fr] gap-12 lg:gap-16 items-center">
          <div>
            <div className="eyebrow mb-5">Adaptive exam practice, built around you</div>
            <h1 className="h-display text-[52px] sm:text-[64px] lg:text-[78px] text-zinc-900">
              Stop <span className="font-serif-italic text-violet-600">guessing</span>
              <br /> what to study.
            </h1>
            <p className="mt-6 text-[16px] text-zinc-500 max-w-[520px] leading-relaxed">
              InfinitySheets identifies your weak topics, creates targeted practice, marks every answer, and turns your results into a clear next step.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#signup" className="btn-violet inline-flex items-center gap-2 px-5 py-3 rounded-xl text-[14.5px] font-medium shadow-sm">
                Start free <ArrowRight className="w-4 h-4" />
              </a>
              <a href="#how" className="btn-outline-dark inline-flex items-center px-5 py-3 rounded-xl text-[14.5px] font-medium">How it works</a>
            </div>
            <div className="mt-10 grid grid-cols-3 gap-3 max-w-[560px]">
              {STATS_LANDING.map((s) => (
                <div key={s.label} className="rounded-xl border border-zinc-200 bg-white px-4 py-3">
                  <div className="text-[20px] font-semibold tracking-tight">{s.num}</div>
                  <div className="text-[12px] text-zinc-500 mt-0.5 leading-snug">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
          <div className="hidden lg:block">
            <DashboardPreview />
          </div>
        </div>
      </div>
    </section>
  );
}
