import React from 'react';
import { motion } from 'framer-motion';

// Shared scroll-reveal wrapper. `from` varies the entrance so the page has
// rhythm instead of every section fading up identically:
//   'up' (default) · 'left' · 'right' · 'scale'
const FROM = {
  up: { opacity: 0, y: 28 },
  left: { opacity: 0, x: -36 },
  right: { opacity: 0, x: 36 },
  scale: { opacity: 0, scale: 0.94 },
};

export default function Reveal({ children, delay = 0, y = 28, from = 'up', className = '' }) {
  const initial = from === 'up' ? { opacity: 0, y } : (FROM[from] || FROM.up);
  return (
    <motion.div
      className={className}
      initial={initial}
      whileInView={{ opacity: 1, x: 0, y: 0, scale: 1 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}
