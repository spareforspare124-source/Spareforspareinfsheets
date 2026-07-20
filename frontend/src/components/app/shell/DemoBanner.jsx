import React from 'react';
import { Eye, X, RotateCcw } from 'lucide-react';

/**
 * Top strip shown only while the user is in demo mode. Provides quick
 * reset & exit affordances. Red hues on the destructive actions make the
 * risk visible.
 */
export default function DemoBanner({ onResetDemo, onExit }) {
  return (
    <div className="px-4 sm:px-6 lg:px-8 pt-3" data-testid="demo-banner">
      <div className="rounded-xl border border-blue-200/70 bg-blue-50 px-3 sm:px-4 py-2.5 flex items-center justify-between gap-2 sm:gap-3 text-[13px] text-slate-700">
        <div className="flex items-center gap-2 min-w-0">
          <span className="w-7 h-7 rounded-full bg-[color:var(--color-primary)] text-white flex items-center justify-center shrink-0">
            <Eye className="w-4 h-4" />
          </span>
          <span className="min-w-0">
            <span className="font-semibold">Demo mode</span>
            <span className="hidden sm:inline"> &middot; explore the app without an account. Progress saves on this device.</span>
          </span>
        </div>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onResetDemo}
            data-testid="demo-banner-reset"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[12.5px] font-medium text-blue-700 bg-white border border-blue-200 hover:bg-blue-50 transition-colors"
            aria-label="Reset demo"
          >
            <RotateCcw className="w-4 h-4" /> <span className="hidden sm:inline">Reset demo</span>
          </button>
          <button
            onClick={onExit}
            data-testid="demo-banner-exit"
            className="inline-flex items-center gap-1 px-2.5 py-1 rounded-md text-[12.5px] font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
            aria-label="Exit demo"
          >
            <X className="w-4 h-4" /> <span className="hidden sm:inline">Exit</span>
          </button>
        </div>
      </div>
    </div>
  );
}
