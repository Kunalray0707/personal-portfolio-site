'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import type { PortfolioTemplate } from '../../lib/templates';

interface TemplateDetailProps {
  template: PortfolioTemplate;
}

export function TemplateDetail({ template }: TemplateDetailProps) {
  const router = useRouter();
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleUseTemplate() {
    setIsCreating(true);
    setError(null);

    try {
      const response = await fetch('/api/portfolio/create', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          title: `${template.name} Portfolio`,
          description: template.description,
          heroTitle: template.heroTitle,
          heroSubtitle: template.heroSubtitle,
          sections: template.sections,
        }),
      });

      if (response.status === 401) {
        router.push('/auth');
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData?.error || 'Unable to create portfolio from template.');
      }

      const data = await response.json();
      router.push(`/dashboard/portfolios/${data.portfolio.id}`);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setIsCreating(false);
    }
  }

  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8"
    >
      <section className="rounded-[2rem] border border-slate-200/80 bg-white/90 p-8 shadow-lg shadow-slate-900/5 dark:border-slate-700/80 dark:bg-slate-950/80">
        <div className="flex flex-col gap-6 xl:flex-row xl:items-center xl:justify-between">
          <div className="max-w-2xl">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
              {template.category}
            </p>
            <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
              {template.name}
            </h1>
            <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
              {template.heroSubtitle}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              {template.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row xl:justify-end mt-6 xl:mt-0">
            <button
              type="button"
              onClick={() => router.push(`/templates/${template.slug}/preview`)}
              className="inline-flex items-center justify-center rounded-full bg-slate-100 px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700"
            >
              Live Preview
            </button>
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 dark:bg-slate-900 dark:hover:bg-slate-800"
              onClick={handleUseTemplate}
              disabled={isCreating}
            >
              {isCreating ? 'Creating…' : 'Use this template'}
            </button>
            <button
              type="button"
              onClick={() => router.push('/templates')}
              className="inline-flex items-center justify-center rounded-full border border-slate-900/10 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition hover:bg-slate-50 dark:border-slate-700/80 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-900"
            >
              Back to Templates
            </button>
          </div>
        </div>

        {error ? (
          <div className="mt-6 rounded-3xl bg-rose-50 p-4 text-sm text-rose-700 dark:bg-rose-950/20 dark:text-rose-200">
            {error}
          </div>
        ) : null}
      </section>

      <section className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="space-y-6 rounded-[2rem] border border-slate-200/80 bg-white/90 p-8 shadow-lg shadow-slate-900/5 dark:border-slate-700/80 dark:bg-slate-950/80">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">Template overview</h2>
            <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">
              {template.description}
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-3xl bg-slate-100 p-5 dark:bg-slate-900">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Hero title</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{template.heroTitle}</p>
            </div>
            <div className="rounded-3xl bg-slate-100 p-5 dark:bg-slate-900">
              <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Hero subtitle</h3>
              <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{template.heroSubtitle}</p>
            </div>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-slate-900 dark:text-white">Highlights</h3>
            <ul className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              {template.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-3">
                  <span className="mt-1 h-2.5 w-2.5 rounded-full bg-slate-900 dark:bg-white" />
                  {highlight}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="space-y-6">
          {template.sections.map((section) => (
            <div key={section.id} className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-lg shadow-slate-900/5 dark:border-slate-700/80 dark:bg-slate-950/80">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{section.title}</h3>
              {section.body ? (
                <p className="mt-3 text-sm leading-6 text-slate-600 dark:text-slate-300">{section.body}</p>
              ) : null}
              {section.bullets ? (
                <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {section.bullets.map((item, index) => (
                    <li key={`${section.id}-item-${index}`} className="flex items-start gap-3">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-slate-900 dark:bg-white" />
                      {item}
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </section>
    </motion.div>
  );
}
