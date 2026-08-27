'use client';
import React from 'react';
import { motion } from 'framer-motion';

export default function PricingPage() {
  return (
    <div className="w-full min-h-screen bg-slate-50 dark:bg-slate-950">
      <section className="text-center py-20 px-6">
        <motion.h1 
          initial={{ y: 20, opacity: 0 }} 
          animate={{ y: 0, opacity: 1 }} 
          className="text-4xl sm:text-5xl font-extrabold text-slate-900 dark:text-white"
        >
          Simple, transparent pricing
        </motion.h1>
        <motion.p 
          initial={{ opacity: 0 }} 
          animate={{ opacity: 1 }} 
          transition={{ delay: 0.2 }} 
          className="mt-4 text-lg text-slate-500 dark:text-slate-300 max-w-2xl mx-auto"
        >
          Everything you need to build your professional brand online. Upgrade at any time.
        </motion.p>
      </section>

      <section className="max-w-6xl mx-auto px-6 pb-20 grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          {
            name: 'Free',
            price: '₹0',
            description: 'Start building your portfolio with essential tools.',
            features: ['1 portfolio', 'Community templates', 'Basic AI tools', 'Public portfolio URL'],
            buttonText: 'Get Started',
            highlight: false
          },
          {
            name: 'Pro Monthly',
            price: '₹499',
            description: 'Everything you need to grow your professional brand.',
            features: ['Unlimited portfolios', 'All 25 premium templates', 'Advanced AI tools', 'Custom domains', 'Password protection', 'Priority support'],
            buttonText: 'Upgrade to Pro',
            highlight: true
          },
          {
            name: 'Pro Yearly',
            price: '₹4,790',
            description: 'Save 20% with an annual Pro subscription.',
            features: ['Everything in Pro', '2 months free', 'Priority support', 'Early access to features'],
            buttonText: 'Upgrade to Pro',
            highlight: false
          }
        ].map((plan, i) => (
          <motion.div 
            key={plan.name}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.15 + 0.3 }}
            className={`p-8 rounded-3xl border ${plan.highlight ? 'border-primary ring-2 ring-primary/20 bg-white dark:bg-slate-900 shadow-xl' : 'border-slate-200 dark:border-slate-800 bg-white/60 dark:bg-slate-900/60 shadow-lg'} relative overflow-hidden`}
          >
            {plan.highlight && (
              <div className="absolute top-0 right-0 bg-primary text-white text-xs font-bold px-3 py-1 rounded-bl-lg">
                MOST POPULAR
              </div>
            )}
            <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{plan.name}</h3>
            <p className="mt-2 text-sm text-slate-500 dark:text-slate-400 min-h-[40px]">{plan.description}</p>
            <div className="mt-6">
              <span className="text-4xl font-extrabold text-slate-900 dark:text-white">{plan.price}</span>
              <span className="text-slate-500 dark:text-slate-400">/mo</span>
            </div>
            
            <a href="/auth" className={`mt-8 block w-full text-center py-3 px-4 rounded-xl font-semibold transition-all ${plan.highlight ? 'bg-primary text-white hover:bg-indigo-500 shadow-md hover:shadow-lg' : 'bg-slate-100 text-slate-900 hover:bg-slate-200 dark:bg-slate-800 dark:text-white dark:hover:bg-slate-700'}`}>
              {plan.buttonText}
            </a>

            <ul className="mt-8 space-y-4">
              {plan.features.map(f => (
                <li key={f} className="flex items-center gap-3 text-sm text-slate-600 dark:text-slate-300">
                  <span className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs">✓</span>
                  {f}
                </li>
              ))}
            </ul>
          </motion.div>
        ))}
      </section>
    </div>
  );
}
