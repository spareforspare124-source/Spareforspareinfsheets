import React from 'react';
import Reveal from './Reveal';

/*
 * Real-product storytelling: three annotated close-ups cropped (via CSS)
 * from the actual dashboard screenshots, replacing the old full-size
 * annotated screenshot. Light/dark variants follow the theme through the
 * existing shot-light / shot-dark classes.
 */
const PEEKS = [
  // pos = object-position (percent of the full screenshot to centre on)
  { label: 'Study streak & daily goal', desc: 'Practice becomes a habit you can see.', pos: '38% 30%', zoom: 2.2 },
  { label: 'Weak topics, found automatically', desc: 'Every answer sharpens the picture.', pos: '30% 88%', zoom: 2.2 },
  { label: 'Upcoming exams', desc: 'Per-subject countdowns keep you honest.', pos: '82% 45%', zoom: 2.2 },
];

function PeekImage({ pos, zoom }) {
  const common = {
    className: 'absolute inset-0 w-full h-full object-cover',
    style: { objectPosition: pos, transform: `scale(${zoom})`, transformOrigin: pos },
    loading: 'lazy',
    alt: '',
    'aria-hidden': true,
  };
  return (
    <>
      <img src="/screenshots/dashboard.png" {...common} className={`shot-light ${common.className}`} />
      <img src="/screenshots/dashboard-dark.png" {...common} className={`shot-dark ${common.className}`} />
    </>
  );
}

export default function ProductPeek() {
  return (
    <section aria-label="Inside the app" className="section-bg">
      <div className="max-w-[1240px] mx-auto px-6 pb-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {PEEKS.map((p, i) => (
            <Reveal key={p.label} delay={i * 0.08}>
              <div className="liquid-glass rounded-2xl overflow-hidden hover-lift">
                <div className="relative h-40 overflow-hidden border-b border-slate-200/60">
                  <PeekImage pos={p.pos} zoom={p.zoom} />
                </div>
                <div className="px-5 py-4">
                  <div className="text-[14px] font-semibold text-slate-900">{p.label}</div>
                  <div className="text-[12.5px] text-slate-600 mt-0.5">{p.desc}</div>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
