import React from 'react';
import { useApp } from '../../context/AppContext';
import { FileText } from 'lucide-react';

export default function WorksheetHistory() {
  const { state } = useApp();
  const ws = state.worksheets || [];
  if (ws.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 p-12 text-center">
        <FileText className="w-6 h-6 text-zinc-400 mx-auto mb-3" />
        <div className="text-[15px] font-medium text-zinc-700">No saved attempts yet</div>
        <div className="text-[13px] text-zinc-500 mt-1">Complete a worksheet to see it appear here.</div>
      </div>
    );
  }
  return (
    <div className="flex flex-col gap-3">
      {ws.map((w) => (
        <div key={w.id} className="rounded-xl border border-zinc-200 p-5 flex items-center justify-between">
          <div className="min-w-0">
            <div className="text-[15px] font-semibold text-zinc-900">{w.subject} · {w.topic}</div>
            <div className="text-[12.5px] text-zinc-500 mt-1">{new Date(w.date).toLocaleString()} · {w.difficulty} · {w.length} questions</div>
          </div>
          <div className="text-right">
            <div className="text-[18px] font-semibold text-zinc-900">{w.score}%</div>
            <div className="text-[12.5px] text-zinc-500">{w.correct}/{w.total} correct</div>
          </div>
        </div>
      ))}
    </div>
  );
}
