import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EXAM_TRACKS, SUBJECTS, SUBJECT_INFO } from '../../data/mock';
import { ArrowRight, ArrowLeft, Calendar, CheckCircle2, GraduationCap, BookOpen, X, Sparkles } from 'lucide-react';
import InfinityBackground from '../decor/InfinityBackground';
import { toast } from 'sonner';

const STEP_LABELS = ['Exam', 'Date', 'Subjects'];

export default function OnboardingFlow() {
  const { state, completeOnboarding } = useApp();
  const [step, setStep] = useState(0);
  const [examTrack, setExamTrack] = useState(state.user?.examTrack || 'SSLC');
  const [examDate, setExamDate] = useState(state.settings?.examDate || '');
  const [subjects, setSubjects] = useState([]);

  const trackSubjects = useMemo(() => SUBJECTS[examTrack] || [], [examTrack]);

  const toggleSubject = (s) => {
    setSubjects((arr) => (arr.includes(s) ? arr.filter((x) => x !== s) : [...arr, s]));
  };

  const next = () => {
    if (step === 0 && !examTrack) { toast.error('Pick an exam track'); return; }
    if (step === 1 && !examDate) { toast.error('Choose an exam date'); return; }
    if (step === 2 && subjects.length === 0) { toast.error('Pick at least one subject'); return; }
    if (step < 2) setStep((v) => v + 1);
    else finish();
  };

  const back = () => setStep((v) => Math.max(0, v - 1));

  const skipAll = () => {
    completeOnboarding({ examTrack, examDate, subjects: trackSubjects });
  };

  const finish = () => {
    completeOnboarding({ examTrack, examDate, subjects });
    toast.success('Setup complete — starting the quick tour');
  };

  const minDate = new Date().toISOString().slice(0, 10);
  const days = examDate ? Math.max(0, Math.ceil((new Date(examDate).getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center section-bg overflow-auto">
      <InfinityBackground variant="hero" />
      <div className="absolute inset-0 grid-fade pointer-events-none" />

      <div className="relative w-full max-w-[820px] mx-4 my-8">
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-lg bg-blue-500 flex items-center justify-center text-white">
              <Sparkles className="w-5 h-5" />
            </span>
            <div className="leading-tight">
              <div className="text-[13px] font-semibold text-slate-900">Quick setup</div>
              <div className="text-[11.5px] text-slate-500">Hi {state.user?.name || 'there'} · tell us about your exam</div>
            </div>
          </div>
          <button onClick={skipAll} className="text-[12.5px] text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1">
            Skip <X className="w-4 h-4" />
          </button>
        </div>

        {/* Stepper */}
        <div className="flex items-center gap-3 mb-5">
          {STEP_LABELS.map((label, i) => (
            <React.Fragment key={label}>
              <div className="flex items-center gap-2">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[12px] font-semibold transition-colors ${i < step ? 'bg-emerald-500 text-white' : i === step ? 'bg-blue-600 text-white' : 'bg-slate-200 text-slate-500'}`}>
                  {i < step ? <CheckCircle2 className="w-5 h-5" /> : i + 1}
                </div>
                <span className={`text-[12.5px] font-medium ${i === step ? 'text-slate-900' : 'text-slate-500'}`}>{label}</span>
              </div>
              {i < STEP_LABELS.length - 1 && (
                <div className={`flex-1 h-0.5 rounded-full ${i < step ? 'bg-emerald-300' : 'bg-slate-200'}`} />
              )}
            </React.Fragment>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-[color:var(--color-border)] overflow-hidden">
          <div className="h-1 w-full bg-slate-100">
            <div className="h-full bg-blue-500 transition-all duration-500" style={{ width: `${((step + 1) / 3) * 100}%` }} />
          </div>

          {step === 0 && (
            <div className="p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-2">
                <GraduationCap className="w-5 h-5 text-blue-600" />
                <span className="text-[11px] tracking-[0.16em] uppercase font-semibold text-blue-600">Step 1</span>
              </div>
              <h2 className="text-[26px] font-semibold tracking-tight text-slate-900">Which exam are you preparing for?</h2>
              <p className="text-[13.5px] text-slate-500 mt-1">We tailor subjects, topics, and worksheet style to your track.</p>
              <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
                {EXAM_TRACKS.map((t) => {
                  const sel = examTrack === t.id;
                  return (
                    <button key={t.id} onClick={() => setExamTrack(t.id)}
                      className={`text-left rounded-xl border px-4 py-3 transition-colors ${sel ? 'border-blue-400 bg-blue-50' : 'border-[color:var(--color-border)] bg-white hover:bg-slate-100'}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className={`text-[13.5px] font-semibold ${sel ? 'text-blue-700' : 'text-slate-900'}`}>{t.name}</div>
                          <div className="text-[12px] text-slate-500 mt-0.5 leading-snug">{t.title}</div>
                        </div>
                        {sel && <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />}
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
                <Calendar className="w-5 h-5 text-violet-600" />
                <span className="text-[11px] tracking-[0.16em] uppercase font-semibold text-violet-700">Step 2</span>
              </div>
              <h2 className="text-[26px] font-semibold tracking-tight text-slate-900">When is your exam?</h2>
              <p className="text-[13.5px] text-slate-500 mt-1">We use this to build countdowns and pace your study plan.</p>

              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
                <label className="flex flex-col gap-1.5">
                  <span className="text-[10px] tracking-[0.14em] uppercase font-semibold text-slate-500">Exam date</span>
                  <input type="date" min={minDate} className="input-base" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
                </label>
                <div className="rounded-xl border border-violet-200/70 bg-violet-50 px-4 py-3 flex items-center justify-between">
                  <div>
                    <div className="text-[11px] tracking-[0.14em] uppercase font-semibold text-violet-700">Days until exam</div>
                    <div className="text-[28px] font-semibold text-slate-900 mt-1 tabular-nums">{days !== null ? days : '—'}</div>
                  </div>
                  <Calendar className="w-7 h-7 text-violet-500/70" />
                </div>
              </div>

              <div className="mt-5 flex flex-wrap gap-2">
                {[7, 30, 60, 90, 180].map((d) => {
                  const dt = new Date(); dt.setDate(dt.getDate() + d);
                  const iso = dt.toISOString().slice(0, 10);
                  return (
                    <button key={d} onClick={() => setExamDate(iso)}
                      className={`px-3 py-1.5 rounded-md text-[12.5px] font-medium border transition-colors ${examDate === iso ? 'border-blue-400 bg-blue-50 text-blue-700' : 'border-[color:var(--color-border)] bg-white text-slate-700 hover:bg-slate-100'}`}>
                      In {d} days
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="p-6 lg:p-8">
              <div className="flex items-center gap-2 mb-2">
                <BookOpen className="w-5 h-5 text-red-600" />
                <span className="text-[11px] tracking-[0.16em] uppercase font-semibold text-red-700">Step 3</span>
              </div>
              <h2 className="text-[26px] font-semibold tracking-tight text-slate-900">Which subjects are you studying?</h2>
              <p className="text-[13.5px] text-slate-500 mt-1">Pick everything you want to practice. You can change this later in Settings.</p>

              <div className="mt-5 flex items-center justify-between gap-3">
                <div className="text-[12.5px] text-slate-500">{subjects.length} of {trackSubjects.length} selected</div>
                <div className="flex items-center gap-2">
                  <button onClick={() => setSubjects(trackSubjects)} className="text-[12.5px] text-blue-700 hover:text-blue-900 transition-colors">Select all</button>
                  <span className="text-slate-300">/</span>
                  <button onClick={() => setSubjects([])} className="text-[12.5px] text-slate-500 hover:text-slate-800 transition-colors">Clear</button>
                </div>
              </div>

              <div className="mt-3 grid grid-cols-2 md:grid-cols-3 gap-2.5">
                {trackSubjects.map((s) => {
                  const info = SUBJECT_INFO[s] || { emoji: '\u25A0', tagline: 'Practice and improve.' };
                  const sel = subjects.includes(s);
                  return (
                    <button key={s} onClick={() => toggleSubject(s)}
                      className={`text-left rounded-xl border px-4 py-3 transition-colors ${sel ? 'border-blue-400 bg-blue-50' : 'border-[color:var(--color-border)] bg-white hover:bg-slate-100'}`}>
                      <div className="flex items-start justify-between gap-2">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1.5">
                            <span className="text-[16px] leading-none">{info.emoji}</span>
                            <span className={`text-[13.5px] font-semibold ${sel ? 'text-blue-700' : 'text-slate-900'}`}>{s}</span>
                          </div>
                        </div>
                        {sel && <CheckCircle2 className="w-5 h-5 text-blue-600 shrink-0" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Footer */}
          <div className="px-6 py-4 border-t border-[color:var(--color-border)] flex items-center justify-between gap-3 bg-slate-50/60">
            <div className="text-[12px] text-slate-500">{step + 1} of 3</div>
            <div className="flex items-center gap-2">
              {step > 0 && (
                <button onClick={back} className="inline-flex items-center gap-1 px-3.5 py-2 rounded-lg text-[13px] font-medium border border-[color:var(--color-border)] bg-white hover:bg-slate-100 text-slate-700 transition-colors">
                  <ArrowLeft className="w-5 h-5" /> Back
                </button>
              )}
              <button onClick={next} className="inline-flex items-center gap-1 px-4 py-2 rounded-lg text-[13px] font-semibold text-white bg-blue-600 hover:opacity-95 transition-opacity">
                {step === 2 ? (<><Sparkles className="w-5 h-5" /> Finish setup</>) : (<>Continue <ArrowRight className="w-5 h-5" /></>)}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
