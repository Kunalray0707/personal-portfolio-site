'use client';
import React from 'react';
interface ChartPanelProps {
  title: string;
  subtitle: string;
  data: number[];
}

export default function ChartPanel({ title, subtitle, data }: ChartPanelProps) {
  const max = Math.max(...data);
  return (
    <div className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 p-6 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{title}</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{subtitle}</h2>
        </div>
        <span className="rounded-2xl bg-slate-100 dark:bg-slate-800 px-3 py-2 text-sm text-slate-700 dark:text-slate-300">Weekly</span>
      </div>
      <div className="mt-8 flex items-end gap-3 h-52">
        {data.map((value, index) => {
          const height = (value / max) * 100;
          return (
            <div key={index} className="flex-1">
              <div className="mb-2 h-[calc(100%-22px)] w-full rounded-3xl bg-slate-100 dark:bg-slate-800" aria-hidden>
                <div className="h-full rounded-3xl bg-gradient-to-t from-primary to-violet-400" style={{ height: `${height}%` }} />
              </div>
              <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">Day {index + 1}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
