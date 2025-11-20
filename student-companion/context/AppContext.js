// context/AppContext.js
import React, { createContext, useContext, useEffect, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightColors, darkColors } from '../constants/colors';

const STORAGE_KEY = 'student-companion-v2';

const AppContext = createContext(null);

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
    existingCgpa: '8.2',
    existingCredits: '60',
    subjects: [
      { id: '1', name: 'DSA', credits: '4', grade: '9' },
      { id: '2', name: 'OS', credits: '4', grade: '8' },
    ],
  },
  docs: [],
};

export function AppProvider({ children }) {
  const [state, setState] = useState(defaultState);

  // Load
  useEffect(() => {
    (async () => {
      try {
        const saved = await AsyncStorage.getItem(STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          setState((prev) => ({ ...prev, ...parsed }));
        }
      } catch (e) {
        console.log('Failed to load state', e);
      }
    })();
  }, []);

  // Save
  useEffect(() => {
    AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(state)).catch((e) =>
      console.log('Failed to save app state', e)
    );
  }, [state]);

  const setPart = (key, value) => {
    setState((prev) => ({ ...prev, [key]: value }));
  };

  const toggleTheme = () => {
    setState((prev) => ({
      ...prev,
      theme: prev.theme === 'dark' ? 'light' : 'dark',
    }));
  };

  const value = {
    state,
    setPart,
    toggleTheme,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error('useApp must be used inside AppProvider');
  return ctx;
}

export function useThemeColors() {
  const { state } = useApp();
  const colors = state.theme === 'dark' ? darkColors : lightColors;
  return { theme: state.theme, colors };
}
