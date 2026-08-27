'use client';
import React, { useEffect, useState } from 'react';
import { MessageSquare, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import { useToast } from '../../../components/ui/toast';

type Ticket = {
  id: string;
  subject: string;
  status: string;
  priority: string;
  createdAt: string;
  user: { name: string | null; email: string | null };
  _count: { messages: number };
};

export default function AdminSupportPage() {
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchTickets = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/admin/support');
      if (!res.ok) throw new Error('Failed to fetch support tickets');
      const data = await res.json();
      setTickets(data.tickets || []);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OPEN': return 'text-amber-600 bg-amber-100 dark:bg-amber-500/10 dark:text-amber-500';
      case 'IN_PROGRESS': return 'text-blue-600 bg-blue-100 dark:bg-blue-500/10 dark:text-blue-500';
      case 'RESOLVED': return 'text-emerald-600 bg-emerald-100 dark:bg-emerald-500/10 dark:text-emerald-500';
      default: return 'text-slate-600 bg-slate-100 dark:bg-slate-800 dark:text-slate-400';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'HIGH':
      case 'URGENT': return <AlertCircle className="w-4 h-4 text-red-500" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Support Tickets</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Manage and resolve user inquiries.</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Subject</th>
                <th className="px-6 py-4 font-medium">User</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium">Priority</th>
                <th className="px-6 py-4 font-medium">Messages</th>
                <th className="px-6 py-4 font-medium text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading tickets...</td>
                </tr>
              ) : tickets.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No support tickets found.</td>
                </tr>
              ) : (
                tickets.map((ticket) => (
                  <tr key={ticket.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/30 transition cursor-pointer">
                    <td className="px-6 py-4 font-medium text-slate-900 dark:text-white max-w-[200px] truncate">
                      {ticket.subject}
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900 dark:text-white">{ticket.user.name || 'Anonymous'}</p>
                      <p className="text-xs text-slate-500">{ticket.user.email}</p>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-bold ${getStatusColor(ticket.status)}`}>
                        {ticket.status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        {getPriorityIcon(ticket.priority)}
                        <span className="text-xs font-medium">{ticket.priority}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-1.5 text-slate-500">
                        <MessageSquare className="w-4 h-4" />
                        <span>{ticket._count.messages}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">{new Date(ticket.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
