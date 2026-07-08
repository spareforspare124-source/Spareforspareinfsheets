import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { SUBJECT_INFO } from '../../data/mock';
import { TrendingUp, TrendingDown, Minus, Sparkles } from 'lucide-react';
import EmptyStateScene from '../decor/EmptyStateScene';

const SUBJECT_COLORS = [
  '#2563eb', '#7c3aed', '#dc2626', '#10b981',
  '#f59e0b', '#ec4899', '#8b5cf6', '#0ea5e9', '#14b8a6',
];

// Difficulty weights for the predicted-score model. Harder worksheets are
// closer to real exam conditions, so they carry more signal.
const DIFF_W = { 'Easy': 0.6, 'Medium': 0.85, 'Exam level': 1.0, 'Hard': 1.15 };
const HALF_LIFE_DAYS = 14;

function weightFor(ws, refTime = Date.now()) {
  const daysAgo = Math.max(0, (refTime - new Date(ws.date).getTime()) / (1000 * 60 * 60 * 24));
  const recency = Math.pow(0.5, daysAgo / HALF_LIFE_DAYS);
  const diff = DIFF_W[ws.difficulty] || 0.85;
  return recency * diff;
}

function predictedFromList(list) {
  if (!list.length) return 0;
  let num = 0, den = 0;
  const now = Date.now();
  for (const w of list) {
    const weight = weightFor(w, now);
    num += w.score * weight;
    den += weight;
  }
  if (den === 0) return 0;
  return Math.min(100, Math.round(num / den));
}

export default function ProgressView() {
  const { state } = useApp();
  const ws = state.worksheets || [];

  const allSubjects = useMemo(() => Array.from(new Set(ws.map((w) => w.subject))), [ws]);
  const [hidden, setHidden] = useState({});
  const isHidden = (s) => hidden[s] === true;
  const visibleSubjects = allSubjects.filter((s) => !isHidden(s));

  // Chronological order (oldest first)
  const chronological = useMemo(() => [...ws].slice().reverse(), [ws]);
  const visibleWS = useMemo(
    () => chronological.filter((w) => !hidden[w.subject]),
    [chronological, hidden]
  );

  // Per-subject series (each point is a worksheet attempt)
  const series = useMemo(() => {
    const m = {};
    visibleSubjects.forEach((s) => { m[s] = []; });
    chronological.forEach((w, i) => {
      if (!visibleSubjects.includes(w.subject)) return;
      m[w.subject].push({ x: i, score: w.score, date: w.date, topic: w.topic });
    });
    return m;
  }, [chronological, visibleSubjects]);

  // Percentage improvement: (last - first) percentage points
  const deltas = useMemo(() => {
    const out = {};
    Object.entries(series).forEach(([s, points]) => {
      if (points.length < 2) { out[s] = { delta: 0, hasEnough: false, first: points[0]?.score, last: points[points.length - 1]?.score }; return; }
      const first = points[0].score;
      const last = points[points.length - 1].score;
      out[s] = { delta: last - first, hasEnough: true, first, last };
    });
    return out;
  }, [series]);

  // Predicted final-exam score (difficulty-weighted with 14-day recency half-life).
  const predictedOverall = useMemo(() => predictedFromList(visibleWS), [visibleWS]);

  // Per-subject predicted score (same formula, subject-scoped).
  const predictedBySubject = useMemo(() => {
    const map = {};
    visibleSubjects.forEach((s) => {
      const list = visibleWS.filter((w) => w.subject === s);
      map[s] = { predicted: predictedFromList(list), count: list.length };
    });
    return map;
  }, [visibleWS, visibleSubjects]);

  // Delta = how the latest worksheet nudged the prediction (compared to prediction without it).
  const predictedDelta = useMemo(() => {
    if (visibleWS.length < 2) return null;
    const withoutLast = visibleWS.slice(0, -1);
    return predictedOverall - predictedFromList(withoutLast);
  }, [visibleWS, predictedOverall]);

  if (ws.length === 0) {
    return (
      <div className="relative rounded-2xl border border-dashed border-[color:var(--color-border)] bg-white overflow-hidden min-h-[360px]">
        <EmptyStateScene variant="both" className="absolute inset-0" />
        <div className="relative p-12 text-center">
          <div className="text-[15px] font-semibold text-slate-700">No progress data yet</div>
          <div className="text-[13px] text-slate-500 mt-1">Complete a worksheet to start drawing your improvement line.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <Delta label="Predicted score" value={`${predictedOverall}%`} delta={predictedDelta} testid="predicted-score" />
        <Mini label="Best score" value={`${Math.max(...(visibleWS.length ? visibleWS.map((x) => x.score) : [0]))}%`} />
        <Mini label="Worksheets" value={visibleWS.length} />
        <Mini label="Questions" value={visibleWS.reduce((s, x) => s + x.total, 0)} />
      </div>

      <div className="rounded-2xl border border-[color:var(--color-border)] p-5 bg-white">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div>
            <div className="eyebrow-muted">Score trend over time</div>
            <div className="text-[12px] text-slate-500 mt-1">A line per subject. Tap a chip to show or hide it.</div>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={() => setHidden({})} className="text-[12px] text-blue-700 hover:text-blue-900 transition-colors">Show all</button>
            <span className="text-slate-300">/</span>
            <button onClick={() => { const m = {}; allSubjects.forEach((s) => { m[s] = true; }); setHidden(m); }} className="text-[12px] text-slate-500 hover:text-slate-800 transition-colors">Hide all</button>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 mb-5">
          {allSubjects.map((s, i) => {
            const color = SUBJECT_COLORS[i % SUBJECT_COLORS.length];
            const off = isHidden(s);
            const info = SUBJECT_INFO[s] || { emoji: '\u25A0' };
            const d = deltas[s] || {};
            return (
              <button key={s} onClick={() => setHidden((a) => ({ ...a, [s]: !a[s] }))}
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[12.5px] font-medium border transition-colors ${off ? 'bg-slate-50 text-slate-400 border-[color:var(--color-border)]' : 'bg-white text-slate-800 border-[color:var(--color-border)] hover:bg-slate-100'}`}>
                <span className="w-2.5 h-2.5 rounded-full" style={{ background: off ? '#cbd5e1' : color }} />
                <span className="text-[14px] leading-none">{info.emoji}</span>
                <span className={off ? 'line-through' : ''}>{s}</span>
                {!off && d.hasEnough && <DeltaPill delta={d.delta} small />}
              </button>
            );
          })}
        </div>

        <LineChart series={series} subjects={visibleSubjects} allSubjects={allSubjects} predicted={predictedOverall} predictedBySubject={predictedBySubject} />
      </div>

      <div className="rounded-2xl border border-[color:var(--color-border)] p-5 bg-white">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div>
            <div className="eyebrow-muted">Predicted score per subject</div>
            <div className="text-[12px] text-slate-500 mt-0.5">Weighted by worksheet difficulty and how recent the attempt is (14-day half-life).</div>
          </div>
          <Sparkles className="w-4 h-4 text-blue-600" />
        </div>
        {visibleSubjects.length === 0 ? (
          <div className="text-[13px] text-slate-500">No subjects visible.</div>
        ) : (
          <div className="flex flex-col gap-3">
            {visibleSubjects.map((s) => {
              const color = SUBJECT_COLORS[allSubjects.indexOf(s) % SUBJECT_COLORS.length];
              const info = SUBJECT_INFO[s] || { emoji: '\u25A0' };
              const p = predictedBySubject[s] || { predicted: 0, count: 0 };
              const d = deltas[s] || {};
              const noPred = p.count === 0;
              return (
                <div key={s} className="rounded-xl border border-[color:var(--color-border)] px-4 py-3">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-2 min-w-0">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                      <span className="text-[14.5px]">{info.emoji}</span>
                      <span className="text-[14px] font-semibold text-slate-900">{s}</span>
                      <span className="text-[11px] text-slate-500">· {p.count} {p.count === 1 ? 'attempt' : 'attempts'}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[10px] tracking-[0.14em] uppercase font-semibold text-slate-500">Predicted</div>
                        <div className="text-[16px] font-semibold text-blue-700 tabular-nums leading-tight">{noPred ? '—' : `${p.predicted}%`}</div>
                      </div>
                      {d.hasEnough ? <DeltaPill delta={d.delta} /> : <span className="text-[11.5px] text-slate-400">2+ needed</span>}
                    </div>
                  </div>
                  {noPred ? null : (
                    <div className="mt-2 h-1.5 rounded-full bg-slate-100 overflow-hidden">
                      <div className="h-full rounded-full" style={{ width: `${p.predicted}%`, background: color }} />
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

function LineChart({ series, subjects, allSubjects, predicted, predictedBySubject }) {
  const w = 760, h = 280, padL = 36, padR = 16, padT = 16, padB = 30;
  const innerW = w - padL - padR;
  const innerH = h - padT - padB;

  // x range across visible points: 0..maxLen
  const maxLen = Math.max(0, ...subjects.map((s) => (series[s]?.length || 0)));
  if (maxLen === 0) {
    return (
      <div className="h-[200px] flex items-center justify-center text-[13px] text-slate-500 border border-dashed border-[color:var(--color-border)] rounded-xl">
        No data for the selected subjects. Toggle a chip to add subjects back.
      </div>
    );
  }
  const denom = Math.max(1, maxLen - 1);
  const xFor = (i) => padL + (i / denom) * innerW;
  const yFor = (v) => padT + innerH - (v / 100) * innerH;
  const predictedY = yFor(predicted);

  return (
    <div className="overflow-x-auto">
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-auto min-w-[640px]">
        {[0, 25, 50, 75, 100].map((g) => {
          const y = yFor(g);
          return (
            <g key={g}>
              <line x1={padL} x2={w - padR} y1={y} y2={y} stroke="#eef2f7" strokeWidth="1" />
              <text x={padL - 8} y={y + 3} textAnchor="end" fontSize="9" fill="#94a3b8">{g}</text>
            </g>
          );
        })}

        {/* x ticks */}
        {Array.from({ length: maxLen }).map((_, i) => (
          <text key={i} x={xFor(i)} y={h - 10} textAnchor="middle" fontSize="9" fill="#94a3b8">{`#${i + 1}`}</text>
        ))}

        {/* per-subject historical lines */}
        {subjects.map((s) => {
          const pts = series[s] || [];
          if (pts.length === 0) return null;
          const color = SUBJECT_COLORS[allSubjects.indexOf(s) % SUBJECT_COLORS.length];
          const path = pts.map((p, i) => `${i === 0 ? 'M' : 'L'} ${xFor(i).toFixed(1)} ${yFor(p.score).toFixed(1)}`).join(' ');
          return (
            <g key={s}>
              <path d={path} fill="none" stroke={color} strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
              {pts.map((p, i) => (
                <circle key={`${s}-${i}`} cx={xFor(i)} cy={yFor(p.score)} r="3.4" fill={color}>
                  <title>{`${s} ${p.score}% (${p.topic})`}</title>
                </circle>
              ))}
            </g>
          );
        })}

        {/* Per-subject predicted end-of-line markers on the right edge */}
        {subjects.map((s) => {
          const pts = series[s] || [];
          if (pts.length === 0) return null;
          const p = predictedBySubject?.[s];
          if (!p || p.count === 0) return null;
          const color = SUBJECT_COLORS[allSubjects.indexOf(s) % SUBJECT_COLORS.length];
          const lastX = xFor(pts.length - 1);
          const predX = w - padR - 4;
          const predY = yFor(p.predicted);
          return (
            <g key={`pred-${s}`}>
              {/* dashed connector from the last real point to the predicted marker */}
              <line x1={lastX} y1={yFor(pts[pts.length - 1].score)} x2={predX - 6} y2={predY} stroke={color} strokeWidth="1.2" strokeDasharray="3 3" opacity="0.7" />
              <circle cx={predX - 6} cy={predY} r="4.2" fill="white" stroke={color} strokeWidth="2" />
              <title>{`${s} predicted ${p.predicted}%`}</title>
            </g>
          );
        })}

        {/* overall predicted line */}
        <line x1={padL} x2={w - padR} y1={predictedY} y2={predictedY} stroke="#1e40af" strokeWidth="1.4" strokeDasharray="5 4" opacity="0.65" />
        <text x={w - padR - 4} y={predictedY - 5} textAnchor="end" fontSize="10" fontWeight="700" fill="#1e40af">Predicted {predicted}%</text>
      </svg>
    </div>
  );
}

function DeltaPill({ delta, small = false }) {
  const Up = delta > 0;
  const Down = delta < 0;
  const Icon = Up ? TrendingUp : (Down ? TrendingDown : Minus);
  const cls = Up
    ? 'bg-emerald-100 text-emerald-700 border-emerald-200'
    : (Down ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-slate-100 text-slate-600 border-slate-200');
  const sign = Up ? '+' : (Down ? '' : '±');
  return (
    <span className={`inline-flex items-center gap-1 px-${small ? '1.5' : '2'} py-0.5 rounded-md text-[${small ? '10.5' : '11.5'}px] font-semibold border ${cls}`}>
      <Icon className={small ? 'w-3 h-3' : 'w-3.5 h-3.5'} />
      <span>{sign}{Math.abs(delta).toFixed(0)} pp</span>
    </span>
  );
}

function Delta({ label, value, delta, testid }) {
  return (
    <div className="rounded-xl border border-blue-200 bg-blue-50 p-4" data-testid={testid}>
      <div className="flex items-center justify-between gap-2">
        <div className="eyebrow-muted">{label}</div>
        {delta !== null && delta !== undefined && <DeltaPill delta={delta} small />}
      </div>
      <div className="text-[20px] font-semibold mt-1 text-blue-700">{value}</div>
    </div>
  );
}

function Mini({ label, value }) {
  return (
    <div className="rounded-xl border border-[color:var(--color-border)] bg-white p-4">
      <div className="eyebrow-muted">{label}</div>
      <div className="text-[20px] font-semibold mt-1 text-slate-900">{value}</div>
    </div>
  );
}
