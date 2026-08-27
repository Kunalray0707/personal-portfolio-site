'use client';
import React from 'react';
import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Nav() {
  return (
    <header className="w-full border-b border-slate-200 dark:border-slate-800 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link href="/" className="text-lg font-bold">Portfolio AI Pro</Link>
          <nav className="hidden sm:flex gap-4 ml-6 text-sm text-slate-600 dark:text-slate-300">
            <Link href="/templates">Templates</Link>
            <Link href="/dashboard/portfolios">Builder</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/docs">Docs</Link>
          </nav>
        </div>

        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Link href="/auth" className="hidden sm:inline-block px-4 py-2 rounded-md bg-primary text-white">Sign up</Link>
          <Link href="/auth" className="text-sm text-slate-600 dark:text-slate-300">Sign in</Link>
        </div>
      </div>
    </header>
  );
}
