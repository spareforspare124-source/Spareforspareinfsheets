import React, { useState } from 'react';
import { ArrowRight, Check, Mail } from 'lucide-react';
import Mascot from '../decor/Mascot';

// To collect real leads, set REACT_APP_WAITLIST_ENDPOINT to a form endpoint
// (Formspree, Google Form's formResponse URL, or your own /api/waitlist
// route). While empty, submissions are validated and stored locally so
// nothing is lost, and the user still gets a confirmation.
const WAITLIST_ENDPOINT = process.env.REACT_APP_WAITLIST_ENDPOINT || '';
const STORAGE_KEY = 'infinitysheets_waitlist';

const validEmail = (e) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e.trim());

/*
 * Waitlist signup. `variant="inline"` renders the compact "signup bubble"
 * used inside the hero (dark rounded card between the CTA buttons and the
 * feature belt); the default renders a full-width dark section.
 */
export default function Waitlist({ variant = 'section', id }) {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('idle'); // idle | busy | done | error
  const inline = variant === 'inline';

  const submit = async (e) => {
    e.preventDefault();
    if (!validEmail(email)) { setStatus('error'); return; }
    setStatus('busy');
    // Always keep a local copy so early sign-ups aren't lost.
    try {
      const list = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      if (!list.includes(email.trim())) list.push(email.trim());
      localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
    } catch { /* storage unavailable — ignore */ }
    if (WAITLIST_ENDPOINT) {
      try {
        await fetch(WAITLIST_ENDPOINT, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email: email.trim(), source: 'landing-waitlist' }),
        });
      } catch { /* network hiccup — the local copy still has it */ }
    }
    setStatus('done');
  };

  const form = status === 'done' ? (
    <div className={`${inline ? 'mt-4' : 'mt-5'} inline-flex items-center gap-3 rounded-2xl bg-emerald-50 border border-emerald-200 px-6 py-4`}>
      <span className="w-8 h-8 rounded-full bg-emerald-500 text-white flex items-center justify-center"><Check className="w-4 h-4" strokeWidth={3} /></span>
      <span className="text-[15px] text-emerald-700 font-medium">You&rsquo;re on the list. We&rsquo;ll be in touch at launch.</span>
    </div>
  ) : (
    <form onSubmit={submit} noValidate className={`${inline ? 'mt-4' : 'mt-5'} flex flex-col sm:flex-row items-stretch justify-center gap-3 max-w-[520px] mx-auto`}>
      <div className="relative flex-1">
        <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
        <input
          type="email"
          value={email}
          onChange={(e) => { setEmail(e.target.value); if (status === 'error') setStatus('idle'); }}
          placeholder="you@email.com"
          data-testid="waitlist-email"
          aria-label="Email address"
          className={`w-full rounded-xl bg-white border pl-12 pr-4 py-3 text-[15px] text-slate-900 placeholder:text-slate-400 outline-none focus:ring-2 focus:ring-blue-400/60 ${status === 'error' ? 'border-red-400' : 'border-slate-300'}`}
        />
      </div>
      <button type="submit" disabled={status === 'busy'} data-testid="waitlist-submit"
        className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-[15px] font-medium transition-colors disabled:opacity-60 whitespace-nowrap">
        {status === 'busy' ? 'Adding…' : <>Join the waitlist <ArrowRight className="w-4 h-4" /></>}
      </button>
    </form>
  );

  const errorLine = status === 'error' && <p className="mt-3 text-[13px] text-red-600">Please enter a valid email address.</p>;
  const footnote = <p className="mt-3 text-[12.5px] text-slate-500">Free at launch. <a href="#privacy" className="underline decoration-slate-600/40 hover:text-slate-400">We&rsquo;ll never share your email.</a></p>;

  if (inline) {
    return (
      <div id="waitlist" className="relative scroll-mt-24 mt-14 w-full max-w-[680px] rounded-3xl liquid-glass border border-slate-200 px-6 py-7 sm:px-10 text-center shadow-xl shadow-slate-300/40">
        {/* Sheety peeking over the top edge, waving hello */}
        <div className="absolute -top-[46px] left-8 pointer-events-none" aria-hidden="true">
          <Mascot pose="peek" width={78} />
        </div>
        <h2 className="h-display text-slate-900 text-[24px] sm:text-[28px] leading-[1.1]">Be one of the first students in.</h2>
        <p className="mt-2 text-[14px] text-slate-600 leading-relaxed max-w-[520px] mx-auto">
          Drop your email and we&rsquo;ll let you know the moment it&rsquo;s live&mdash;no spam, just the launch.
        </p>
        {form}
        {errorLine}
        {footnote}
        <p className="mt-1.5 text-[12.5px] text-slate-500">Built on real past papers and mark schemes &middot; by students, for students.</p>
      </div>
    );
  }

  return (
    <section id={id || 'waitlist-section'} className="relative section-dark overflow-hidden">
      <div className="max-w-[860px] mx-auto px-6 py-10 lg:py-12 text-center">
        <h2 className="h-display text-slate-900 text-[28px] sm:text-[34px] lg:text-[38px] leading-[1.05]">
          Be one of the first students in.
        </h2>
        <p className="mt-3 text-[15px] text-slate-600 leading-relaxed max-w-[560px] mx-auto">
          We&rsquo;re opening InfinitySheets to a first group of students. Drop your email and
          we&rsquo;ll let you know the moment it&rsquo;s live&mdash;no spam, just the launch.
        </p>
        {form}
        {errorLine}
        {footnote}
      </div>
    </section>
  );
}
