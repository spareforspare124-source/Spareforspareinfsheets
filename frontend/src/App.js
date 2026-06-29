import React, { useEffect, useState } from 'react';
import './App.css';
import { AppProvider, useApp } from './context/AppContext';
import LandingPage from './components/landing/LandingPage';
import AppShell from './components/app/AppShell';
import { Toaster } from './components/ui/sonner';

function Router() {
  const { state, loaded } = useApp();
  const [hash, setHash] = useState(window.location.hash || '');

  useEffect(() => {
    const onHash = () => setHash(window.location.hash || '');
    window.addEventListener('hashchange', onHash);
    return () => window.removeEventListener('hashchange', onHash);
  }, []);

  if (!loaded) return null;

  // If user is logged in, show the dashboard app
  if (state.user) {
    return <AppShell hash={hash} />;
  }
  return <LandingPage hash={hash} />;
}

function App() {
  return (
    <div className="App">
      <AppProvider>
        <Router />
        <Toaster position="top-right" />
      </AppProvider>
    </div>
  );
}

export default App;
