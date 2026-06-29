import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Check, X } from 'lucide-react';

export default function Mistakes() {
  const { state, removeMistake } = useApp();
  const list = state.mistakes || [];
  const [reveal, setReveal] = useState({});

  if (list.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-zinc-200 p-12 text-center">
        <div className="text-[15px] font-medium text-zinc-700">No mistakes recorded</div>
        <div className="text-[13px] text-zinc-500 mt-1">Missed questions will appear here so you can retry them.</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-3 max-w-[820px]">
      {list.map((m) => {
        const shown = reveal[m.id];
        return (
          <div key={m.id} className="rounded-xl border border-zinc-200 p-5">
            <div className="text-[12.5px] text-zinc-500 mb-1">{m.subject} · {m.topic}</div>
            <div className="text-[14.5px] font-medium text-zinc-900">{m.question}</div>
            <div className="mt-3 flex flex-col gap-2">
              {m.options.map((opt, i) => {
                const isCorrect = i === m.correct;
                const isGiven = i === m.given;
                const cls = !shown
                  ? 'border-zinc-200 hover:border-zinc-300'
                  : isCorrect ? 'border-emerald-300 bg-emerald-50/50' : (isGiven ? 'border-rose-300 bg-rose-50/50' : 'border-zinc-200');
                return (
                  <div key={i} className={`px-4 py-2.5 rounded-lg border text-[14px] flex items-center justify-between ${cls}`}>
                    <span><span className="inline-block w-6 text-zinc-500 font-medium">{String.fromCharCode(65 + i)}.</span>{opt}</span>
                    {shown && isCorrect && <Check className="w-4 h-4 text-emerald-600" />}
                    {shown && isGiven && !isCorrect && <X className="w-4 h-4 text-rose-600" />}
                  </div>
                );
              })}
            </div>
            <div className="flex items-center gap-2 mt-4">
              <button onClick={() => setReveal({ ...reveal, [m.id]: !shown })} className="btn-outline-dark px-3 py-1.5 rounded-md text-[13px]">{shown ? 'Hide answer' : 'Reveal answer'}</button>
              <button onClick={() => removeMistake(m.id)} className="px-3 py-1.5 rounded-md text-[13px] text-zinc-600 hover:text-zinc-900">Mark as reviewed</button>
            </div>
          </div>
        );
      })}
    </div>
  );
}
