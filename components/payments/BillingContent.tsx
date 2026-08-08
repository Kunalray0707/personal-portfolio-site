'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { PricingCard, PlanItem } from './PricingCard';
import { PaymentModal } from './PaymentModal';
import { FaCheck, FaSpinner } from 'react-icons/fa';

type SubscriptionInfo = {
  id: string;
  planName: string;
  planSlug: string;
  interval: 'MONTHLY' | 'YEARLY' | 'LIFETIME';
  status: string;
  startDate: string;
  endDate: string | null;
};

type PaymentRecord = {
  id: string;
  amount: number;
  currency: string;
  status: string;
  method: string | null;
  invoiceNumber: string | null;
  createdAt: string;
  plan: { name: string } | null;
  invoice: { invoiceNumber: string; pdfUrl: string | null } | null;
};

export function BillingContent() {
  const [plans, setPlans] = useState<PlanItem[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<PlanItem | null>(null);
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null);
  const [premium, setPremium] = useState(false);
  const [payments, setPayments] = useState<PaymentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refunding, setRefunding] = useState<string | null>(null);

  const loadData = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const [plansRes, subRes, payRes] = await Promise.all([
        fetch('/api/payments/plans', { cache: 'no-store' }),
        fetch('/api/payments/subscription', { cache: 'no-store' }),
        fetch('/api/payments/history', { cache: 'no-store' })
      ]);

      const plansData = await plansRes.json();
      const subData = await subRes.json();
      const payData = await payRes.json();

      if (plansRes.ok) setPlans(plansData.plans || []);
      if (subRes.ok) {
        setSubscription(subData.subscription);
        setPremium(subData.premium);
      }
      if (payRes.ok) setPayments(payData.payments || []);
    } catch {
      setError('Unable to load billing information.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const handleRefund = async (paymentId: string) => {
    if (!window.confirm('Request a refund for this payment?')) return;
    setRefunding(paymentId);
    setError('');
    try {
      const res = await fetch('/api/payments/refund', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ paymentId })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Refund failed');
      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Refund failed');
    } finally {
      setRefunding(null);
    }
  };

  const formatPrice = (paise: number) =>
    paise === 0 ? 'Free' : `₹${(paise / 100).toLocaleString('en-IN')}`;

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center text-slate-500 dark:text-slate-400">
        Loading billing…
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {error && (
        <div className="rounded-3xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700 dark:border-rose-900 dark:bg-rose-950/30 dark:text-rose-200">
          {error}
        </div>
      )}

      {/* Current plan status */}
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
              Current plan
            </p>
            <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
              {premium ? subscription?.planName || 'Pro' : 'Free'}
            </h2>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
              {premium
                ? subscription?.endDate
                  ? `Active until ${new Date(subscription.endDate).toLocaleDateString()}`
                  : 'Lifetime access unlocked'
                : 'Upgrade to access premium templates and advanced AI tools.'}
            </p>
          </div>
          <span
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold ${
              premium
                ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300'
            }`}
          >
            {premium ? <FaCheck className="h-4 w-4" /> : null}
            {premium ? 'Premium active' : 'Free plan'}
          </span>
        </div>
      </section>

      {/* Pricing plans */}
      <section>
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-slate-900 dark:text-white">Pricing plans</h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
            Choose a plan that fits your needs. Cancel anytime.
          </p>
        </div>
        <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {plans.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              onSelect={setSelectedPlan}
              highlight={plan.priceINR > 0 && plan.priceINR <= 50000}
            />
          ))}
        </div>
      </section>

      {/* Payment history */}
      <section className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm dark:border-slate-800 dark:bg-slate-950/80">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-xl font-semibold text-slate-900 dark:text-white">
              Payment history
            </h2>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
              Your past payments and invoices.
            </p>
          </div>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs text-slate-600 dark:bg-slate-800 dark:text-slate-300">
            {payments.length}
          </span>
        </div>

        {payments.length === 0 ? (
          <div className="mt-6 rounded-3xl bg-slate-50 p-6 text-center text-sm text-slate-500 dark:bg-slate-950/70 dark:text-slate-400">
            No payments yet. Your purchases will appear here.
          </div>
        ) : (
          <div className="mt-6 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead>
                <tr className="border-b border-slate-200 text-xs uppercase tracking-wider text-slate-500 dark:border-slate-800 dark:text-slate-400">
                  <th className="pb-3 pr-4 font-medium">Plan</th>
                  <th className="pb-3 pr-4 font-medium">Amount</th>
                  <th className="pb-3 pr-4 font-medium">Status</th>
                  <th className="pb-3 pr-4 font-medium">Invoice</th>
                  <th className="pb-3 pr-4 font-medium">Date</th>
                  <th className="pb-3 font-medium">Action</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 pr-4 text-slate-900 dark:text-white">
                      {payment.plan?.name || 'Payment'}
                    </td>
                    <td className="py-3 pr-4 text-slate-700 dark:text-slate-200">
                      {formatPrice(payment.amount)}
                    </td>
                    <td className="py-3 pr-4">
                      <span
                        className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                          payment.status === 'SUCCESS'
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300'
                            : payment.status === 'REFUNDED'
                            ? 'bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300'
                            : payment.status === 'PENDING'
                            ? 'bg-sky-50 text-sky-700 dark:bg-sky-950/40 dark:text-sky-300'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-300'
                        }`}
                      >
                        {payment.status.charAt(0) + payment.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">
                      {payment.invoice?.invoiceNumber || payment.invoiceNumber || '—'}
                    </td>
                    <td className="py-3 pr-4 text-slate-600 dark:text-slate-300">
                      {new Date(payment.createdAt).toLocaleDateString()}
                    </td>
                    <td className="py-3">
                      {payment.status === 'SUCCESS' ? (
                        <button
                          type="button"
                          onClick={() => handleRefund(payment.id)}
                          disabled={refunding === payment.id}
                          className="rounded-full border border-amber-200 px-3 py-1.5 text-xs font-medium text-amber-700 transition hover:bg-amber-50 disabled:cursor-not-allowed disabled:opacity-60"
                        >
                          {refunding === payment.id ? (
                            <FaSpinner className="h-3 w-3 animate-spin" />
                          ) : (
                            'Refund'
                          )}
                        </button>
                      ) : (
                        <span className="text-xs text-slate-400">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <PaymentModal
        plan={selectedPlan}
        onClose={() => setSelectedPlan(null)}
        onSuccess={() => {
          setSelectedPlan(null);
          loadData();
        }}
      />
    </div>
  );
}
