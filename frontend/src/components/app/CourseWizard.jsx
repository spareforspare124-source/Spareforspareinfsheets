import React, { useMemo, useState } from 'react';
import { useApp } from '../../context/AppContext';
import { EXAM_TRACKS, SUBJECTS, SUBJECT_INFO } from '../../data/mock';
import { ArrowRight, ArrowLeft, Calendar, CheckCircle2, GraduationCap, BookOpen, X, Sparkles, Target } from 'lucide-react';
import StudyDecor from '../decor/StudyDecor';
import { toast } from 'sonner';

const STEP_LABELS = ['Exam', 'Subject', 'Date'];
const LEVELS = ['Beginner', 'Intermediate', 'Advanced'];

/**
 * Unified course wizard used in three places:
 *  - First-time onboarding (mode='onboarding')
 *  - "Add course" from My Courses (mode='add-course')
 *  - After Reset Demo (mode='onboarding')
 *
 * Always adds ONE course to context (track + subject + exam date + target).
 * In onboarding mode it also sets the user's primary examTrack and marks
 * onboardingDone=true on finish.
 */
export default function CourseWizard({ mode = 'onboarding', onClose, onAdded }) {
  const { state, addCourse, completeOnboarding } = useApp();
  const isOnboarding = mode === 'onboarding';

  const [step, setStep] = useState(0);
  const [examTrack, setExamTrack] = useState(state.user?.examTrack || 'SSLC');
  const trackSubjects = useMemo(() => SUBJECTS[examTrack] || [], [examTrack]);
  const [subject, setSubject] = useState('');
  const [examDate, setExamDate] = useState('');
  const [target, setTarget] = useState('');
  const [level, setLevel] = useState('Intermediate');

  const validateStep = () => {
    if (step === 0 && !examTrack) return 'Pick an exam track';
    if (step === 1 && !subject) return 'Pick a subject';
    if (step === 2 && !examDate) return 'Choose an exam date';
    return null;
  };

  const next = () => {
    const err = validateStep();
    if (err) { toast.error(err); return; }
    if (step < 2) {
      setStep((v) => v + 1);
      return;
    }
    finish();
  };
  const back = () => setStep((v) => Math.max(0, v - 1));

  const finish = () => {
    const course = { name: subject, exam: examTrack, subject, target, level, status: 'Active', examDate };
    addCourse(course);
    if (isOnboarding) {
      // collect ALL subjects (only this one for now) and global examDate fallback
      completeOnboarding({ examTrack, examDate, subjects: [subject] });
      toast.success('Setup complete — let’s build your first worksheet');
    } else {
      toast.success(`${subject} added`);
    }
    if (onAdded) onAdded(course);
    if (onClose) onClose();
  };

  const minDate = new Date().toISOString().slice(0, 10);
  const days = examDate ? Math.max(0, Math.ceil((new Date(examDate + 'T00:00:00').getTime() - Date.now()) / (1000 * 60 * 60 * 24))) : null;
  const skip = () => {
    if (onClose) onClose();
    else if (isOnboarding) completeOnboarding({ examTrack, examDate, subjects: trackSubjects });
  };

  const cancellable = !isOnboarding;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center section-bg overflow-auto">
      <StudyDecor density="dense" />
      <div className="absolute inset-0 grid-fade pointer-events-none" />

      <div className="relative w-full max-w-[820px] mx-4 my-8">
        <Header isOnboarding={isOnboarding} userName={state.user?.name} onSkip={skip} cancellable={cancellable} />

        <Stepper step={step} />

        <div className="bg-white rounded-2xl border border-[color:var(--color-border)] shadow-[0_30px_80px_-30px_rgba(15,23,42,0.18)] overflow-hidden">
          <div className="h-1 w-full bg-slate-100">
            <div className="h-full bg-gradient-to-r from-violet-500 via-blue-500 to-cyan-400 transition-all duration-500" style={{ width: `${((step + 1) / 3) * 100}%` }} />
          </div>

          {step === 0 && (
            <StepExamTrack value={examTrack} onChange={setExamTrack} />
          )}
          {step === 1 && (
            <StepSubject examTrack={examTrack} subjects={trackSubjects} value={subject} onChange={setSubject} />
          )}
          {step === 2 && (
            <StepDate examDate={examDate} setExamDate={setExamDate} minDate={minDate} days={days} target={target} setTarget={setTarget} level={level} setLevel={setLevel} subject={subject} />
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

function Header({ isOnboarding, userName, onSkip, cancellable }) {
  return (
    <div className="flex items-center justify-between mb-5">
      <div className="flex items-center gap-2">
        <span className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-blue-600 flex items-center justify-center text-white">
          <Sparkles className="w-4 h-4" />
        </span>
        <div className="leading-tight">
          <div className="text-[13px] font-semibold text-slate-900">{isOnboarding ? 'Quick setup' : 'Add a course'}</div>
          <div className="text-[11.5px] text-slate-500">{isOnboarding ? `Hi ${userName || 'there'} · let’s pick your first course` : 'Add a course with its own exam date'}</div>
        </div>
      </div>
      <button onClick={onSkip} className="text-[12.5px] text-slate-500 hover:text-slate-800 transition-colors inline-flex items-center gap-1">
        {cancellable ? 'Cancel' : 'Skip'} <X className="w-3.5 h-3.5" />
      </button>
    </div>
  );
}

function Stepper({ step }) {
  return (
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
  );
}

function StepExamTrack({ value, onChange }) {
  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center gap-2 mb-2">
        <GraduationCap className="w-4 h-4 text-violet-600" />
        <span className="text-[11px] tracking-[0.16em] uppercase font-semibold text-violet-600">Step 1</span>
      </div>
      <h2 className="text-[26px] font-semibold tracking-tight text-slate-900">Which exam are you preparing for?</h2>
      <p className="text-[13.5px] text-slate-500 mt-1">We tailor subjects, topics, and worksheet style to your track.</p>
      <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5">
        {EXAM_TRACKS.map((t) => {
          const sel = value === t.id;
          return (
            <button key={t.id} onClick={() => onChange(t.id)}
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
  );
}

function StepSubject({ examTrack, subjects, value, onChange }) {
  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center gap-2 mb-2">
        <BookOpen className="w-4 h-4 text-cyan-600" />
        <span className="text-[11px] tracking-[0.16em] uppercase font-semibold text-cyan-700">Step 2</span>
      </div>
      <h2 className="text-[26px] font-semibold tracking-tight text-slate-900">Which subject for {EXAM_TRACKS.find((e) => e.id === examTrack)?.name || examTrack}?</h2>
      <p className="text-[13.5px] text-slate-500 mt-1">Pick one subject to add as a course. You can add more from My Courses later.</p>
      <div className="mt-5 grid grid-cols-2 md:grid-cols-3 gap-2.5">
        {subjects.map((s) => {
          const info = SUBJECT_INFO[s] || { emoji: '\u{1F4DA}', tagline: 'Practice and improve.' };
          const sel = value === s;
          return (
            <button key={s} onClick={() => onChange(s)}
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
  );
}

function StepDate({ examDate, setExamDate, minDate, days, target, setTarget, level, setLevel, subject }) {
  return (
    <div className="p-6 lg:p-8">
      <div className="flex items-center gap-2 mb-2">
        <Calendar className="w-4 h-4 text-blue-600" />
        <span className="text-[11px] tracking-[0.16em] uppercase font-semibold text-blue-700">Step 3</span>
      </div>
      <h2 className="text-[26px] font-semibold tracking-tight text-slate-900">When is your {subject || 'subject'} exam?</h2>
      <p className="text-[13.5px] text-slate-500 mt-1">Each subject gets its own date so countdowns stay accurate.</p>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4 items-stretch">
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] tracking-[0.14em] uppercase font-semibold text-slate-500">Exam date</span>
          <input type="date" min={minDate} className="input-base" value={examDate} onChange={(e) => setExamDate(e.target.value)} />
        </label>
        <div className="rounded-xl border border-blue-200/70 bg-gradient-to-br from-blue-50 via-violet-50/50 to-transparent px-4 py-3 flex items-center justify-between">
          <div>
            <div className="text-[11px] tracking-[0.14em] uppercase font-semibold text-blue-700">Days until exam</div>
            <div className="text-[28px] font-semibold text-slate-900 mt-1 tabular-nums">{days !== null ? days : '\u2014'}</div>
          </div>
          <Calendar className="w-7 h-7 text-blue-500/70" />
        </div>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {[7, 30, 60, 90, 180].map((d) => {
          const dt = new Date(); dt.setDate(dt.getDate() + d);
          const iso = dt.toISOString().slice(0, 10);
          return (
            <button key={d} onClick={() => setExamDate(iso)}
              className={`px-3 py-1.5 rounded-md text-[12.5px] font-medium border transition-colors ${examDate === iso ? 'border-violet-400 bg-violet-50 text-violet-700' : 'border-[color:var(--color-border)] bg-white text-slate-700 hover:bg-slate-100'}`}>
              In {d} days
            </button>
          );
        })}
      </div>

      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] tracking-[0.14em] uppercase font-semibold text-slate-500">Target grade (optional)</span>
          <input className="input-base" placeholder="e.g., 7 or A* or 1400" value={target} onChange={(e) => setTarget(e.target.value)} />
        </label>
        <label className="flex flex-col gap-1.5">
          <span className="text-[10px] tracking-[0.14em] uppercase font-semibold text-slate-500">Current level</span>
          <div className="inline-flex flex-wrap gap-1 p-1 bg-slate-100 rounded-lg">
            {LEVELS.map((l) => (
              <button type="button" key={l} onClick={() => setLevel(l)} className={`px-3 py-1.5 rounded-md text-[12.5px] font-medium transition-colors ${level === l ? 'bg-white shadow-sm text-slate-900' : 'text-slate-600 hover:text-slate-900'}`}>{l}</button>
            ))}
          </div>
        </label>
      </div>
    </div>
  );
}
