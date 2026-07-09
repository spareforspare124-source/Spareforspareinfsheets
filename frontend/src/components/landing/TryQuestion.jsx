import React, { useState } from 'react';
import { Check, X, ArrowRight, Eye } from 'lucide-react';
import Reveal from './Reveal';
import { useApp } from '../../context/AppContext';

const QUESTION = {
  track: 'IGCSE Physics',
  topic: 'Electrostatics',
  text: 'Two identical conducting spheres carry charges of +6 μC and −2 μC. They are brought into contact, then separated. What is the charge on each sphere afterwards?',
  options: [
    { key: 'A', text: '+4 μC' },
    { key: 'B', text: '+2 μC' },
    { key: 'C', text: '+8 μC' },
    { key: 'D', text: '−2 μC' },
  ],
  correct: 'B',
  explanation: 'When identical conductors touch, the total charge (+6 − 2 = +4 μC) redistributes equally: +2 μC each. Exam boards love this one—it tests conservation of charge, not formulas.',
};

export default function TryQuestion() {
  const [picked, setPicked] = useState(null);
  const { startDemo } = useApp();
  const onDemo = () => { startDemo(); window.location.hash = '#dashboard'; };
  const answered = picked !== null;
  const isCorrect = picked === QUESTION.correct;

  return (
    <section className="section-bg">
      <div className="max-w-[1280px] mx-auto px-6 py-28 lg:py-36 min-h-[80svh] flex flex-col justify-center">
        <Reveal>
          <div className="text-center max-w-[760px] mx-auto">
            <div className="eyebrow mb-5">Feel it for yourself</div>
            <h2 className="h-display text-[44px] sm:text-[56px] lg:text-[64px] leading-[1.05]">Try a real question. Right here.</h2>
            <p className="mt-5 text-[16px] text-slate-500 leading-relaxed">
              This is what practice on InfinitySheets feels like&mdash;instant marking, an explanation, and a read on your weak spots.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.15}>
          <div className="mt-14 max-w-[720px] mx-auto w-full">
            <div className="rounded-3xl bg-white border border-slate-200 shadow-xl shadow-slate-900/5 overflow-hidden">
              <div className="px-7 py-4 border-b border-slate-100 flex items-center justify-between">
                <span className="text-[12px] font-semibold tracking-wider uppercase text-blue-600">{QUESTION.track}</span>
                <span className="text-[12px] text-slate-400">Topic: {QUESTION.topic}</span>
              </div>
              <div className="p-7">
                <p className="text-[16.5px] text-slate-900 leading-relaxed font-medium">{QUESTION.text}</p>
                <div className="mt-6 flex flex-col gap-2.5">
                  {QUESTION.options.map((o) => {
                    const chosen = picked === o.key;
                    const showCorrect = answered && o.key === QUESTION.correct;
                    const showWrong = answered && chosen && !isCorrect;
                    return (
                      <button
                        key={o.key}
                        disabled={answered}
                        onClick={() => setPicked(o.key)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-left text-[15px] transition-colors ${
                          showCorrect ? 'border-emerald-400 bg-emerald-50 text-emerald-900'
                          : showWrong ? 'border-red-300 bg-red-50 text-red-900'
                          : chosen ? 'border-blue-400 bg-blue-50'
                          : 'border-slate-200 hover:border-blue-300 hover:bg-blue-50/50'
                        } ${answered ? 'cursor-default' : 'cursor-pointer'}`}
                      >
                        <span className={`w-7 h-7 shrink-0 rounded-lg flex items-center justify-center text-[13px] font-semibold ${
                          showCorrect ? 'bg-emerald-500 text-white' : showWrong ? 'bg-red-500 text-white' : 'bg-slate-100 text-slate-600'
                        }`}>
                          {showCorrect ? <Check className="w-4 h-4" /> : showWrong ? <X className="w-4 h-4" /> : o.key}
                        </span>
                        {o.text}
                      </button>
                    );
                  })}
                </div>
                {answered && (
                  <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 px-5 py-4">
                    <div className={`text-[14px] font-semibold ${isCorrect ? 'text-emerald-700' : 'text-red-700'}`}>
                      {isCorrect ? 'Correct.' : `Not quite — the answer is ${QUESTION.correct}.`}
                    </div>
                    <p className="text-[13.5px] text-slate-600 mt-1.5 leading-relaxed">{QUESTION.explanation}</p>
                    <div className="mt-4 rounded-lg bg-white border border-slate-200 px-4 py-3 border-l-[3px] border-l-violet-500">
                      <div className="text-[10px] tracking-wider font-semibold uppercase text-slate-500">On InfinitySheets</div>
                      <p className="text-[13.5px] text-slate-700 mt-1">
                        {isCorrect
                          ? 'This topic would be marked strong, and your next worksheet would push one level deeper.'
                          : 'Electrostatics would be flagged as a weak topic, and your next worksheet would target it automatically.'}
                      </p>
                    </div>
                    <div className="mt-5 flex flex-wrap gap-3">
                      <button onClick={onDemo} className="btn-violet inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-medium">
                        <Eye className="w-4 h-4" /> Keep practicing in the demo
                      </button>
                      <a href="#signup" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-[14px] font-medium border border-slate-300 hover:bg-slate-100 transition-colors">
                        Start Free <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
