import React from 'react';
import { EXAM_TRACKS } from '../../data/mock';

export default function ExamPathways() {
  return (
    <section className="bg-white">
      <div className="max-w-[1280px] mx-auto px-6 py-24 lg:py-28">
        <div className="eyebrow mb-5">Exam pathways</div>
        <h2 className="h-display text-[40px] sm:text-[48px] lg:text-[56px] max-w-[920px] text-zinc-900">
          Practice adapts to the exam students are preparing for.
        </h2>
        <p className="mt-5 max-w-[640px] text-[15px] text-zinc-500 leading-relaxed">
          Each pathway changes the subjects, topics, and default worksheet style. Sign up and choose one to enter the app.
        </p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mt-12">
          {EXAM_TRACKS.map((e) => (
            <div key={e.id} className="card-soft p-6 cursor-default">
              <span className="inline-block px-2.5 py-1 text-[11px] font-semibold rounded-md bg-violet-100 text-violet-700 mb-4">{e.name}</span>
              <h3 className="text-[16px] font-semibold text-zinc-900 mb-2 leading-snug">{e.title}</h3>
              <p className="text-[13.5px] text-zinc-500 leading-relaxed">{e.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
