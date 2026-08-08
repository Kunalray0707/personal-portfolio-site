'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { FaTimes, FaSpinner } from 'react-icons/fa';
import type { PlanItem } from './PricingCard';

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => {
      open: () => void;
    };
  }
}

interface PaymentModalProps {
  plan: PlanItem | null;
  onClose: () => void;
  onSuccess: () => void;
}

interface RazorpayOrderResponse {
  order: { id: string; amount: number; currency: string };
  plan: PlanItem;
  keyId: string;
}

export function PaymentModal({ plan, onClose, onSuccess }: PaymentModalProps) {
  const [loadingOrder, setLoadingOrder] = useState(false);
  const [error, setError] = useState('');

  // Reset error state when the selected plan changes.
  useEffect(() => {
    setError('');
  }, [plan]);

  const createOrder = useCallback(async (selectedPlan: PlanItem) => {
    setLoadingOrder(true);
    setError('');
    try {
      const res = await fetch('/api/payments/create-order', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId: selectedPlan.id })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Unable to create order');
      return data as RazorpayOrderResponse;
    } finally {
      setLoadingOrder(false);
    }
  }, []);

  const handleCheckout = async () => {
    if (!plan) return;
    try {
      const data = await createOrder(plan);

      // If no Razorpay key is configured, simulate a successful payment
      // so the full flow is testable locally in mock mode.
      if (!data.keyId) {
        const verifyRes = await fetch('/api/payments/verify', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            orderId: data.order.id,
            paymentId: `pay_mock_${Date.now()}`,
            signature: 'mock_signature_for_local_testing',
            planId: plan.id
          })
        });
        const verifyData = await verifyRes.json();
        if (!verifyRes.ok) throw new Error(verifyData.error || 'Payment verification failed');
        onSuccess();
        return;
      }

      // Load the Razorpay checkout script on demand.
      const loadScript = () =>
        new Promise<boolean>((resolve) => {
          if (window.Razorpay) return resolve(true);
          const script = document.createElement('script');
          script.src = 'https://checkout.razorpay.com/v1/checkout.js';
          script.onload = () => resolve(true);
          script.onerror = () => resolve(false);
          document.head.appendChild(script);
        });

      const loaded = await loadScript();
      if (!loaded || !window.Razorpay) {
        setError('Razorpay checkout failed to load. Please try again.');
        return;
      }

      const rzp = new window.Razorpay({
        key: data.keyId,
        amount: data.order.amount,
        currency: data.order.currency,
        name: 'Portfolio AI Pro',
        description: `Plan: ${plan.name}`,
        order_id: data.order.id,
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch('/api/payments/verify', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              orderId: response.razorpay_order_id,
              paymentId: response.razorpay_payment_id,
              signature: response.razorpay_signature,
              planId: plan.id
            })
          });
          const verifyData = await verifyRes.json();
          if (!verifyRes.ok) {
            setError(verifyData.error || 'Payment verification failed');
            return;
          }
          onSuccess();
        },
        theme: {
          color: '#6366f1'
        }
      });

      rzp.open();
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Payment failed';
      setError(message);
    }
  };

  if (!plan) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-slate-950/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div
        className="relative w-full max-w-md rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl dark:border-slate-700 dark:bg-slate-950"
        role="dialog"
        aria-modal="true"
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-4 top-4 rounded-full border border-slate-200 p-2 text-slate-500 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-300 dark:hover:bg-slate-800"
          aria-label="Close"
        >
          <FaTimes className="h-4 w-4" />
        </button>

        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">
            Checkout
          </p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-900 dark:text-white">
            Subscribe to {plan.name}
          </h2>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">{plan.description}</p>
        </div>

        <div className="mt-6 rounded-3xl bg-slate-50 p-4 text-sm dark:bg-slate-900">
          <div className="flex items-center justify-between text-slate-700 dark:text-slate-200">
            <span>{plan.name}</span>
            <span className="font-semibold">
              ₹{(plan.priceINR / 100).toLocaleString('en-IN')}
            </span>
          </div>
          <div className="mt-2 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400">
            <span>Billing cycle</span>
            <span>
              {plan.interval === 'MONTHLY'
                ? 'Monthly'
                : plan.interval === 'YEARLY'
                ? 'Yearly'
                : 'One-time'}
            </span>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-2xl bg-rose-50 p-3 text-sm text-rose-700 dark:bg-rose-950/30 dark:text-rose-200">
            {error}
          </div>
        )}

        <div className="mt-6 flex gap-3">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-full border border-slate-200 px-5 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleCheckout}
            disabled={loadingOrder}
            className="flex flex-1 items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-white transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loadingOrder ? <FaSpinner className="h-4 w-4 animate-spin" /> : null}
            {loadingOrder ? 'Creating order…' : 'Pay now'}
          </button>
        </div>
      </div>
    </div>
  );
}
