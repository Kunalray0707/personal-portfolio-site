'use client';
import React, { useEffect, useState } from 'react';
import { Plus, Megaphone, Trash2, Power, Info, AlertTriangle, CheckCircle2 } from 'lucide-react';
import { useToast } from '../../../components/ui/toast';

type Announcement = {
  id: string;
  title: string;
  content: string;
  type: string;
  active: boolean;
  createdAt: string;
};

export default function AdminAnnouncementsPage() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: '', content: '', type: 'INFO', active: true });

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/announcements');
      if (!res.ok) throw new Error('Failed to fetch announcements');
      const data = await res.json();
      setAnnouncements(data.announcements || []);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/announcements', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || 'Failed to create announcement');
      }
      toast({ title: 'Success', description: `Announcement created successfully.` });
      setIsModalOpen(false);
      setFormData({ title: '', content: '', type: 'INFO', active: true });
      fetchAnnouncements();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'error' });
    }
  };

  const toggleStatus = async (id: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/announcements/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ active: !currentStatus })
      });
      if (!res.ok) throw new Error('Failed to update announcement status');
      fetchAnnouncements();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'error' });
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Delete this announcement?')) return;
    try {
      const res = await fetch(`/api/admin/announcements/${id}`, { method: 'DELETE' });
      if (!res.ok) throw new Error('Failed to delete announcement');
      toast({ title: 'Success', description: 'Announcement deleted.' });
      fetchAnnouncements();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'error' });
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'WARNING': return <AlertTriangle className="w-5 h-5 text-amber-500" />;
      case 'SUCCESS': return <CheckCircle2 className="w-5 h-5 text-emerald-500" />;
      default: return <Info className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Announcements</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Broadcast messages to all users on the platform.</p>
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition"
        >
          <Plus className="w-4 h-4" />
          Create Announcement
        </button>
      </div>

      <div className="grid gap-6">
        {loading ? (
          <div className="py-8 text-center text-slate-500">Loading announcements...</div>
        ) : announcements.length === 0 ? (
          <div className="py-8 text-center text-slate-500">No announcements found.</div>
        ) : (
          announcements.map((ann) => (
            <div key={ann.id} className={`relative flex items-start gap-4 rounded-2xl border ${ann.active ? 'border-primary/30 bg-primary/5 dark:bg-primary/10' : 'border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900'} p-6 shadow-sm transition`}>
              <div className="flex-shrink-0 mt-1">
                {getTypeIcon(ann.type)}
              </div>
              <div className="flex-1">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <h3 className="font-bold text-slate-900 dark:text-white text-lg">{ann.title}</h3>
                  <div className="flex items-center gap-3">
                    <span className="text-xs text-slate-500">{new Date(ann.createdAt).toLocaleDateString()}</span>
                    <button onClick={() => toggleStatus(ann.id, ann.active)} className={`px-2.5 py-1 text-xs font-medium rounded-full ${ann.active ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}>
                      {ann.active ? 'Active' : 'Inactive'}
                    </button>
                    <button onClick={() => handleDelete(ann.id)} className="p-1 text-slate-400 hover:text-red-500 transition" title="Delete">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="mt-2 text-slate-600 dark:text-slate-300 text-sm">{ann.content}</p>
              </div>
            </div>
          ))
        )}
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm">
          <div className="bg-white dark:bg-slate-900 rounded-2xl p-6 w-full max-w-lg border border-slate-200 dark:border-slate-800 shadow-xl">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4">New Announcement</h3>
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Content</label>
                <textarea required rows={3} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:border-primary" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">Type</label>
                <select value={formData.type} onChange={e => setFormData({...formData, type: e.target.value})} className="w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-transparent text-slate-900 dark:text-white focus:outline-none focus:border-primary">
                  <option value="INFO">Info</option>
                  <option value="WARNING">Warning</option>
                  <option value="SUCCESS">Success</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="active" checked={formData.active} onChange={e => setFormData({...formData, active: e.target.checked})} className="rounded text-primary focus:ring-primary bg-slate-100 border-slate-300" />
                <label htmlFor="active" className="text-sm font-medium text-slate-700 dark:text-slate-300">Make active immediately</label>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white">Cancel</button>
                <button type="submit" className="px-4 py-2 bg-primary text-white text-sm font-medium rounded-xl hover:bg-primary/90 transition">Broadcast</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
