import React, { useState, useEffect } from 'react';
import { ExternalLink, BadgeCheck, Info, ArrowLeft, Sun, Moon } from 'lucide-react';
import { RESOURCE_TRACKS } from '../../data/resources';
import { useApp } from '../../context/AppContext';
import Footer from './Footer';
import Reveal from './Reveal';

export default function ResourcesPage({ embedded = false }) {
  const { toggleTheme, state } = useApp();
  const [active, setActive] = useState(RESOURCE_TRACKS[0].id);
  const track = RESOURCE_TRACKS.find((t) => t.id === active) || RESOURCE_TRACKS[0];

  useEffect(() => { window.scrollTo(0, 0); }, []);

  return (
    <div className={`${embedded ? '' : 'section-bg min-h-screen'} flex flex-col`}>
      {!embedded && (
        <header className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-[color:var(--color-border)]">
          <div className="max-w-[1280px] mx-auto px-6 h-[60px] flex items-center justify-between">
            <a href="#top" className="flex items-center gap-2 text-[14px] text-slate-600 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-4 h-4" /> Back to InfinitySheets
            </a>
            <div className="flex items-center gap-2">
              <button
                onClick={toggleTheme}
                aria-label={state.theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
                className="w-9 h-9 inline-flex items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-100 transition-colors"
              >
                {state.theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
              <a href="#signup" className="btn-violet px-4 py-2 rounded-lg text-[14px] font-medium shadow-sm">Start Free</a>
            </div>
          </div>
        </header>
      )}

      <main className="flex-1">
        <div className={`${embedded ? 'max-w-[1200px]' : 'max-w-[1280px] mx-auto px-6 pt-16'} pb-24`}>
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

          <div className={`sticky ${embedded ? 'top-0' : 'top-[60px]'} z-30 ${embedded ? '' : '-mx-6 px-6'} py-3 mt-10 bg-white/85 backdrop-blur border-b border-slate-200/70`}>
            <div className="flex gap-2 overflow-x-auto pb-1" role="tablist" aria-label="Curricula">
              {RESOURCE_TRACKS.map((t) => (
                <button
                  key={t.id}
                  role="tab"
                  aria-selected={t.id === active}
                  onClick={() => setActive(t.id)}
                  className={`shrink-0 px-4 py-2 rounded-full text-[13.5px] font-medium border transition-colors ${
                    t.id === active
                      ? 'bg-slate-900 text-white border-slate-900'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'
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
                <Info className="w-4 h-4 mt-0.5 shrink-0 text-amber-600" />
                <p className="text-[13.5px] text-amber-800 leading-relaxed">{track.note}</p>
              </div>
            )}
            <div className="mt-8 flex flex-col gap-10">
              {track.groups.map((g) => (
                <div key={g.label}>
                  <div className="flex items-center gap-2 mb-4">
                    {/^official/i.test(g.label) || /KSEAB|Pareeksha|DGE|NTA|College Board|LSAC|IIT/i.test(g.label) ? (
                      <BadgeCheck className="w-4 h-4 text-emerald-600" />
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
                          <ExternalLink className="w-3.5 h-3.5 mt-1 shrink-0 text-slate-300 group-hover:text-blue-500 transition-colors" />
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
