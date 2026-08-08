'use client';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaPlus, FaEdit, FaTrash, FaEye } from 'react-icons/fa';

interface PortfolioSummary {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  isPrivate: boolean;
  updatedAt: string;
  createdAt: string;
}

export default function PortfolioLibraryPage() {
  const [portfolios, setPortfolios] = useState<PortfolioSummary[]>([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const router = useRouter();

  useEffect(() => {
    fetch('/api/portfolio/list', { cache: 'no-store' })
      .then((res) => res.json())
      .then((data) => {
        if (data.portfolios) setPortfolios(data.portfolios);
        else setError(data.error || 'Unable to load portfolios.');
      })
      .catch(() => setError('Unable to load portfolios.'))
      .finally(() => setLoading(false));
  }, []);

  async function handleCreate() {
    setMessage('Creating portfolio…');
    const response = await fetch('/api/portfolio/create', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'Untitled portfolio' })
    });

    const data = await response.json();
    if (!response.ok) {
      setError(data.error || 'Could not create portfolio.');
      setMessage('');
      return;
    }

    router.push(`/dashboard/portfolios/${data.portfolio.id}`);
  }

  async function handleDelete(id: string) {
    if (!window.confirm('Delete this portfolio? This action cannot be undone.')) return;
    const response = await fetch(`/api/portfolio/${id}`, { method: 'DELETE' });
    const data = await response.json();
    if (!response.ok) {
      setError(data.error || 'Unable to delete portfolio.');
      return;
    }
    setPortfolios((current) => current.filter((item) => item.id !== id));
    setMessage('Portfolio deleted.');
  }

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-slate-500 dark:text-slate-300">Loading portfolios…</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Portfolio builder</p>
          <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Your portfolio collection</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <button onClick={handleCreate} className="inline-flex items-center gap-2 rounded-2xl bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500">
            <FaPlus className="w-4 h-4" /> Create new portfolio
          </button>
          <button onClick={() => router.push('/templates')} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
            Browse templates
          </button>
        </div>
      </div>

      {message && <div className="rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}
      {error && <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}

      {portfolios.length === 0 ? (
        <div className="rounded-3xl border border-slate-200 bg-white/90 dark:border-slate-800 dark:bg-slate-950/80 p-10 text-center">
          <p className="text-lg font-semibold text-slate-900 dark:text-slate-100">No portfolios yet</p>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">Start creating your first portfolio and publish it with a private or public URL.</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {portfolios.map((portfolio) => (
            <div key={portfolio.id} className="rounded-3xl border border-slate-200 bg-white/90 dark:border-slate-800 dark:bg-slate-950/80 p-5 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-lg font-semibold text-slate-900 dark:text-white">{portfolio.title}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{portfolio.published ? 'Published' : 'Draft'} • {portfolio.isPrivate ? 'Private URL' : 'Public URL'}</p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={() => router.push(`/dashboard/portfolios/${portfolio.id}`)} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                    <FaEdit className="w-4 h-4" /> Edit
                  </button>
                  <a href={`/portfolio/${portfolio.slug}`} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800">
                    <FaEye className="w-4 h-4" /> Preview
                  </a>
                  <button type="button" onClick={() => handleDelete(portfolio.id)} className="inline-flex items-center gap-2 rounded-2xl border border-rose-200 bg-rose-50 px-4 py-2 text-sm text-rose-700 transition hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/70 dark:text-rose-200">
                    <FaTrash className="w-4 h-4" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
