import React from 'react';

/**
 * Loading state shown while the mock study-plan generator "thinks".
 * Three bouncing dots in the app's primary/secondary/tertiary colors.
 */
export default function PlanGeneratingState() {
  return (
    <div className="flex flex-col items-center justify-center py-12" data-testid="plan-generating">
      <div className="flex items-center gap-1.5">
        <span className="w-2 h-2 rounded-full bg-blue-500 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-2 h-2 rounded-full bg-violet-500 animate-bounce" style={{ animationDelay: '120ms' }} />
        <span className="w-2 h-2 rounded-full bg-red-400 animate-bounce" style={{ animationDelay: '240ms' }} />
      </div>
      <div className="text-[13px] text-slate-600 mt-4">Analyzing your weak topics and exam window…</div>
    </div>
  );
}
