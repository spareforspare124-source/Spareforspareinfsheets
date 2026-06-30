import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Sparkles, Calendar, BookOpen, Target } from 'lucide-react';
import { SUBJECTS } from '../../data/mock';

function daysUntil(dateStr) {
  if (!dateStr) return null;
  return Math.max(0, Math.ceil((new Date(dateStr).getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
}

export default function StudyPlanModal({ open, onClose }) {
  const { state } = useApp();
  const [generating, setGenerating] = useState(false);
  const [shown, setShown] = useState(false);

  const days = daysUntil(state.settings?.examDate) ?? 14;
  const track = state.user?.examTrack || 'CBSE';
  const subjects = SUBJECTS[track] || ['Mathematics', 'Physics'];

  // Build a simple mock 7-day plan blending user's subjects and weak topics
  const plan = useMemo(() => {
    const weakTopics = {};
    (state.worksheets || []).forEach((w) => {
      const k = w.topic;
      if (!weakTopics[k]) weakTopics[k] = { total: 0, correct: 0, subject: w.subject };
      weakTopics[k].total += w.total;
      weakTopics[k].correct += w.correct;
    });
    const weakArr = Object.entries(weakTopics)
      .map(([k, v]) => ({ topic: k, ...v, acc: v.total ? v.correct / v.total : 0 }))
      .sort((a, b) => a.acc - b.acc);

    const out = [];
    const ndays = Math.min(7, Math.max(3, days || 7));
    for (let d = 0; d < ndays; d++) {
      const subj = subjects[d % subjects.length];
      const weak = weakArr[d % Math.max(1, weakArr.length)];
      const topic = weak ? weak.topic : null;
      out.push({
        day: d + 1,
        subject: subj,
        focus: topic && weak.subject === subj ? topic : null,
        minutes: 30 + (d % 3) * 15,
        items: [
          `${10 + (d % 3) * 5}-question ${subj} worksheet`,
          d % 2 === 0 ? 'Review yesterday’s mistakes' : 'Re-solve 3 hardest questions',
        ],
      });
    }
    return out;
  }, [state.worksheets, subjects, days]);

  React.useEffect(() => {
    if (!open) { setShown(false); return; }
    setGenerating(true);
    const t = setTimeout(() => { setGenerating(false); setShown(true); }, 950);
    return () => clearTimeout(t);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[680px] bg-white rounded-2xl border border-[color:var(--color-border)] shadow-[0_30px_80px_-30px_rgba(15,23,42,0.3)] overflow-hidden">
        <div className="relative px-6 py-4 border-b border-[color:var(--color-border)] flex items-center justify-between">
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500/8 via-blue-500/8 to-cyan-400/8 pointer-events-none" />
          <div className="relative flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 text-white flex items-center justify-center"><Sparkles className="w-4 h-4" /></div>
            <div>
              <div className="text-[15px] font-semibold text-slate-900">AI Study Plan</div>
              <div className="text-[11.5px] text-slate-500">Personalized for {state.user?.name || 'you'} · {track} · {days} day{days === 1 ? '' : 's'} until exam</div>
            </div>
          </div>
          <button onClick={onClose} className="relative w-8 h-8 rounded-md text-slate-500 hover:bg-slate-100 flex items-center justify-center transition-colors"><X className="w-4 h-4" /></button>
        </div>

        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          {generating ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '0ms' }} />
                <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '120ms' }} />
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-bounce" style={{ animationDelay: '240ms' }} />
              </div>
              <div className="text-[13px] text-slate-600 mt-4">Analyzing your weak topics and exam window…</div>
            </div>
          ) : shown && (
            <div className="flex flex-col gap-3">
              {plan.map((p) => (
                <div key={p.day} className="rounded-xl border border-[color:var(--color-border)] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 min-w-0">
                      <div className="w-9 h-9 rounded-lg bg-violet-100 text-violet-700 flex items-center justify-center text-[12px] font-semibold">D{p.day}</div>
                      <div className="min-w-0">
                        <div className="text-[14.5px] font-semibold text-slate-900">{p.subject}{p.focus ? ` · ${p.focus}` : ''}</div>
                        <div className="text-[12px] text-slate-500">~{p.minutes} minutes</div>
                      </div>
                    </div>
                    <div className="hidden sm:flex items-center gap-1.5 text-[11.5px] text-slate-500"><Calendar className="w-3.5 h-3.5" /> Day {p.day}</div>
                  </div>
                  <ul className="mt-3 flex flex-col gap-1.5">
                    {p.items.map((it, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-[13px] text-slate-700">
                        <span className="shrink-0 w-5 h-5 rounded-md bg-blue-100 text-blue-700 flex items-center justify-center">
                          {idx === 0 ? <BookOpen className="w-3 h-3" /> : <Target className="w-3 h-3" />}
                        </span>
                        <span>{it}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-[color:var(--color-border)] flex items-center justify-end gap-2 bg-slate-50/60">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-[13.5px] border border-[color:var(--color-border)] bg-white hover:bg-slate-100 text-slate-700 transition-colors">Close</button>
          <button onClick={onClose} className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13.5px] font-medium bg-gradient-to-r from-violet-600 to-blue-600 text-white hover:opacity-95">
            <Sparkles className="w-3.5 h-3.5" /> Save plan
          </button>
        </div>
      </div>
    </div>
  );
}
