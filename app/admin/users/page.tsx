'use client';
import React, { useEffect, useState } from 'react';
import { Search, MoreVertical, Shield, Trash2, User as UserIcon } from 'lucide-react';
import { useToast } from '../../../components/ui/toast';
import { motion } from 'framer-motion';

type User = {
  id: string;
  name: string | null;
  email: string | null;
  role: string;
  createdAt: string;
  _count: {
    portfolios: number;
    subscriptions: number;
  };
};

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const { toast } = useToast();

  const fetchUsers = async (query = '') => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/users${query ? `?search=${encodeURIComponent(query)}` : ''}`);
      if (!res.ok) throw new Error('Failed to fetch users');
      const data = await res.json();
      setUsers(data.users || []);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchUsers(search);
  };

  const updateRole = async (userId: string, newRole: string) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole })
      });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to update role');
      }
      toast({ title: 'Success', description: 'User role updated.' });
      fetchUsers(search);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'error' });
    }
  };

  const deleteUser = async (userId: string) => {
    if (!window.confirm('Are you sure you want to delete this user? This action cannot be undone.')) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'DELETE' });
      if (!res.ok) {
        const error = await res.json();
        throw new Error(error.error || 'Failed to delete user');
      }
      toast({ title: 'Success', description: 'User deleted.' });
      fetchUsers(search);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'error' });
    }
  };

  return (
    <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Users</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage user accounts and roles.</p>
        </div>
        <form onSubmit={handleSearch} className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search users..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 pr-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-primary dark:text-white"
          />
        </form>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Role</th>
                <th className="px-6 py-4 font-medium">Portfolios</th>
                <th className="px-6 py-4 font-medium">Joined</th>
                <th className="px-6 py-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">Loading users...</td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-8 text-center text-slate-500">No users found.</td>
                </tr>
              ) : (
                users.map((user, idx) => (
                  <motion.tr 
                    key={user.id} 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: idx * 0.05 }}
                    className="hover:bg-slate-50 dark:hover:bg-slate-950/30 transition"
                  >
                    <td className="px-6 py-4 flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-slate-200 dark:bg-slate-700 flex items-center justify-center">
                        <UserIcon className="w-4 h-4 text-slate-500 dark:text-slate-400" />
                      </div>
                      <div>
                        <p className="font-medium text-slate-900 dark:text-white">{user.name || 'Anonymous'}</p>
                        <p className="text-xs text-slate-500">{user.email}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        user.role === 'ADMIN' 
                          ? 'bg-primary/10 text-primary' 
                          : 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                      }`}>
                        {user.role === 'ADMIN' && <Shield className="w-3 h-3" />}
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4">{user._count.portfolios}</td>
                    <td className="px-6 py-4">{new Date(user.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {user.role === 'USER' ? (
                          <button
                            onClick={() => updateRole(user.id, 'ADMIN')}
                            className="text-xs font-medium text-primary hover:underline"
                          >
                            Make Admin
                          </button>
                        ) : (
                          <button
                            onClick={() => updateRole(user.id, 'USER')}
                            className="text-xs font-medium text-slate-500 hover:underline"
                          >
                            Remove Admin
                          </button>
                        )}
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="p-1.5 text-slate-400 hover:text-red-500 rounded-md hover:bg-red-50 dark:hover:bg-red-500/10 transition"
                          title="Delete user"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </motion.div>
  );
}
