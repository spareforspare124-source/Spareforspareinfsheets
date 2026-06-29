import React, { useState } from 'react';
import { Infinity, Menu, X } from 'lucide-react';

export default function Navbar({ onStart }) {
  const [open, setOpen] = useState(false);
  const links = [
    { label: 'Features', href: '#features' },
    { label: 'How it works', href: '#how' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Pricing', href: '#pricing' },
  ];
  return (
    <header className="sticky top-0 z-40 bg-white/85 backdrop-blur border-b border-zinc-100">
      <div className="max-w-[1280px] mx-auto px-6 h-[60px] flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 group">
          <span className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center group-hover:bg-violet-200 transition-colors">
            <Infinity className="w-5 h-5 text-violet-600" strokeWidth={2.4} />
          </span>
          <span className="font-semibold text-[15px] tracking-tight text-zinc-900">InfinitySheets</span>
        </a>
        <nav className="hidden md:flex items-center gap-8">
          {links.map((l) => (
            <a key={l.href} href={l.href} className="text-[14px] text-zinc-600 hover:text-zinc-900 transition-colors">{l.label}</a>
          ))}
          <a href="#signup" className="text-[14px] font-medium text-zinc-900">Log In</a>
          <a href="#signup" className="text-[14px] font-medium text-zinc-900">Sign Up</a>
        </nav>
        <div className="flex items-center gap-3">
          <button onClick={onStart} className="btn-violet hidden md:inline-flex px-4 py-2 rounded-lg text-[14px] font-medium shadow-sm">Start free</button>
          <button onClick={() => setOpen(!open)} className="md:hidden w-9 h-9 inline-flex items-center justify-center rounded-md hover:bg-zinc-100">
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="md:hidden border-t border-zinc-100 bg-white">
          <div className="px-6 py-4 flex flex-col gap-3">
            {links.map((l) => (
              <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="text-[14px] text-zinc-700">{l.label}</a>
            ))}
            <a href="#signup" onClick={() => setOpen(false)} className="text-[14px] font-medium">Log In</a>
            <a href="#signup" onClick={() => setOpen(false)} className="text-[14px] font-medium">Sign Up</a>
            <button onClick={onStart} className="btn-violet mt-2 px-4 py-2 rounded-lg text-[14px] font-medium">Start free</button>
          </div>
        </div>
      )}
    </header>
  );
}
