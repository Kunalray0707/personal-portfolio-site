import React from 'react';
import Link from 'next/link';
import { LayoutDashboard, Users, CreditCard, LayoutTemplate, FileText, Ticket, Settings, Megaphone, Tag } from 'lucide-react';
import { headers } from 'next/headers';
import { prisma } from '../../lib/prismadb';

const adminNavItems = [
  { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/admin/users', label: 'Users', icon: Users },
  { href: '/admin/payments', label: 'Payments', icon: CreditCard },
  { href: '/admin/templates', label: 'Templates', icon: LayoutTemplate },
  { href: '/admin/blogs', label: 'Blogs', icon: FileText },
  { href: '/admin/coupons', label: 'Coupons', icon: Tag },
  { href: '/admin/support', label: 'Support', icon: Ticket },
  { href: '/admin/announcements', label: 'Announcements', icon: Megaphone },
  { href: '/admin/settings', label: 'Settings', icon: Settings },
];

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const headersList = headers();
  const userId = headersList.get('x-user-id');
  
  let user = null;
  if (userId) {
    user = await prisma.user.findUnique({
      where: { id: userId },
      select: { name: true, email: true, role: true }
    });
  }

  return (
    <div className="flex min-h-screen flex-col md:flex-row bg-slate-50 dark:bg-slate-950">
      {/* Sidebar */}
      <aside className="w-full md:w-64 flex-shrink-0 border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm md:min-h-screen">
        <div className="p-6 border-b border-slate-200 dark:border-slate-800">
          <Link href="/admin" className="flex items-center gap-2">
            <div className="h-8 w-8 rounded bg-primary flex items-center justify-center text-white font-bold">A</div>
            <span className="font-semibold text-lg text-slate-900 dark:text-white">Admin Pro</span>
          </Link>
        </div>
        <nav className="p-4 space-y-1">
          {adminNavItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-md text-slate-700 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white transition-colors"
            >
              <item.icon className="w-4 h-4" />
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between px-6 shadow-sm sticky top-0 z-10">
          <h1 className="text-xl font-semibold text-slate-900 dark:text-white hidden md:block">
            Management Panel
          </h1>
          <div className="flex items-center gap-4 ml-auto">
            <div className="text-sm text-right hidden sm:block">
              <p className="font-medium text-slate-900 dark:text-white">{user?.name || 'Admin'}</p>
              <p className="text-slate-500 dark:text-slate-400 text-xs">{user?.email}</p>
            </div>
            <div className="h-9 w-9 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center overflow-hidden border border-slate-300 dark:border-slate-600">
              <span className="text-slate-600 dark:text-slate-300 text-sm font-semibold">
                {(user?.name?.[0] || 'A').toUpperCase()}
              </span>
            </div>
            <a href="/dashboard" className="text-sm font-medium text-primary hover:underline ml-4">
              Exit Admin
            </a>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
