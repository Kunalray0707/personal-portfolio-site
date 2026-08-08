'use client';
import React from 'react';
interface AnalyticsCardProps {
  title: string;
  value: string;
  change: string;
  description: string;
}

export default function AnalyticsCard({ title, value, change, description }: AnalyticsCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 p-6 shadow-sm">
      <div className="flex items-center justify-between gap-2">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">{value}</p>
        </div>
        <div className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-3 py-2 text-sm font-medium text-emerald-600 dark:text-emerald-300">{change}</div>
      </div>
      <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">{description}</p>
    </div>
  );
}
