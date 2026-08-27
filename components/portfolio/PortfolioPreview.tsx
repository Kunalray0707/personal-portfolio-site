'use client';
import Image from 'next/image';
import React from 'react';
import { motion } from 'framer-motion';

type Section = {
  id: string;
  type: 'text' | 'feature' | 'contact';
  title: string;
  body?: string;
  bullets?: string[];
  imageUrl?: string;
};

type PortfolioPreviewProps = {
  portfolio: {
    title: string;
    description: string;
    heroTitle: string;
    heroSubtitle: string;
    isPrivate: boolean;
    slug: string;
    sections: Section[];
  };
};

export default function PortfolioPreview({ portfolio }: PortfolioPreviewProps) {
  return (
    <div className="space-y-8">
      <motion.section 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[2rem] border border-slate-200 bg-gradient-to-b from-slate-100 to-white p-8 shadow-sm dark:border-slate-800 dark:from-slate-900 dark:to-slate-950 dark:bg-slate-950/70"
      >
        <div className="max-w-3xl">
          <span className="inline-flex rounded-full bg-primary/10 px-3 py-1 text-sm font-semibold text-primary">Portfolio preview</span>
          <h1 className="mt-6 text-3xl font-semibold text-slate-900 dark:text-white">{portfolio.heroTitle}</h1>
          <p className="mt-4 text-slate-600 dark:text-slate-300">{portfolio.heroSubtitle}</p>
          <div className="mt-6 flex flex-wrap gap-3 text-sm text-slate-500 dark:text-slate-400">
            <span>{portfolio.isPrivate ? 'Private showcase' : 'Public showcase'}</span>
            <span className="inline-flex h-1.5 w-1.5 rounded-full bg-slate-400" aria-hidden="true" />
            <span>slug: /portfolio/{portfolio.slug}</span>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-6">
        {portfolio.sections.length === 0 ? (
          <div className="rounded-3xl border border-slate-200 bg-slate-50 p-8 text-slate-600 dark:border-slate-800 dark:bg-slate-950/70 dark:text-slate-300">No sections configured yet.</div>
        ) : (
          portfolio.sections.map((section, index) => (
            <motion.article 
              key={section.id} 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: Math.min(index * 0.1, 0.5) }}
              className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/80"
            >
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">{section.type}</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">{section.title}</h2>
                </div>
                {section.type === 'feature' && section.imageUrl ? (
                  <div className="relative h-16 w-16 overflow-hidden rounded-3xl">
                    <Image src={section.imageUrl} alt={section.title} fill className="object-cover" unoptimized />
                  </div>
                ) : null}
              </div>
              {section.bullets && section.bullets.length > 0 ? (
                <ul className="mt-4 space-y-2 text-sm text-slate-600 dark:text-slate-300">
                  {section.bullets.map((bullet, index) => (
                    <li key={`${section.id}-bullet-${index}`} className="flex items-start gap-3">
                      <span className="mt-1 h-2.5 w-2.5 rounded-full bg-slate-900 dark:bg-white" />
                      <span>{bullet}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">{section.body || 'Add engaging content for this section.'}</p>
              )}
            </motion.article>
          ))
        )}
      </section>
    </div>
  );
}
