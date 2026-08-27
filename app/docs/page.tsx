'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function DocsPage() {
  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950">
      <section className="text-center py-20 px-6 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
        <motion.h1 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          className="text-4xl font-extrabold text-slate-900 dark:text-white"
        >
          Documentation
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.1 }} 
          className="mt-4 text-lg text-slate-500 dark:text-slate-300 max-w-2xl mx-auto"
        >
          Learn how to build, customize, and deploy your portfolio.
        </motion.p>
      </section>

      <section className="max-w-4xl mx-auto px-6 py-16 space-y-12">
        {[
          { title: 'Getting Started', body: 'Create an account and use the visual builder to drag and drop sections. You can easily start from a pre-made template or start from a blank canvas.' },
          { title: 'Using AI Generation', body: 'Click the sparkles icon on any text field to automatically generate professional bios, project summaries, and seo tags tailored to your industry.' },
          { title: 'Connecting Custom Domains', body: 'Upgrade to Pro to link your own domain name. Navigate to the Domains tab, enter your custom URL, and update your DNS records as instructed.' },
          { title: 'Exporting your Portfolio', body: 'You can export your portfolio as a zip file (HTML/CSS), a PDF resume, or sync it directly to a GitHub repository from the Export tab.' }
        ].map((doc, i) => (
          <motion.article 
            key={doc.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: i * 0.1 }}
            className="p-8 rounded-3xl bg-white dark:bg-slate-900 shadow-sm border border-slate-200 dark:border-slate-800"
          >
            <h2 className="text-2xl font-bold text-slate-900 dark:text-white">{doc.title}</h2>
            <p className="mt-4 leading-relaxed text-slate-600 dark:text-slate-300">{doc.body}</p>
          </motion.article>
        ))}
      </section>
    </div>
  );
}
