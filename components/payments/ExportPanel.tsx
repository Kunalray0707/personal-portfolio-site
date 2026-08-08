'use client';

import React, { useEffect, useState } from 'react';
import {
  FaFileCode,
  FaFilePdf,
  FaFileArchive,
  FaFileDownload,
  FaRocket,
  FaGithub,
  FaGlobe,
  FaPlus,
  FaTrash,
  FaCheck,
} from 'react-icons/fa';

interface PortfolioItem {
  id: string;
  title: string;
  slug: string;
}

interface CustomDomainItem {
  id: string;
  domain: string;
  verified: boolean;
  portfolioId: string;
  portfolio?: { title: string; slug: string } | null;
}

async function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}

export default function ExportPanel() {
  const [portfolios, setPortfolios] = useState<PortfolioItem[]>([]);
  const [selectedId, setSelectedId] = useState('');
  const [domains, setDomains] = useState<CustomDomainItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');

  // Custom domain form
  const [domainPortfolioId, setDomainPortfolioId] = useState('');
  const [domainName, setDomainName] = useState('');
  const [verifyToken, setVerifyToken] = useState('');
  const [pendingToken, setPendingToken] = useState('');

  useEffect(() => {
    Promise.all([
      fetch('/api/portfolio/list', { cache: 'no-store' }).then((r) => r.json()),
      fetch('/api/domains/list', { cache: 'no-store' }).then((r) => r.json()),
    ])
      .then(([portfolioRes, domainRes]) => {
        setPortfolios(portfolioRes.portfolios || []);
        setDomains(domainRes.domains || []);
        if (portfolioRes.portfolios && portfolioRes.portfolios.length > 0) {
          setSelectedId(portfolioRes.portfolios[0].id);
          setDomainPortfolioId(portfolioRes.portfolios[0].id);
        }
      })
      .catch(() => setError('Unable to load portfolio data.'))
      .finally(() => setLoading(false));
  }, []);

  async function runExport(kind: 'html' | 'pdf' | 'zip' | 'json') {
    if (!selectedId) {
      setError('Select a portfolio first.');
      return;
    }
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch(`/api/export/${kind}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolioId: selectedId }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Export failed.');
      }
      const blob = await res.blob();
      const portfolio = portfolios.find((p) => p.id === selectedId);
      const base = (portfolio?.slug || 'portfolio');
      const ext = kind === 'pdf' ? 'pdf.html' : kind;
      await downloadBlob(blob, `${base}.${ext}`);
      setMessage(`Exported as ${kind.toUpperCase()}.`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Export failed.');
    } finally {
      setBusy(false);
    }
  }

  async function handleDeploy() {
    if (!selectedId) {
      setError('Select a portfolio first.');
      return;
    }
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch('/api/export/deploy', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolioId: selectedId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Deploy bundle failed.');
      setMessage(
        `Bundle ready (${data.fileCount} files). Project name: ${data.projectName}. ${data.readme}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Deploy bundle failed.');
    } finally {
      setBusy(false);
    }
  }

  async function handleGithub() {
    if (!selectedId) {
      setError('Select a portfolio first.');
      return;
    }
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch('/api/export/github', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolioId: selectedId }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'GitHub export failed.');
      const repo = data.repository?.repoName || 'portfolio';
      setMessage(
        `Repo "${repo}" ready. ${data.message}`
      );
    } catch (err) {
      setError(err instanceof Error ? err.message : 'GitHub export failed.');
    } finally {
      setBusy(false);
    }
  }

  async function addDomain() {
    if (!domainPortfolioId || !domainName.trim()) {
      setError('Provide a portfolio and domain.');
      return;
    }
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch('/api/domains/set', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ portfolioId: domainPortfolioId, domain: domainName.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to add domain.');
      setPendingToken(data.verificationToken || '');
      setDomains((current) => [data.customDomain, ...current]);
      setDomainName('');
      setMessage('Domain added. Add the TXT record below, then verify.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to add domain.');
    } finally {
      setBusy(false);
    }
  }

  async function verifyDomain(id: string) {
    if (!verifyToken.trim()) {
      setError('Enter the verification token.');
      return;
    }
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch('/api/domains/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customDomainId: id, token: verifyToken.trim() }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Verification failed.');
      setDomains((current) =>
        current.map((d) => (d.id === id ? { ...d, verified: true } : d))
      );
      setVerifyToken('');
      setPendingToken('');
      setMessage('Domain verified successfully.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Verification failed.');
    } finally {
      setBusy(false);
    }
  }

  async function removeDomain(id: string) {
    setBusy(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch('/api/domains/delete', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ customDomainId: id }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to remove domain.');
      setDomains((current) => current.filter((d) => d.id !== id));
      setMessage('Domain removed.');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to remove domain.');
    } finally {
      setBusy(false);
    }
  }

  if (loading) {
    return <div className="py-16 text-center text-slate-500 dark:text-slate-400">Loading export tools…</div>;
  }

  return (
    <div className="grid gap-6 xl:grid-cols-2">
      {/* Export downloads */}
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
        <div className="flex items-center gap-3">
          <FaFileDownload className="text-xl text-primary" />
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Download portfolio</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Export the selected portfolio as a standalone file.</p>
          </div>
        </div>

        <div className="mt-6">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300">Select portfolio</label>
          <select
            value={selectedId}
            onChange={(e) => {
              setSelectedId(e.target.value);
              setDomainPortfolioId(e.target.value);
            }}
            className="mt-2 w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {portfolios.length === 0 ? (
              <option value="">No portfolios yet</option>
            ) : (
              portfolios.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title} (/portfolio/{p.slug})
                </option>
              ))
            )}
          </select>
        </div>

        <div className="mt-6 grid grid-cols-2 gap-3">
          <button
            type="button"
            disabled={busy || !selectedId}
            onClick={() => runExport('html')}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            <FaFileCode className="w-4 h-4" /> HTML
          </button>
          <button
            type="button"
            disabled={busy || !selectedId}
            onClick={() => runExport('pdf')}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <FaFilePdf className="w-4 h-4" /> PDF
          </button>
          <button
            type="button"
            disabled={busy || !selectedId}
            onClick={() => runExport('zip')}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <FaFileArchive className="w-4 h-4" /> ZIP
          </button>
          <button
            type="button"
            disabled={busy || !selectedId}
            onClick={() => runExport('json')}
            className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            <FaFileCode className="w-4 h-4" /> JSON
          </button>
        </div>

        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <button
            type="button"
            disabled={busy || !selectedId}
            onClick={handleDeploy}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            <FaRocket className="w-4 h-4" /> Deploy bundle
          </button>
          <button
            type="button"
            disabled={busy || !selectedId}
            onClick={handleGithub}
            className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60 dark:bg-white dark:text-slate-900 dark:hover:bg-slate-200"
          >
            <FaGithub className="w-4 h-4" /> Export to GitHub
          </button>
        </div>
      </section>

      {/* Custom domains */}
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
        <div className="flex items-center gap-3">
          <FaGlobe className="text-xl text-primary" />
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Custom domains</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Attach a branded domain to your portfolio.</p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          <select
            value={domainPortfolioId}
            onChange={(e) => setDomainPortfolioId(e.target.value)}
            className="w-full rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
          >
            {portfolios.length === 0 ? (
              <option value="">No portfolios yet</option>
            ) : (
              portfolios.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.title}
                </option>
              ))
            )}
          </select>
          <div className="flex gap-2">
            <input
              value={domainName}
              onChange={(e) => setDomainName(e.target.value)}
              placeholder="example.com"
              className="flex-1 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100"
            />
            <button
              type="button"
              disabled={busy}
              onClick={addDomain}
              className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaPlus className="w-4 h-4" /> Add
            </button>
          </div>
        </div>

        {pendingToken && (
          <div className="mt-4 rounded-3xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-100">
            <p className="font-semibold">Add this TXT record</p>
            <p className="mt-2 break-all font-mono text-xs">_paip-challenge — {pendingToken}</p>
            <label className="mt-3 block text-xs font-medium text-amber-700 dark:text-amber-200">
              Verification token
            </label>
            <input
              value={verifyToken}
              onChange={(e) => setVerifyToken(e.target.value)}
              placeholder={pendingToken}
              className="mt-1 w-full rounded-2xl border border-amber-300 bg-white px-4 py-2 text-sm outline-none focus:border-amber-400 dark:border-amber-700 dark:bg-slate-900"
            />
            <button
              type="button"
              disabled={busy}
              onClick={() => verifyDomain(domains.find((d) => !d.verified)?.id || '')}
              className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-amber-600 px-4 py-2 text-sm font-semibold text-white transition hover:bg-amber-500 disabled:cursor-not-allowed disabled:opacity-60"
            >
              <FaCheck className="w-4 h-4" /> Verify
            </button>
          </div>
        )}

        <div className="mt-6 space-y-3">
          {domains.length === 0 ? (
            <div className="rounded-3xl bg-slate-50 p-4 text-center text-sm text-slate-500 dark:bg-slate-950/70 dark:text-slate-400">
              No custom domains yet.
            </div>
          ) : (
            domains.map((domain) => (
              <div key={domain.id} className="flex items-center justify-between gap-3 rounded-3xl border border-slate-200 bg-slate-50 p-4 dark:border-slate-800 dark:bg-slate-950/70">
                <div>
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">{domain.domain}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">
                    {domain.portfolio?.title || 'Portfolio'} •{' '}
                    {domain.verified ? (
                      <span className="text-emerald-600 dark:text-emerald-400">Verified</span>
                    ) : (
                      <span className="text-amber-600 dark:text-amber-400">Pending</span>
                    )}
                  </p>
                </div>
                <button
                  type="button"
                  disabled={busy}
                  onClick={() => removeDomain(domain.id)}
                  className="rounded-2xl border border-rose-200 bg-rose-50 p-2 text-rose-700 transition hover:bg-rose-100 dark:border-rose-900 dark:bg-rose-950/70 dark:text-rose-200"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      </section>

      {message && <div className="col-span-full rounded-3xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">{message}</div>}
      {error && <div className="col-span-full rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>}
    </div>
  );
}
