import React from 'react';

/*
 * Playful doodle students for the landing page — chunky, rounded,
 * cartoon-simple characters (dot eyes, big smiles, oversized props),
 * deliberately NOT realistic. Each has animated parts: bobbing heads,
 * typing hands, a waving arm, flipping pages.
 *
 * Theme-aware: line color follows --doodle-ink / --doodle-paper CSS
 * variables. Pass tone="dark" only for sections that are dark in BOTH
 * themes. All animation is disabled under prefers-reduced-motion.
 */

const BLUE = '#3b82f6';
const BLUE_DEEP = '#2563eb';
const BLUE_SOFT = '#93c5fd';

function palette(tone) {
  if (tone === 'dark') return { s: '#e2e8f0', paper: '#0f172a' };
  return { s: 'var(--doodle-ink, #0f172a)', paper: 'var(--doodle-paper, #ffffff)' };
}

function Sparkles({ x = 0, y = 0, s }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke={s} strokeWidth="2" strokeLinecap="round" className="doodle-twinkle">
      <path d="M7 0 L7 14 M0 7 L14 7" />
      <path d="M30 16 L30 26 M25 21 L35 21" opacity="0.7" />
      <circle cx="16" cy="30" r="1.8" fill={s} stroke="none" />
    </g>
  );
}

/* Big round head, dot eyes, huge grin — shared face helper */
function Face({ cx, cy, r, s, fill }) {
  return (
    <g>
      <circle cx={cx} cy={cy} r={r} stroke={s} strokeWidth="3" fill={fill} />
      <circle cx={cx - r * 0.32} cy={cy - r * 0.08} r="2.2" fill={s} />
      <circle cx={cx + r * 0.32} cy={cy - r * 0.08} r="2.2" fill={s} />
      <path d={`M${cx - r * 0.3} ${cy + r * 0.3} q ${r * 0.3} ${r * 0.35} ${r * 0.6} 0`} stroke={s} strokeWidth="2.6" strokeLinecap="round" fill="none" />
    </g>
  );
}

/*
 * Happy typer: round-headed student hammering a giant laptop,
 * head bobbing, hands bouncing on the keys, sparks flying off the screen.
 */
export function DoodleLaptop({ tone = 'light', className = '', width = 170 }) {
  const { s, paper } = palette(tone);
  return (
    <svg viewBox="0 0 200 170" width={width} className={`doodle-float ${className}`} aria-hidden="true" fill="none">
      <Sparkles x={158} y={6} s={s} />
      {/* bobbing head with headphones */}
      <g className="doodle-bob">
        {/* mop of hair: three big bumps */}
        <path d="M72 42 q-4 -20 14 -22 q8 -12 22 -6 q16 -2 14 18 l-4 8 q-20 -12 -42 2 z" stroke={s} strokeWidth="3" fill={BLUE_DEEP} strokeLinejoin="round" />
        <Face cx={97} cy={48} r={22} s={s} fill={paper} />
        {/* chunky headphones */}
        <path d="M72 40 q25 -22 50 0" stroke={s} strokeWidth="3.4" strokeLinecap="round" />
        <rect x="68" y="40" width="10" height="16" rx="5" stroke={s} strokeWidth="2.6" fill={BLUE} />
        <rect x="116" y="40" width="10" height="16" rx="5" stroke={s} strokeWidth="2.6" fill={BLUE} />
      </g>
      {/* squat rounded body */}
      <path d="M74 78 q23 -10 46 0 q6 18 2 34 l-50 0 q-4 -16 2 -34 z" stroke={s} strokeWidth="3" fill={BLUE} strokeLinejoin="round" />
      {/* bouncing typing hands (little mitten circles) */}
      <g className="doodle-type">
        <circle cx="76" cy="116" r="6" stroke={s} strokeWidth="2.6" fill={paper} />
      </g>
      <g className="doodle-type-alt">
        <circle cx="118" cy="116" r="6" stroke={s} strokeWidth="2.6" fill={paper} />
      </g>
      {/* comically wide laptop */}
      <path d="M58 124 l80 0 l-6 -30 l-68 0 z" stroke={s} strokeWidth="3" fill={paper} strokeLinejoin="round" />
      <path d="M72 102 l44 0 M72 110 l32 0" stroke={BLUE_SOFT} strokeWidth="3" strokeLinecap="round" />
      <path d="M50 124 l96 0 l8 12 l-112 0 z" stroke={s} strokeWidth="3" fill={paper} strokeLinejoin="round" />
      {/* sticker on the lid corner */}
      <circle cx="128" cy="116" r="4" stroke={BLUE} strokeWidth="2.2" />
      {/* happy sparks off the screen */}
      <g className="doodle-twinkle">
        <path d="M144 92 l6 -6 M148 100 l8 -2" stroke={BLUE} strokeWidth="2.4" strokeLinecap="round" />
      </g>
      {/* stubby legs + big shoes */}
      <path d="M84 136 l-2 14 M112 136 l2 14" stroke={s} strokeWidth="3" strokeLinecap="round" />
      <path d="M82 150 q-9 0 -8 6 l16 0 q1 -6 -8 -6 M114 150 q9 0 8 6 l-16 0 q-1 -6 8 -6" stroke={s} strokeWidth="2.6" fill={paper} />
      {/* ground squiggle */}
      <path d="M46 162 q10 -4 20 0 q10 4 20 0 q10 -4 20 0 q10 4 20 0 q10 -4 20 0" stroke={s} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

/*
 * Book juggler: tiny body, enormous wobbling stack of books,
 * free arm waving hello.
 */
export function DoodleBooks({ tone = 'light', className = '', width = 150 }) {
  const { s, paper } = palette(tone);
  const book = (y, w, tilt, accent) => (
    <g key={y} transform={`rotate(${tilt} 66 ${y + 7})`}>
      <rect x={66 - w / 2} y={y} width={w} height="14" rx="4" stroke={s} strokeWidth="2.8" fill={accent ? BLUE : paper} />
      <path d={`M${66 - w / 2 + 6} ${y + 7} l${w - 12} 0`} stroke={accent ? '#fff' : BLUE_SOFT} strokeWidth="2" strokeLinecap="round" />
    </g>
  );
  return (
    <svg viewBox="0 0 170 185" width={width} className={`doodle-float ${className}`} aria-hidden="true" fill="none">
      <Sparkles x={126} y={2} s={s} />
      {/* wobbling tower of books */}
      <g className="doodle-wobble">
        {book(10, 58, -6, false)}
        {book(25, 66, 4, true)}
        {book(40, 60, -3, false)}
        {book(55, 68, 5, true)}
      </g>
      {/* bobbing head peeking around the stack */}
      <g className="doodle-bob">
        {/* beanie */}
        <path d="M96 84 q4 -18 22 -18 q18 0 22 18 l-4 4 q-18 -10 -36 0 z" stroke={s} strokeWidth="3" fill={BLUE_DEEP} strokeLinejoin="round" />
        <circle cx="118" cy="70" r="5" stroke={s} strokeWidth="2.4" fill={BLUE_DEEP} />
        <Face cx={118} cy={94} r={20} s={s} fill={paper} />
      </g>
      {/* tiny body */}
      <path d="M102 118 q16 -8 32 0 q5 14 2 26 l-36 0 q-3 -12 2 -26 z" stroke={s} strokeWidth="3" fill={BLUE} strokeLinejoin="round" />
      {/* one arm hugging the stack */}
      <path d="M104 122 q-24 -6 -34 -34" stroke={s} strokeWidth="3" strokeLinecap="round" />
      <circle cx="68" cy="84" r="5.5" stroke={s} strokeWidth="2.4" fill={paper} />
      {/* other arm waving hello */}
      <g className="doodle-wave">
        <path d="M132 124 q18 -6 24 -22" stroke={s} strokeWidth="3" strokeLinecap="round" />
        <circle cx="158" cy="98" r="6" stroke={s} strokeWidth="2.4" fill={paper} />
        <path d="M164 90 l4 -6 M168 98 l7 -2" stroke={s} strokeWidth="2" strokeLinecap="round" />
      </g>
      {/* stubby legs + big shoes */}
      <path d="M110 144 l-2 14 M126 144 l2 14" stroke={s} strokeWidth="3" strokeLinecap="round" />
      <path d="M108 158 q-9 0 -8 6 l16 0 q1 -6 -8 -6 M128 158 q9 0 8 6 l-16 0 q-1 -6 8 -6" stroke={s} strokeWidth="2.6" fill={paper} />
      {/* ground squiggle */}
      <path d="M36 174 q10 -4 20 0 q10 4 20 0 q10 -4 20 0 q10 4 20 0 q10 -4 20 0" stroke={s} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}

/*
 * Beanbag reader: round student sunk into a beanbag with a huge open
 * book, pages flipping, ideas popping overhead.
 */
export function DoodleReading({ tone = 'light', className = '', width = 170 }) {
  const { s, paper } = palette(tone);
  return (
    <svg viewBox="0 0 200 165" width={width} className={`doodle-float ${className}`} aria-hidden="true" fill="none">
      {/* popping idea bulb */}
      <g className="doodle-pop">
        <circle cx="150" cy="26" r="9" stroke={s} strokeWidth="2.6" fill={paper} />
        <path d="M147 35 l6 0 M148 39 l4 0" stroke={s} strokeWidth="2" strokeLinecap="round" />
        <path d="M150 8 l0 6 M136 14 l4 4 M164 14 l-4 4" stroke={BLUE} strokeWidth="2.4" strokeLinecap="round" />
      </g>
      <Sparkles x={14} y={10} s={s} />
      {/* beanbag blob */}
      <path d="M50 148 q-10 -34 26 -42 q40 -10 66 8 q22 16 8 34 z" stroke={s} strokeWidth="3" fill={BLUE_SOFT} fillOpacity="0.35" strokeLinejoin="round" />
      {/* bobbing head with two space buns */}
      <g className="doodle-bob">
        <circle cx="82" cy="46" r="7" stroke={s} strokeWidth="2.6" fill={BLUE_DEEP} />
        <circle cx="118" cy="46" r="7" stroke={s} strokeWidth="2.6" fill={BLUE_DEEP} />
        <path d="M76 62 q0 -18 24 -18 q24 0 24 18 l-4 6 q-20 -8 -40 0 z" stroke={s} strokeWidth="3" fill={BLUE_DEEP} strokeLinejoin="round" />
        <Face cx={100} cy={70} r={21} s={s} fill={paper} />
      </g>
      {/* round body sunk in the bag */}
      <path d="M78 96 q22 -10 44 0 q6 12 4 24 l-52 0 q-2 -12 4 -24 z" stroke={s} strokeWidth="3" fill={BLUE} strokeLinejoin="round" />
      {/* giant open book with flipping page */}
      <path d="M62 118 q38 -18 38 -2 q0 -16 38 2 l0 22 q-38 -14 -38 -2 q0 -12 -38 2 z" stroke={s} strokeWidth="3" fill={paper} strokeLinejoin="round" />
      <path d="M72 122 q16 -7 22 -4 M106 118 q16 -7 22 -4 M72 129 q13 -6 19 -4" stroke={BLUE_SOFT} strokeWidth="2.4" strokeLinecap="round" />
      <g className="doodle-flip">
        <path d="M100 116 q14 -14 26 -10" stroke={s} strokeWidth="2.4" strokeLinecap="round" fill="none" />
      </g>
      {/* mitten hands holding the book */}
      <circle cx="66" cy="120" r="6" stroke={s} strokeWidth="2.6" fill={paper} />
      <circle cx="134" cy="120" r="6" stroke={s} strokeWidth="2.6" fill={paper} />
      {/* ground squiggle */}
      <path d="M42 156 q10 -4 20 0 q10 4 20 0 q10 -4 20 0 q10 4 20 0 q10 -4 20 0 q10 4 20 0" stroke={s} strokeWidth="2.6" strokeLinecap="round" />
    </svg>
  );
}
