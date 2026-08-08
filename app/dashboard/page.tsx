'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import Sidebar from '../../components/dashboard/Sidebar';
import TopNav from '../../components/dashboard/TopNav';
import AnalyticsCard from '../../components/dashboard/AnalyticsCard';
import ChartPanel from '../../components/dashboard/ChartPanel';
import RecentActivity from '../../components/dashboard/RecentActivity';
import ProfileCard from '../../components/dashboard/ProfileCard';

const overviewCards = [
  { title: 'Portfolio views', value: '28.4k', change: '+12.4%', description: 'Last 7 days of profile traffic across public portfolios.' },
  { title: 'New leads', value: '530', change: '+9.8%', description: 'Contact requests and booking hits from your portfolio CTA.' },
  { title: 'Conversions', value: '82', change: '+4.2%', description: 'Premium subscriptions and inquiries from visitors.' },
  { title: 'Active templates', value: '14', change: '+3', description: 'Live premium templates currently in use.' }
];

const trafficData = [38, 52, 45, 62, 71, 84, 96];
const engagementData = [12, 18, 22, 28, 34, 38, 46];
const recentActivity = [
  { title: 'New project uploaded', description: 'A new portfolio project sample was added to your showcase.', time: '2 min ago' },
  { title: 'Lead captured', description: 'A client expressed interest through your contact form.', time: '28 min ago' },
  { title: 'Template updated', description: 'Your main template was refreshed with new hero styles.', time: '1 hr ago' },
  { title: 'Password updated', description: 'Security settings were reviewed successfully.', time: '3 hr ago' }
];

const settingsItems = [
  { label: 'Plan', value: 'Pro', detail: 'Unlimited portfolios and premium support' },
  { label: 'Team members', value: '12', detail: 'Active collaborators in your workspace' },
  { label: 'Storage used', value: '18.2 GB', detail: 'Portfolio assets and media storage' }
];

const notifications = [
  { label: 'New subscriber', message: 'A visitor subscribed to your premium portfolio updates.', time: '5 min ago' },
  { label: 'Payment received', message: 'A new payment was successfully processed.', time: '1 hr ago' },
  { label: 'Template ready', message: 'Your published portfolio template is now live.', time: '2 hr ago' }
];

export default function DashboardPage() {
  const [user, setUser] = useState<{ name?: string | null; email?: string | null } | null>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => setUser(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-slate-500 dark:text-slate-300">Loading dashboard…</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
        <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6">
          <TopNav user={user} onMenuToggle={() => setIsMenuOpen((open) => !open)} />

          <section className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
            {overviewCards.map((card) => (
              <AnalyticsCard key={card.title} title={card.title} value={card.value} change={card.change} description={card.description} />
            ))}
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
            <div className="grid gap-6">
              <ChartPanel title="Traffic growth" subtitle="Portfolio visitors" data={trafficData} />
              <ChartPanel title="Engagement" subtitle="CTA interactions" data={engagementData} />
            </div>
            <div className="grid gap-6">
              <ProfileCard name={user?.name} email={user?.email} />
              <RecentActivity items={recentActivity} />
            </div>
          </section>

          <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900/80">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Portfolio builder</p>
                <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Create and manage your live portfolio pages</h2>
              </div>
              <a href="/dashboard/portfolios" className="inline-flex items-center gap-2 rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500">
                Open builder
              </a>
            </div>
            <p className="mt-4 text-sm text-slate-500 dark:text-slate-400">Build, publish, and update portfolio content with version history, live preview, and password protection.</p>
          </section>

          <section className="grid gap-6 xl:grid-cols-[1.4fr_0.8fr]">
            <div id="workspace-settings" className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 p-6 shadow-sm">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Workspace settings</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Manage billing, team, and portfolio preferences</h2>
                </div>
                <a href="#workspace-settings" className="rounded-2xl bg-primary px-4 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500">View settings</a>
              </div>
              <div className="mt-8 grid gap-4 sm:grid-cols-3">
                {settingsItems.map((item) => (
                  <div key={item.label} className="rounded-3xl bg-slate-50 dark:bg-slate-950/80 p-4">
                    <p className="text-sm text-slate-500 dark:text-slate-400">{item.label}</p>
                    <p className="mt-3 text-xl font-semibold text-slate-900 dark:text-white">{item.value}</p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{item.detail}</p>
                  </div>
                ))}
              </div>
            </div>
            <div id="notifications" className="rounded-3xl border border-slate-200 dark:border-slate-800 bg-white/90 dark:bg-slate-900/80 p-6 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <p className="text-sm font-medium text-slate-500 dark:text-slate-400">Notifications</p>
                  <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">Recent system updates</h2>
                </div>
                <span className="rounded-2xl bg-slate-100 px-3 py-2 text-sm text-slate-700 dark:bg-slate-800 dark:text-slate-300">3 new</span>
              </div>
              <div className="mt-6 space-y-4">
                {notifications.map((notification) => (
                  <div key={notification.label} className="rounded-3xl bg-slate-50 dark:bg-slate-950/80 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="font-semibold text-slate-900 dark:text-white">{notification.label}</p>
                      <span className="text-xs text-slate-400">{notification.time}</span>
                    </div>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{notification.message}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </motion.div>
      </div>
    </div>
  );
}
