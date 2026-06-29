import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EXAM_TRACKS } from '../../data/mock';
import { toast } from 'sonner';

export default function Profile() {
  const { state, updateProfile } = useApp();
  const [form, setForm] = useState({ name: state.user?.name || '', email: state.user?.email || '', examTrack: state.user?.examTrack || 'SSLC' });

  const save = (e) => {
    e.preventDefault();
    updateProfile(form);
    toast.success('Profile saved');
  };

  return (
    <form onSubmit={save} className="max-w-[560px] flex flex-col gap-4">
      <p className="text-[14px] text-zinc-500">Your account details. Stored locally on this device.</p>
      <Field label="Name"><input className="input-base" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
      <Field label="Email"><input className="input-base" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
      <Field label="Exam track">
        <select className="input-base" value={form.examTrack} onChange={(e) => setForm({ ...form, examTrack: e.target.value })}>
          {EXAM_TRACKS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
      </Field>
      <button className="btn-violet px-5 py-2.5 rounded-lg text-[14px] font-medium self-start">Save profile</button>
    </form>
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
