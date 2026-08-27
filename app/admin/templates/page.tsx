import React from 'react';
import { templates, templateCategories } from '../../../lib/templates';
import { Palette, Layers } from 'lucide-react';

export default function AdminTemplatesPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Templates Library</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          View all {templates.length} system templates available for users. (Read-only)
        </p>
      </div>

      <div className="flex flex-wrap gap-2 mb-6">
        <div className="px-3 py-1 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full text-xs font-medium">All</div>
        {templateCategories.map(cat => (
          <div key={cat} className="px-3 py-1 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 rounded-full text-xs font-medium">
            {cat}
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {templates.map((tpl) => (
          <div key={tpl.slug} className="group rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm hover:shadow-md transition">
            <div className={`h-32 flex items-center justify-center p-6 ${tpl.theme === 'dark' ? 'bg-slate-900 text-white' : 'bg-slate-100 text-slate-900'}`}>
              <div className="text-center">
                <p className="font-bold text-lg opacity-90">{tpl.name}</p>
                <p className="text-xs opacity-70 mt-1">{tpl.theme.toUpperCase()} THEME</p>
              </div>
            </div>
            <div className="p-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="inline-flex items-center gap-1 text-xs font-medium bg-primary/10 text-primary px-2 py-1 rounded-md">
                  <Palette className="w-3 h-3" />
                  {tpl.category}
                </span>
                <span className="inline-flex items-center gap-1 text-xs font-medium text-slate-500">
                  <Layers className="w-3 h-3" />
                  {tpl.sections.length} sections
                </span>
              </div>
              <p className="text-sm text-slate-600 dark:text-slate-400 line-clamp-2">
                {tpl.description}
              </p>
              <div className="flex flex-wrap gap-1">
                {tpl.tags.slice(0, 3).map(tag => (
                  <span key={tag} className="text-[10px] uppercase tracking-wider bg-slate-100 dark:bg-slate-800 text-slate-500 px-1.5 py-0.5 rounded">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
