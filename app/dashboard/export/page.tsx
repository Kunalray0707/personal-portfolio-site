'use client';

import React from 'react';
import ExportPanel from '../../../components/payments/ExportPanel';

export default function ExportPage() {
  return (
    <div className="space-y-6">
      <div>
        <p className="text-sm text-slate-500 dark:text-slate-400">Export & deployment</p>
        <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">Distribution hub</h1>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
          Download your portfolio as a standalone file, scaffold a Vercel or GitHub deployment, and attach a custom domain.
        </p>
      </div>
      <ExportPanel />
    </div>
  );
}
