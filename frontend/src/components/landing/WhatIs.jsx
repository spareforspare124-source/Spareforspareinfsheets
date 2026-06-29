import React from 'react';

export default function WhatIs() {
  return (
    <section className="section-dark">
      <div className="max-w-[1280px] mx-auto px-6 py-24 lg:py-32 grid lg:grid-cols-2 gap-12 lg:gap-20">
        <div>
          <div className="text-violet-400 text-[11px] tracking-[0.14em] uppercase font-semibold mb-5">What is InfinitySheets?</div>
          <h2 className="h-display text-[40px] sm:text-[48px] lg:text-[56px] text-white">
            Exam practice that keeps adapting after every worksheet.
          </h2>
        </div>
        <div className="flex flex-col gap-6 lg:pt-2">
          <p className="text-[16px] leading-relaxed text-zinc-300">
            Students do not just need notes. They need repeated exposure to the way questions are asked, fast feedback, and a clear idea of what to do next.
          </p>
          <p className="text-[16px] leading-relaxed text-zinc-300">
            InfinitySheets gives students a working study loop: choose a subject, generate a worksheet, answer it, get marked, and use the results to build the next recommendation.
          </p>
        </div>
      </div>
    </section>
  );
}
