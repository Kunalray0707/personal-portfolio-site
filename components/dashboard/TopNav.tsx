'use client';
import React, { useState } from 'react';
import { FaBell, FaUserCircle, FaBars } from 'react-icons/fa';
import { useRouter } from 'next/navigation';
import ThemeToggle from '../ThemeToggle';

interface TopNavProps {
  user: { name?: string | null; email?: string | null } | null;
  onMenuToggle: () => void;
}

export default function TopNav({ user, onMenuToggle }: TopNavProps) {
  const router = useRouter();
  const [signingOut, setSigningOut] = useState(false);

  async function handleLogout() {
    setSigningOut(true);
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/auth/login');
  }

  return (
    <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <div className="flex items-center justify-between gap-4">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Good afternoon</p>
            <h1 className="text-3xl font-semibold">Welcome back, {user?.name || user?.email || 'Creator'}</h1>
          </div>
          <button
            type="button"
            onClick={onMenuToggle}
            className="inline-flex items-center justify-center rounded-full border border-slate-200 bg-white/90 p-2 text-slate-700 shadow-sm hover:border-slate-300 dark:border-slate-700 dark:bg-slate-900/90 dark:text-slate-200 xl:hidden"
          >
            <FaBars className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <a href="#notifications" className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-4 py-2 text-sm text-slate-700 dark:text-slate-200 shadow-sm hover:border-slate-300 dark:hover:border-slate-600 transition">
          <FaBell className="w-4 h-4" />
          Notifications
        </a>
        <div className="inline-flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-700 bg-white/80 dark:bg-slate-900/80 px-4 py-2 shadow-sm">
          <FaUserCircle className="w-5 h-5 text-slate-500 dark:text-slate-300" />
          <span className="text-sm text-slate-700 dark:text-slate-200">{user?.name || 'Portfolio Pro'}</span>
        </div>
        <ThemeToggle />
        <button
          type="button"
          disabled={signingOut}
          onClick={handleLogout}
          className="rounded-2xl bg-slate-900 px-4 py-2 text-sm text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-70"
        >
          {signingOut ? 'Signing out…' : 'Sign out'}
        </button>
      </div>
    </div>
  );
}
