import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import Reveal from './Reveal';
import Mascot from '../decor/Mascot';
import { FEATURES } from '../../data/mock';
import { FeatureDemo, DEMO_KINDS } from './Features';

/*
 * The six feature cards on a slowly spinning 3D ring, shown between the
 * hero dashboard screenshot and the product stats strip. Every card's
 * looping demo stays open as it rides the ring. The spin never stops —
 * hovering only reveals prev/next arrows that page card-by-card (still
 * animated in 3D), and a horizontal wheel spins the ring directly.
 * (Student photos ride the 2D belt up in the hero.)
 */
const SPIN_SECONDS = 40;
const STEP_ANIM_MS = 600;

function FeatureCard({ f, demoIndex }) {
  return (
    <div className="w-full h-full feature-card demo-open liquid-glass rounded-2xl px-5 py-4 text-left flex flex-col overflow-hidden">
      <div className="feature-demo">
        <FeatureDemo kind={DEMO_KINDS[demoIndex] || 'fresh'} />
      </div>
      <h3 className="text-[15px] font-semibold text-slate-900 leading-snug">{f.title}</h3>
      <p className="mt-1.5 text-[12.5px] text-slate-600 leading-relaxed line-clamp-3">{f.desc}</p>
    </div>
  );
}

export default function StudentGallery3D() {
  const n = FEATURES.length;
  const step = 360 / n;
  const radius = 340;
  const ringRef = React.useRef(null);
  const stageRef = React.useRef(null);
  const angleRef = React.useRef(0);        // current rotation in degrees
  const animRef = React.useRef(null);      // {from, to, start} while paging
  const [hovered, setHovered] = React.useState(false);
  const reduced = React.useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );

  React.useEffect(() => {
    if (reduced) return;
    let raf;
    let last = performance.now();
    const easeInOut = (t) => (t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2);
    const tick = (now) => {
      const dt = now - last;
      last = now;
      const anim = animRef.current;
      if (anim) {
        const t = Math.min(1, (now - anim.start) / STEP_ANIM_MS);
        angleRef.current = anim.from + (anim.to - anim.from) * easeInOut(t);
        if (t >= 1) animRef.current = null;
      } else {
        // Never pauses — hover only reveals the paging arrows.
        angleRef.current += (dt / (SPIN_SECONDS * 1000)) * 360;
      }
      if (ringRef.current) ringRef.current.style.transform = `rotateY(${-angleRef.current}deg)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduced]);

  // Page to the next/previous card: animate to the nearest slot boundary in
  // that direction so a card lands dead-centre.
  const page = (dir) => {
    const from = animRef.current ? animRef.current.to : angleRef.current;
    const slot = dir > 0 ? Math.floor(from / step + 1e-4) + 1 : Math.ceil(from / step - 1e-4) - 1;
    animRef.current = { from, to: slot * step, start: performance.now() };
  };

  // Horizontal wheel / side-scroll spins the ring directly. Registered
  // manually because React's onWheel is passive (preventDefault ignored).
  React.useEffect(() => {
    const stage = stageRef.current;
    if (!stage || reduced) return;
    const onWheel = (e) => {
      // Horizontal input arrives differently per mouse/driver: true deltaX
      // (trackpads, MX-series thumb wheels on some drivers) or as a
      // shift+vertical wheel (other drivers). Treat both as spin input;
      // plain vertical wheel still scrolls the page.
      let dx = 0;
      if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) dx = e.deltaX;
      else if (e.shiftKey && e.deltaY !== 0) dx = e.deltaY;
      if (!dx) return;
      if (e.deltaMode === 1) dx *= 16; // line-based deltas → approx pixels
      e.preventDefault();
      animRef.current = null;
      angleRef.current += dx * 0.25;
    };
    stage.addEventListener('wheel', onWheel, { passive: false });
    return () => stage.removeEventListener('wheel', onWheel);
  }, [reduced]);

  return (
    <section id="features" className="section-bg overflow-hidden scroll-mt-24">
      <div className="max-w-[1280px] mx-auto px-6 pt-4 pb-14 text-center">
        <Reveal>
          <div className="relative inline-block">
            {/* Sheety peeking out from behind the heading, hanging onto it */}
            <div className="hidden lg:block absolute -top-[38px] right-10 -z-10 pointer-events-none -rotate-6" aria-hidden="true">
              <Mascot pose="peek" width={66} />
            </div>
            <div className="relative eyebrow mb-3">Features</div>
            <h2 className="relative h-display text-[28px] sm:text-[34px] lg:text-[40px] leading-[1.05]">Everything you need to study smarter.</h2>
          </div>
        </Reveal>
        <div
          ref={stageRef}
          className="gallery3d-stage mt-10 relative"
          onMouseEnter={() => setHovered(true)}
          onMouseLeave={() => setHovered(false)}
        >
          <div ref={ringRef} className="gallery3d-ring" style={reduced ? { transform: 'rotateY(-15deg)' } : undefined}>
            {FEATURES.map((f, i) => (
              <div key={f.title} className="gallery3d-card" style={{ transform: `rotateY(${step * i}deg) translateZ(${radius}px)` }}>
                <FeatureCard f={f} demoIndex={i} />
              </div>
            ))}
          </div>
          {hovered && !reduced && (
            <>
              <button onClick={() => page(-1)} aria-label="Previous feature"
                className="absolute left-[8%] top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full liquid-glass border border-slate-200 flex items-center justify-center text-slate-700 hover:text-blue-600 transition-colors">
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button onClick={() => page(1)} aria-label="Next feature"
                className="absolute right-[8%] top-1/2 -translate-y-1/2 z-10 w-11 h-11 rounded-full liquid-glass border border-slate-200 flex items-center justify-center text-slate-700 hover:text-blue-600 transition-colors">
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}
        </div>
        {/* Phones get a simple swipeable strip instead of the 3D ring */}
        <div className="gallery3d-mobile mt-8 gap-3 overflow-x-auto px-1 pb-2 snap-x snap-mandatory">
          {FEATURES.map((f, i) => (
            <div key={f.title} className="snap-center shrink-0 w-[250px]">
              <FeatureCard f={f} demoIndex={i} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
