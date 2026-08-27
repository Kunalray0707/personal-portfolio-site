'use client';
import { useRouter, usePathname } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useEffect, useState } from 'react';

export default function BackButton() {
  const router = useRouter();
  const pathname = usePathname();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Don't show back button on root, dashboard root, or admin root
  if (pathname === '/' || pathname === '/dashboard' || pathname === '/admin') {
    return null;
  }

  return (
    <AnimatePresence>
      <motion.button
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -20 }}
        onClick={() => router.back()}
        className="fixed bottom-8 left-8 z-50 flex items-center gap-2 rounded-full bg-white/70 px-5 py-3 text-sm font-semibold text-slate-900 shadow-[0_8px_30px_rgb(0,0,0,0.12)] backdrop-blur-md ring-1 ring-slate-900/5 transition-all hover:scale-105 hover:bg-white dark:bg-slate-900/70 dark:text-white dark:ring-white/10 dark:hover:bg-slate-800"
      >
        <ArrowLeft className="h-4 w-4" />
        Go Back
      </motion.button>
    </AnimatePresence>
  );
}
