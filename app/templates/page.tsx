'use client';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { templates, templateCategories } from '../../lib/templates';
import { TemplateCard } from '../../components/templates/TemplateCard';

export default function TemplatesPage() {
  return (
    <main className="container mx-auto px-6 py-10 sm:px-8 lg:px-10">
      <section className="mb-12 rounded-[2rem] border border-slate-200/80 bg-white/90 p-8 shadow-lg shadow-slate-900/5 dark:border-slate-700/80 dark:bg-slate-950/80">
        <div className="max-w-4xl">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500 dark:text-slate-400">
            Premium templates
          </p>
          <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 dark:text-white sm:text-5xl">
            Create your portfolio faster with professionally crafted templates.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-7 text-slate-600 dark:text-slate-300">
            Browse 25 premium portfolio templates designed for developers, designers, entrepreneurs, and creative professionals. Select a template and make it your own instantly.
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            {templateCategories.map((category) => (
              <Link
                key={category}
                href={`#${category.toLowerCase()}`}
                className="rounded-full border border-slate-200 bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-200 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
              >
                {category}
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-8">
        {templateCategories.map((category) => (
          <div key={category} id={category.toLowerCase()} className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <div>
                <h2 className="text-2xl font-semibold text-slate-950 dark:text-white">{category}</h2>
                <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">
                  {templates.filter((template) => template.category === category).length} templates in {category.toLowerCase()}.
                </p>
              </div>
              <Link
                href="/templates"
                className="text-sm font-semibold text-slate-900 underline decoration-slate-400 underline-offset-4 dark:text-white"
              >
                View all
              </Link>
            </div>
            <div className="grid gap-6 lg:grid-cols-2 xl:grid-cols-3">
              {templates
                .filter((template) => template.category === category)
                .map((template, index) => (
                  <motion.div
                    key={template.slug}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: "-50px" }}
                    transition={{ delay: index * 0.1 }}
                  >
                    <TemplateCard template={template} />
                  </motion.div>
                ))}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
