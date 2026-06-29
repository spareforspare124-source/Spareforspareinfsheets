import React from 'react';
import { Infinity } from 'lucide-react';

function Ring({ value = 82 }) {
  const r = 26;
  const c = 2 * Math.PI * r;
  const offset = c - (value / 100) * c;
  return (
    <div className="relative w-[64px] h-[64px]">
      <svg width="64" height="64" viewBox="0 0 64 64" className="-rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" strokeWidth="6" className="ring-track" />
        <circle cx="32" cy="32" r={r} fill="none" strokeWidth="6" strokeLinecap="round" className="ring-fill" strokeDasharray={c} strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[15px] font-semibold text-zinc-900">{value}</div>
    </div>
  );
}

export default function DashboardPreview() {
  const sidebar = ['Dashboard', 'Start Studying', 'My Subjects', 'Worksheet History', 'Progress', 'Strengths & Weaknesses', 'Profile', 'Settings'];
  const stats = [
    { l: 'Readiness', v: '82%' },
    { l: 'Streak', v: '9 days' },
    { l: 'Questions', v: '428' },
    { l: 'Sheets', v: '31' },
  ];
  return (
    <div className="relative">
      <div className="absolute -inset-6 rounded-[28px] bg-gradient-to-br from-violet-200/40 via-violet-100/30 to-transparent blur-2xl pointer-events-none" />
      <div className="relative bg-white border border-zinc-200 rounded-2xl shadow-[0_20px_60px_-30px_rgba(24,24,27,0.25)] overflow-hidden">
        <div className="grid grid-cols-[200px_1fr]">
          <aside className="border-r border-zinc-100 p-4">
            <div className="flex items-center gap-2 px-2 py-1 mb-4">
              <Infinity className="w-4 h-4 text-violet-600" strokeWidth={2.4} />
              <span className="text-[13px] font-semibold">InfinitySheets</span>
            </div>
            <nav className="flex flex-col gap-0.5">
              {sidebar.map((s, i) => (
                <div key={s} className={`text-[12.5px] px-2.5 py-1.5 rounded-md ${i === 0 ? 'bg-violet-50 text-violet-700 font-medium' : 'text-zinc-600'}`}>{s}</div>
              ))}
            </nav>
          </aside>
          <div className="p-6">
            <div className="flex items-start justify-between gap-4">
              <div className="min-w-0">
                <div className="eyebrow-muted mb-2">Your study overview</div>
                <h3 className="text-[26px] font-semibold tracking-tight leading-tight">Ready for the next win?</h3>
                <p className="text-[13.5px] text-zinc-500 mt-1">Electrostatics is your priority topic today.</p>
              </div>
              <Ring value={82} />
            </div>
            <div className="grid grid-cols-4 gap-3 mt-5">
              {stats.map((s) => (
                <div key={s.l} className="rounded-lg border border-zinc-100 px-3 py-2.5">
                  <div className="text-[10px] tracking-wider font-semibold uppercase text-zinc-500">{s.l}</div>
                  <div className="text-[15px] font-semibold mt-1 text-zinc-900">{s.v}</div>
                </div>
              ))}
            </div>
            <div className="mt-4 rounded-lg border border-zinc-100 px-4 py-3 border-l-[3px] border-l-violet-500">
              <div className="text-[10px] tracking-wider font-semibold uppercase text-zinc-500">Recommended action</div>
              <div className="text-[13.5px] mt-1 text-zinc-800">Complete a 10-question Electrostatics worksheet.</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
