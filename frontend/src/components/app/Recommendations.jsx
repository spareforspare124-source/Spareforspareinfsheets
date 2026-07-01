import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, ArrowRight } from 'lucide-react';
import EmptyStateScene from '../decor/EmptyStateScene';

export default function Recommendations({ go }) {
  const { state } = useApp();
  const ws = state.worksheets || [];
  const recs = useMemo(() => {
    const topics = {};
    ws.forEach((w) => {
      if (!topics[w.topic]) topics[w.topic] = { correct: 0, total: 0, subject: w.subject };
      topics[w.topic].correct += w.correct;
      topics[w.topic].total += w.total;
    });
    const arr = Object.entries(topics).map(([k, v]) => ({ topic: k, ...v, acc: v.total ? v.correct / v.total : 0 }));
    arr.sort((a, b) => a.acc - b.acc);
    return arr.slice(0, 4);
  }, [ws]);

  if (recs.length === 0) {
    return (
      <div className="relative rounded-2xl border border-dashed border-[color:var(--color-border)] bg-white overflow-hidden min-h-[360px]">
        <EmptyStateScene variant="lab" className="absolute inset-0" />
        <div className="relative p-12 text-center">
          <Sparkles className="w-6 h-6 text-slate-400 mx-auto mb-3" />
          <div className="text-[15px] font-medium text-slate-700">No recommendations yet</div>
          <div className="text-[13px] text-slate-500 mt-1">Complete a worksheet so we can suggest your next best actions.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 max-w-[820px]">
      {recs.map((r, i) => (
        <div key={r.topic} className="rounded-xl border border-zinc-200 p-5 flex items-center justify-between gap-4">
          <div className="min-w-0">
            <div className="text-[11px] tracking-[0.14em] uppercase font-semibold text-violet-600">Next best action {i + 1}</div>
            <div className="text-[15.5px] font-semibold text-zinc-900 mt-1">Practice {r.topic}</div>
            <div className="text-[13px] text-zinc-500 mt-0.5">Current accuracy {Math.round(r.acc * 100)}% · {r.subject}</div>
          </div>
          <button onClick={() => { window.sessionStorage.setItem('preselect_subject', r.subject); go('worksheets'); }} className="btn-violet inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13.5px] font-medium">
            Start <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ))}
    </div>
  );
}
