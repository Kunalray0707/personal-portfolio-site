'use client';
import React, { useEffect, useState } from 'react';
import { Plus, Tag, Trash2, Power } from 'lucide-react';
import { useToast } from '../../../components/ui/toast';

type Coupon = {
  id: string;
  code: string;
  discountPercent: number;
  maxUses: number | null;
  usedCount: number;
  expiresAt: string | null;
  active: boolean;
  createdAt: string;
};

export default function AdminCouponsPage() {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ code: '', discountPercent: 10, maxUses: '', expiresAt: '' });

  const fetchCoupons = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/coupons');
      if (!res.ok) throw new Error('Failed to fetch coupons');
      const data = await res.json();
      setCoupons(data.coupons || []);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        maxUses: formData.maxUses ? parseInt(formData.maxUses) : null,
        expiresAt: formData.expiresAt ? new Date(formData.expiresAt).toISOString() : null
      };

      const res = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create coupon');
      }
      toast({ title: 'Success', description: `Coupon created successfully.` });
      setIsModalOpen(false);
      setFormData({ code: '', discountPercent: 10, maxUses: '', expiresAt: '' });
      fetchCoupons();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'error' });
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentStatus })
      });
      if (!res.ok) throw new Error('Failed to update coupon status');
      fetchCoupons();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this coupon?')) return;
    try {
      const res = await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete coupon');
      toast({ title: 'Success', description: 'Coupon deleted.' });
      fetchCoupons();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'error' });
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Coupons</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Create discount codes for plans and portfolios.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition"
        >
          <Plus className="w-4 h-4" />
          Create Coupon
        </button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {loading ? (
          <div className="col-span-full py-8 text-center text-slate-500">Loading coupons...</div>
        ) : coupons.length === 0 ? (
          <div className="col-span-full py-8 text-center text-slate-500">No active coupons found.</div>
        ) : (
          coupons.map((coupon) => (
            <div key={coupon.id} className="relative rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-6 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-start justify-between">
                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-mono font-bold tracking-wider text-sm border border-slate-200 dark:border-slate-700">
                    <Tag className="w-3.5 h-3.5 text-slate-400" />
                    {coupon.code}
                  </div>
                  <button onClick={() => toggleStatus(coupon.id, coupon.active)} className={`p-1.5 rounded-full ${coupon.active ? 'text-emerald-500 hover:bg-emerald-50 dark:hover:bg-emerald-500/10' : 'text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'}`} title={coupon.active ? 'Deactivate' : 'Activate'}>
                    <Power className="w-4 h-4" />
                  </button>
                </div>
                <div className="mt-4">
                  <p className="text-3xl font-bold text-slate-900 dark:text-white">{coupon.discountPercent}% OFF</p>
                </div>
                <div className="mt-4 space-y-1.5 text-sm text-slate-500 dark:text-slate-400">
                  <p>Uses: <span className="font-medium text-slate-700 dark:text-slate-300">{coupon.usedCount}</span> / {coupon.maxUses || '∞'}</p>
                  <p>Expires: <span className="font-medium text-slate-700 dark:text-slate-300">{coupon.expiresAt ? new Date(coupon.expiresAt).toLocaleDateString() : 'Never'}</span></p>
                </div>
              </div>
              <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-800 flex justify-end">
                <button onClick={() => handleDelete(coupon.id)} className="text-xs font-medium text-red-500 hover:underline">
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-sm border border-slate-200 dark:border-slate-800 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">New Coupon</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Coupon Code</label>
                <input required type="text" value={formData.code} onChange={e => setFormData({...formData, code: e.target.value.toUpperCase()})} placeholder="e.g. SUMMER20" className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:border-primary uppercase font-mono" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Discount %</label>
                <input required type="number" min="1" max="100" value={formData.discountPercent} onChange={e => setFormData({...formData, discountPercent: parseInt(e.target.value)})} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Max Uses (optional)</label>
                <input type="number" min="1" value={formData.maxUses} onChange={e => setFormData({...formData, maxUses: e.target.value})} placeholder="Unlimited if blank" className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Expiry Date (optional)</label>
                <input type="date" value={formData.expiresAt} onChange={e => setFormData({...formData, expiresAt: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:border-primary" />
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
