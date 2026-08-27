'use client';
import React, { useEffect, useState } from 'react';
import { Users, LayoutTemplate, CreditCard, DollarSign } from 'lucide-react';
import { motion } from 'framer-motion';

type Stats = {
  totalUsers: number;
  totalPortfolios: number;
  activeSubscriptions: number;
  totalRevenue: number;
};

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetch('/api/admin/stats')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch stats');
        return res.json();
      })
      .then((data) => {
        setStats(data);
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return <div className="text-slate-500">Loading admin stats...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  const cards = [
    { label: 'Total Users', value: stats?.totalUsers || 0, icon: Users, color: 'text-blue-500', bg: 'bg-blue-500/10' },
    { label: 'Total Portfolios', value: stats?.totalPortfolios || 0, icon: LayoutTemplate, color: 'text-indigo-500', bg: 'bg-indigo-500/10' },
    { label: 'Active Subscriptions', value: stats?.activeSubscriptions || 0, icon: CreditCard, color: 'text-green-500', bg: 'bg-green-500/10' },
    { label: 'Total Revenue (INR)', value: `₹${(stats?.totalRevenue || 0).toLocaleString()}`, icon: DollarSign, color: 'text-emerald-500', bg: 'bg-emerald-500/10' },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Admin Dashboard</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">
          Overview of platform activity and revenue.
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {cards.map((card, idx) => (
          <motion.div
            key={card.label}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1, duration: 0.4 }}
            className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-center gap-4">
              <div className={`p-3 rounded-xl ${card.bg}`}>
                <card.icon className={`w-6 h-6 ${card.color}`} />
              </div>
              <div>
                <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{card.label}</p>
                <p className="text-2xl font-semibold text-slate-900 dark:text-white mt-1">{card.value}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2 mt-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h3 className="font-semibold text-slate-900 dark:text-white mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <a href="/admin/users" className="block p-4 rounded-xl border border-slate-100 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 transition">
              <p className="font-medium text-slate-900 dark:text-white">Manage Users</p>
              <p className="text-sm text-slate-500 mt-1">Review accounts and change roles</p>
            </a>
            <a href="/admin/announcements" className="block p-4 rounded-xl border border-slate-100 hover:border-slate-300 dark:border-slate-800 dark:hover:border-slate-700 transition">
              <p className="font-medium text-slate-900 dark:text-white">Broadcast Announcement</p>
              <p className="text-sm text-slate-500 mt-1">Create a system-wide alert for all users</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
