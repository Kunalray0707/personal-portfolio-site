'use client';
import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { FaLock, FaSpinner } from 'react-icons/fa';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/auth/login', { 
        method: 'POST', 
        headers: { 'Content-Type': 'application/json' }, 
        body: JSON.stringify({ email, password, remember: true }) 
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Login failed');
      // On success, go to admin dashboard
      router.push('/admin');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-950 p-4">
      <div className="w-full max-w-md bg-slate-900 rounded-3xl p-8 shadow-2xl border border-slate-800">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-primary/10 rounded-full mb-4">
            <FaLock className="text-primary text-xl" />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">Admin Portal</h1>
          <p className="text-slate-400">Authorized personnel only</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">
              Admin Email
            </label>
            <input 
              type="email"
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="admin@portfolify.com" 
              className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-white focus:ring-2 focus:ring-primary outline-none transition" 
              required 
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-slate-300">
              Password
            </label>
            <input 
              type="password"
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              className="w-full px-4 py-3 rounded-xl border border-slate-700 bg-slate-950 text-white focus:ring-2 focus:ring-primary outline-none transition" 
              required 
            />
          </div>
          
          {error && <div className="text-red-500 text-sm">{error}</div>}
          
          <button 
            type="submit"
            disabled={loading} 
            className="w-full flex items-center justify-center gap-2 bg-primary text-white font-semibold py-3 rounded-xl hover:opacity-90 transition disabled:opacity-50 mt-4"
          >
            {loading && <FaSpinner className="animate-spin" />}
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}
