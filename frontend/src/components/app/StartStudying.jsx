import React from 'react';
import { useApp } from '../../context/AppContext';
import { SUBJECTS, SUBJECT_INFO } from '../../data/mock';
import { BookOpen, ArrowRight } from 'lucide-react';
import InfinityBackground from '../decor/InfinityBackground';
import SubjectOverview from './SubjectOverview';

const toneBadge = {
  primary: 'bg-blue-100 text-blue-700',
  violet: 'bg-blue-100 text-blue-700',
  blue: 'bg-violet-100 text-violet-700',
  secondary: 'bg-violet-100 text-violet-700',
  cyan: 'bg-red-100 text-red-700',
  accent: 'bg-red-100 text-red-700',
  success: 'bg-emerald-100 text-emerald-700',
};

export default function StartStudying({ go, subjectParam }) {
  const { state } = useApp();
  const track = state.user?.examTrack || 'SSLC';
  const all = SUBJECTS[track] || [];
  const selected = state.user?.subjects && state.user.subjects.length ? state.user.subjects.filter((s) => all.includes(s)) : all;
  const list = selected;

  if (subjectParam) {
    const decoded = decodeURIComponent(subjectParam);
    if (list.includes(decoded)) {
      return <SubjectOverview subject={decoded} go={go} onBack={() => { window.location.hash = '#study'; }} />;
    }
  }

  return (
    <div className="relative">
      <InfinityBackground variant="soft" />
      <div className="relative">
        <p className="text-[14px] text-slate-500 mb-6">Pick a subject to see its overview and create a worksheet tailored to your level.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {list.map((s) => {
            const info = SUBJECT_INFO[s] || { emoji: '\u25A0', tagline: 'Practice and improve.', tone: 'primary' };
            return (
              <button key={s} onClick={() => { window.location.hash = `#study?subject=${encodeURIComponent(s)}`; }} className="group relative text-left card-soft p-5 overflow-hidden">
                <div className="relative flex items-start justify-between gap-3">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-[22px] font-semibold ${toneBadge[info.tone] || toneBadge.primary}`}>{info.emoji}</div>
                  <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
                </div>
                <div className="relative mt-4 text-[16.5px] font-semibold text-slate-900">{s}</div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
