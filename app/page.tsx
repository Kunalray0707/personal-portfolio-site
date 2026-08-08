'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaPalette, FaMobileAlt } from 'react-icons/fa';

export default function Home() {
  return (
    <div className="w-full">
      <section className="text-center py-20">
        <motion.h1 initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6 }} className="text-4xl sm:text-5xl font-extrabold">
          Portfolio AI Pro
        </motion.h1>
        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="mt-4 text-lg text-slate-500 dark:text-slate-300">
          Beautiful, AI-powered portfolios — fast. Designed for professionals and teams.
        </motion.p>
        <motion.div className="mt-8 flex justify-center gap-4" initial={{ scale: 0.98 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }}>
          <a className="inline-block bg-primary text-white px-6 py-3 rounded-md shadow hover:brightness-95" href="/auth/register">Get started — it&apos;s free</a>
          <a className="inline-block border border-slate-200 px-6 py-3 rounded-md text-slate-700 dark:text-slate-200" href="/templates">Explore templates</a>
        </motion.div>
      </section>

      <section className="grid grid-cols-1 sm:grid-cols-3 gap-6 mt-12">
        <motion.div className="p-6 bg-white/60 dark:bg-slate-800/60 rounded-2xl shadow-lg" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }}>
          <FaRocket className="text-3xl text-primary" />
          <h3 className="mt-4 font-semibold">Fast Setup</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Create and launch your portfolio in minutes with intelligent defaults.</p>
        </motion.div>
        <motion.div className="p-6 bg-white/60 dark:bg-slate-800/60 rounded-2xl shadow-lg" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.05 }}>
          <FaPalette className="text-3xl text-primary" />
          <h3 className="mt-4 font-semibold">Design Flexibility</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Pick and customize premium templates or build from scratch.</p>
        </motion.div>
        <motion.div className="p-6 bg-white/60 dark:bg-slate-800/60 rounded-2xl shadow-lg" initial={{ y: 10, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }}>
          <FaMobileAlt className="text-3xl text-primary" />
          <h3 className="mt-4 font-semibold">Responsive</h3>
          <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">All templates are responsive and optimized for mobile and desktop.</p>
        </motion.div>
      </section>

      <section className="mt-16">
        <h2 className="text-2xl font-semibold">Animations & micro-interactions</h2>
        <p className="mt-2 text-sm text-slate-500 dark:text-slate-300">Framer Motion & GSAP are wired in for premium motion.</p>
      </section>
    </div>
  );
}
