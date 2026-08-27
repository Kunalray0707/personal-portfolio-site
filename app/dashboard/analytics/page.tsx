'use client';
import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';
import Sidebar from '../../../components/dashboard/Sidebar';
import TopNav from '../../../components/dashboard/TopNav';

export default function AnalyticsPage() {
  const [user, setUser] = useState<{ name?: string | null; email?: string | null } | null>(null);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    fetch('/api/auth/me', { cache: 'no-store' })
      .then((r) => r.json())
      .then((d) => setUser(d.user))
      .catch(() => setUser(null));

    fetch('/api/analytics')
      .then((r) => r.json())
      .then((d) => setData(d))
      .finally(() => setLoading(false));
  }, []);

  const COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6'];

  if (loading) {
    return <div className="min-h-[60vh] flex items-center justify-center text-slate-500">Loading analytics...</div>;
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <div className="grid gap-6 xl:grid-cols-[300px_1fr]">
        <Sidebar isOpen={isMenuOpen} onClose={() => setIsMenuOpen(false)} />
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="space-y-6 pb-12">
          <TopNav user={user} onMenuToggle={() => setIsMenuOpen((open) => !open)} />

          <div className="px-6">
            <h1 className="text-2xl font-bold">Analytics Overview</h1>
            <p className="text-slate-500">Track your portfolio performance over the last 30 days.</p>
          </div>

          <section className="grid gap-6 md:grid-cols-2 px-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-medium text-slate-500">Total Views</h3>
              <p className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">{data?.totalViews || 0}</p>
            </div>
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-sm font-medium text-slate-500">Unique Visitors</h3>
              <p className="mt-2 text-4xl font-bold text-slate-900 dark:text-white">{data?.totalUnique || 0}</p>
            </div>
          </section>

          <section className="px-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-semibold mb-6">Traffic Over Time</h3>
              <div className="h-[300px] w-full">
                {data?.chartData?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data.chartData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#334155" opacity={0.2} />
                      <XAxis dataKey="date" stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <YAxis stroke="#64748b" fontSize={12} tickLine={false} axisLine={false} />
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Line type="monotone" dataKey="views" stroke="#6366f1" strokeWidth={3} dot={false} name="Views" />
                      <Line type="monotone" dataKey="visitors" stroke="#10b981" strokeWidth={3} dot={false} name="Unique Visitors" />
                    </LineChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400">No traffic data available.</div>
                )}
              </div>
            </div>
          </section>

          <section className="grid gap-6 md:grid-cols-2 px-6">
            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-semibold mb-6">Devices</h3>
              <div className="h-[250px] w-full">
                {data?.deviceChart?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={data.deviceChart} cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5} dataKey="value" nameKey="name">
                        {data.deviceChart.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                    </PieChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400">No device data available.</div>
                )}
              </div>
              {data?.deviceChart?.length > 0 && (
                <div className="flex justify-center gap-4 mt-4">
                  {data.deviceChart.map((d: any, i: number) => (
                    <div key={d.name} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }}></div>
                      <span className="text-sm capitalize text-slate-600 dark:text-slate-300">{d.name}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
              <h3 className="text-lg font-semibold mb-6">Top Referrers</h3>
              <div className="h-[250px] w-full">
                {data?.referrerChart?.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.referrerChart} layout="vertical" margin={{ left: 40 }}>
                      <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#334155" opacity={0.1} />
                      <XAxis type="number" hide />
                      <YAxis dataKey="name" type="category" axisLine={false} tickLine={false} stroke="#64748b" fontSize={12} width={100} />
                      <Tooltip cursor={{ fill: 'transparent' }} contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }} />
                      <Bar dataKey="value" fill="#6366f1" radius={[0, 4, 4, 0]} barSize={20} name="Visits" />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400">No referrer data available.</div>
                )}
              </div>
            </div>
          </section>

        </motion.div>
      </div>
    </div>
  );
}
