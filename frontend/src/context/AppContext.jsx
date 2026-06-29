import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';

const STORAGE_KEY = 'infinitysheets_state_v1';

const defaultState = {
  user: null, // { name, email, examTrack }
  worksheets: [], // array of completed worksheet results
  mistakes: [], // wrong answer history
  streak: 0,
  lastStudyDate: null,
  settings: {
    dailyGoal: 10,
    defaultDifficulty: 'Mixed exam practice',
    examDate: '',
  },
  questionsToday: 0,
  goalDate: null,
};

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [state, setState] = useState(defaultState);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) setState({ ...defaultState, ...JSON.parse(raw) });
    } catch (e) { /* ignore */ }
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (!loaded) return;
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(state)); } catch (e) {}
  }, [state, loaded]);

  const signup = useCallback((user) => {
    setState((s) => ({ ...s, user }));
  }, []);

  const login = useCallback((email) => {
    setState((s) => {
      if (s.user && s.user.email === email) return s;
      // create lightweight user if not present
      return { ...s, user: s.user || { name: email.split('@')[0], email, examTrack: 'SSLC' } };
    });
  }, []);

  const logout = useCallback(() => {
    setState((s) => ({ ...s, user: null }));
  }, []);

  const updateProfile = useCallback((patch) => {
    setState((s) => ({ ...s, user: { ...s.user, ...patch } }));
  }, []);

  const updateSettings = useCallback((patch) => {
    setState((s) => ({ ...s, settings: { ...s.settings, ...patch } }));
  }, []);

  const resetProgress = useCallback(() => {
    setState((s) => ({ ...s, worksheets: [], mistakes: [], streak: 0, questionsToday: 0, goalDate: null, lastStudyDate: null }));
  }, []);

  const deleteAccount = useCallback(() => {
    setState(defaultState);
    try { localStorage.removeItem(STORAGE_KEY); } catch (e) {}
  }, []);

  const recordWorksheet = useCallback((sheet) => {
    // sheet = { id, subject, topic, difficulty, length, questions, answers, score, correct, total, durationSec, date }
    setState((s) => {
      const today = new Date().toDateString();
      const lastDate = s.lastStudyDate;
      let streak = s.streak || 0;
      if (lastDate !== today) {
        if (lastDate) {
          const diffDays = Math.floor((new Date(today).getTime() - new Date(lastDate).getTime()) / (1000 * 60 * 60 * 24));
          if (diffDays === 1) streak += 1;
          else if (diffDays > 1) streak = 1;
        } else {
          streak = 1;
        }
      }
      const goalDate = s.goalDate === today ? today : today;
      const questionsToday = (s.goalDate === today ? s.questionsToday : 0) + sheet.total;
      const newMistakes = (sheet.questions || []).map((q, i) => {
        if (sheet.answers[i] !== q.a) {
          return { id: `${sheet.id}-${i}`, subject: sheet.subject, topic: sheet.topic, question: q.q, options: q.options, correct: q.a, given: sheet.answers[i], date: sheet.date };
        }
        return null;
      }).filter(Boolean);
      return {
        ...s,
        worksheets: [sheet, ...s.worksheets],
        mistakes: [...newMistakes, ...s.mistakes].slice(0, 200),
        streak,
        lastStudyDate: today,
        questionsToday,
        goalDate,
      };
    });
  }, []);

  const removeMistake = useCallback((id) => {
    setState((s) => ({ ...s, mistakes: s.mistakes.filter((m) => m.id !== id) }));
  }, []);

  return (
    <AppContext.Provider value={{ state, loaded, signup, login, logout, updateProfile, updateSettings, resetProgress, deleteAccount, recordWorksheet, removeMistake }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used within AppProvider');
  return ctx;
}
