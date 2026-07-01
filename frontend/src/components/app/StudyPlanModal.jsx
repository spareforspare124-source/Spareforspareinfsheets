import React, { useEffect, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { X, Sparkles } from 'lucide-react';
import { SUBJECTS } from '../../data/mock';
import PlanGeneratingState from './plan/PlanGeneratingState';
import PlanDayCard from './plan/PlanDayCard';
import useMockStudyPlan from './plan/useMockStudyPlan';

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

  const plan = useMockStudyPlan({ worksheets: state.worksheets, subjects, days });

  useEffect(() => {
    if (!open) { setShown(false); return; }
    setGenerating(true);
    const t = setTimeout(() => { setGenerating(false); setShown(true); }, 950);
    return () => clearTimeout(t);
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} data-testid="study-plan-modal">
      <div onClick={(e) => e.stopPropagation()} className="w-full max-w-[680px] bg-white rounded-2xl border border-[color:var(--color-border)] overflow-hidden">
        <div className="relative px-6 py-4 border-b border-[color:var(--color-border)] flex items-center justify-between">
          <div className="relative flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500 text-white flex items-center justify-center"><Sparkles className="w-4 h-4" /></div>
            <div>
              <div className="text-[15px] font-semibold text-slate-900">Study Plan</div>
              <div className="text-[11.5px] text-slate-500">Personalized for {state.user?.name || 'you'} · {track} · {days} day{days === 1 ? '' : 's'} until exam</div>
            </div>
          </div>
          <button onClick={onClose} data-testid="plan-close" className="relative w-8 h-8 rounded-md text-slate-500 hover:bg-slate-100 flex items-center justify-center transition-colors"><X className="w-4 h-4" /></button>
        </div>

        <div className="px-6 py-5 max-h-[60vh] overflow-y-auto">
          {generating ? (
            <PlanGeneratingState />
          ) : shown && (
            <div className="flex flex-col gap-3">
              {plan.map((p) => (
                <PlanDayCard key={p.day} plan={p} />
              ))}
            </div>
          )}
        </div>
        <div className="px-6 py-4 border-t border-[color:var(--color-border)] flex items-center justify-end gap-2 bg-slate-50/60">
          <button onClick={onClose} className="px-4 py-2 rounded-lg text-[13.5px] border border-[color:var(--color-border)] bg-white hover:bg-slate-100 text-slate-700 transition-colors">Close</button>
          <button onClick={onClose} data-testid="plan-save" className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13.5px] font-medium bg-blue-600 text-white hover:opacity-95">
            <Sparkles className="w-3.5 h-3.5" /> Save plan
          </button>
        </div>
      </div>
    </div>
  );
}
