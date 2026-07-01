import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileText } from 'lucide-react';
import EmptyStateScene from '../decor/EmptyStateScene';

export default function WorksheetHistory() {
  const { state } = useApp();
  const ws = state.worksheets || [];
  if (ws.length === 0) {
    return (
      <div className="relative rounded-2xl border border-dashed border-[color:var(--color-border)] bg-white overflow-hidden min-h-[360px]">
        <EmptyStateScene variant="lab" className="absolute inset-0" />
        <div className="relative p-12 text-center">
          <FileText className="w-6 h-6 text-slate-400 mx-auto mb-3" />
          <div className="text-[15px] font-medium text-slate-700">No saved attempts yet</div>
          <div className="text-[13px] text-slate-500 mt-1">Complete a worksheet to see it appear here.</div>
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      {ws.map((w) => (
        <div key={w.id} className="rounded-xl border border-[color:var(--color-border)] bg-white p-5 flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-[15px] font-semibold text-slate-900">{w.subject} · {w.topic}</div>
            <div className="text-[12.5px] text-slate-500 mt-1">{new Date(w.date).toLocaleString()} · {w.difficulty} · {w.length} questions</div>
          </div>
          <div className="text-right">
            <div className="text-[18px] font-semibold text-slate-900">{w.score}%</div>
            <div className="text-[12.5px] text-slate-500">{w.correct}/{w.total} correct</div>
          </div>
        </div>
      ))}
    </div>
  );
}
