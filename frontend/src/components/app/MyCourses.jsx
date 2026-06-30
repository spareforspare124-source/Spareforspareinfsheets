import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Plus, GraduationCap, Trash2, CalendarClock } from 'lucide-react';
import { EXAM_TRACKS, SUBJECT_INFO } from '../../data/mock';
import { toast } from 'sonner';
import CourseWizard from './CourseWizard';

const STATUS = ['Active', 'On hold', 'Completed'];

function daysUntil(dateStr) {
  if (!dateStr) return null;
  return Math.max(0, Math.ceil((new Date(dateStr + 'T00:00:00').getTime() - Date.now()) / (1000 * 60 * 60 * 24)));
}

function statusClass(s) {
  if (s === 'Active') return 'bg-emerald-50 border-emerald-200 text-emerald-700';
  if (s === 'Completed') return 'bg-violet-50 border-violet-200 text-violet-700';
  return 'bg-slate-50 border-slate-200 text-slate-700';
}

function CourseCard({ course, onRemove, onUpdate }) {
  const info = SUBJECT_INFO[course.subject] || { emoji: '\u{1F4DA}' };
  const exam = EXAM_TRACKS.find((e) => e.id === course.exam) || { name: course.exam };
  const days = daysUntil(course.examDate);
  return (
    <div className="card-soft p-5">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <span className="inline-block px-2 py-0.5 text-[10.5px] font-semibold rounded-md bg-violet-100 text-violet-700 mb-2">{exam.name}</span>
          <div className="flex items-center gap-1.5">
            <span className="text-[16px] leading-none">{info.emoji}</span>
            <div className="text-[15.5px] font-semibold text-slate-900 leading-tight">{course.name || course.subject}</div>
          </div>
          {course.subject && course.subject !== course.name && <div className="text-[12.5px] text-slate-500 mt-1">{course.subject}</div>}
        </div>
        <button onClick={() => { onRemove(course.id); toast.success('Course removed'); }} className="w-8 h-8 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center transition-colors" aria-label="Remove course">
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-md border border-slate-100 px-2.5 py-2">
          <div className="text-[9.5px] tracking-wider uppercase font-semibold text-slate-500">Target</div>
          <div className="text-[12.5px] text-slate-800 font-medium mt-0.5">{course.target || '\u2014'}</div>
        </div>
        <div className="rounded-md border border-slate-100 px-2.5 py-2">
          <div className="text-[9.5px] tracking-wider uppercase font-semibold text-slate-500">Level</div>
          <div className="text-[12.5px] text-slate-800 font-medium mt-0.5">{course.level || '\u2014'}</div>
        </div>
      </div>
      <div className="mt-3 rounded-md border border-blue-200/60 px-2.5 py-2 bg-gradient-to-br from-blue-50 via-violet-50/40 to-transparent flex items-center justify-between">
        <div className="flex items-center gap-2 text-[12.5px] text-blue-700">
          <CalendarClock className="w-3.5 h-3.5" />
          <span className="font-medium">{course.examDate ? new Date(course.examDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No date set'}</span>
        </div>
        <div className="text-[12.5px] font-semibold text-slate-900 tabular-nums">{days !== null ? `${days}d` : '\u2014'}</div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <select value={course.status || 'Active'} onChange={(e) => onUpdate(course.id, { status: e.target.value })}
          className={`text-[12px] font-medium rounded-md px-2 py-1 border transition-colors ${statusClass(course.status || 'Active')}`}>
          {STATUS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="text-[11.5px] text-slate-500">Added {new Date(course.addedAt || Date.now()).toLocaleDateString()}</div>
      </div>
    </div>
  );
}

function EmptyState({ onAdd }) {
  return (
    <div className="rounded-2xl border border-dashed border-[color:var(--color-border)] p-12 text-center bg-white">
      <div className="w-12 h-12 rounded-xl bg-violet-100 text-violet-700 flex items-center justify-center mx-auto mb-4">
        <GraduationCap className="w-6 h-6" />
      </div>
      <div className="text-[15.5px] font-semibold text-slate-900">No courses yet</div>
      <p className="text-[13.5px] text-slate-500 mt-1 max-w-[420px] mx-auto">Add your first course to start building a personalized study plan. Each course gets its own exam date.</p>
      <button onClick={onAdd} className="btn-violet inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[13.5px] font-medium mt-6">
        <Plus className="w-4 h-4" /> Add your first course
      </button>
    </div>
  );
}

export default function MyCourses() {
  const { state, removeCourse, updateCourse } = useApp();
  const courses = state.courses || [];
  const [open, setOpen] = useState(false);

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3 mb-6">
        <p className="text-[14px] text-slate-500">Track every course you are studying with its own exam date.</p>
        <button onClick={() => setOpen(true)} className="btn-violet inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-[14px] font-medium">
          <Plus className="w-4 h-4" /> Add course
        </button>
      </div>

      {courses.length === 0 ? (
        <EmptyState onAdd={() => setOpen(true)} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {courses.map((c) => (
            <CourseCard key={c.id} course={c} onRemove={removeCourse} onUpdate={updateCourse} />
          ))}
        </div>
      )}

      {open && <CourseWizard mode="add-course" onClose={() => setOpen(false)} />}
    </div>
  );
}
