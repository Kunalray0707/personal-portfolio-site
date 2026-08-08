'use client';
import React from 'react';
interface Activity {
  title: string;
  description: string;
  time: string;
}

interface RecentActivityProps {
  items: Activity[];
}

export default function RecentActivity({ items }: RecentActivityProps) {
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 p-6 shadow-sm">
      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Recent activity</p>
        <span className="text-xs uppercase tracking-[0.2em] text-slate-400">Live</span>
      </div>
      <div className="mt-6 space-y-4">
        {items.map((item) => (
          <div key={item.title} className="rounded-3xl bg-slate-50 dark:bg-slate-950/70 p-4">
            <div className="flex items-center justify-between gap-3">
              <p className="font-semibold text-slate-900 dark:text-white">{item.title}</p>
              <span className="text-xs text-slate-400">{item.time}</span>
            </div>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
