import React from 'react';
import { EXAM_TRACKS, SUBJECTS } from '../../data/mock';

// Honest product facts (not user counts — the product is pre-launch).
const subjectCount = new Set(Object.values(SUBJECTS).flat()).size;

const STATS = [
  { value: EXAM_TRACKS.length, suffix: '', label: 'curricula covered' },
  { value: subjectCount, suffix: '+', label: 'subjects' },
  { text: 'Unlimited', label: 'exam-style questions' },
  { text: '$0', label: 'forever' },
];

// Counts 0 → target over ~0.9s the first time the stat scrolls into view.
function CountUp({ target, suffix }) {
  const ref = React.useRef(null);
  const [val, setVal] = React.useState(0);
  React.useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setVal(target); return; }
    let raf;
    let fallback;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      // If rAF is throttled (background tab), land on the target anyway.
      fallback = setTimeout(() => setVal(target), 1400);
      const start = performance.now();
      const tick = (now) => {
        const t = Math.min(1, (now - start) / 900);
        setVal(Math.round(target * (1 - Math.pow(1 - t, 3))));
        if (t < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    }, { threshold: 0.4 });
    io.observe(el);
    // Environments where IntersectionObserver never fires (frozen/embedded
    // renderers) still get the final number via a manual viewport check.
    const guard = setInterval(() => {
      const r = el.getBoundingClientRect();
      if (r.top < window.innerHeight && r.bottom > 0) { setVal(target); clearInterval(guard); }
    }, 1500);
    return () => { io.disconnect(); cancelAnimationFrame(raf); clearTimeout(fallback); clearInterval(guard); };
  }, [target]);
  return <span ref={ref}>{val}{suffix}</span>;
}

export default function ProductStats() {
  return (
    <section aria-label="At a glance" className="section-bg border-y border-[color:var(--color-border)]">
      <div className="max-w-[1100px] mx-auto px-6 py-8 grid grid-cols-2 md:grid-cols-4 gap-6">
        {STATS.map((s) => (
          <div key={s.label} className="text-center">
            <div className="text-[28px] sm:text-[32px] font-semibold tracking-tight text-slate-900">
              {s.text ? s.text : <CountUp target={s.value} suffix={s.suffix} />}
            </div>
            <div className="text-[12.5px] text-slate-500 mt-0.5">{s.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
