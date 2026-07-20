import React from 'react';
import { motion } from 'framer-motion';
import { PHOTOS, PhotoPlaceholder } from './studentPhotos';

/*
 * Student photos on a 2D conveyor belt in the hero, between the signup
 * bubble and the exam-track chips. The belt scrolls left continuously and
 * never pauses (hover included). The card list is rendered twice so the
 * CSS keyframe loop (-50%) wraps seamlessly. Reduced-motion users get a
 * static row of the first three photos.
 * (The six feature cards live on the 3D ring further down the page.)
 */
export default function FeatureCarousel() {
  const reduced = React.useMemo(
    () => typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches,
    []
  );
  const cards = reduced ? PHOTOS.slice(0, 3) : [...PHOTOS, ...PHOTOS];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.9, delay: 0.4 }}
      className="carousel-belt mt-14 mb-2"
      aria-label="Students using InfinitySheets"
    >
      <div className={`carousel-belt-track ${reduced ? 'justify-center' : ''}`} style={reduced ? { animation: 'none' } : undefined}>
        {cards.map((p, i) => (
          <div key={`${p.caption}-${i}`} className="carousel-belt-card" aria-hidden={i >= PHOTOS.length}>
            <div className="h-[190px] liquid-glass rounded-2xl overflow-hidden">
              {p.img
                ? <img src={p.img} alt={p.caption} className="w-full h-full object-cover" />
                : <PhotoPlaceholder tone={p.tone} emoji={p.emoji} caption={p.caption} />}
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}
