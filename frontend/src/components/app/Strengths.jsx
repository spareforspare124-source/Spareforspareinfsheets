import React, { useMemo } from 'react';
import { useApp } from '../../context/AppContext';

export default function Strengths() {
  const { state } = useApp();
  const ws = state.worksheets || [];
  const byTopic = useMemo(() => {
    const t = {};
    ws.forEach((w) => {
      if (!t[w.topic]) t[w.topic] = { correct: 0, total: 0, subject: w.subject };
      t[w.topic].correct += w.correct;
      t[w.topic].total += w.total;
    });
    return Object.entries(t).map(([k, v]) => ({ topic: k, ...v, acc: v.total ? Math.round((v.correct / v.total) * 100) : 0 })).sort((a, b) => b.acc - a.acc);
  }, [ws]);

  if (byTopic.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 p-12 text-center">
        <div className="text-[15px] font-medium text-zinc-700">No data yet</div>
        <div className="text-[13px] text-zinc-500 mt-1">Complete a worksheet to see personalized learning analytics.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {byTopic.map((t) => (
        <div key={t.topic} className="rounded-xl border border-zinc-200 p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="text-[14.5px] font-medium">{t.topic} <span className="text-zinc-400 font-normal">· {t.subject}</span></div>
            <div className="text-[13px] text-zinc-700 tabular-nums">{t.acc}% · {t.correct}/{t.total}</div>
          </div>
          <div className="h-1.5 rounded-full bg-zinc-100 overflow-hidden">
            <div className={`h-full ${t.acc >= 70 ? 'bg-violet-500' : t.acc >= 40 ? 'bg-amber-400' : 'bg-rose-400'}`} style={{ width: `${t.acc}%` }} />
          </div>
        </div>
      ))}
    </div>
  );
}
