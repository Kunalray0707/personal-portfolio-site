'use client';
import React, { useEffect, useState } from 'react';
import { useThemeContext } from './ThemeProvider';

export default function ThemeToggle() {
  const { theme, toggleTheme } = useThemeContext();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      aria-label="Toggle theme"
      className="px-2 py-1 rounded-md border border-slate-200 dark:border-slate-700"
    >
      {theme === 'dark' ? '🌙' : '☀️'}
    </button>
  );
}
