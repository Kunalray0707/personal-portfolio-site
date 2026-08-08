'use client';
import React from 'react';
import { FaUser, FaShieldAlt, FaPenNib } from 'react-icons/fa';

interface ProfileCardProps {
  name?: string | null;
  email?: string | null;
}

export default function ProfileCard({ name, email }: ProfileCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 p-6 shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex h-16 w-16 items-center justify-center rounded-3xl bg-primary/10 text-primary">
          <FaUser className="h-7 w-7" />
        </div>
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Your profile</p>
          <h2 className="text-xl font-semibold text-slate-900 dark:text-white">{name || 'Portfolio Creator'}</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">{email || 'No email available'}</p>
        </div>
      </div>
      <div className="mt-6 grid gap-3">
        <button className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition">
          <FaPenNib className="w-4 h-4" />
          Customize profile
        </button>
        <button className="flex items-center gap-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 px-4 py-3 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 transition">
          <FaShieldAlt className="w-4 h-4" />
          Security & settings
        </button>
      </div>
    </div>
  );
}
