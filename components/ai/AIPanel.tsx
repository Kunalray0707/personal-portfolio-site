'use client';

import React, { useState } from 'react';

interface Section {
  id: string;
  type: 'text' | 'feature' | 'contact';
  title: string;
  body?: string;
  bullets?: string[];
  imageUrl?: string;
}

interface AIPanelProps {
  draftTitle: string;
  draftHeroTitle: string;
  draftHeroSubtitle: string;
  draftDescription: string;
  draftSections: Section[];
  applyAbout: (text: string) => void;
  applyResumeSummary: (text: string) => void;
  applySkills?: (skills: { primary?: string[]; secondary?: string[] } | { raw: string }) => void;
}

export default function AIPanel({ draftTitle, draftHeroTitle, draftHeroSubtitle, draftDescription, draftSections, applyAbout, applyResumeSummary, applySkills }: AIPanelProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resultPreview, setResultPreview] = useState('');

  async function onGenerateAbout() {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/ai/about', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: draftTitle, heroTitle: draftHeroTitle, heroSubtitle: draftHeroSubtitle, description: draftDescription, sections: draftSections })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI generation failed');
      setResultPreview(data.about);
      applyAbout(data.about);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'Failed to generate about');
    } finally {
      setLoading(false);
    }
  }

  async function onGenerateResumeSummary() {
    setLoading(true);
    setError('');
    try {
      const resumeText = draftDescription || draftSections.map((s) => s.title + '\n' + (s.body || '')).join('\n');
      const res = await fetch('/api/ai/resume-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ resumeText })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI generation failed');
      setResultPreview(data.summary);
      applyResumeSummary(data.summary);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'Failed to generate resume summary');
    } finally {
      setLoading(false);
    }
  }

  async function onSuggestSkills() {
    setLoading(true);
    setError('');
    try {
      const content = draftSections.map((s) => s.title + ' ' + (s.body || '') + ' ' + (s.bullets || []).join(' ')).join('\n');
      const res = await fetch('/api/ai/skills', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ projectsOrBio: content })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'AI suggestion failed');
      setResultPreview(JSON.stringify(data.skills, null, 2));
      if (applySkills) applySkills(data.skills);
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      setError(message || 'Failed to suggest skills');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <h3 className="text-lg font-semibold text-slate-900 dark:text-white">AI tools</h3>
      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Generate content with AI and insert into your portfolio.</p>

      <div className="mt-4 flex flex-col gap-3">
        <button onClick={onGenerateAbout} disabled={loading} className="w-full rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white">
          {loading ? 'Generating…' : 'AI About generator'}
        </button>
        <button onClick={onGenerateResumeSummary} disabled={loading} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
          AI Resume summary
        </button>
        <button onClick={onSuggestSkills} disabled={loading} className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700">
          AI Skills suggestion
        </button>
      </div>

      {error && <div className="mt-4 rounded-2xl bg-rose-50 p-3 text-sm text-rose-700">{error}</div>}

      {resultPreview && (
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white p-3 text-sm dark:border-slate-800 dark:bg-slate-950/80">
          <pre className="whitespace-pre-wrap">{resultPreview}</pre>
        </div>
      )}
    </div>
  );
}
