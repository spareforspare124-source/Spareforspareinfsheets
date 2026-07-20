import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function FinalCTA() {
  return (
    <section className="section-bg">
      <div className="max-w-[1280px] mx-auto px-6 py-20">
        <div className="relative overflow-hidden rounded-3xl bg-white border border-slate-200 shadow-sm px-8 py-16 lg:px-16 lg:py-20">
          <div className="relative max-w-[760px]">
            <div className="text-[11px] tracking-[0.14em] uppercase font-semibold text-blue-700 mb-5">Final call</div>
            <h2 className="h-display text-slate-900 text-[40px] sm:text-[48px] lg:text-[56px]">Ready to study smarter?</h2>
            <p className="mt-5 text-[16px] text-slate-600 leading-relaxed max-w-[560px]">
              Join students replacing blind rereading with targeted, exam-style practice. Free, personalized, and the planning is done for you&mdash;every hour you study finally counts.
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a href="#signup" className="inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14.5px] font-medium transition-colors">
                Start Free <ArrowRight className="w-5 h-5" />
              </a>
              <a href="#features" className="inline-flex items-center px-5 py-3 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 transition-colors text-[14.5px] font-medium">Explore features</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
