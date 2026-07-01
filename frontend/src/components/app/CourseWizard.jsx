import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EXAM_TRACKS, SUBJECTS, SUBJECT_INFO } from '../../data/mock';
import { ArrowRight, ArrowLeft, Calendar, CheckCircle2, GraduationCap, BookOpen, X, Sparkles } from 'lucide-react';
import StudyDecor from '../decor/StudyDecor';
import { toast } from 'sonner';

const STEP_LABELS = ['Exam', 'Subjects', 'Dates'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

function inDays(d) {
  const dt = new Date(); dt.setDate(dt.getDate() + d); return dt.toISOString().slice(0, 10);
}

export default function CourseWizard({ mode = 'onboarding', onClose }) {
  const { state, addCourse, completeOnboarding } = useApp();
  const isOnboarding = mode === 'onboarding';

  const [step, setStep] = useState(0);
  const [examTrack, setExamTrack] = useState(state.user?.examTrack || 'SSLC');
  const trackSubjects = useMemo(() => SUBJECTS[examTrack] || [], [examTrack]);
  const [picked, setPicked] = useState([]); // [subject, ...]
  const [dates, setDates] = useState({});   // { subject: 'YYYY-MM-DD' }
  const [target, setTarget] = useState('');
  const [level, setLevel] = useState('Intermediate');
  const [courseName, setCourseName] = useState('');

  const togglePick = (s) => setPicked((arr) => arr.includes(s) ? arr.filter((x) => x !== s) : [...arr, s]);

  const validate = () => {
    if (step === 0 && !examTrack) return 'Pick an exam track';
    if (step === 1 && picked.length === 0) return 'Pick at least one subject';
    if (step === 2) {
      const missing = picked.filter((s) => !dates[s]);
      if (missing.length) return `Set a date for ${missing.join(', ')}`;
    }
    return null;
  };

  const next = () => {
    const err = validate(); if (err) { toast.error(err); return; }
    if (step < 2) { setStep((v) => v + 1); return; }
    finish();
  };
  const back = () => setStep((v) => Math.max(0, v - 1));

  const finish = () => {
    const exam = EXAM_TRACKS.find((e) => e.id === examTrack);
    const subjects = picked.map((s) => ({ subject: s, examDate: dates[s], target, level }));
    const name = (courseName || '').trim() || `${exam?.name || examTrack} ${picked.length > 1 ? 'Term' : picked[0]}`;
    addCourse({ name, exam: examTrack, subjects, status: 'Active', target, level });
    // For onboarding, also set primary track + earliest date as global hint
    const earliest = subjects.map((x) => x.examDate).sort()[0];
    if (isOnboarding) {
      completeOnboarding({ examTrack, examDate: earliest, subjects: picked });
      toast.success(`Setup complete — let's build your first worksheet`);
    } else {
      toast.success(`${name} added`);
    }
    if (onClose) onClose();
  };

  const skip = () => {
    if (onClose) onClose();
    else if (isOnboarding) completeOnboarding({ examTrack, examDate: '', subjects: trackSubjects });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center section-bg overflow-auto">
      <StudyDecor density="dense" />
      <div className="absolute inset-0 grid-fade pointer-events-none" />

      <div className="relative w-full max-w-[860px] mx-4 my-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white">
              <Sparkles className="w-4 h-4" />
            </span>
            <div className="leading-tight">
              <div className="text-[13px] font-semibold text-slate-900">{isOnboarding ? 'Quick setup' : 'Add a course'}</div>
              <div className="text-[11.5px] text-slate-500">{isOnboarding ? `Hi ${state.user?.name || 'there'} · build your first course` : 'A course can contain multiple subjects'}</div>
            </div>
          </div>
          <button onClick={skip} className="text-[12.5px] text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1">
            {onClose ? 'Cancel' : 'Skip'} <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="flex items-center gap-3 mb-5">
          {STEP_LABELS.map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold transition-colors ${i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-violet-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {i < step ? <CheckCircle2 className="w-4 h-4" /> : i + 1}
                </div>
                <span className={`text-[12.5px] font-medium ${i === step ? 'text-slate-900' : 'text-slate-500'}`}>{label}</span>
              </div>
              {i < STEP_LABELS.length - 1 && <div className={`flex-1 h-0.5 rounded-full ${i < step ? 'bg-emerald-300' : 'bg-slate-200'}`} />}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-[color:var(--color-border)] shadow-[0_30px_80px_-30px_rgba(15,23,42,0.18)] overflow-hidden">
          <div className="h-1 w-full bg-slate-100">
            <div className="h-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400 transition-all duration-500" style={{ width: `${((step + 1) / 3) * 100}%` }} />
          </div>

          {step === 0 && (
            <div className="p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-4 h-4 text-violet-600" />
                <span className="text-[11px] tracking-[0.16em] uppercase font-semibold text-violet-600">Step 1</span>
              </div>
              <h2 className="text-[26px] font-semibold tracking-tight text-slate-900">Which exam is this course for?</h2>
              <p className="text-[13.5px] text-slate-500 mt-1">A course groups subjects under one exam track.</p>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {EXAM_TRACKS.map((t) => {
                  const sel = examTrack === t.id;
                  return (
                    <button key={t.id} onClick={() => { setExamTrack(t.id); setPicked([]); setDates({}); }}
                      className={`text-left rounded-xl border px-4 py-3 transition-colors ${sel ? 'border-violet-400 bg-gradient-to-br from-violet-50 to-blue-50' : 'border-[color:var(--color-border)] bg-white hover:bg-slate-100'}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className={`text-[13.5px] font-semibold ${sel ? 'text-violet-700' : 'text-slate-900'}`}>{t.name}</div>
                          <div className="text-[12px] text-slate-500 mt-0.5 leading-snug">{t.title}</div>
                        </div>
                        {sel && <CheckCircle2 className="w-4 h-4 text-violet-600 shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 1 && (
            <div className="p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-4 h-4 text-cyan-600" />
                <span className="text-[11px] tracking-[0.16em] uppercase font-semibold text-cyan-700">Step 2</span>
              </div>
              <h2 className="text-[26px] font-semibold tracking-tight text-slate-900">Pick the subjects in this course</h2>
              <p className="text-[13.5px] text-slate-500 mt-1">Select one or more subjects. Each can have its own exam date in the next step.</p>
              <div className="mt-4 flex items-center justify-between gap-3">
                <div className="text-[12.5px] text-slate-500">{picked.length} selected</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setPicked(trackSubjects)} className="text-[12.5px] text-violet-700 hover:text-violet-900 transition-colors">Select all</button>
                  <span className="text-slate-300">/</span>
                  <button onClick={() => { setPicked([]); setDates({}); }} className="text-[12.5px] text-slate-500 hover:text-slate-800 transition-colors">Clear</button>
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2.5">
                {trackSubjects.map((s) => {
                  const info = SUBJECT_INFO[s] || { emoji: '\u{1F4DA}', tagline: 'Practice and improve.' };
                  const sel = picked.includes(s);
                  return (
                    <button key={s} onClick={() => togglePick(s)}
                      className={`text-left rounded-xl border px-4 py-3 transition-colors ${sel ? 'border-violet-400 bg-gradient-to-br from-violet-50 to-blue-50' : 'border-[color:var(--color-border)] bg-white hover:bg-slate-100'}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[16px] leading-none">{info.emoji}</span>
                            <span className={`text-[13.5px] font-semibold ${sel ? 'text-violet-700' : 'text-slate-900'}`}>{s}</span>
                          </div>
                          <div className="text-[11.5px] text-slate-500 mt-1 leading-snug truncate">{info.tagline}</div>
                        </div>
                        {sel && <CheckCircle2 className="w-4 h-4 text-violet-600 shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-2">
                <Calendar className="w-4 h-4 text-blue-600" />
                <span className="text-[11px] tracking-[0.16em] uppercase font-semibold text-blue-700">Step 3</span>
              </div>
              <h2 className="text-[26px] font-semibold tracking-tight text-slate-900">Set an exam date per subject</h2>
              <p className="text-[13.5px] text-slate-500 mt-1">Each subject can have its own date, so countdowns stay accurate.</p>

              <div className="mt-5 grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[10px] tracking-[0.14em] uppercase font-semibold text-slate-500">Course name (optional)</span>
                  <input className="input-base" placeholder="e.g., IB Year 2" value={courseName} onChange={(e) => setCourseName(e.target.value)} />
                </label>
                <label className="flex flex-col gap-1.5">
                  <span className="text-[10px] tracking-[0.14em] uppercase font-semibold text-slate-500">Default target / level</span>
                  <div className="flex items-center gap-2">
                    <input className="input-base" placeholder="Target (e.g., 7)" value={target} onChange={(e) => setTarget(e.target.value)} />
                    <select className="input-base" value={level} onChange={(e) => setLevel(e.target.value)} style={{ maxWidth: 160 }}>
                      {LEVELS.map((l) => <option key={l} value={l}>{l}</option>)}
                    </select>
                  </div>
                </label>
              </div>

              <div className="mt-5 flex flex-col gap-3">
                {picked.map((s) => {
                  const info = SUBJECT_INFO[s] || { emoji: '\u{1F4DA}' };
                  const v = dates[s] || '';
                  const days = v ? Math.max(0, Math.ceil((new Date(v + 'T00:00:00').getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : null;
                  return (
                    <div key={s} className="rounded-xl border border-[color:var(--color-border)] p-4 grid grid-cols-1 md:grid-cols-[1fr_auto_auto] gap-3 items-center">
                      <div className="flex items-center gap-2">
                        <span className="text-[18px] leading-none">{info.emoji}</span>
                        <div>
                          <div className="text-[14px] font-semibold text-slate-900">{s}</div>
                          <div className="text-[11.5px] text-slate-500">{info.tagline || ''}</div>
                        </div>
                      </div>
                      <input type="date" min={new Date().toISOString().slice(0, 10)} className="input-base" value={v} onChange={(e) => setDates((d) => ({ ...d, [s]: e.target.value }))} />
                      <div className="rounded-md border border-blue-200/60 bg-gradient-to-br from-blue-50 via-violet-50/40 to-transparent px-3 py-2 text-right min-w-[100px]">
                        <div className="text-[9.5px] tracking-wider uppercase font-semibold text-blue-700">Days</div>
                        <div className="text-[16px] font-semibold text-slate-900 tabular-nums">{days !== null ? days : '—'}</div>
                      </div>
                      <div className="md:col-span-3 flex flex-wrap gap-1.5">
                        {[7, 30, 60, 90, 180].map((d) => {
                          const iso = inDays(d);
                          return (
                            <button key={d} onClick={() => setDates((m) => ({ ...m, [s]: iso }))}
                              className={`px-2.5 py-1 rounded-md text-[11.5px] font-medium border transition-colors ${v === iso ? 'border-violet-400 bg-violet-50 text-violet-700' : 'border-[color:var(--color-border)] bg-white text-slate-700 hover:bg-slate-100'}`}>
                              In {d} days
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="px-6 py-4 border-t border-[color:var(--color-border)] flex items-center justify-between gap-3 bg-slate-50/60">
            <div className="text-[12px] text-slate-500">{step + 1} of 3</div>
            <div className="flex items-center gap-2">
              {step > 0 && (
                <button onClick={back} className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg text-[13px] font-medium border border-[color:var(--color-border)] bg-white hover:bg-slate-100 text-slate-700 transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Back
                </button>
              )}
              <button onClick={next} className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-[13px] font-semibold text-white bg-gradient-to-r from-violet-600 to-blue-600 hover:opacity-95 transition-opacity">
                {step === 2 ? (<><Sparkles className="w-4 h-4" /> {isOnboarding ? 'Finish setup' : 'Add course'}</>) : (<>Continue <ArrowRight className="w-4 h-4" /></>)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
