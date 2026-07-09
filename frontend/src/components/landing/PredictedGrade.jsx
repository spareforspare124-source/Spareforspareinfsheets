import React from 'react';
import { motion } from 'framer-motion';
import Reveal from './Reveal';

// Score trajectory used to draw the chart (weeks vs worksheet score %).
const POINTS = [42, 48, 46, 55, 61, 58, 68, 74, 79, 84];

function Chart() {
  const w = 640, h = 300, pad = 34;
  const stepX = (w - pad * 2) / (POINTS.length - 1);
  const y = (v) => h - pad - ((v - 30) / 70) * (h - pad * 2);
  const path = POINTS.map((v, i) => `${i === 0 ? 'M' : 'L'} ${pad + i * stepX} ${y(v)}`).join(' ');
  const area = `${path} L ${pad + (POINTS.length - 1) * stepX} ${h - pad} L ${pad} ${h - pad} Z`;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto" role="img" aria-label="Score improving over ten weeks from 42% to 84%">
      <defs>
        <linearGradient id="pgFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.25" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      {[45, 60, 75, 90].map((g) => (
        <g key={g}>
          <line x1={pad} x2={w - pad} y1={y(g)} y2={y(g)} stroke="#e2e8f0" strokeDasharray="4 5" />
          <text x={w - pad + 6} y={y(g) + 4} fontSize="11" fill="#94a3b8">{g}%</text>
        </g>
      ))}
      <motion.path
        d={area}
        fill="url(#pgFill)"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, delay: 0.6 }}
      />
      <motion.path
        d={path}
        fill="none"
        stroke="#3b82f6"
        strokeWidth="3.5"
        strokeLinecap="round"
        initial={{ pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.6, ease: 'easeInOut' }}
      />
      <motion.circle
        cx={pad + (POINTS.length - 1) * stepX}
        cy={y(POINTS[POINTS.length - 1])}
        r="7"
        fill="#3b82f6"
        stroke="#fff"
        strokeWidth="3"
        initial={{ scale: 0 }}
        whileInView={{ scale: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 1.5, type: 'spring' }}
      />
    </svg>
  );
}

export default function PredictedGrade() {
  return (
    <section className="section-light overflow-hidden">
      <div className="max-w-[1280px] mx-auto px-6 py-28 lg:py-36 min-h-[85svh] flex flex-col justify-center">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">
          <Reveal>
            <div>
              <div className="eyebrow mb-5">Predicted grades</div>
              <h2 className="h-display text-[44px] sm:text-[56px] lg:text-[64px] leading-[1.05]">
                Know your grade <span className="font-serif-italic">before</span> the exam does.
              </h2>
              <p className="mt-6 text-[16.5px] text-slate-600 leading-relaxed max-w-[520px]">
                Every worksheet sharpens your predicted score. For courses like the IGCSE and IB,
                where predicted grades shape university applications, that means no more guessing
                how ready you are&mdash;you can see it, and you can change it while there is still time.
              </p>
              <div className="mt-8 flex gap-4">
                <div className="rounded-2xl border border-slate-200 bg-white px-5 py-4">
                  <div className="text-[10px] tracking-wider font-semibold uppercase text-slate-500">10 weeks ago</div>
                  <div className="text-[32px] font-semibold tracking-tight text-slate-400 leading-tight">4</div>
                  <div className="text-[11.5px] text-slate-400">predicted (IB)</div>
                </div>
                <div className="rounded-2xl border border-blue-200 bg-blue-50 px-5 py-4">
                  <div className="text-[10px] tracking-wider font-semibold uppercase text-blue-600">today</div>
                  <div className="text-[32px] font-semibold tracking-tight text-blue-600 leading-tight">6</div>
                  <div className="text-[11.5px] text-blue-500">predicted (IB)</div>
                </div>
              </div>
            </div>
          </Reveal>
          <Reveal delay={0.15}>
            <div className="rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-900/5 p-6 sm:p-8">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <div className="text-[13px] font-semibold text-slate-900">Physics &middot; worksheet scores</div>
                  <div className="text-[11.5px] text-slate-400">Illustration of the progress view</div>
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-[12px] font-medium">+42% in 10 weeks</span>
              </div>
              <Chart />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
