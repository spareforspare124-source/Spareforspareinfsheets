import React from 'react';

/*
 * Study-object doodles — books, lab glassware, equations, laptops,
 * stationery — scattered around the site so it reads unmistakably as a
 * study website. Hand-drawn line-art with blue accents, theme-aware via
 * --doodle-ink / --doodle-paper (pass tone="dark" only for always-dark
 * sections). Decorative (aria-hidden); gentle float, twinkling sparkles;
 * all animation disabled under prefers-reduced-motion.
 */

const BLUE = '#3b82f6';
const BLUE_SOFT = '#93c5fd';

function palette(tone) {
  if (tone === 'dark') return { s: '#e2e8f0', paper: '#0f172a' };
  return { s: 'var(--doodle-ink, #0f172a)', paper: 'var(--doodle-paper, #ffffff)' };
}

function Sparkles({ x = 0, y = 0, s }) {
  return (
    <g transform={`translate(${x} ${y})`} stroke={s} strokeWidth="1.8" strokeLinecap="round" className="doodle-twinkle">
      <path d="M6 0 L6 12 M0 6 L12 6" />
      <path d="M24 14 L24 22 M20 18 L28 18" opacity="0.7" />
      <circle cx="13" cy="25" r="1.5" fill={s} stroke="none" />
    </g>
  );
}

/* Leaning stack of textbooks with a bookmark */
export function DoodleBooks({ tone = 'light', className = '', width = 120 }) {
  const { s, paper } = palette(tone);
  const book = (y, w, tilt, accent) => (
    <g key={y} transform={`rotate(${tilt} 60 ${y + 7})`}>
      <rect x={60 - w / 2} y={y} width={w} height="14" rx="3" stroke={s} strokeWidth="2.4" fill={accent ? BLUE : paper} />
      <path d={`M${60 - w / 2 + 5} ${y + 7} l${w - 10} 0`} stroke={accent ? '#fff' : BLUE_SOFT} strokeWidth="1.6" strokeLinecap="round" />
    </g>
  );
  return (
    <svg viewBox="0 0 120 110" width={width} className={`doodle-float ${className}`} aria-hidden="true" fill="none">
      <Sparkles x={88} y={4} s={s} />
      {book(30, 56, -5, false)}
      {book(45, 64, 3, true)}
      {book(60, 58, -2, false)}
      {book(75, 66, 2, true)}
      {/* bookmark ribbon */}
      <path d="M46 30 l0 -12 l5 4 l5 -4 l0 12" stroke={s} strokeWidth="2" fill={BLUE_SOFT} strokeLinejoin="round" />
      <path d="M22 94 L100 94" stroke={s} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/* Conical flask, bubbling */
export function DoodleFlask({ tone = 'light', className = '', width = 100 }) {
  const { s, paper } = palette(tone);
  return (
    <svg viewBox="0 0 100 120" width={width} className={`doodle-float ${className}`} aria-hidden="true" fill="none">
      <Sparkles x={68} y={2} s={s} />
      <path d="M40 22 l20 0 M44 22 l0 30 l-20 40 q-4 10 8 10 l36 0 q12 0 8 -10 l-20 -40 l0 -30" stroke={s} strokeWidth="2.6" fill={paper} strokeLinejoin="round" />
      {/* liquid */}
      <path d="M32 74 q18 -8 36 0 l12 22 q2 6 -6 6 l-48 0 q-8 0 -6 -6 z" fill={BLUE} fillOpacity="0.55" stroke={s} strokeWidth="1.6" />
      {/* bubbles */}
      <g className="doodle-twinkle">
        <circle cx="50" cy="64" r="3" stroke={s} strokeWidth="1.6" />
        <circle cx="58" cy="52" r="2.2" stroke={s} strokeWidth="1.4" />
        <circle cx="46" cy="42" r="1.6" fill={s} />
      </g>
      <path d="M14 104 L88 104" stroke={s} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/* Test tube rack */
export function DoodleTestTubes({ tone = 'light', className = '', width = 100 }) {
  const { s, paper } = palette(tone);
  const tube = (x, fillH, accent) => (
    <g key={x}>
      <path d={`M${x} 26 l0 48 q0 9 9 9 q9 0 9 -9 l0 -48`} stroke={s} strokeWidth="2.2" fill={paper} />
      <path d={`M${x + 1.5} ${83 - fillH} l15 0 l0 ${fillH - 9} q0 7.5 -7.5 7.5 q-7.5 0 -7.5 -7.5 z`} fill={accent} fillOpacity="0.6" />
      <path d={`M${x - 3} 26 l24 0`} stroke={s} strokeWidth="2.4" strokeLinecap="round" />
    </g>
  );
  return (
    <svg viewBox="0 0 110 110" width={width} className={`doodle-float ${className}`} aria-hidden="true" fill="none">
      <Sparkles x={78} y={0} s={s} />
      {tube(16, 26, BLUE)}
      {tube(46, 38, BLUE_SOFT)}
      {tube(76, 18, BLUE)}
      <path d="M8 92 l94 0 M14 92 l0 12 M96 92 l0 12" stroke={s} strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

/* Open laptop with code-ish lines */
export function DoodleLaptop({ tone = 'light', className = '', width = 130 }) {
  const { s, paper } = palette(tone);
  return (
    <svg viewBox="0 0 130 100" width={width} className={`doodle-float ${className}`} aria-hidden="true" fill="none">
      <Sparkles x={100} y={2} s={s} />
      <path d="M30 70 l70 0 l-6 -44 q-1 -6 -7 -6 l-44 0 q-6 0 -7 6 z" stroke={s} strokeWidth="2.6" fill={paper} strokeLinejoin="round" />
      <path d="M44 34 l34 0 M42 44 l28 0 M40 54 l36 0" stroke={BLUE_SOFT} strokeWidth="2.6" strokeLinecap="round" />
      <circle cx="88" cy="58" r="4" stroke={BLUE} strokeWidth="1.8" />
      <path d="M18 70 l94 0 l8 12 q2 4 -4 4 l-102 0 q-6 0 -4 -4 z" stroke={s} strokeWidth="2.6" fill={paper} strokeLinejoin="round" />
      <path d="M56 78 l18 0" stroke={s} strokeWidth="2" strokeLinecap="round" />
    </svg>
  );
}

/* Floating hand-written equations */
export function DoodleEquations({ tone = 'light', className = '', width = 150 }) {
  const { s } = palette(tone);
  return (
    <svg viewBox="0 0 150 110" width={width} className={`doodle-float ${className}`} aria-hidden="true" fill="none">
      <g fontFamily="'Comic Sans MS', 'Segoe Print', cursive" fontWeight="600">
        <text x="8" y="30" fontSize="20" fill={s}>a&#178;+b&#178;=c&#178;</text>
        <text x="70" y="66" fontSize="22" fill={BLUE}>&#8747;x&#8202;dx</text>
        <text x="10" y="98" fontSize="18" fill={s}>E=mc&#178;</text>
      </g>
      <g className="doodle-twinkle" stroke={BLUE} strokeWidth="1.8" strokeLinecap="round">
        <path d="M126 18 l0 12 M120 24 l12 0" />
        <circle cx="52" cy="52" r="1.6" fill={BLUE} stroke="none" />
      </g>
    </svg>
  );
}

/* Atom with orbiting electrons */
export function DoodleAtom({ tone = 'light', className = '', width = 100 }) {
  const { s } = palette(tone);
  return (
    <svg viewBox="0 0 100 100" width={width} className={`doodle-float ${className}`} aria-hidden="true" fill="none">
      <ellipse cx="50" cy="50" rx="38" ry="15" stroke={s} strokeWidth="2.2" transform="rotate(25 50 50)" />
      <ellipse cx="50" cy="50" rx="38" ry="15" stroke={s} strokeWidth="2.2" transform="rotate(-25 50 50)" />
      <ellipse cx="50" cy="50" rx="38" ry="15" stroke={BLUE_SOFT} strokeWidth="2.2" transform="rotate(90 50 50)" />
      <circle cx="50" cy="50" r="6" fill={BLUE} stroke={s} strokeWidth="1.8" />
      <g className="doodle-twinkle">
        <circle cx="82" cy="36" r="3" fill={BLUE} />
        <circle cx="20" cy="62" r="3" fill={BLUE_SOFT} />
      </g>
    </svg>
  );
}

/* Pencil and ruler crossed */
export function DoodleStationery({ tone = 'light', className = '', width = 110 }) {
  const { s, paper } = palette(tone);
  return (
    <svg viewBox="0 0 110 100" width={width} className={`doodle-float ${className}`} aria-hidden="true" fill="none">
      <Sparkles x={80} y={0} s={s} />
      {/* ruler */}
      <g transform="rotate(-18 55 60)">
        <rect x="15" y="52" width="80" height="16" rx="3" stroke={s} strokeWidth="2.2" fill={paper} />
        <path d="M25 52 l0 6 M35 52 l0 8 M45 52 l0 6 M55 52 l0 8 M65 52 l0 6 M75 52 l0 8 M85 52 l0 6" stroke={s} strokeWidth="1.4" />
      </g>
      {/* pencil */}
      <g transform="rotate(28 55 45)">
        <rect x="20" y="38" width="58" height="12" rx="2" stroke={s} strokeWidth="2.2" fill={BLUE} fillOpacity="0.85" />
        <path d="M78 38 l12 6 l-12 6 z" stroke={s} strokeWidth="2" fill={paper} strokeLinejoin="round" />
        <path d="M86 42 l4 2 l-4 2 z" fill={s} />
        <rect x="14" y="38" width="6" height="12" rx="2" stroke={s} strokeWidth="1.8" fill={BLUE_SOFT} />
      </g>
    </svg>
  );
}

/* Graduation cap */
export function DoodleGradCap({ tone = 'light', className = '', width = 110 }) {
  const { s, paper } = palette(tone);
  return (
    <svg viewBox="0 0 110 90" width={width} className={`doodle-float ${className}`} aria-hidden="true" fill="none">
      <Sparkles x={82} y={2} s={s} />
      <path d="M10 40 L55 22 L100 40 L55 58 Z" stroke={s} strokeWidth="2.4" fill={BLUE} fillOpacity="0.85" strokeLinejoin="round" />
      <path d="M32 50 l0 16 q23 12 46 0 l0 -16" stroke={s} strokeWidth="2.4" fill={paper} strokeLinejoin="round" />
      <path d="M100 40 l0 22" stroke={s} strokeWidth="2" strokeLinecap="round" />
      <circle cx="100" cy="66" r="3.5" stroke={s} strokeWidth="1.8" fill={BLUE_SOFT} />
    </svg>
  );
}
