'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaGoogle, FaSpinner } from 'react-icons/fa';

export default function RegisterPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);

  async function handleGoogle() {
    setGoogleLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/google');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Google sign-in unavailable');
      }
      window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google sign-in unavailable');
      setGoogleLoading(false);
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/register', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, name }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Registration failed');
      router.push('/auth/login');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  }

  return (
<div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Create account</h1>

      <button
        type="button"
        onClick={handleGoogle}
        disabled={googleLoading}
        className="mb-6 flex w-full items-center justify-center gap-2 rounded-2xl border border-slate-300 bg-white px-4 py-3 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {googleLoading ? <FaSpinner className="h-4 w-4 animate-spin" /> : <FaGoogle className="h-4 w-4" />}
        Continue with Google
      </button>

      <div className="mb-6 flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        <span className="text-xs uppercase tracking-wider text-slate-400">or</span>
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Full name" className="w-full px-4 py-2 border rounded-md" />
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-2 border rounded-md" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password (min 8 chars)" className="w-full px-4 py-2 border rounded-md" />
        {error && <div className="text-red-500">{error}</div>}
        <button disabled={loading} className="w-full bg-primary text-white px-4 py-2 rounded-md">{loading ? 'Creating...' : 'Create account'}</button>
      </form>
    </div>
  );
}
