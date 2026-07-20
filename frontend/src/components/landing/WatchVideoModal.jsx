import React, { useEffect, useState, useCallback } from 'react';
import { X, Play, Pause, ArrowRight } from 'lucide-react';
import { HOW_IT_WORKS } from '../../data/mock';
import StepDemo from './StepDemo';

const STEP_MS = 3400;

/*
 * A lightweight "walkthrough" that plays like a short video — it auto-
 * advances through the five How-It-Works step animations with captions.
 * No external video file needed; when a real recording exists, drop it in
 * as a <video> and swap the body.
 */
export default function WatchVideoModal({ open, onClose }) {
  const [i, setI] = useState(0);
  const [playing, setPlaying] = useState(true);

  useEffect(() => { if (open) { setI(0); setPlaying(true); } }, [open]);

  useEffect(() => {
    if (!open || !playing) return;
    const t = setTimeout(() => setI((v) => (v + 1) % HOW_IT_WORKS.length), STEP_MS);
    return () => clearTimeout(t);
  }, [open, playing, i]);

  const esc = useCallback((e) => { if (e.key === 'Escape') onClose(); }, [onClose]);
  useEffect(() => {
    if (!open) return;
    window.addEventListener('keydown', esc);
    document.body.style.overflow = 'hidden';
    return () => { window.removeEventListener('keydown', esc); document.body.style.overflow = ''; };
  }, [open, esc]);

  if (!open) return null;
  const step = HOW_IT_WORKS[i];

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4" role="dialog" aria-modal="true" aria-label="How InfinitySheets works">
      <div className="absolute inset-0 bg-slate-900/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-[720px] rounded-3xl bg-white shadow-2xl overflow-hidden">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
          <div className="text-[13px] font-semibold tracking-wider uppercase text-blue-600">See how it works</div>
          <button onClick={onClose} aria-label="Close" className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-500 hover:bg-slate-100 transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 sm:p-8">
          <div className="rounded-2xl bg-slate-50 border border-slate-200 p-6">
            <StepDemo key={i} step={i} />
          </div>
          <div className="mt-5 flex items-start gap-4">
            <div className="text-[30px] font-semibold tracking-tight text-blue-300 leading-none tabular-nums select-none">{step.n}</div>
            <div className="min-w-0">
              <div className="text-[18px] font-semibold text-slate-900">{step.title}</div>
              <p className="text-[14px] text-slate-600 mt-1 leading-relaxed">{step.text}</p>
            </div>
          </div>

          {/* progress dots + controls */}
          <div className="mt-6 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <button onClick={() => setPlaying((p) => !p)} aria-label={playing ? 'Pause' : 'Play'}
                className="w-9 h-9 rounded-full bg-blue-600 text-white flex items-center justify-center hover:bg-blue-700 transition-colors">
                {playing ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
              </button>
              <div className="flex gap-1.5">
                {HOW_IT_WORKS.map((_, idx) => (
                  <button key={idx} onClick={() => setI(idx)} aria-label={`Step ${idx + 1}`}
                    className={`h-1.5 rounded-full transition-all ${idx === i ? 'w-6 bg-blue-600' : 'w-1.5 bg-slate-300 hover:bg-slate-400'}`} />
                ))}
              </div>
            </div>
            <a href="#signup" onClick={onClose} className="btn-violet inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-medium">
              Start free <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
