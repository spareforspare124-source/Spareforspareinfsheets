import React, { useEffect, useRef, useState } from 'react';
import { useInView } from 'framer-motion';

/*
 * Types `text` out character by character once the heading scrolls into view,
 * with a blinking caret. Renders the full text immediately for users with
 * reduced motion enabled, and keeps layout stable by reserving the full size.
 */
export default function TypeHeading({ text, className = '', speed = 45, as: Tag = 'h2' }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, amount: 0.4 });
  const [count, setCount] = useState(0);
  const [started, setStarted] = useState(false);
  const done = count >= text.length;

  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setCount(text.length);
      setStarted(true);
      return;
    }
    if (inView) setStarted(true);
  }, [inView, text.length]);

  useEffect(() => {
    if (!started || done) return;
    const t = setTimeout(() => setCount((c) => c + 1), speed);
    return () => clearTimeout(t);
  }, [started, count, done, speed]);

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {/* Invisible full text reserves the final layout; typed text paints over it */}
      <span aria-hidden="true" className="relative inline-block">
        <span className="invisible">{text}</span>
        <span className="absolute inset-0">
          {text.slice(0, count)}
          {started && !done && <span className="type-caret" />}
        </span>
      </span>
    </Tag>
  );
}
