'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaSpinner } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

export default function UnifiedAuthPage() {
  const router = useRouter();
  const [identifier, setIdentifier] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<1 | 2>(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [devCode, setDevCode] = useState<string | null>(null);

  async function handleRequestOTP(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setDevCode(null);
    try {
      const res = await fetch('/api/auth/otp/request', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to send code');
      
      if (data.dev_code) {
        setDevCode(data.dev_code); // For local testing since email server isn't hooked up
      }
      setStep(2);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyOTP(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/otp/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ identifier, code })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Invalid code');
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Invalid code');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-950 p-4">
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl p-8 shadow-xl border border-slate-200 dark:border-slate-800"
      >
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white mb-2">Welcome</h1>
          <p className="text-slate-500 dark:text-slate-400">
            {step === 1 ? 'Enter your Email or Phone to log in instantly.' : 'Enter the 6-digit code sent to you.'}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {step === 1 ? (
            <motion.form 
              key="step1"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleRequestOTP} 
              className="space-y-4"
            >
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                Email or Phone Number
              </label>
              <input
                type="text"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                placeholder="example@email.com or +1234567890"
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition"
                required
              />
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading || identifier.length < 5}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50"
            >
              {loading && <FaSpinner className="animate-spin" />}
              Continue
            </button>
            </motion.form>
          ) : (
            <motion.form 
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
              onSubmit={handleVerifyOTP} 
              className="space-y-4"
            >
            <div>
              <label className="block text-sm font-medium mb-1 text-slate-700 dark:text-slate-300">
                6-Digit Code
              </label>
              <input
                type="text"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="000000"
                maxLength={6}
                className="w-full px-4 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white focus:ring-2 focus:ring-primary outline-none transition tracking-widest text-center text-lg font-mono"
                required
              />
              {devCode && (
                <p className="text-xs text-primary mt-2 text-center bg-primary/10 p-2 rounded-lg">
                  Local Dev Mode Code: <strong>{devCode}</strong>
                </p>
              )}
            </div>
            {error && <p className="text-red-500 text-sm">{error}</p>}
            <button
              type="submit"
              disabled={loading || code.length !== 6}
              className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50"
            >
              {loading && <FaSpinner className="animate-spin" />}
              Verify & Login
            </button>
            <button
              type="button"
              onClick={() => setStep(1)}
              className="w-full text-sm text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 py-2"
            >
              Go back
            </button>
            </motion.form>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
