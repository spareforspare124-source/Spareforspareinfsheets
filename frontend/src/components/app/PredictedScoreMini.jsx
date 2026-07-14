import React from 'react';

/**
 * Track-aware summary of a student's predicted grade across every subject
 * they've studied. Reused by the Performance tab and the Dashboard stat row.
 *
 *   CBSE / ICSE    → average of every visible subject's predicted score
 *   IGCSE / AS-A   → count of subjects at each letter-grade threshold (A*, A, ...)
 *   IB             → count of subjects at each 1-7 grade
 *   Everything else (SSLC, SAT, JEE, NEET, LSAT, custom)
 *                  → count of subjects in each 10-point percentage band
 *
 * Props:
 *   predictedBySubject  {subject: { predicted, grade, count }}
 *   visibleSubjects     string[] — subjects to include in the summary
 *   examTrack           student's exam track (drives the format)
 *   footer              optional React node rendered below the summary
 *                       (used by the Dashboard to append the accuracy line)
 */

const IGCSE_GRADE_ORDER = ['A*', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'U'];
const IB_GRADE_ORDER = [7, 6, 5, 4, 3, 2, 1];
const PERCENT_BUCKETS = [
  { key: '90+', min: 90, max: 101, label: '\u2265 90%' },
  { key: '80s', min: 80, max: 90, label: '80\u201389%' },
  { key: '70s', min: 70, max: 80, label: '70\u201379%' },
  { key: '60s', min: 60, max: 70, label: '60\u201369%' },
  { key: '50s', min: 50, max: 60, label: '50\u201359%' },
  { key: '<50', min: 0, max: 50, label: '&lt; 50%' },
];

export default function PredictedScoreMini({ predictedBySubject, visibleSubjects, examTrack, label = 'Predicted score', footer = null }) {
  const track = (examTrack || '').toUpperCase();
  const scored = (visibleSubjects || [])
    .map((s) => predictedBySubject?.[s])
    .filter((p) => p && p.count > 0);

  if (scored.length === 0) {
    return (
      <div className="rounded-xl border border-[color:var(--color-border)] bg-white p-4">
        <div className="eyebrow-muted">{label}</div>
        <div className="text-[20px] font-semibold mt-1 text-slate-400">&mdash;</div>
        <div className="text-[11px] text-slate-500 mt-1">Complete a worksheet in any subject to unlock.</div>
        {footer}
      </div>
    );
  }

  // CBSE / ICSE → single average number
  if (track === 'CBSE' || track === 'ICSE') {
    const avg = Math.round(scored.reduce((s, p) => s + p.predicted, 0) / scored.length);
    return (
      <div className="rounded-xl border border-[color:var(--color-border)] bg-white p-4">
        <div className="eyebrow-muted">{label}</div>
        <div className="text-[26px] font-semibold mt-1 text-slate-900 tabular-nums">{avg}%</div>
        <div className="text-[11px] text-slate-500 mt-1">
          Average across {scored.length} subject{scored.length === 1 ? '' : 's'}.
        </div>
        {footer}
      </div>
    );
  }

  // IGCSE / AS-A → letter grade counts
  if (track === 'IGCSE' || track === 'ASA') {
    const counts = {};
    scored.forEach((p) => {
      const g = p.grade?.label || '\u2014';
      counts[g] = (counts[g] || 0) + 1;
    });
    const entries = IGCSE_GRADE_ORDER.filter((g) => counts[g]).map((g) => ({ key: g, count: counts[g] }));
    return (
      <div className="rounded-xl border border-[color:var(--color-border)] bg-white p-4">
        <div className="eyebrow-muted">{label}</div>
        <div className="mt-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {entries.map(({ key, count }) => (
            <div key={key} className="inline-flex items-baseline gap-1">
              <span className="text-[20px] font-semibold text-slate-900 tabular-nums leading-none">{count}</span>
              <span className="text-[13px] font-semibold text-slate-600 leading-none">{key}</span>
            </div>
          ))}
        </div>
        <div className="text-[11px] text-slate-500 mt-1.5">
          Across {scored.length} subject{scored.length === 1 ? '' : 's'} &middot; predicted {track === 'ASA' ? 'A Level' : 'IGCSE'} grade.
        </div>
        {footer}
      </div>
    );
  }

  // IB → 1-7 grade counts
  if (track === 'IB') {
    const counts = {};
    scored.forEach((p) => {
      const g = p.grade?.label ? parseInt(p.grade.label, 10) : null;
      if (g && !Number.isNaN(g)) counts[g] = (counts[g] || 0) + 1;
    });
    const entries = IB_GRADE_ORDER.filter((g) => counts[g]).map((g) => ({ key: g, count: counts[g] }));
    return (
      <div className="rounded-xl border border-[color:var(--color-border)] bg-white p-4">
        <div className="eyebrow-muted">{label}</div>
        <div className="mt-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
          {entries.map(({ key, count }) => (
            <div key={key} className="inline-flex items-baseline gap-1">
              <span className="text-[20px] font-semibold text-slate-900 tabular-nums leading-none">{count}</span>
              <span className="text-[13px] font-semibold text-slate-600 leading-none">
                {key}{count === 1 ? '' : 's'}
              </span>
            </div>
          ))}
        </div>
        <div className="text-[11px] text-slate-500 mt-1.5">
          Across {scored.length} subject{scored.length === 1 ? '' : 's'} &middot; predicted IB grade (1&ndash;7).
        </div>
        {footer}
      </div>
    );
  }

  // Everything else — percentage bucket counts.
  const bucketCounts = PERCENT_BUCKETS.map((b) => ({
    ...b,
    count: scored.filter((p) => p.predicted >= b.min && p.predicted < b.max).length,
  })).filter((b) => b.count > 0);

  return (
    <div className="rounded-xl border border-[color:var(--color-border)] bg-white p-4">
      <div className="eyebrow-muted">{label}</div>
      <div className="mt-1.5 flex flex-wrap items-baseline gap-x-3 gap-y-1">
        {bucketCounts.map((b) => (
          <div key={b.key} className="inline-flex items-baseline gap-1">
            <span className="text-[20px] font-semibold text-slate-900 tabular-nums leading-none">{b.count}</span>
            <span
              className="text-[13px] font-semibold text-slate-600 leading-none"
              dangerouslySetInnerHTML={{ __html: b.label }}
            />
          </div>
        ))}
      </div>
      <div className="text-[11px] text-slate-500 mt-1.5">
        Across {scored.length} subject{scored.length === 1 ? '' : 's'}.
      </div>
      {footer}
    </div>
  );
}
