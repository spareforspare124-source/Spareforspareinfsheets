import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SUBJECT_INFO } from '../../data/mock';

const SUBJECT_COLORS = [
  '#7c3aed', // violet
  '#2563eb', // royal blue
  '#06b6d4', // cyan
  '#10b981', // emerald
  '#f59e0b', // amber
  '#ec4899', // pink
  '#8b5cf6', // purple
  '#0ea5e9', // sky
  '#14b8a6', // teal
];

export default function ProgressView() {
  const { state } = useApp();
  const ws = state.worksheets || [];

  const allSubjects = useMemo(() => {
    const set = new Set();
    ws.forEach((w) => set.add(w.subject));
    return Array.from(set);
  }, [ws]);

  // Map subject -> false means hidden; missing = visible
  const [hidden, setHidden] = useState({});
  const isHidden = (s) => hidden[s] === true;
  const visibleSubjects = allSubjects.filter((s) => !isHidden(s));

  const ordered = useMemo(() => [...ws].slice().reverse(), [ws]);
  const visibleWS = useMemo(() => ordered.filter((w) => !isHidden(w.subject)), [ordered, hidden]); // eslint-disable-line react-hooks/exhaustive-deps

  const subjectStats = useMemo(() => {
    const m = {};
    visibleWS.forEach((w) => {
      if (!m[w.subject]) m[w.subject] = { total: 0, correct: 0, count: 0, scores: [] };
      m[w.subject].total += w.total;
      m[w.subject].correct += w.correct;
      m[w.subject].count += 1;
      m[w.subject].scores.push(w.score);
    });
    return m;
  }, [visibleWS]);

  const overallAvg = useMemo(() => {
    if (visibleWS.length === 0) return 0;
    return Math.round(visibleWS.reduce((s, w) => s + w.score, 0) / visibleWS.length);
  }, [visibleWS]);

  if (ws.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-[color:var(--color-border)] p-12 text-center bg-white">
        <div className="text-[15px] font-medium text-slate-700">No progress data yet</div>
        <div className="text-[13px] text-slate-500 mt-1">Complete a worksheet to see your performance over time.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Mini label="Average score" value={`${overallAvg}%`} accent />
        <Mini label="Best score" value={`${Math.max(...(visibleWS.length ? visibleWS.map((x) => x.score) : [0]))}%`} />
        <Mini label="Worksheets" value={visibleWS.length} />
        <Mini label="Questions" value={visibleWS.reduce((s, x) => s + x.total, 0)} />
      </div>

      <div className="rounded-2xl border border-[color:var(--color-border)] p-5 bg-white">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <div className="eyebrow-muted">Score by subject</div>
            <div className="text-[12px] text-slate-500 mt-1">Tap a subject chip to show or hide it. The dashed line is your overall average.</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setHidden({})} className="text-[12px] text-violet-700 hover:text-violet-900 transition-colors">Show all</button>
            <span className="text-slate-300">/</span>
            <button onClick={() => { const m = {}; allSubjects.forEach((s) => { m[s] = true; }); setHidden(m); }} className="text-[12px] text-slate-500 hover:text-slate-800 transition-colors">Hide all</button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-5">
          {allSubjects.map((s, i) => {
            const color = SUBJECT_COLORS[i % SUBJECT_COLORS.length];
            const off = isHidden(s);
            const info = SUBJECT_INFO[s] || { emoji: '\u{1F4DA}' };
            return (
              <button key={s} onClick={() => setHidden((a) => ({ ...a, [s]: !a[s] }))}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12.5px] font-medium border transition-colors ${off ? 'bg-slate-50 text-slate-400 border-[color:var(--color-border)]' : 'bg-white text-slate-800 border-[color:var(--color-border)] hover:bg-slate-100'}`}>
                <span className="w-2 h-2 rounded-full" style={{ background: off ? '#cbd5e1' : color }} />
                <span className="text-[14px] leading-none">{info.emoji}</span>
                <span className={off ? 'line-through' : ''}>{s}</span>
              </button>
            );
          })}
        </div>

        <SubjectGroupedChart worksheets={visibleWS} subjects={visibleSubjects} allSubjects={allSubjects} avg={overallAvg} />
      </div>

      <div className="rounded-2xl border border-[color:var(--color-border)] p-5 bg-white">
        <div className="eyebrow-muted mb-3">Per-subject accuracy</div>
        {visibleSubjects.length === 0 ? (
          <div className="text-[13px] text-slate-500">No subjects visible. Toggle a chip to add subjects back.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {visibleSubjects.map((s) => {
              const color = SUBJECT_COLORS[allSubjects.indexOf(s) % SUBJECT_COLORS.length];
              const st = subjectStats[s];
              const info = SUBJECT_INFO[s] || { emoji: '\u{1F4DA}' };
              const avg = st && st.scores.length ? Math.round(st.scores.reduce((a, b) => a + b, 0) / st.scores.length) : 0;
              return (
                <div key={s} className="rounded-xl border border-[color:var(--color-border)] px-4 py-3">
                  <div className="flex items-center justify-between gap-3 mb-2">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                      <span className="text-[14.5px]">{info.emoji}</span>
                      <span className="text-[14px] font-semibold text-slate-900">{s}</span>
                    </div>
                    <div className="text-[12.5px] text-slate-600 tabular-nums">{avg}% · {st?.count || 0} worksheets</div>
                  </div>
                  <div className="h-1.5 rounded-full bg-slate-100 overflow-hidden">
                    <div className="h-full transition-all" style={{ width: `${avg}%`, background: color }} />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function SubjectGroupedChart({ worksheets, subjects, allSubjects, avg }) {
  const w = 760, h = 280, padL = 36, padR = 16, padT = 16, padB = 30;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;

  const N = Math.min(8, Math.max(1, worksheets.length));
  const data = useMemo(() => {
    if (worksheets.length === 0 || subjects.length === 0) return { buckets: [] };
    const bucketSize = Math.ceil(worksheets.length / N);
    const buckets = [];
    for (let i = 0; i < N; i++) {
      const slice = worksheets.slice(i * bucketSize, (i + 1) * bucketSize);
      const bySubject = {};
      subjects.forEach((s) => { bySubject[s] = { sum: 0, count: 0, avg: null }; });
      slice.forEach((wk) => {
        if (!bySubject[wk.subject]) return;
        bySubject[wk.subject].sum += wk.score;
        bySubject[wk.subject].count += 1;
      });
      Object.keys(bySubject).forEach((k) => {
        const b = bySubject[k];
        b.avg = b.count ? Math.round(b.sum / b.count) : null;
      });
      buckets.push({ index: i, items: bySubject });
    }
    return { buckets };
  }, [worksheets, subjects, N]);

  if (data.buckets.length === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center text-[13px] text-slate-500 border border-dashed border-[color:var(--color-border)] rounded-xl">
        No data for the selected subjects. Toggle a chip to add subjects back.
      </div>
    );
  }

  const groupW = innerW / data.buckets.length;
  const barGap = 2;
  const groupPadding = 8;
  const barCount = Math.max(1, subjects.length);
  const barW = Math.max(4, (groupW - groupPadding * 2 - (barCount - 1) * barGap) / barCount);

  const avgY = padT + innerH - (avg / 100) * innerH;

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto min-w-[640px]">
        {[0, 25, 50, 75, 100].map((g) => {
          const y = padT + innerH - (g / 100) * innerH;
          return (
            <g key={g}>
              <line x1={padL} x2={w - padR} y1={y} y2={y} stroke="#eef2f7" strokeWidth="1" />
              <text x={padL - 8} y={y + 3} textAnchor="end" fontSize="9" fill="#94a3b8">{g}</text>
            </g>
          );
        })}

        {data.buckets.map((bucket, bi) => {
          const groupX = padL + bi * groupW + groupPadding;
          return subjects.map((s, si) => {
            const v = bucket.items[s]?.avg;
            if (v === null || v === undefined) return null;
            const barH = (v / 100) * innerH;
            const x = groupX + si * (barW + barGap);
            const y = padT + innerH - barH;
            const color = SUBJECT_COLORS[allSubjects.indexOf(s) % SUBJECT_COLORS.length];
            return (
              <g key={`${bi}-${s}`}>
                <rect x={x} y={y} width={barW} height={barH} rx="3" fill={color} opacity="0.95">
                  <title>{s}: {v}%</title>
                </rect>
              </g>
            );
          });
        })}

        {data.buckets.map((b, i) => {
          const x = padL + i * groupW + groupW / 2;
          return (
            <text key={i} x={x} y={h - 10} textAnchor="middle" fontSize="9.5" fill="#94a3b8">
              {data.buckets.length <= 1 ? 'All' : `#${i + 1}`}
            </text>
          );
        })}

        <line x1={padL} x2={w - padR} y1={avgY} y2={avgY} stroke="#0f172a" strokeWidth="1.2" strokeDasharray="4 4" opacity="0.55" />
        <text x={w - padR - 4} y={avgY - 4} textAnchor="end" fontSize="10" fontWeight="600" fill="#0f172a">Avg {avg}%</text>
      </svg>
    </div>
  );
}

function Mini({ label, value, accent = false }) {
  return (
    <div className={`rounded-xl border p-4 ${accent ? 'border-violet-200 bg-gradient-to-br from-violet-50 to-blue-50' : 'border-[color:var(--color-border)] bg-white'}`}>
      <div className="eyebrow-muted">{label}</div>
      <div className={`text-[20px] font-semibold mt-1 ${accent ? 'text-violet-700' : 'text-slate-900'}`}>{value}</div>
    </div>
  );
}
