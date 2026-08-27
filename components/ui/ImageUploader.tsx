'use client';

import React, { useRef, useState } from 'react';
import { FaUpload, FaSpinner, FaTimes } from 'react-icons/fa';
import { cn } from '../../lib/utils';

interface ImageUploaderProps {
  value?: string;
  onChange: (url: string) => void;
  kind?: 'image' | 'resume';
  label?: string;
  accept?: string;
  className?: string;
}

/**
 * Reusable file uploader wired to the /api/upload Cloudinary route.
 * Falls back to a data URL in mock mode when Cloudinary is not configured.
 */
export function ImageUploader({
  value,
  onChange,
  kind = 'image',
  label = 'Upload image',
  accept = 'image/*',
  className
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  const handleFile = async (file: File) => {
    if (!file) return;
    setUploading(true);
    setError('');
    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('kind', kind);
      const res = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Upload failed');
      onChange(data.upload.url);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className={cn('space-y-2', className)}>
      <div className="flex items-center gap-3">
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 transition hover:bg-slate-100 disabled:cursor-not-allowed disabled:opacity-60 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
        >
          {uploading ? <FaSpinner className="h-4 w-4 animate-spin" /> : <FaUpload className="h-4 w-4" />}
          {uploading ? 'Uploading…' : label}
        </button>
        <input
          ref={inputRef}
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = '';
          }}
        />
        {value && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="inline-flex items-center gap-1 rounded-2xl border border-rose-200 px-3 py-2 text-xs text-rose-700 transition hover:bg-rose-50 dark:border-rose-900 dark:text-rose-200 dark:hover:bg-rose-950/70"
            aria-label="Clear upload"
          >
            <FaTimes className="h-3 w-3" /> Clear
          </button>
        )}
      </div>

      {value && kind === 'image' && (
        <div className="mt-2 overflow-hidden rounded-2xl border border-slate-200 dark:border-slate-800">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={value} alt="Uploaded preview" className="max-h-40 w-full object-cover" />
        </div>
      )}
      {value && kind === 'resume' && (
        <a href={value} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-primary hover:underline">
          View uploaded resume
        </a>
      )}

      {error && <p className="text-sm text-rose-600 dark:text-rose-300">{error}</p>}
    </div>
  );
}
