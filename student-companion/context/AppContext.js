// context/AppContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useColorScheme } from 'react-native';

const STORAGE_KEY = 'student-companion-v2';

const lightColors = {
  bg: '#f3f4f6',
  bgSecondary: 'rgba(255,255,255,0.9)',
  card: 'rgba(255,255,255,0.95)',
  border: 'rgba(15,23,42,0.08)',
  text: '#020617',
  textMuted: '#6b7280',
  accent: '#6366f1',
  accentSoft: 'rgba(99,102,241,0.12)',
  danger: '#f97373',
  success: '#22c55e',
  neonCyan: '#22d3ee',
  neonPink: '#fb37ff',
};

const darkColors = {
  bg: '#020617',
  bgSecondary: 'rgba(15,23,42,0.96)',
  card: 'rgba(15,23,42,0.9)',
  border: 'rgba(148,163,184,0.2)',
  text: '#e5e7eb',
  textMuted: '#9ca3af',
  accent: '#6366f1',
  accentSoft: 'rgba(99,102,241,0.25)',
  danger: '#f97373',
  success: '#22c55e',
  neonCyan: '#22d3ee',
  neonPink: '#fb37ff',
};

const defaultState = {
  theme: 'dark',
  subjects: [
    { id: '1', name: 'DSA', attended: 18, total: 22 },
    { id: '2', name: 'OS', attended: 15, total: 20 },
    { id: '3', name: 'DBMS', attended: 12, total: 18 },
  ],
  tasks: [
    { id: '1', title: 'Finish DSA assignment', due: 'Today', done: false },
    { id: '2', title: 'Revise OS Unit 2', due: 'Tomorrow', done: false },
  ],
  timetable: {
    Monday: ['9–10 DSA', '10–11 DBMS', '2–3 OS'],
    Tuesday: ['9–10 Maths', '11–12 DBMS Lab'],
    Wednesday: ['10–11 DAA', '2–4 Mini Project'],
    Thursday: ['9–10 OS', '3–4 Sports'],
    Friday: ['9–10 DBMS', '11–12 DSA'],
  },
  profile: {
    name: 'Nandhu',
    usn: '4NI24IS161',
    college: 'The National Institute of Engineering',
    branch: 'ISE',
    semester: '3rd Sem',
  },
  cgpaData: {
    currentCgpa: '8.2',
    currentCredits: '60',
    thisSemSgpa: '9.0',
    thisSemCredits: '20',
  },
};

const AppContext = createContext(null);

export const AppProvider = ({ children }) => {
  const systemScheme = useColorScheme();
  const [appState, setAppState] = useState({
    ...defaultState,
    theme: systemScheme === 'dark' ? 'dark' : 'light',
  });
  const [hydrated, setHydrated] = useState(false);

  // Load from storage
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setAppState((prev) => ({
            ...prev,
            ...parsed,
          }));
        }
      } catch (e) {
        console.log('Failed to load state', e);
      } finally {
        setHydrated(true);
      }
    })();
  }, []);

  // Save to storage
  useEffect(() => {
    if (!hydrated) return;
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(appState)).catch((e) =>
      console.log('Failed to save', e)
    );
  }, [appState, hydrated]);

  const setPart = (key, valueOrUpdater) => {
    setAppState((prev) => {
      const prevSlice = prev[key];
      const nextSlice =
        typeof valueOrUpdater === 'function'
          ? valueOrUpdater(prevSlice)
          : valueOrUpdater;
      return { ...prev, [key]: nextSlice };
    });
  };

  const toggleTheme = () => {
    setAppState((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  };

  const colors = appState.theme === 'dark' ? darkColors : lightColors;

  return (
    <AppContext.Provider
      value={{ appState, setAppState, setPart, toggleTheme, colors, hydrated }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
