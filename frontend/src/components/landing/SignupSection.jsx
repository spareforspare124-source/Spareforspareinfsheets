import React, { useState } from 'react';
import { EXAM_TRACKS } from '../../data/mock';
import { toast } from 'sonner';
import { DoodleGradCap } from '../decor/StudyDoodles';
import GoogleAuthButton from './GoogleAuthButton';

export default function SignupSection() {
  const [tab, setTab] = useState('signup');
  const [form, setForm] = useState({ name: '', email: '', track: 'AP', password: '' });
  const [loginForm, setLoginForm] = useState({ email: '', password: '' });
  const [busy] = useState(false);

  // LANDING-ONLY BUILD: the form (including Google) renders for preview but
  // is locked — nothing leaves the page. Everything shows the same notice.
  const launchingSoon = () => toast.info('Sign-ups aren’t open yet — we’re launching soon. Watch this space!');
  const comingSoon = (e) => { e.preventDefault(); launchingSoon(); };
  const handleSignup = comingSoon;
  const handleLogin = comingSoon;
  const handleGoogle = launchingSoon;

  return (
    <section id="signup" className="relative section-dark overflow-hidden">
      <div className="hidden lg:block absolute left-[3%] bottom-16"><DoodleGradCap width={95} /></div>
      <div className="max-w-[1280px] mx-auto px-6 py-24 lg:py-28 grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
        <div>
          <div className="text-blue-700 text-[11px] tracking-[0.14em] uppercase font-semibold mb-5">Start now</div>
          <h2 className="h-display text-[40px] sm:text-[48px] lg:text-[56px] text-slate-900">
            Create your InfinitySheets account.
          </h2>
          <p className="mt-5 max-w-[520px] text-[15px] text-slate-600 leading-relaxed">
            Sign up with your email to save your worksheets, streak, and progress across devices. Sessions are protected with secure httpOnly cookies.
          </p>
        </div>
        <div className="liquid-glass rounded-2xl p-6" data-testid="auth-panel">
          <div className="grid grid-cols-2 gap-2 mb-5">
            <button onClick={() => setTab('signup')} data-testid="tab-signup" className={`py-2.5 rounded-lg text-[14px] font-medium transition-colors ${tab === 'signup' ? 'bg-blue-600 text-white' : 'bg-transparent text-slate-500 hover:text-slate-900 border border-slate-300'}`}>Sign Up</button>
            <button onClick={() => setTab('login')} data-testid="tab-login" className={`py-2.5 rounded-lg text-[14px] font-medium transition-colors ${tab === 'login' ? 'bg-blue-600 text-white' : 'bg-transparent text-slate-500 hover:text-slate-900 border border-slate-300'}`}>Log In</button>
          </div>

          <div className="mb-4">
            <GoogleAuthButton
              onCredential={handleGoogle}
              onError={launchingSoon}
              onUnavailable={launchingSoon}
              label={tab === 'signup' ? 'Sign up with Google' : 'Continue with Google'}
            />
          </div>
          <div className="flex items-center gap-3 mb-4">
            <span className="h-px flex-1 bg-slate-200" />
            <span className="text-[11px] uppercase tracking-wider text-slate-500">or with email</span>
            <span className="h-px flex-1 bg-slate-200" />
          </div>

          {tab === 'signup' ? (
            <form onSubmit={handleSignup} className="flex flex-col gap-3">
              <Field label="Name"><input data-testid="signup-name" className="input-base" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
              <Field label="Email"><input data-testid="signup-email" type="email" className="input-base" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} /></Field>
              <Field label="Exam track">
                <select data-testid="signup-track" className="input-base" value={form.track} onChange={(e) => setForm({ ...form, track: e.target.value })}>
                  {EXAM_TRACKS.map((t) => <option key={t.id} value={t.id}>{t.name}</option>)}
                </select>
              </Field>
              <Field label="Password (min 6 characters)"><input data-testid="signup-password" type="password" className="input-base" value={form.password} onChange={(e) => setForm({ ...form, password: e.target.value })} /></Field>
              <button type="submit" data-testid="signup-submit" disabled={busy} className="btn-violet mt-2 py-3 rounded-lg text-[14px] font-medium disabled:opacity-60">{busy ? 'Creating…' : 'Create account'}</button>
            </form>
          ) : (
            <form onSubmit={handleLogin} className="flex flex-col gap-3">
              <Field label="Email"><input data-testid="login-email" type="email" className="input-base" value={loginForm.email} onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })} /></Field>
              <Field label="Password"><input data-testid="login-password" type="password" className="input-base" value={loginForm.password} onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })} /></Field>
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
      <span className="text-[10px] tracking-[0.14em] uppercase font-semibold text-slate-500">{label}</span>
      {children}
    </label>
  );
}
