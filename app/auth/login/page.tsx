'use client';
import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { FaGoogle, FaSpinner } from 'react-icons/fa';

export default function LoginPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const e = searchParams.get('error');
    if (e) setError('Google sign-in was not completed. Please try again.');
  }, [searchParams]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password, remember: true }) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      router.push('/dashboard');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  async function handleGoogle() {
    setGoogleLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/google');
      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Google sign-in unavailable');
      }
      // Redirect to the returned Google auth URL.
      window.location.href = data.url;
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Google sign-in unavailable');
      setGoogleLoading(false);
    }
  }

  return (
    <div className="max-w-md mx-auto">
      <h1 className="text-2xl font-semibold mb-4">Sign in</h1>

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
        <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Email" className="w-full px-4 py-2 border rounded-md" />
        <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Password" className="w-full px-4 py-2 border rounded-md" />
        {error && <div className="text-red-500">{error}</div>}
        <button disabled={loading} className="w-full bg-primary text-white px-4 py-2 rounded-md">{loading ? 'Signing in...' : 'Sign in'}</button>
      </form>
      <div className="mt-4 text-sm">
        <a href="/auth/forgot-password" className="text-primary">Forgot password?</a>
      </div>
      <div className="mt-6">
        <h3 className="text-sm">Or sign in with phone</h3>
        <a href="/auth/otp" className="text-primary">Use OTP</a>
      </div>
      <div className="mt-4 text-sm">
        <span className="text-slate-500">Don&apos;t have an account?</span>{' '}
        <a href="/auth/register" className="text-primary">Create one</a>
      </div>
    </div>
  );
}
