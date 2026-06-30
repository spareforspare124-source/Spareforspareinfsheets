import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Sparkles, CalendarClock } from 'lucide-react';
import StudyPlanModal from './StudyPlanModal';

function Ring({ value = 0 }) {
  const r = 32;
  const c = 2 * Math.PI * r;
  const offset = c - (Math.max(0, Math.min(100, value)) / 100) * c;
  return (
    <div className="relative w-[80px] h-[80px]">
      <svg width="80" height="80" viewBox="0 0 80 80" className="-rotate-90">
        <circle cx="40" cy="40" r={r} fill="none" strokeWidth="7" className="ring-track" />
        <circle cx="40" cy="40" r={r} fill="none" strokeWidth="7" strokeLinecap="round" className="ring-fill" strokeDasharray={c} strokeDashoffset={offset} />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center text-[18px] font-semibold text-zinc-900">{Math.round(value)}</div>
    </div>
  );
}

function Stat({ label, value }) {
  return (
    <div className="rounded-xl border border-[color:var(--color-border)] p-4 bg-white">
      <div className="text-[10px] tracking-[0.14em] uppercase font-semibold text-slate-500">{label}</div>
      <div className="text-[20px] font-semibold mt-1 text-slate-900">{value}</div>
    </div>
  );
}

function DaysStat({ days }) {
  const has = days !== null && days !== undefined;
  return (
    <div className="rounded-xl border border-blue-200/70 p-4 bg-gradient-to-br from-blue-50 via-violet-50/50 to-transparent relative overflow-hidden">
      <div className="absolute -top-6 -right-6 w-20 h-20 rounded-full bg-blue-500/20 blur-2xl pointer-events-none" />
      <div className="relative text-[10px] tracking-[0.14em] uppercase font-semibold text-blue-700">Days until exam</div>
      <div className="relative text-[24px] font-semibold mt-1 text-slate-900 tabular-nums">
        {has ? days : '\u2014'}
        {has && <span className="text-[12px] font-medium text-slate-500 ml-1">{days === 1 ? 'day' : 'days'}</span>}
      </div>
      {!has && <div className="relative text-[11px] text-slate-500 mt-0.5">Set in Settings</div>}
    </div>
  );
}

export default function Dashboard({ go }) {
  const { state } = useApp();
  const ws = state.worksheets || [];
  const [planOpen, setPlanOpen] = useState(false);

  const stats = useMemo(() => {
    const total = ws.reduce((s, w) => s + (w.total || 0), 0);
    const correct = ws.reduce((s, w) => s + (w.correct || 0), 0);
    const sheets = ws.length;
    const readiness = total === 0 ? 0 : Math.round((correct / total) * 100);
    return { total, correct, sheets, readiness };
  }, [ws]);

  const { topics } = useMemo(() => {
    const t = {};
    ws.forEach((w) => {
      const k = w.topic;
      if (!t[k]) t[k] = { correct: 0, total: 0 };
      t[k].correct += w.correct;
      t[k].total += w.total;
    });
    return { topics: t };
  }, [ws]);

  const weakTopic = useMemo(() => {
    const entries = Object.entries(topics).map(([k, v]) => ({ k, acc: v.total ? v.correct / v.total : 1, ...v }));
    entries.sort((a, b) => a.acc - b.acc);
    return entries[0];
  }, [topics]);

  const strongTopics = useMemo(() => Object.entries(topics).map(([k, v]) => ({ k, acc: v.total ? v.correct / v.total : 0 })).filter((e) => e.acc >= 0.7).slice(0, 3), [topics]);
  const weakTopics = useMemo(() => Object.entries(topics).map(([k, v]) => ({ k, acc: v.total ? v.correct / v.total : 0 })).filter((e) => e.acc < 0.7).slice(0, 3), [topics]);

  const goalDate = new Date().toDateString();
  const questionsToday = state.goalDate === goalDate ? state.questionsToday : 0;
  const dailyGoal = state.settings?.dailyGoal || 10;
  const progressPct = Math.min(100, Math.round((questionsToday / dailyGoal) * 100));

  const examDate = state.settings?.examDate;
  const examCountdown = examDate ? Math.max(0, Math.ceil((new Date(examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : null;

  const recommended = weakTopic
    ? `Complete a 10-question ${weakTopic.k} worksheet.`
    : (ws.length === 0 ? 'Generate your first worksheet to start building recommendations.' : 'Try a new topic in your subject.');

  return (
    <div className="flex flex-col gap-6">
      <div className="rounded-2xl border border-[color:var(--color-border)] p-6 bg-white">
        <div className="flex items-start justify-between gap-4">
          <div>
            <div className="eyebrow-muted mb-2">Your study overview</div>
            <h2 className="text-[28px] font-semibold tracking-tight">Welcome back, {state.user?.name || 'Student'}.</h2>
            <p className="text-[14px] text-slate-500 mt-1">Here is your study overview.</p>
          </div>
          <Ring value={stats.readiness} />
        </div>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mt-6">
          <DaysStat days={examCountdown} />
          <Stat label="Study streak" value={`${state.streak || 0} days`} />
          <Stat label="Questions answered" value={stats.total} />
          <Stat label="Worksheets completed" value={stats.sheets} />
        </div>
        <div className="mt-5 grid lg:grid-cols-[1fr_auto] gap-3 items-stretch">
          <div className="rounded-xl border border-[color:var(--color-border)] px-5 py-4 border-l-[3px] border-l-violet-500 bg-gradient-to-r from-violet-50/40 to-transparent">
            <div className="eyebrow-muted mb-1">Recommended action</div>
            <div className="text-[14.5px] text-slate-800">{recommended}</div>
          </div>
          <button onClick={() => setPlanOpen(true)} className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-[14px] font-semibold text-white bg-gradient-to-r from-violet-600 via-blue-600 to-cyan-500 shadow-[0_12px_30px_-12px_rgba(124,58,237,0.55)] hover:opacity-95 transition-opacity">
            <Sparkles className="w-4 h-4" /> Create plan with AI
          </button>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-[color:var(--color-border)] p-5 bg-white">
          <div className="eyebrow-muted mb-2">Today&rsquo;s goal</div>
          <div className="text-[18px] font-semibold">{questionsToday} / {dailyGoal} questions</div>
          <div className="mt-3 h-1.5 rounded-full bg-slate-100 overflow-hidden">
            <div className="h-full bg-gradient-to-r from-violet-500 to-blue-500 transition-all" style={{ width: `${progressPct}%` }} />
          </div>
        </div>
        <div className="rounded-xl border border-[color:var(--color-border)] p-5 bg-white">
          <div className="eyebrow-muted mb-2 flex items-center gap-1.5"><CalendarClock className="w-3.5 h-3.5 text-blue-600" /> Exam date</div>
          <div className="text-[15px] text-slate-800">{state.settings?.examDate ? new Date(state.settings.examDate).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'Add an exam date in Settings'}</div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <div className="rounded-xl border border-zinc-200 p-5">
          <div className="eyebrow-muted mb-3">Strong topics</div>
          {strongTopics.length === 0 ? (
            <div className="text-[14px] text-zinc-500">Complete a worksheet to start measuring strengths.</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {strongTopics.map((t) => (
                <span key={t.k} className="px-2.5 py-1 rounded-md bg-violet-50 text-violet-700 text-[12.5px] font-medium">{t.k} · {Math.round(t.acc * 100)}%</span>
              ))}
            </div>
          )}
        </div>
        <div className="rounded-xl border border-zinc-200 p-5">
          <div className="eyebrow-muted mb-3">Weak topics</div>
          {weakTopics.length === 0 ? (
            <div className="text-[14px] text-zinc-500">Missed questions will appear here.</div>
          ) : (
            <div className="flex flex-wrap gap-2">
              {weakTopics.map((t) => (
                <span key={t.k} className="px-2.5 py-1 rounded-md bg-zinc-100 text-zinc-700 text-[12.5px] font-medium">{t.k} · {Math.round(t.acc * 100)}%</span>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button onClick={() => go('worksheets')} className="btn-violet px-5 py-2.5 rounded-lg text-[14px] font-medium">Create a worksheet</button>
        <button onClick={() => go('study')} className="btn-outline-dark px-5 py-2.5 rounded-lg text-[14px] font-medium">Browse subjects</button>
      </div>

      <StudyPlanModal open={planOpen} onClose={() => setPlanOpen(false)} />
    </div>
  );
}
