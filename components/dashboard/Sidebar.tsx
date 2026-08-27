'use client';
import React from 'react';
import Link from 'next/link';
import { FaHome, FaChartLine, FaBell, FaRegChartBar, FaCog, FaTimes, FaCreditCard, FaFileExport } from 'react-icons/fa';

const links = [
  { label: 'Overview', href: '/dashboard', icon: FaHome },
  { label: 'Analytics', href: '/dashboard/analytics', icon: FaChartLine },
  { label: 'Activity', href: '/dashboard', icon: FaRegChartBar },
  { label: 'Notifications', href: '/dashboard', icon: FaBell },
  { label: 'Billing', href: '/dashboard/billing', icon: FaCreditCard },
  { label: 'Export', href: '/dashboard/export', icon: FaFileExport },
  { label: 'Settings', href: '/dashboard', icon: FaCog }
];

interface SidebarProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function Sidebar({ isOpen = false, onClose }: SidebarProps) {
  return (
    <>
      <div
        className={`fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm transition-opacity duration-300 xl:hidden ${isOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
        onClick={onClose}
        aria-hidden={!isOpen}
      />
      <aside className={`fixed inset-y-0 left-0 z-50 w-72 max-w-full overflow-y-auto border-r border-slate-200 bg-white/95 dark:border-slate-800 dark:bg-slate-950/95 p-6 shadow-2xl transition-transform duration-300 xl:static xl:translate-x-0 xl:w-72 xl:border-none xl:shadow-none ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex items-center justify-between mb-8 xl:hidden">
          <div>
            <div className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Dashboard</div>
            <p className="mt-2 text-lg font-semibold">Quick menu</p>
          </div>
          {onClose ? (
            <button type="button" onClick={onClose} className="rounded-full border border-slate-200 p-2 text-slate-700 dark:border-slate-700 dark:text-slate-200">
              <FaTimes className="w-4 h-4" />
            </button>
          ) : null}
        </div>
        <div className="hidden xl:block mb-8">
          <div className="text-xs uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">Dashboard</div>
          <p className="mt-3 text-lg font-semibold">Workspace overview</p>
        </div>
        <nav className="space-y-2">
          {links.map((item) => {
            const Icon = item.icon;
            return (
              <Link key={item.label} href={item.href} className="flex items-center gap-3 rounded-2xl px-4 py-3 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </aside>
    </>
  );
}
