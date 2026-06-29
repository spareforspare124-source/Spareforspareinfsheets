import React from 'react';
import { Infinity, LayoutDashboard, BookOpen, FileText, TrendingUp, Target, AlertCircle, User, Settings as SettingsIcon, LogOut, Sparkles, History } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Dashboard from './Dashboard';
import StartStudying from './StartStudying';
import Worksheets from './Worksheets';
import WorksheetHistory from './WorksheetHistory';
import ProgressView from './ProgressView';
import Strengths from './Strengths';
import Mistakes from './Mistakes';
import Recommendations from './Recommendations';
import Profile from './Profile';
import SettingsView from './SettingsView';

const NAV = [
  { key: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { key: 'study', label: 'Start Studying', icon: BookOpen },
  { key: 'worksheets', label: 'Worksheets', icon: FileText },
  { key: 'history', label: 'Worksheet History', icon: History },
  { key: 'progress', label: 'Progress', icon: TrendingUp },
  { key: 'strengths', label: 'Strengths & Weaknesses', icon: Target },
  { key: 'recommendations', label: 'Smart Recommendations', icon: Sparkles },
  { key: 'mistakes', label: 'Mistake History', icon: AlertCircle },
  { key: 'profile', label: 'Profile', icon: User },
  { key: 'settings', label: 'Settings', icon: SettingsIcon },
];

export default function AppShell({ hash }) {
  const { state, logout } = useApp();
  const active = (hash && hash.replace('#', '')) || 'dashboard';
  const current = NAV.find((n) => n.key === active) || NAV[0];

  const go = (k) => { window.location.hash = `#${k}`; };

  let content = null;
  switch (current.key) {
    case 'dashboard': content = <Dashboard go={go} />; break;
    case 'study': content = <StartStudying go={go} />; break;
    case 'worksheets': content = <Worksheets go={go} />; break;
    case 'history': content = <WorksheetHistory />; break;
    case 'progress': content = <ProgressView />; break;
    case 'strengths': content = <Strengths />; break;
    case 'recommendations': content = <Recommendations go={go} />; break;
    case 'mistakes': content = <Mistakes />; break;
    case 'profile': content = <Profile />; break;
    case 'settings': content = <SettingsView />; break;
    default: content = <Dashboard go={go} />;
  }

  return (
    <div className="min-h-screen bg-white grid grid-cols-[220px_1fr]">
      <aside className="border-r border-zinc-100 flex flex-col bg-white">
        <div className="px-5 pt-5 pb-6 flex items-center gap-2">
          <span className="w-8 h-8 rounded-lg bg-violet-100 flex items-center justify-center">
            <Infinity className="w-5 h-5 text-violet-600" strokeWidth={2.4} />
          </span>
          <span className="font-semibold text-[15px] tracking-tight">InfinitySheets</span>
        </div>
        <nav className="flex-1 px-3 flex flex-col gap-0.5">
          {NAV.map((n) => {
            const Icon = n.icon;
            const isActive = current.key === n.key;
            return (
              <button key={n.key} onClick={() => go(n.key)}
                className={`text-left text-[13.5px] px-3 py-2 rounded-lg flex items-center gap-2.5 transition-colors ${isActive ? 'bg-violet-50 text-violet-700 font-medium' : 'text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900'}`}>
                <Icon className="w-4 h-4" />
                <span>{n.label}</span>
              </button>
            );
          })}
        </nav>
        <div className="px-3 pb-4 pt-4 border-t border-zinc-100">
          <button onClick={() => { logout(); window.location.hash = ''; }} className="w-full text-left text-[13.5px] px-3 py-2 rounded-lg flex items-center gap-2.5 text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 transition-colors">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
      <main className="min-w-0">
        <header className="px-8 pt-7 pb-2 flex items-start justify-between border-b border-zinc-100">
          <div>
            <div className="eyebrow-muted mb-1">{state.user?.examTrack || 'SSLC'}</div>
            <h1 className="text-[28px] font-semibold tracking-tight text-zinc-900">{current.label}</h1>
          </div>
          {current.key === 'dashboard' && (
            <button onClick={() => go('worksheets')} className="btn-violet inline-flex items-center px-4 py-2 rounded-lg text-[14px] font-medium">New worksheet</button>
          )}
        </header>
        <div className="px-8 py-7 max-w-[1280px]">{content}</div>
      </main>
    </div>
  );
}
