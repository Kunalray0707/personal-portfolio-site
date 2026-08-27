'use client';
import React, { useEffect, useState } from 'react';
import { CreditCard, CheckCircle2, Clock, XCircle, ArrowRightLeft } from 'lucide-react';
import { useToast } from '../../../components/ui/toast';

type Payment = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  invoiceNumber: string | null;
  user: { name: string | null; email: string | null };
  plan: { name: string } | null;
};

export default function AdminPaymentsPage() {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const { toast } = useToast();

  const fetchPayments = async (p = 1) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/payments?page=${p}`);
      if (!res.ok) throw new Error('Failed to fetch payments');
      const data = await res.json();
      setPayments(data.payments || []);
      setTotalPages(data.pagination?.pages || 1);
      setPage(data.pagination?.page || 1);
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'error' });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments(page);
  }, [page]);

  const StatusIcon = ({ status }: { status: string }) => {
    switch (status) {
      case 'SUCCESS': return <CheckCircle2 className="w-4 h-4 text-emerald-500" />;
      case 'PENDING': return <Clock className="w-4 h-4 text-amber-500" />;
      case 'FAILED': return <XCircle className="w-4 h-4 text-red-500" />;
      case 'REFUNDED': return <ArrowRightLeft className="w-4 h-4 text-slate-500" />;
      default: return <Clock className="w-4 h-4 text-slate-400" />;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Payments</h2>
        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">Review transaction history and subscriptions.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-slate-50 dark:bg-slate-950/50 border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
              <tr>
                <th className="px-6 py-4 font-medium">Transaction ID</th>
                <th className="px-6 py-4 font-medium">Customer</th>
                <th className="px-6 py-4 font-medium">Plan</th>
                <th className="px-6 py-4 font-medium">Amount</th>
                <th className="px-6 py-4 font-medium">Status</th>
                <th className="px-6 py-4 font-medium text-right">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
              {loading ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">Loading payments...</td>
                </tr>
              ) : payments.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-slate-500">No payments found.</td>
                </tr>
              ) : (
                payments.map((payment) => (
                  <tr key={payment.id} className="hover:bg-slate-50 dark:hover:bg-slate-950/30 transition">
                    <td className="px-6 py-4 font-mono text-xs text-slate-500">{payment.id.slice(-8)}</td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-900 dark:text-white">{payment.user.name || 'Anonymous'}</p>
                      <p className="text-xs text-slate-500">{payment.user.email}</p>
                    </td>
                    <td className="px-6 py-4">{payment.plan?.name || 'Custom'}</td>
                    <td className="px-6 py-4 font-medium">
                      {(payment.amount / 100).toLocaleString('en-IN', { style: 'currency', currency: payment.currency || 'INR' })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <StatusIcon status={payment.status} />
                        <span className="text-xs font-medium">{payment.status}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">{new Date(payment.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        
        {/* Pagination */}
        {!loading && totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 py-4">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="px-3 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <span className="text-sm text-slate-500">Page {page} of {totalPages}</span>
            <button
              disabled={page === totalPages}
              onClick={() => setPage(page + 1)}
              className="px-3 py-1 text-sm border border-slate-200 dark:border-slate-700 rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
