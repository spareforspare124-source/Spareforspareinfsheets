import React, { useState, useEffect, useMemo } from 'react';
import { ExternalLink, BadgeCheck, Info, ArrowLeft, Sun, Moon } from 'lucide-react';
import { RESOURCE_TRACKS } from '../../data/resources';
import { useApp } from '../../context/AppContext';
import Footer from './Footer';
import Reveal from './Reveal';

export default function ResourcesPage({ embedded = false }) {
  const { toggleTheme, state } = useApp();

  // Which tracks does the student "have"?
  //   - their primary exam track (from onboarding / profile)
  //   - every exam track referenced by their added courses
  // Only used when embedded inside the app shell; the anonymous landing
  // page keeps the full directory so undecided visitors can browse.
  const studentTrackIds = useMemo(() => {
    if (!embedded) return null;
    const ids = new Set();
    if (state.user?.examTrack) ids.add(state.user.examTrack);
    (state.courses || []).forEach((c) => { if (c.exam) ids.add(c.exam); });
    return ids;
  }, [embedded, state.user?.examTrack, state.courses]);

  const visibleTracks = useMemo(() => {
    if (!embedded || !studentTrackIds || studentTrackIds.size === 0) return RESOURCE_TRACKS;
    const filtered = RESOURCE_TRACKS.filter((t) => studentTrackIds.has(t.id));
    // Fall back to the full list if the student's tracks aren't in the
    // resource directory yet, so the page never renders empty.
    return filtered.length > 0 ? filtered : RESOURCE_TRACKS;
  }, [embedded, studentTrackIds]);

  const [active, setActive] = useState(visibleTracks[0]?.id || RESOURCE_TRACKS[0].id);
  // Keep the active tab in sync if the visible list changes (e.g., new
  // course added while the page is open).
  useEffect(() => {
    if (!visibleTracks.some((t) => t.id === active)) {
      setActive(visibleTracks[0]?.id || RESOURCE_TRACKS[0].id);
    }
  }, [visibleTracks, active]);
  const track = visibleTracks.find((t) => t.id === active) || visibleTracks[0] || RESOURCE_TRACKS[0];

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className={`${embedded ? '' : 'section-bg min-h-screen'} flex flex-col`}>
      {!embedded && (
        <header className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-[color:var(--color-border)]">
          <div className="max-w-[1280px] mx-auto px-6 h-[60px] flex items-center justify-between">
            <a href="#top" className="flex items-center gap-2 text-[14px] text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-5 h-5" /> Back to InfinitySheets
            </a>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                aria-label={state.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {state.theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
              <a href="#signup" className="btn-violet px-4 py-2 rounded-lg text-[14px] font-medium shadow-sm">Start Free</a>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1">
        <div className={`${embedded ? 'max-w-[1200px]' : 'max-w-[1280px] mx-auto px-6 pt-16'} pb-24`}>
          {!embedded && (
            <Reveal>
              <div className="max-w-[820px]">
                <div className="eyebrow mb-5">Free resource directory</div>
                <h1 className="h-display text-[44px] sm:text-[56px] lg:text-[64px] leading-[1.05]">
                  Every official source, one page.
                </h1>
                <p className="mt-6 text-[16.5px] text-slate-600 leading-relaxed max-w-[640px]">
                  Past papers, syllabi, and practice material for every curriculum we support&mdash;official
                  sources first, then the best free archives. No sign-up needed. We link to the
                  original publishers rather than re-hosting their papers.
                </p>
              </div>
            </Reveal>
          )}

          <div className={`sticky ${embedded ? 'top-0' : 'top-[60px]'} z-30 ${embedded ? '' : '-mx-6 px-6'} py-3 ${embedded ? '' : 'mt-10'} bg-white/85 backdrop-blur border-b border-slate-200/70`}>
            <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Curricula">
              {visibleTracks.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={t.id === active}
                  onClick={() => setActive(t.id)}
                  className={`shrink-0 px-4 py-2 rounded-full text-[13.5px] font-medium border transition-colors ${
                    t.id === active
                      ? 'bg-blue-600 text-white border-blue-600'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-blue-400 hover:text-blue-700'
                  }`}
                >
                  {t.short}
                </button>
              ))}
            </div>
          </div>

          <div className="mt-10">
            <h2 className="h-display text-[28px] sm:text-[34px]">{track.name}</h2>
            {track.note && (
              <div className="mt-4 flex items-start gap-2.5 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 max-w-[640px]">
                <Info className="w-5 h-5 mt-0.5 shrink-0 text-amber-600" />
                <p className="text-[13.5px] text-amber-800 leading-relaxed">{track.note}</p>
              </div>
            )}
            <div className="mt-8 flex flex-col gap-10">
              {track.groups.map((g) => (
                <div key={g.label}>
                  <div className="flex items-center gap-2 mb-4">
                    {/^official/i.test(g.label) || /KSEAB|Pareeksha|DGE|NTA|College Board|LSAC|IIT/i.test(g.label) ? (
                      <BadgeCheck className="w-5 h-5 text-emerald-600" />
                    ) : null}
                    <h3 className="text-[13px] tracking-[0.12em] uppercase font-semibold text-slate-500">{g.label}</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {g.links.map((l) => (
                      <a
                        key={l.url}
                        href={l.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="group card-soft p-5 flex flex-col gap-1.5 hover:border-blue-300 hover:shadow-lg hover:shadow-slate-900/5 transition-all"
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-[14.5px] font-semibold text-slate-900 leading-snug">{l.title}</span>
                          <ExternalLink className="w-4 h-4 mt-1 shrink-0 text-slate-300 group-hover:text-blue-500 transition-colors" />
                        </div>
                        <p className="text-[13px] text-slate-500 leading-relaxed">{l.desc}</p>
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {!embedded && (
            <div className="mt-20 rounded-3xl bg-white border border-slate-200 px-8 py-12 lg:px-14 text-center shadow-sm">
              <h2 className="h-display text-slate-900 text-[30px] sm:text-[38px]">Or skip the hunting entirely.</h2>
              <p className="mt-4 text-[15px] text-slate-600 max-w-[560px] mx-auto leading-relaxed">
                InfinitySheets generates fresh exam-style questions for your syllabus, finds your weak
                concepts, and plans your practice&mdash;so you never have to dig through archives again.
              </p>
              <a href="#signup" className="mt-7 inline-flex items-center justify-center px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-[14.5px] font-medium transition-colors">
                Start Free
              </a>
            </div>
          )}
        </div>
      </main>
      {!embedded && <Footer />}
    </div>
  );
}
