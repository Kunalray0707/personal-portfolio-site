'use client';

import * as React from 'react';
import { FaTimes } from 'react-icons/fa';
import { cn } from '../../lib/utils';

type ToastVariant = 'default' | 'success' | 'error' | 'warning';

interface ToastOptions {
  title?: string;
  description?: string;
  variant?: ToastVariant;
  duration?: number;
}

interface ToastState extends ToastOptions {
  id: number;
  visible: boolean;
}

const ToastContext = React.createContext<{
  toast: (options: ToastOptions) => void;
}>({ toast: () => undefined });

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastState[]>([]);

  const dismiss = React.useCallback((id: number) => {
    setToasts((current) => current.map((t) => (t.id === id ? { ...t, visible: false } : t)));
    window.setTimeout(() => {
      setToasts((current) => current.filter((t) => t.id !== id));
    }, 200);
  }, []);

  const toast = React.useCallback(
    (options: ToastOptions) => {
      const id = Date.now() + Math.random();
      setToasts((current) => [...current, { id, visible: true, ...options }]);
      const duration = options.duration ?? 4000;
      window.setTimeout(() => dismiss(id), duration);
    },
    [dismiss]
  );

  const value = React.useMemo(() => ({ toast }), [toast]);

  return (
    <ToastContext.Provider value={value}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            aria-live="polite"
            className={cn(
              'pointer-events-auto flex items-start justify-between gap-3 rounded-2xl border p-4 shadow-lg transition-all duration-200',
              t.visible ? 'translate-y-0 opacity-100' : 'translate-y-2 opacity-0',
              t.variant === 'success' && 'border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/60 dark:text-emerald-200',
              t.variant === 'error' && 'border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/60 dark:text-rose-200',
              t.variant === 'warning' && 'border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/60 dark:text-amber-200',
              (!t.variant || t.variant === 'default') && 'border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-100'
            )}
          >
            <div className="space-y-1">
              {t.title && <p className="text-sm font-semibold">{t.title}</p>}
              {t.description && <p className="text-sm opacity-90">{t.description}</p>}
            </div>
            <button
              type="button"
              onClick={() => dismiss(t.id)}
              className="rounded-sm opacity-70 transition-opacity hover:opacity-100"
              aria-label="Dismiss notification"
            >
<FaTimes className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
