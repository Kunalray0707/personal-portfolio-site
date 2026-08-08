'use client';
import React from 'react';

export default function Footer() {
  return (
    <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <div className="text-sm text-slate-600 dark:text-slate-400">© {new Date().getFullYear()} Portfolio AI Pro — All rights reserved.</div>
        <div className="flex gap-4 text-sm text-slate-600 dark:text-slate-400">
          <a href="/auth/register">Privacy</a>
          <a href="/auth/register">Terms</a>
          <a href="/auth/register">Contact</a>
        </div>
      </div>
    </footer>
  );
}
