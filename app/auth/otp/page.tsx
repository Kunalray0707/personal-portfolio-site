'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OtpPage() {
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [step, setStep] = useState<'request' | 'verify'>('request');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function requestOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/otp/request', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'OTP request failed');
      setStep('verify');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'OTP request failed');
    } finally {
      setLoading(false);
    }
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/otp/verify', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ phone, code, remember: true }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'OTP verify failed');
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'OTP verify failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      {step === 'request' ? (
        <form onSubmit={requestOtp} className="space-y-4">
          <h2 className="text-lg font-semibold">Sign in with phone</h2>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="+1234567890" className="w-full px-4 py-2 border rounded-md" />
          {error && <div className="text-red-500">{error}</div>}
          <button disabled={loading} className="w-full bg-primary text-white px-4 py-2 rounded-md">{loading ? 'Sending...' : 'Send code'}</button>
        </form>
      ) : (
        <form onSubmit={verifyOtp} className="space-y-4">
          <h2 className="text-lg font-semibold">Enter code</h2>
          <input value={code} onChange={(e) => setCode(e.target.value)} placeholder="6-digit code" className="w-full px-4 py-2 border rounded-md" />
          {error && <div className="text-red-500">{error}</div>}
          <button disabled={loading} className="w-full bg-primary text-white px-4 py-2 rounded-md">{loading ? 'Verifying...' : 'Verify'}</button>
        </form>
      )}
    </div>
  );
}
