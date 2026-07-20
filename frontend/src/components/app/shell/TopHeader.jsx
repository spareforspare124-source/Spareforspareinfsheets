import React from 'react';
import { Moon, Sun, Sparkles, PanelLeftOpen } from 'lucide-react';

/**
 * Page header shown at the top of every dashboard page.
 * Displays the eyebrow exam track, the page title, and the primary
 * page-scoped action (currently only rendered on the dashboard route).
 * When the sidebar is collapsed, a chevron re-opener appears on the left.
 */
export default function TopHeader({ examTrack, title, activeKey, isDark, courseCount, onToggleTheme, onNewWorksheet, sidebarOpen, onOpenSidebar }) {
  return (
    <header className="px-4 sm:px-6 lg:px-8 pt-5 sm:pt-7 pb-2 flex items-start justify-between gap-3 border-b border-[color:var(--color-border)] bg-white" data-testid="top-header">
      <div className="flex items-start gap-2 sm:gap-3 min-w-0 flex-1">
        {onOpenSidebar && (!sidebarOpen) && (
          <button
            onClick={onOpenSidebar}
            data-testid="header-open-sidebar"
            aria-label="Open sidebar"
            className="mt-1 w-10 h-10 shrink-0 rounded-lg border border-[color:var(--color-border)] bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors"
          >
            <PanelLeftOpen className="w-5 h-5" />
          </button>
        )}
        <div className="min-w-0">
          <div className="eyebrow-muted mb-1 flex items-center gap-2">
            <span>{examTrack}</span>
          </div>
          <h1 className="text-[22px] sm:text-[28px] font-semibold tracking-tight text-slate-900 truncate" data-testid="page-title">{title}</h1>
        </div>
      </div>
      <div className="flex items-center gap-2 shrink-0">
        <button
          onClick={onToggleTheme}
          className="w-10 h-10 rounded-lg border border-[color:var(--color-border)] bg-white text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors"
          aria-label="Toggle theme"
          data-testid="header-theme-toggle"
        >
          {isDark ? <Sun className="w-5 h-5 text-amber-500" /> : <Moon className="w-5 h-5 text-blue-600" />}
        </button>
        {activeKey === 'dashboard' && (
          <button
            onClick={onNewWorksheet}
            data-testid="header-new-worksheet"
            className="btn-violet inline-flex items-center gap-1.5 px-3 sm:px-4 py-2 rounded-lg text-[14px] font-medium"
            aria-label="New worksheet"
          >
            <Sparkles className="w-5 h-5" /> <span className="hidden sm:inline">New worksheet</span>
          </button>
        )}
        {activeKey === 'courses' && (
          <div className="hidden sm:block text-[13px] text-slate-500" data-testid="header-course-count">
            {courseCount} course{courseCount === 1 ? '' : 's'}
          </div>
        )}
      </div>
    </header>
  );
}
