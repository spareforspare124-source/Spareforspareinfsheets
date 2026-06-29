import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { toast } from 'sonner';

const GOALS = [5, 10, 20];
const DIFF = ['Basics', 'Mixed exam practice', 'Challenge'];

export default function SettingsView() {
  const { state, updateSettings, resetProgress, deleteAccount } = useApp();
  const [s, setS] = useState({ ...state.settings });
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [confirmReset, setConfirmReset] = useState(false);

  const save = (e) => {
    e.preventDefault();
    updateSettings(s);
    toast.success('Settings saved');
  };

  return (
    <div className="max-w-[640px] flex flex-col gap-6">
      <p className="text-[14px] text-zinc-500">Tune your study preferences.</p>
      <form onSubmit={save} className="flex flex-col gap-4">
        <Field label="Daily goal">
          <div className="inline-flex gap-1 p-1 bg-zinc-100 rounded-lg">
            {GOALS.map((g) => (
              <button type="button" key={g} onClick={() => setS({ ...s, dailyGoal: g })} className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${s.dailyGoal === g ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-600 hover:text-zinc-900'}`}>{g} questions</button>
            ))}
          </div>
        </Field>
        <Field label="Default difficulty">
          <div className="inline-flex flex-wrap gap-1 p-1 bg-zinc-100 rounded-lg">
            {DIFF.map((d) => (
              <button type="button" key={d} onClick={() => setS({ ...s, defaultDifficulty: d })} className={`px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors ${s.defaultDifficulty === d ? 'bg-white shadow-sm text-zinc-900' : 'text-zinc-600 hover:text-zinc-900'}`}>{d}</button>
            ))}
          </div>
        </Field>
        <Field label="Exam date">
          <input type="date" className="input-base" value={s.examDate || ''} onChange={(e) => setS({ ...s, examDate: e.target.value })} />
        </Field>
        <button className="btn-violet px-5 py-2.5 rounded-lg text-[14px] font-medium self-start">Save settings</button>
      </form>

      <div className="rounded-xl border border-zinc-200 p-5">
        <div className="text-[14.5px] font-semibold mb-1">Reset my progress</div>
        <div className="text-[13px] text-zinc-500 mb-3">Clear worksheets, scores, streak, and mistake history.</div>
        {!confirmReset ? (
          <button onClick={() => setConfirmReset(true)} className="btn-outline-dark px-4 py-2 rounded-lg text-[13.5px]">Reset progress</button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => { resetProgress(); setConfirmReset(false); toast.success('Progress reset'); }} className="px-4 py-2 rounded-lg text-[13.5px] font-medium bg-amber-500 text-white hover:bg-amber-600 transition-colors">Confirm reset</button>
            <button onClick={() => setConfirmReset(false)} className="btn-outline-dark px-4 py-2 rounded-lg text-[13.5px]">Cancel</button>
          </div>
        )}
      </div>

      <div className="rounded-xl border border-rose-200 bg-rose-50/30 p-5">
        <div className="text-[14.5px] font-semibold mb-1 text-rose-700">Delete account</div>
        <div className="text-[13px] text-rose-600/80 mb-3">Permanently remove this local account, worksheets, scores, and settings.</div>
        {!confirmDelete ? (
          <button onClick={() => setConfirmDelete(true)} className="px-4 py-2 rounded-lg text-[13.5px] font-medium bg-rose-600 text-white hover:bg-rose-700 transition-colors">Delete account</button>
        ) : (
          <div className="flex gap-2">
            <button onClick={() => { deleteAccount(); window.location.hash = ''; }} className="px-4 py-2 rounded-lg text-[13.5px] font-medium bg-rose-600 text-white hover:bg-rose-700 transition-colors">Confirm delete</button>
            <button onClick={() => setConfirmDelete(false)} className="btn-outline-dark px-4 py-2 rounded-lg text-[13.5px]">Cancel</button>
          </div>
        )}
      </div>
    </div>
  );
}

function Field({ label, children }) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-[10px] tracking-[0.14em] uppercase font-semibold text-zinc-500">{label}</span>
      {children}
    </label>
  );
}
