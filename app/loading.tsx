'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function Loading() {
  return (
    <div className="flex items-center justify-center h-64">
      <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1 }} className="w-12 h-12 rounded-full bg-primary/80" />
      <span className="ml-4 text-sm text-slate-500 dark:text-slate-300">Loading...</span>
    </div>
  );
}
