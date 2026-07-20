import React from 'react';

/*
 * Sheety — the InfinitySheets mascot, matched to the brand character
 * sheets: flat cartoon style with thick ink outlines, a big rounded white
 * helmet, dark visor with a GLOWING INFINITY face over two smile-arc
 * eyes, blue ear pods, navy hoodie with drawstrings + chest infinity,
 * backpack straps, white gloves, and navy/white sneakers.
 *
 * Poses: "wave" (arm up, waving), "peek" (head + gloves over an edge),
 * "sit" (legs dangling — perch him on a card edge), "float" (airborne
 * with sparkles). Motion is CSS-driven and respects reduced motion.
 *
 * Palette: #0D1B2A ink/visor · #14264A hoodie · #1E3A8A pods/straps ·
 * #3B82F6 infinity blue · #A5D8FF ice · #fff
 */

const INK = '#0D1B2A';
const HOODIE = '#14264A';
const NAVY = '#1E3A8A';
const BLUE = '#3B82F6';
const ICE = '#A5D8FF';

/* A proper lemniscate: two symmetric loops crossing at the centre. */
function Infinity8({ x = 0, y = 0, s = 1, stroke = BLUE, width = 3.6 }) {
  return (
    <path
      transform={`translate(${x} ${y}) scale(${s})`}
      d="M0 0 C-4.5 -7.5 -14 -7.5 -14 0 C-14 7.5 -4.5 7.5 0 0 C4.5 -7.5 14 -7.5 14 0 C14 7.5 4.5 7.5 0 0 Z"
      fill="none" stroke={stroke} strokeWidth={width} strokeLinecap="round" strokeLinejoin="round"
    />
  );
}

/* Head centred on (cx, cy). Roughly 76 wide × 72 tall including hair. */
function Head({ cx = 60, cy = 40 }) {
  return (
    <g transform={`translate(${cx} ${cy})`}>
      {/* hair tuft — three ink spikes swept right, like the reference */}
      <path d="M-14 -28 C-15 -38 -9 -44 -6 -38 L-4 -33 C-3 -42 4 -48 6 -40 L7 -34 C10 -43 17 -42 14 -32 L11 -27 Z" fill={INK} />
      {/* ear pods */}
      <rect x="-43" y="-11" width="12" height="22" rx="6" fill={NAVY} stroke={INK} strokeWidth="2.5" />
      <rect x="31" y="-11" width="12" height="22" rx="6" fill={NAVY} stroke={INK} strokeWidth="2.5" />
      <ellipse cx="-37" cy="0" rx="2.6" ry="5" fill="#fff" />
      <ellipse cx="37" cy="0" rx="2.6" ry="5" fill="#fff" />
      {/* helmet */}
      <rect x="-34" y="-31" width="68" height="62" rx="24" fill="#fff" stroke={INK} strokeWidth="3" />
      {/* visor */}
      <rect x="-26" y="-23" width="52" height="46" rx="16" fill={INK} />
      {/* face: glowing infinity over smile-arc eyes */}
      <g className="mascot-glow">
        <Infinity8 x={0} y={-5} s={1} />
        <path d="M-15 9 q5 5.5 10 0" fill="none" stroke={ICE} strokeWidth="2.8" strokeLinecap="round" />
        <path d="M5 9 q5 5.5 10 0" fill="none" stroke={ICE} strokeWidth="2.8" strokeLinecap="round" />
      </g>
    </g>
  );
}

/* Hoodie torso centred under a Head at (cx, headCy). */
function Torso({ cx = 60, top = 72, width: w = 62, height: h = 38 }) {
  const hw = w / 2;
  return (
    <g transform={`translate(${cx} ${top})`}>
      {/* backpack straps peeking at the shoulders */}
      <path d={`M${-hw + 6} 4 q-6 10 -3 ${h - 8}`} fill="none" stroke={NAVY} strokeWidth="6" strokeLinecap="round" />
      <path d={`M${hw - 6} 4 q6 10 3 ${h - 8}`} fill="none" stroke={NAVY} strokeWidth="6" strokeLinecap="round" />
      {/* hoodie */}
      <path
        d={`M${-hw} 8 Q0 -2 ${hw} 8 L${hw + 4} ${h} Q0 ${h + 8} ${-hw - 4} ${h} Z`}
        fill={HOODIE} stroke={INK} strokeWidth="3" strokeLinejoin="round"
      />
      {/* drawstrings */}
      <path d="M-6 8 l-1.5 9" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M6 8 l1.5 9" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" />
      {/* chest infinity */}
      <Infinity8 x={0} y={h / 2 + 6} s={0.72} width={4.2} />
    </g>
  );
}

function Glove({ x, y, r = 8.5 }) {
  return <circle cx={x} cy={y} r={r} fill="#fff" stroke={INK} strokeWidth="3" />;
}

/* Sneaker: navy body, white sole + toe cap. */
function Shoe({ x, y, flip = false }) {
  return (
    <g transform={`translate(${x} ${y})${flip ? ' scale(-1 1)' : ''}`}>
      <path d="M-9 -4 Q-9 -10 -2 -10 L7 -10 Q12 -10 12 -4 L12 0 L-9 0 Z" fill={HOODIE} stroke={INK} strokeWidth="2.6" strokeLinejoin="round" />
      <rect x="-10" y="-1" width="23" height="5" rx="2.5" fill="#fff" stroke={INK} strokeWidth="2.4" />
      <path d="M4 -10 L12 -4" stroke={ICE} strokeWidth="2" strokeLinecap="round" />
    </g>
  );
}

function Sparkles({ cx = 60 }) {
  return (
    <g className="mascot-sparkle" fill={BLUE} aria-hidden="true">
      <path d={`M${cx - 46} 26 l2 5 5 2 -5 2 -2 5 -2 -5 -5 -2 5 -2 z`} opacity="0.8" />
      <path d={`M${cx + 44} 12 l1.5 4 4 1.5 -4 1.5 -1.5 4 -1.5 -4 -4 -1.5 4 -1.5 z`} opacity="0.6" />
      <path d={`M${cx + 50} 62 l1.2 3 3 1.2 -3 1.2 -1.2 3 -1.2 -3 -3 -1.2 3 -1.2 z`} opacity="0.7" />
    </g>
  );
}

export default function Mascot({ pose = 'wave', width = 90, className = '' }) {
  if (pose === 'peek') {
    // Head + gloves gripping an edge; place at the top edge of a card.
    return (
      <svg viewBox="0 0 120 78" width={width} className={className} aria-hidden="true">
        <Head cx={60} cy={44} />
        <Glove x={18} y={74} />
        <Glove x={102} y={74} />
      </svg>
    );
  }

  if (pose === 'sit') {
    return (
      <svg viewBox="0 0 120 150" width={width} className={className} aria-hidden="true">
        <Head cx={60} cy={38} />
        <Torso cx={60} top={68} />
        {/* gloves resting beside the hips */}
        <Glove x={24} y={104} />
        <Glove x={96} y={104} />
        {/* dangling white legs + sneakers */}
        <g className="mascot-leg-l" style={{ transformOrigin: '50px 112px' }}>
          <rect x="44" y="110" width="11" height="22" rx="5.5" fill="#fff" stroke={INK} strokeWidth="2.6" />
          <Shoe x={49} y={142} />
        </g>
        <g className="mascot-leg-r" style={{ transformOrigin: '70px 112px' }}>
          <rect x="65" y="110" width="11" height="22" rx="5.5" fill="#fff" stroke={INK} strokeWidth="2.6" />
          <Shoe x={71} y={142} flip />
        </g>
      </svg>
    );
  }

  if (pose === 'float') {
    return (
      <svg viewBox="0 0 120 150" width={width} className={`mascot-bob ${className}`} aria-hidden="true">
        <Sparkles cx={60} />
        <Head cx={60} cy={40} />
        <Torso cx={60} top={70} />
        <Glove x={22} y={100} />
        <Glove x={98} y={100} />
        {/* tucked legs */}
        <rect x="45" y="112" width="11" height="14" rx="5.5" fill="#fff" stroke={INK} strokeWidth="2.6" />
        <rect x="64" y="112" width="11" height="14" rx="5.5" fill="#fff" stroke={INK} strokeWidth="2.6" />
        <Shoe x={50} y={136} />
        <Shoe x={70} y={136} flip />
      </svg>
    );
  }

  // default: wave — one arm raised and waving
  return (
    <svg viewBox="0 0 130 150" width={width} className={className} aria-hidden="true">
      <Head cx={62} cy={40} />
      <Torso cx={62} top={70} />
      {/* resting arm */}
      <Glove x={26} y={102} />
      {/* waving arm */}
      <g className="mascot-wave-arm" style={{ transformOrigin: '100px 92px' }}>
        <path d="M98 92 q6 -14 4 -26" fill="none" stroke={HOODIE} strokeWidth="9" strokeLinecap="round" />
        <Glove x={102} y={60} r={9} />
      </g>
      {/* standing white legs + sneakers */}
      <rect x="48" y="112" width="11" height="20" rx="5.5" fill="#fff" stroke={INK} strokeWidth="2.6" />
      <rect x="66" y="112" width="11" height="20" rx="5.5" fill="#fff" stroke={INK} strokeWidth="2.6" />
      <Shoe x={53} y={142} />
      <Shoe x={73} y={142} flip />
    </svg>
  );
}
