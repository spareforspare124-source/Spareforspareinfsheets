import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EXAM_TRACKS } from '../../data/mock';
import { toast } from 'sonner';

export default function SignupSection() {
  const { apiRegister, apiLogin } = useApp();
  const [tab, setTab] = useState('signup');
  const [form, setForm] = useState({ name: '', email: '', track: 'SSLC', password: '' });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [busy, setBusy] = useState(false);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.password) {
      toast.error('Please fill all fields');
      return;
    }
    setBusy(true);
    try {
      await apiRegister({ email: form.email, password: form.password, name: form.name, examTrack: form.track });
      toast.success('Account created');
      window.location.hash = '#dashboard';
    } catch (err) {
      toast.error(err.message || 'Could not create account');
    } finally {
      setBusy(false);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginForm.email || !loginForm.password) {
      toast.error('Enter email and password');
      return;
    }
    setBusy(true);
    try {
      await apiLogin({ email: loginForm.email, password: loginForm.password });
      toast.success('Welcome back');
      window.location.hash = '#dashboard';
    } catch (err) {
      toast.error(err.message || 'Login failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section id="signup" className="section-dark">
      <div className="max-w-[1280px] mx-auto px-6 py-24 lg:py-28 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <div className="text-blue-400 text-[11px] tracking-[0.14em] uppercase font-semibold mb-5">Start now</div>
          <h2 className="h-display text-[40px] sm:text-[48px] lg:text-[56px] text-white">
            Create your InfinitySheets account.
          </h2>
          <p className="mt-5 max-w-[520px] text-[15px] text-zinc-400 leading-relaxed">
            Sign up with your email to save your worksheets, streak, and progress across devices. Sessions are protected with secure httpOnly cookies.
          </p>
        </div>
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6" data-testid="auth-panel">
          <div className="grid grid-cols-2 gap-2 mb-5">
            <button onClick={() => setTab('signup')} data-testid="tab-signup" className={`py-2.5 rounded-lg text-[14px] font-medium transition-colors ${tab === 'signup' ? 'bg-blue-600 text-white' : 'bg-transparent text-zinc-400 hover:text-white border border-zinc-700'}`}>Sign Up</button>
            <button onClick={() => setTab('login')} data-testid="tab-login" className={`py-2.5 rounded-lg text-[14px] font-medium transition-colors ${tab === 'login' ? 'bg-blue-600 text-white' : 'bg-transparent text-zinc-400 hover:text-white border border-zinc-700'}`}>Log In</button>
          </div>
          {tab === 'signup' ? (
            <form onSubmit={handleSignup} className="flex flex-col gap-3">
              <Field label="Name"><input data-testid="signup-name" className="input-dark" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
              <Field label="Email"><input data-testid="signup-email" type="email" className="input-dark" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
              <Field label="Exam track">
                <select data-testid="signup-track" className="input-dark" value={form.track} onChange={(e) => setForm({ ...form, track: e.target.value })}>
                  {EXAM_TRACKS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </Field>
              <Field label="Password (min 6 characters)"><input data-testid="signup-password" type="password" className="input-dark" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></Field>
              <button type="submit" data-testid="signup-submit" disabled={busy} className="btn-violet mt-2 py-3 rounded-lg text-[14px] font-medium disabled:opacity-60">{busy ? 'Creating…' : 'Create account'}</button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="flex flex-col gap-3">
              <Field label="Email"><input data-testid="login-email" type="email" className="input-dark" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} /></Field>
              <Field label="Password"><input data-testid="login-password" type="password" className="input-dark" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} /></Field>
              <button type="submit" data-testid="login-submit" disabled={busy} className="btn-violet mt-2 py-3 rounded-lg text-[14px] font-medium disabled:opacity-60">{busy ? 'Logging in…' : 'Log in'}</button>
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
