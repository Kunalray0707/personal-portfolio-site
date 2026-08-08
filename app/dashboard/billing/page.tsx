'use client';

import React, { useState } from 'react';
import Sidebar from '../../../components/dashboard/Sidebar';
import TopNav from '../../../components/dashboard/TopNav';
import { BillingContent } from '../../../components/payments/BillingContent';

export default function BillingPage() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [user, setUser] = React.useState<{
    name?: string | null;
    email?: string | null;
  } | null>(null);

  React.useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => setUser(null));
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 dark:bg-slate-950 dark:text-slate-100">
      <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
        <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <div className="space-y-6">
          <TopNav user={user} onMenuToggle={() => setIsMenuOpen((open) => !open)} />
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Billing</p>
            <h1 className="text-3xl font-semibold text-slate-900 dark:text-white">
              Manage your subscription
            </h1>
          </div>
          <BillingContent />
        </div>
      </div>
    </div>
  );
}
