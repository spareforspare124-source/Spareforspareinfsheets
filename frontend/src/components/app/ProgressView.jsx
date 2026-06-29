import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';

export default function ProgressView() {
  const { state } = useApp();
  const ws = state.worksheets || [];
  const ordered = useMemo(() => [...ws].slice().reverse(), [ws]);
  const points = useMemo(() => ordered.map((w, i) => ({ x: i, y: w.score })), [ordered]);

  if (ws.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 p-12 text-center">
        <div className="text-[15px] font-medium text-zinc-700">No progress data yet</div>
        <div className="text-[13px] text-zinc-500 mt-1">Complete a worksheet to see your performance over time.</div>
      </div>
    );
  }

  const w = 720, h = 260, pad = 30;
  const xs = points.length > 1 ? points.map((p, i) => pad + (i * (w - pad * 2)) / (points.length - 1)) : [w / 2];
  const ys = points.map((p) => h - pad - (p.y / 100) * (h - pad * 2));
  const path = points.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xs[i]} ${ys[i]}`).join(' ');
  const avg = Math.round(ws.reduce((s, x) => s + x.score, 0) / ws.length);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Mini label="Average score" value={`${avg}%`} />
        <Mini label="Best score" value={`${Math.max(...ws.map((x) => x.score))}%`} />
        <Mini label="Worksheets" value={ws.length} />
        <Mini label="Questions" value={ws.reduce((s, x) => s + x.total, 0)} />
      </div>
      <div className="rounded-2xl border border-zinc-200 p-5">
        <div className="eyebrow-muted mb-3">Score over time</div>
        <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto">
          {[0, 25, 50, 75, 100].map((g) => {
            const y = h - pad - (g / 100) * (h - pad * 2);
            return <line key={g} x1={pad} x2={w - pad} y1={y} y2={y} stroke="#f4f4f5" strokeWidth="1" />;
          })}
          <path d={path} fill="none" stroke="#7c3aed" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
          {points.map((p, i) => (
            <circle key={i} cx={xs[i]} cy={ys[i]} r="4" fill="#7c3aed" />
          ))}
        </svg>
      </div>
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div className="rounded-xl border border-zinc-200 p-4">
      <div className="eyebrow-muted">{label}</div>
      <div className="text-[20px] font-semibold mt-1">{value}</div>
    </div>
  );
}
