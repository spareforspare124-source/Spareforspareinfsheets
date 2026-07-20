import React, { useState } from 'react';
import { Plus, Minus } from 'lucide-react';
import Reveal from './Reveal';
import TypeHeading from './TypeHeading';
import { DoodleReading } from '../decor/StudentDoodles';

const FAQS = [
  {
    q: 'Is it really free?',
    a: 'Yes. Every feature—worksheets, weakness analysis, scores, predicted grades—is free, supported by ads so it stays that way for everyone.',
  },
  {
    q: 'How is this different from ChatGPT?',
    a: 'A chatbot answers what you ask, forgets you between sessions, and drifts off syllabus. InfinitySheets remembers every answer you give, tracks your weaknesses over time, matches real exam formats, and decides what you should practice next—so the burden of knowing what to study never falls back on you.',
  },
  {
    q: 'Are the questions like real past papers?',
    a: 'That is the goal of every question we generate. AI is used for one job—creating fresh, exam-style questions—and we continuously compare the output against real past papers for style, format, and difficulty. If a question ever feels off, you can flag it and we improve.',
  },
  {
    q: 'Which exams are covered?',
    a: 'SSLC, CBSE, ICSE, IGCSE, AS & A Level, IB, SAT, JEE, and NEET—each with subject-specific question banks. This especially helps courses like IB or CLAT, where practice material is usually locked behind paywalls.',
  },
  {
    q: 'How accurate are the predicted grades?',
    a: 'Predictions are built from your worksheet scores across topics and calibrated against how each exam is graded. They sharpen as you practice more—and the point is not just to know the number, but to change it while there is still time.',
  },
  {
    q: 'Who is behind InfinitySheets?',
    a: 'Students. We built this because we are preparing for the same exams you are, and we think the training coaching centres sell should not be a privilege only for those who can afford it.',
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="section-bg">
      <div className="max-w-[1280px] mx-auto px-6 py-28 lg:py-32">
        <Reveal>
          <div className="relative text-center max-w-[720px] mx-auto">
            <div className="eyebrow mb-5">Questions, answered</div>
            <TypeHeading text="Everything students ask us." className="h-display text-[46px] sm:text-[58px] lg:text-[64px] leading-[1.05]" />
            <div className="hidden lg:block absolute -right-44 -top-6"><DoodleReading /></div>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <div className="mt-14 max-w-[760px] mx-auto flex flex-col gap-3">
            {FAQS.map((f, i) => {
              const isOpen = open === i;
              return (
                <div key={i} className="rounded-2xl border border-slate-200 bg-white overflow-hidden">
                  <button
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    className="w-full flex items-center justify-between gap-4 px-6 py-5 text-left"
                    aria-expanded={isOpen}
                  >
                    <span className="text-[15.5px] font-semibold text-slate-900">{f.q}</span>
                    {isOpen ? <Minus className="w-5 h-5 shrink-0 text-slate-400" /> : <Plus className="w-5 h-5 shrink-0 text-slate-400" />}
                  </button>
                  {isOpen && (
                    <p className="px-6 pb-5 text-[14.5px] text-slate-600 leading-relaxed">{f.a}</p>
                  )}
                </div>
              );
            })}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
