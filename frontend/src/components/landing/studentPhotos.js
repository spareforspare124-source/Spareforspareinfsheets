import React from 'react';

/*
 * Student-photo slots shared by the hero belt (2D) and — if ever needed
 * again — other galleries. Drop real photos into `img` to replace the
 * SVG placeholder art.
 */
export const PHOTOS = [
  { caption: 'Project build in progress', tone: '#3b82f6', emoji: '📐', img: '/photos/student-1.jpg' },
  { caption: 'Robotics after class', tone: '#8b5cf6', emoji: '⚡', img: '/photos/student-2.jpg' },
  { caption: 'Chemistry practical', tone: '#f59e0b', emoji: '🧪', img: '/photos/student-3.jpg' },
  { caption: 'Demo day', tone: '#10b981', emoji: '👥', img: '/photos/student-4.jpg' },
  { caption: 'Group project, one goal', tone: '#ef4444', emoji: '🎯', img: '/photos/student-5.jpg' },
];

export function PhotoPlaceholder({ tone, emoji, caption }) {
  return (
    <div className="w-full h-full flex flex-col">
      <div className="flex-1 rounded-t-2xl flex items-center justify-center text-[44px]"
        style={{ background: `linear-gradient(135deg, ${tone}22, ${tone}55)` }}>
        <span role="img" aria-hidden="true">{emoji}</span>
      </div>
      <div className="px-4 py-3 text-left">
        <div className="text-[13.5px] font-semibold text-slate-900">{caption}</div>
        <div className="text-[11.5px] text-slate-500">Student photo coming soon</div>
      </div>
    </div>
  );
}
