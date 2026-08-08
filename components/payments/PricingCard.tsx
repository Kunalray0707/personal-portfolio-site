'use client';

import React from 'react';
import { FaCheck } from 'react-icons/fa';

export type PlanItem = {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  priceINR: number;
  interval: 'MONTHLY' | 'YEARLY' | 'LIFETIME';
  features: string[];
};

interface PricingCardProps {
  plan: PlanItem;
  onSelect: (plan: PlanItem) => void;
  highlight?: boolean;
}

function formatPrice(paise: number): string {
  const rupees = paise / 100;
  return rupees === 0 ? 'Free' : `₹${rupees.toLocaleString('en-IN')}`;
}

function formatInterval(interval: PlanItem['interval']): string {
  switch (interval) {
    case 'MONTHLY':
      return '/month';
    case 'YEARLY':
      return '/year';
    case 'LIFETIME':
      return 'one-time';
    default:
      return '';
  }
}

export function PricingCard({ plan, onSelect, highlight = false }: PricingCardProps) {
  return (
    <div
      className={`flex flex-col rounded-3xl border p-6 shadow-lg shadow-slate-900/5 transition hover:-translate-y-1 ${
        highlight
          ? 'border-primary/40 bg-gradient-to-b from-primary/5 to-transparent dark:border-primary/50'
          : 'border-slate-200/80 bg-white/90 dark:border-slate-700/80 dark:bg-slate-950/80'
      }`}
    >
      {highlight ? (
        <span className="mb-4 inline-flex w-fit rounded-full bg-primary px-3 py-1 text-xs font-semibold text-white">
          Most popular
        </span>
      ) : (
        <span className="mb-4 h-6" aria-hidden="true" />
      )}

      <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{plan.name}</h3>
      <p className="mt-2 min-h-[2.5rem] text-sm leading-5 text-slate-500 dark:text-slate-400">
        {plan.description}
      </p>

      <div className="mt-6 flex items-baseline gap-1">
        <span className="text-3xl font-bold text-slate-900 dark:text-white">
          {formatPrice(plan.priceINR)}
        </span>
        <span className="text-sm text-slate-500 dark:text-slate-400">
          {formatInterval(plan.interval)}
        </span>
      </div>

      <ul className="mt-6 flex-1 space-y-3">
        {plan.features.map((feature) => (
          <li key={feature} className="flex items-start gap-3 text-sm text-slate-700 dark:text-slate-200">
            <FaCheck className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />
            <span>{feature}</span>
          </li>
        ))}
      </ul>

      <button
        type="button"
        onClick={() => onSelect(plan)}
        className={`mt-8 w-full rounded-full px-5 py-3 text-sm font-semibold transition ${
          highlight
            ? 'bg-primary text-white hover:bg-indigo-500'
            : 'border border-slate-900/10 bg-slate-950 text-white hover:bg-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800'
        }`}
      >
        {plan.priceINR === 0 ? 'Get started free' : 'Choose plan'}
      </button>
    </div>
  );
}
