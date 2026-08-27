'use client';
import React from 'react';
import { motion } from 'framer-motion';
import { FaRocket, FaPalette, FaMobileAlt, FaMagic, FaGithub } from 'react-icons/fa';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="w-full">
      {/* Background Decorators */}
      <div className="absolute top-0 inset-x-0 h-[600px] overflow-hidden z-[-1] pointer-events-none">
        <div className="absolute top-[-150px] left-[10%] w-[500px] h-[500px] bg-indigo-500/20 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-screen animate-blob" />
        <div className="absolute top-[-100px] right-[10%] w-[400px] h-[400px] bg-rose-500/20 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-2000" />
        <div className="absolute top-[100px] left-[40%] w-[600px] h-[600px] bg-blue-500/20 rounded-full blur-3xl opacity-50 mix-blend-multiply dark:mix-blend-screen animate-blob animation-delay-4000" />
      </div>

      <section className="text-center py-24 sm:py-32 relative">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-3 py-1 mb-8 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-sm font-medium text-slate-800 dark:text-slate-200 shadow-sm"
        >
          <span className="flex h-2 w-2 rounded-full bg-indigo-500 animate-pulse"></span>
          Portfolio AI Pro v2.0 is live
        </motion.div>

        <motion.h1 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          transition={{ duration: 0.6, delay: 0.1 }} 
          className="text-5xl sm:text-7xl font-extrabold tracking-tight text-slate-900 dark:text-white"
        >
          Build your brand with <br className="hidden sm:block" />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-rose-500">
            intelligent design
          </span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.3, duration: 0.6 }} 
          className="mt-6 text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed"
        >
          Create stunning, lightning-fast portfolios powered by AI. Drag, drop, generate, and deploy in minutes. No coding required.
        </motion.p>
        
        <motion.div 
          className="mt-10 flex flex-col sm:flex-row justify-center items-center gap-4" 
          initial={{ opacity: 0, y: 10 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          <Link href="/auth" className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-slate-900 text-white dark:bg-white dark:text-slate-900 px-8 py-4 rounded-full font-semibold text-lg hover:scale-105 transition-all shadow-[0_0_40px_-10px_rgba(99,102,241,0.5)]">
            Get started for free
            <FaRocket className="w-4 h-4" />
          </Link>
          <Link href="/templates" className="w-full sm:w-auto inline-flex justify-center items-center gap-2 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white px-8 py-4 rounded-full font-semibold text-lg hover:bg-white dark:hover:bg-slate-800 transition-all hover:scale-105 shadow-sm">
            Explore templates
          </Link>
        </motion.div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-16 px-4 pb-32 max-w-6xl mx-auto">
        {[
          { icon: FaRocket, title: "Lightning Fast", desc: "Built on Next.js Edge. Deploys globally in milliseconds.", color: "text-rose-500", bg: "bg-rose-500/10" },
          { icon: FaMagic, title: "AI Generation", desc: "Write professional bios and case studies with a single click.", color: "text-indigo-500", bg: "bg-indigo-500/10" },
          { icon: FaPalette, title: "Stunning Templates", desc: "Access 25+ premium, fully customizable starting points.", color: "text-purple-500", bg: "bg-purple-500/10" },
          { icon: FaMobileAlt, title: "Fully Responsive", desc: "Looks perfect on desktops, tablets, and phones automatically.", color: "text-emerald-500", bg: "bg-emerald-500/10" }
        ].map((feature, i) => (
          <motion.div 
            key={feature.title}
            initial={{ opacity: 0, y: 20 }} 
            whileInView={{ opacity: 1, y: 0 }} 
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.5 }}
            className="p-8 bg-white/70 dark:bg-slate-900/70 backdrop-blur-md rounded-[2rem] shadow-sm border border-slate-200 dark:border-slate-800 hover:shadow-xl hover:-translate-y-1 transition-all group"
          >
            <div className={`w-14 h-14 rounded-2xl ${feature.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
              <feature.icon className={`text-2xl ${feature.color}`} />
            </div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-3">{feature.title}</h3>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
              {feature.desc}
            </p>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
