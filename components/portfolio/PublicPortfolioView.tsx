'use client';
import React, { useState } from 'react';
import PortfolioPreview from './PortfolioPreview';

type Section = {
  id: string;
  type: 'text' | 'feature' | 'contact';
  title: string;
  body?: string;
  bullets?: string[];
  imageUrl?: string;
};

type PublicPortfolio = {
  title: string;
  description: string;
  heroTitle: string;
  heroSubtitle: string;
  slug: string;
  isPrivate: boolean;
  content?: { sections: Section[] };
};

interface PublicPortfolioViewProps {
  portfolio: PublicPortfolio;
}

export default function PublicPortfolioView({ portfolio: initialPortfolio }: PublicPortfolioViewProps) {
  const [portfolio, setPortfolio] = useState<PublicPortfolio>(initialPortfolio);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [authenticated, setAuthenticated] = useState(!initialPortfolio.isPrivate);

  const handleUnlock = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/public/portfolio/${portfolio.slug}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });
      const data = await response.json();
      if (!response.ok) {
        setError(data.error || 'Unable to unlock portfolio.');
        return;
      }
      setPortfolio(data.portfolio);
      setAuthenticated(true);
    } catch {
      setError('Unable to unlock portfolio.');
    } finally {
      setLoading(false);
    }
  };

  if (portfolio.isPrivate && !authenticated) {
    return (
      <div className="rounded-[2rem] border border-slate-200 bg-white/90 p-10 shadow-sm dark:border-slate-800 dark:bg-slate-950/95">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Private portfolio</p>
          <h1 className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">{portfolio.title}</h1>
          <p className="mt-4 text-slate-600 dark:text-slate-300">This portfolio is protected by a password. Enter the password below to view the content.</p>

          <form onSubmit={handleUnlock} className="mt-8 space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Portfolio password</label>
              <input
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
              />
            </div>
            {error && <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>}
            <button type="submit" disabled={loading} className="inline-flex items-center rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60">
              {loading ? 'Unlocking…' : 'Unlock portfolio'}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return <PortfolioPreview portfolio={{ ...portfolio, sections: portfolio.content?.sections ?? [] }} />;
}
