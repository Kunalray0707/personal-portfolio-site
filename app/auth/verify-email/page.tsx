'use client';
import React, { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';

export default function VerifyEmailPage() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Verifying your email...');

  useEffect(() => {
    if (!token) {
      setStatus('error');
      setMessage('Missing verification token.');
      return;
    }

    fetch(`/api/auth/verify-email?token=${encodeURIComponent(token)}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.ok) {
          setStatus('success');
          setMessage('Email verified successfully. You can now sign in.');
        } else {
          setStatus('error');
          setMessage(data.error || 'Unable to verify your email.');
        }
      })
      .catch(() => {
        setStatus('error');
        setMessage('Unable to verify your email. Please try again later.');
      });
  }, [token]);

  return (
    <div className="max-w-md mx-auto py-16 text-center">
      <h1 className="text-2xl font-semibold">Verify Email</h1>
      <p className="mt-4 text-slate-500 dark:text-slate-300">{message}</p>
      {status === 'success' && (
        <a href="/auth/login" className="mt-6 inline-block rounded-md bg-primary px-5 py-3 text-white">Sign in</a>
      )}
    </div>
  );
}
