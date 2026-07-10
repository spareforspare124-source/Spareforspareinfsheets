import React, { useState, useEffect } from 'react';
import { LayoutDashboard, GraduationCap, Pencil, FileText, Library, History, TrendingUp, Dumbbell, Sparkles, AlertTriangle, Settings, Shield } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import Dashboard from './Dashboard';
import StartStudying from './StartStudying';
import Worksheets from './Worksheets';
import WorksheetHistory from './WorksheetHistory';
import ProgressView from './ProgressView';
import Strengths from './Strengths';
import Mistakes from './Mistakes';
import Recommendations from './Recommendations';
import SettingsView from './SettingsView';
import MyCourses from './MyCourses';
import TutorialOverlay from './TutorialOverlay';
import CourseWizard from './CourseWizard';
import QuestionBank from './QuestionBank';
import AdminPlaceholder from './AdminPlaceholder';
import CourseOverview from './CourseOverview';
import Sidebar from './shell/Sidebar';
import DemoBanner from './shell/DemoBanner';
import TopHeader from './shell/TopHeader';
import { toast } from 'sonner';

const BASE_NAV = [
  { key: 'dashboard', label: 'Dashboard', Icon: LayoutDashboard },
  { key: 'courses', label: 'My Courses', Icon: GraduationCap },
  { key: 'study', label: 'Start Studying', Icon: Pencil },
  { key: 'qbank', label: 'Question Bank', Icon: Library },
  { key: 'resources', label: 'Resources', Icon: FileText },
  { key: 'history', label: 'Worksheet History', Icon: History },
  { key: 'progress', label: 'Performance', Icon: TrendingUp },
  { key: 'strengths', label: 'Strengths & Weaknesses', Icon: Dumbbell },
  { key: 'recommendations', label: 'Smart Recommendations', Icon: Sparkles },
  { key: 'settings', label: 'Settings', Icon: Settings },
];
const ADMIN_ITEM = { key: 'admin', label: 'Admin', Icon: Shield };
const HIDDEN_ROUTES = [
  { key: 'worksheets', label: 'Create a Worksheet', Icon: FileText },
  { key: 'mistakes', label: 'Mistake History', Icon: AlertTriangle },
  { key: 'course-overview', label: 'Course Overview', Icon: GraduationCap },
];

const SIDEBAR_STORAGE_KEY = 'infinitysheets_sidebar_open';

function parseHash(hash) {
  const raw = (hash || '').replace(/^#/, '');
  const [key, query] = raw.split('?');
  const params = {};
  (query || '').split('&').filter(Boolean).forEach((pair) => {
    const [k, v = ''] = pair.split('=');
    params[k] = v;
  });
  return { key: key || 'dashboard', params };
}

function renderRoute(activeKey, params, go, isAdmin) {
  switch (activeKey) {
    case 'dashboard': return <Dashboard go={go} />;
    case 'courses': return <MyCourses />;
    case 'study': return <StartStudying go={go} subjectParam={params.subject} />;
    case 'worksheets': return <Worksheets go={go} />;
    case 'qbank': return <QuestionBank go={go} subjectParam={params.subject} />;
    case 'history': return <WorksheetHistory />;
    case 'progress': return <ProgressView />;
    case 'strengths': return <Strengths />;
    case 'recommendations': return <Recommendations go={go} />;
    case 'mistakes': return <Mistakes />;
    case 'settings': return <SettingsView />;
    case 'admin': return isAdmin ? <AdminPlaceholder /> : <Dashboard go={go} />;
    case 'course-overview': return <CourseOverview courseId={params.id} go={go} />;
    default: return <Dashboard go={go} />;
  }
}

export default function AppShell({ hash }) {
  const { state, logout, apiLogout, toggleTheme, restartTutorial, restartOnboarding, resetProgress } = useApp();
  const { key: active, params } = parseHash(hash);
  const isDemo = !!state.user?.isDemo;
  const isAdmin = state.user?.role === 'admin' || isDemo;
  const NAV = isAdmin ? [...BASE_NAV, ADMIN_ITEM] : BASE_NAV;
  const ALL_ITEMS = [...NAV, ...HIDDEN_ROUTES];
  const current = ALL_ITEMS.find((n) => n.key === active) || NAV[0];

  // Sidebar collapse state — persisted so it survives refreshes.
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    try {
      const v = localStorage.getItem(SIDEBAR_STORAGE_KEY);
      return v === null ? true : v === '1';
    } catch (_) {
      return true;
    }
  });
  useEffect(() => {
    try { localStorage.setItem(SIDEBAR_STORAGE_KEY, sidebarOpen ? '1' : '0'); } catch (_) {}
  }, [sidebarOpen]);

  const go = (k) => {
    // `resources` is intercepted by the top-level Router (App.js) which
    // renders the shared landing ResourcesPage regardless of auth state.
    window.location.hash = `#${k}`;
  };
  const isDark = state.theme === 'dark';
  const showOnboarding = !state.onboardingDone;
  const showTutorial = state.onboardingDone && !state.tutorialDone;

  const resetDemo = () => {
    resetProgress();
    restartOnboarding();
    restartTutorial();
    window.location.hash = '#dashboard';
    toast.success('Demo reset — starting setup from the top');
  };

  const exitAccount = async () => {
    if (isDemo) {
      logout();
    } else {
      await apiLogout();
    }
    window.location.hash = '';
  };

  return (
    <div className="min-h-screen section-bg flex">
      {/* Collapsible sidebar. When closed, its own left margin becomes
          negative so it slides out to the left with a CSS transform on the
          inner aside (the width stays the same, but the wrapper shrinks). */}
      <div
        className={`shrink-0 py-2 pl-2 transition-[width,opacity,transform] duration-300 ease-out overflow-hidden ${
          sidebarOpen ? 'w-[242px] opacity-100 translate-x-0' : 'w-0 opacity-0 -translate-x-4'
        }`}
        aria-hidden={!sidebarOpen}
      >
        <div className="w-[230px] h-[calc(100vh-16px)] sticky top-2">
          <Sidebar
            nav={NAV}
            activeKey={current.key}
            isDemo={isDemo}
            onNavigate={go}
            onResetDemo={resetDemo}
            onLogout={exitAccount}
            onClose={() => setSidebarOpen(false)}
          />
        </div>
      </div>

      <main className="min-w-0 flex-1 relative">
        {isDemo && <DemoBanner onResetDemo={resetDemo} onExit={exitAccount} />}
        <TopHeader
          examTrack={state.user?.examTrack || 'SSLC'}
          title={current.label}
          activeKey={current.key}
          isDark={isDark}
          courseCount={(state.courses || []).length}
          onToggleTheme={toggleTheme}
          onNewWorksheet={() => go('worksheets')}
          sidebarOpen={sidebarOpen}
          onOpenSidebar={() => setSidebarOpen(true)}
        />
        <div className="px-8 py-7 max-w-[1280px]">
          {renderRoute(current.key, params, go, isAdmin)}
        </div>
      </main>

      {showOnboarding && <CourseWizard mode="onboarding" />}
      {showTutorial && <TutorialOverlay />}
    </div>
  );
}
