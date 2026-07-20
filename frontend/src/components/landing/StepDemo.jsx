import React from 'react';

/* Animated vignettes — one looping "gif" per How-It-Works step, drawn in
   SVG so they stay crisp and theme-aware. Shared by the How It Works
   section and the "Watch video" walkthrough modal. */

function Cursor({ x, y }) {
  return (
    <g className="demo-cursor" transform={`translate(${x} ${y})`}>
      <path d="M0 0 L0 15 L4 11.5 L7 18 L9.5 17 L6.7 10.5 L11.5 10 Z" fill="#0f172a" stroke="#fff" strokeWidth="1.2" />
    </g>
  );
}

export default function StepDemo({ step }) {
  const card = { fill: 'var(--doodle-paper, #fff)', stroke: '#cbd5e1' };
  const ink = 'var(--doodle-ink, #0f172a)';
  return (
    <svg viewBox="0 0 320 200" className="w-full h-auto" aria-hidden="true">
      {step === 0 && (
        <g>
          {/* worksheet card with a submit button being clicked */}
          <rect x="40" y="20" width="240" height="140" rx="12" {...card} strokeWidth="1.5" />
          <rect x="58" y="38" width="150" height="10" rx="5" fill="#93c5fd" />
          <rect x="58" y="60" width="200" height="7" rx="3.5" fill="#e2e8f0" />
          <rect x="58" y="74" width="180" height="7" rx="3.5" fill="#e2e8f0" />
          <rect x="58" y="96" width="120" height="16" rx="8" fill="#dbeafe" />
          <g className="demo-press">
            <rect x="58" y="126" width="118" height="24" rx="8" fill="#3b82f6" />
            <text x="117" y="142" textAnchor="middle" fontSize="11" fill="#fff" fontWeight="600">Submit worksheet</text>
          </g>
          <Cursor x={150} y={140} />
        </g>
      )}
      {step === 1 && (
        <g>
          {/* topic bars being scanned; weak one flags red */}
          <rect x="40" y="20" width="240" height="150" rx="12" {...card} strokeWidth="1.5" />
          {[0, 1, 2, 3].map((i) => (
            <g key={i}>
              <rect x="58" y={42 + i * 30} width="80" height="8" rx="4" fill="#e2e8f0" />
              <rect x="150" y={40 + i * 30} width="110" height="12" rx="6" fill="#eff6ff" />
              <rect x="150" y={40 + i * 30} width={[95, 60, 30, 80][i]} height="12" rx="6" fill={i === 2 ? '#f87171' : '#60a5fa'} />
            </g>
          ))}
          <rect x="146" y="28" width="4" height="130" rx="2" fill="#3b82f6" opacity="0.55" className="demo-scan" />
          <g className="demo-pop">
            <rect x="196" y="92" width="70" height="20" rx="10" fill="#fee2e2" stroke="#f87171" strokeWidth="1.2" />
            <text x="231" y="106" textAnchor="middle" fontSize="10" fill="#b91c1c" fontWeight="600">weak spot</text>
          </g>
        </g>
      )}
      {step === 2 && (
        <g>
          {/* new targeted worksheet sliding in on top of old ones */}
          <rect x="66" y="46" width="200" height="120" rx="12" fill="#e2e8f0" opacity="0.6" />
          <rect x="54" y="34" width="200" height="120" rx="12" fill="#e2e8f0" opacity="0.85" />
          <g className="demo-slide">
            <rect x="42" y="22" width="200" height="120" rx="12" {...card} strokeWidth="1.5" />
            <rect x="58" y="40" width="90" height="16" rx="8" fill="#fee2e2" />
            <text x="103" y="52" textAnchor="middle" fontSize="10" fill="#b91c1c" fontWeight="600">Trigonometry</text>
            <rect x="58" y="68" width="160" height="7" rx="3.5" fill="#e2e8f0" />
            <rect x="58" y="82" width="140" height="7" rx="3.5" fill="#e2e8f0" />
            <rect x="58" y="96" width="150" height="7" rx="3.5" fill="#e2e8f0" />
            <rect x="58" y="116" width="76" height="18" rx="9" fill="#3b82f6" />
            <text x="96" y="129" textAnchor="middle" fontSize="10" fill="#fff" fontWeight="600">Start</text>
          </g>
        </g>
      )}
      {step === 3 && (
        <g>
          {/* recommendation card popping in */}
          <rect x="40" y="30" width="240" height="130" rx="12" {...card} strokeWidth="1.5" />
          <rect x="58" y="48" width="120" height="10" rx="5" fill="#93c5fd" />
          <g className="demo-pop">
            <rect x="58" y="74" width="204" height="60" rx="10" fill="#eff6ff" stroke="#93c5fd" strokeWidth="1.2" />
            <circle cx="80" cy="104" r="10" fill="#fde68a" stroke="#f59e0b" strokeWidth="1.4" />
            <text x="80" y="108" textAnchor="middle" fontSize="11">&#128161;</text>
            <text x="100" y="99" fontSize="10.5" fill={ink} fontWeight="600">Next: 10 questions on</text>
            <text x="100" y="113" fontSize="10.5" fill="#2563eb" fontWeight="600">Electrostatics &middot; Medium</text>
          </g>
        </g>
      )}
      {step === 4 && (
        <g>
          {/* progress chart drawing itself upward */}
          <rect x="40" y="20" width="240" height="150" rx="12" {...card} strokeWidth="1.5" />
          {[60, 95, 130].map((y) => <line key={y} x1="58" x2="262" y1={y} y2={y} stroke="#e2e8f0" strokeDasharray="3 5" />)}
          <path d="M60 145 L95 132 L128 138 L162 112 L196 100 L230 78 L258 60" fill="none" stroke="#3b82f6" strokeWidth="3.5" strokeLinecap="round" className="demo-draw" />
          <g className="demo-pop">
            <rect x="196" y="34" width="66" height="20" rx="10" fill="#dcfce7" stroke="#4ade80" strokeWidth="1.2" />
            <text x="229" y="48" textAnchor="middle" fontSize="10" fill="#15803d" fontWeight="600">+42%</text>
          </g>
        </g>
      )}
    </svg>
  );
}
