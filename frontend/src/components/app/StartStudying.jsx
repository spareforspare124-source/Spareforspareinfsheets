import React from 'react';
import { useApp } from '../../context/AppContext';
import { SUBJECTS } from '../../data/mock';
import { BookOpen } from 'lucide-react';

export default function StartStudying({ go }) {
  const { state } = useApp();
  const track = state.user?.examTrack || 'SSLC';
  const list = SUBJECTS[track] || [];
  return (
    <div>
      <p className="text-[14px] text-zinc-500 mb-6">Choose a subject to generate a targeted worksheet.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {list.map((s) => (
          <button key={s} onClick={() => { window.sessionStorage.setItem('preselect_subject', s); go('worksheets'); }} className="text-left card-soft p-5 hover:border-violet-300">
            <div className="w-10 h-10 rounded-lg bg-violet-100 flex items-center justify-center mb-4">
              <BookOpen className="w-5 h-5 text-violet-600" />
            </div>
            <div className="text-[16px] font-semibold text-zinc-900">{s}</div>
            <div className="text-[13px] text-zinc-500 mt-1">Create a worksheet in {s}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
