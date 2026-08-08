import Link from 'next/link';
import { PortfolioTemplate } from '../../lib/templates';

interface TemplateCardProps {
  template: PortfolioTemplate;
}

export function TemplateCard({ template }: TemplateCardProps) {
  return (
    <div className="rounded-3xl border border-slate-200/80 bg-white/90 p-6 shadow-lg shadow-slate-900/5 transition hover:-translate-y-1 hover:shadow-xl sm:p-8 dark:border-slate-700/80 dark:bg-slate-950/80">
      <div className="mb-5 flex items-center justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">
            {template.category}
          </p>
          <h3 className="mt-3 text-xl font-semibold text-slate-900 dark:text-white sm:text-2xl">
            {template.name}
          </h3>
        </div>
        <div className="flex flex-wrap gap-2">
          {template.tags.slice(0, 2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      <p className="mb-5 text-sm leading-6 text-slate-600 dark:text-slate-300">
        {template.description}
      </p>

      <div className="mb-6 space-y-2">
        {template.highlights.map((highlight) => (
          <p key={highlight} className="text-sm text-slate-700 dark:text-slate-200">
            • {highlight}
          </p>
        ))}
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={`/templates/${template.slug}`}
          className="rounded-full border border-slate-900/10 bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:hover:bg-slate-800"
        >
          Preview
        </Link>
        <div className="flex flex-wrap gap-2">
          {template.tags.slice(2).map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700 dark:bg-slate-800 dark:text-slate-200"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
