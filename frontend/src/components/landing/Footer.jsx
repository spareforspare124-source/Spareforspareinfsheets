import React from 'react';
import { Infinity } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-zinc-100">
      <div className="max-w-[1280px] mx-auto px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <Infinity className="w-4 h-4 text-violet-600" strokeWidth={2.4} />
          <span className="text-[13.5px] font-semibold text-zinc-900">InfinitySheets</span>
        </div>
        <a href="#signup" className="text-[13.5px] text-zinc-600 hover:text-zinc-900 transition-colors">Start free</a>
      </div>
    </footer>
  );
}
