import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EXAM_TRACKS } from '../../data/mock';
import { toast } from 'sonner';

export default function SignupSection() {
  const { signup, login } = useApp();
  const [tab, setTab] = useState('signup');
  const [form, setForm] = useState({ name: '', email: '', track: 'SSLC', password: '' });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });

  const handleSignup = (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill all fields');
      return;
    }
    signup({ name: form.name, email: form.email, examTrack: form.track });
    toast.success('Account created');
    window.location.hash = '#dashboard';
  };

  const handleLogin = (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      toast.error('Enter email and password');
      return;
    }
    login(loginForm.email);
    toast.success('Welcome back');
    window.location.hash = '#dashboard';
  };

  return (
    <section id="signup" className="section-dark">
      <div className="max-w-[1280px] mx-auto px-6 py-24 lg:py-28 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <div className="text-violet-400 text-[11px] tracking-[0.14em] uppercase font-semibold mb-5">Start now</div>
          <h2 className="h-display text-[40px] sm:text-[48px] lg:text-[56px] text-white">
            Create your InfinitySheets account.
          </h2>
          <p className="mt-5 max-w-[520px] text-[15px] text-zinc-400 leading-relaxed">
            This creates a working local account in your browser. Your worksheets, scores, streak, and settings are saved on this device.
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6">
          <div className="grid grid-cols-2 gap-2 mb-5">
            <button onClick={() => setTab('signup')} className={`py-2.5 rounded-lg text-[14px] font-medium transition-colors ${tab === 'signup' ? 'bg-violet-600 text-white' : 'bg-transparent text-zinc-400 hover:text-white border border-zinc-700'}`}>Sign Up</button>
            <button onClick={() => setTab('login')} className={`py-2.5 rounded-lg text-[14px] font-medium transition-colors ${tab === 'login' ? 'bg-violet-600 text-white' : 'bg-transparent text-zinc-400 hover:text-white border border-zinc-700'}`}>Log In</button>
          </div>
          {tab === 'signup' ? (
            <form onSubmit={handleSignup} className="flex flex-col gap-3">
              <Field label="Name"><input className="input-dark" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
              <Field label="Email"><input type="email" className="input-dark" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
              <Field label="Exam track">
                <select className="input-dark" value={form.track} onChange={(e) => setForm({ ...form, track: e.target.value })}>
                  {EXAM_TRACKS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </Field>
              <Field label="Password"><input type="password" className="input-dark" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></Field>
              <button type="submit" className="btn-violet mt-2 py-3 rounded-lg text-[14px] font-medium">Create account</button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="flex flex-col gap-3">
              <Field label="Email"><input type="email" className="input-dark" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} /></Field>
              <Field label="Password"><input type="password" className="input-dark" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} /></Field>
              <button type="submit" className="btn-violet mt-2 py-3 rounded-lg text-[14px] font-medium">Log in</button>
            </form>
          )}
        </div>
      </div>
    </section>
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
