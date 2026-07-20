import React from 'react';
import { Calendar, BookOpen, Target } from 'lucide-react';

/**
 * A single day card inside the generated study plan.
 * Shows the subject / focus topic, estimated minutes, and the day's tasks.
 */
export default function PlanDayCard({ plan }) {
  return (
    <div className="rounded-xl border border-[color:var(--color-border)] p-4" data-testid={`plan-day-${plan.day}`}>
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-9 h-9 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-[12px] font-semibold">D{plan.day}</div>
          <div className="min-w-0">
            <div className="text-[14.5px] font-semibold text-slate-900">
              {plan.subject}{plan.focus ? ` · ${plan.focus}` : ''}
            </div>
            <div className="text-[12px] text-slate-500">~{plan.minutes} minutes</div>
          </div>
        </div>
        <div className="hidden sm:flex items-center gap-1.5 text-[11.5px] text-slate-500">
          <Calendar className="w-4 h-4" /> Day {plan.day}
        </div>
      </div>
      <ul className="mt-3 flex flex-col gap-1.5">
        {plan.items.map((it, idx) => (
          <li key={`${plan.day}-${it}`} className="flex items-start gap-2 text-[13px] text-slate-700">
            <span className="shrink-0 w-6 h-6 rounded-md bg-violet-100 text-violet-700 flex items-center justify-center">
              {idx === 0 ? <BookOpen className="w-4 h-4" /> : <Target className="w-4 h-4" />}
            </span>
            <span>{it}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
