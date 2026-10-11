'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2, ShieldCheck, Sparkles } from 'lucide-react';
import { ExternalKnowledgeVault } from '@/components/ExternalKnowledgeVault';

const MODULES = [
  { id: 'stocks', title: 'Stocks', subtitle: 'Own a Piece of a Company', color: 'var(--asset-stocks)', bg: 'rgba(109, 40, 217, 0.08)', logo: '/logos/stocks.jpg' },
  { id: 'mutual-funds', title: 'Mutual Funds', subtitle: 'Invest Through a Basket', color: 'var(--asset-funds)', bg: 'rgba(249, 115, 22, 0.08)', logo: '/logos/mutual-funds.jpg' },
  { id: 'etfs', title: 'ETFs', subtitle: 'A Basket You Can Trade', color: 'var(--asset-stocks)', bg: 'rgba(37, 99, 235, 0.08)', logo: '/logos/etfs.jpg' },
  { id: 'bonds', title: 'Bonds', subtitle: 'Become a Lender', color: 'var(--asset-bonds)', bg: 'rgba(217, 119, 6, 0.08)', logo: '/logos/bonds.jpg' },
  { id: 'reits', title: 'REITs', subtitle: 'Real Estate Without the Building', color: 'var(--asset-reits)', bg: 'rgba(13, 148, 136, 0.08)', logo: '/logos/reits.jpg' },
  { id: 'invits', title: 'InvITs', subtitle: 'Infrastructure Behind Everyday Life', color: 'var(--asset-invits)', bg: 'rgba(124, 58, 237, 0.08)', logo: '/logos/invits.jpg' },
  { id: 'futures-options', title: 'Futures & Options', subtitle: 'Understand Price Movements & Leverage', color: 'var(--loss)', bg: 'rgba(239, 68, 68, 0.08)', logo: '/logos/fno.jpg' }
];

export default function LearnIndex() {
  return (
    <div className="max-w-6xl mx-auto space-y-16 pb-12">
      {/* Academy Hero Header */}
      <div className="flex flex-col gap-2">
        <div className="sub-heading">Financial Engine Modules</div>
        <h1 className="text-4xl sm:text-5xl font-extrabold text-text-primary tracking-tight">
          Learn & Simulate
        </h1>
        <p className="text-text-secondary text-base sm:text-lg max-w-2xl mt-1 leading-relaxed">
          Master the mechanics of 7 core asset classes. Read plain-language breakdowns, chat with virtual mentors, and experiment with risk-free interactive simulations.
        </p>
      </div>

      {/* 7 Asset Class Interactive Modules */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MODULES.map((mod, idx) => (
          <Link href={`/learn/${mod.id}`} key={mod.id}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.08 }}
              className="card p-7 flex flex-col items-start hover:-translate-y-1 h-full cursor-pointer group relative overflow-hidden shadow-sm hover:shadow-xl rounded-3xl border border-border hover:border-accent/50"
            >
              <div className="w-16 h-16 rounded-2xl mb-5 overflow-hidden border border-border/40 bg-card shadow-md transition-transform group-hover:scale-105 group-hover:shadow-lg flex items-center justify-center shrink-0">
                <img src={mod.logo} alt={mod.title} className="w-full h-full object-cover" />
              </div>
              <h2 className="text-2xl font-black mb-1.5 text-text-primary group-hover:text-accent transition-colors">{mod.title}</h2>
              <p className="text-text-secondary font-medium text-xs sm:text-sm mb-6 flex-1 leading-relaxed">{mod.subtitle}</p>
              
              <div className="w-full flex items-center justify-between pt-5 border-t border-border">
                <div className="flex items-center gap-2">
                  <svg className="w-5 h-5 transform -rotate-90">
                    <circle cx="10" cy="10" r="8" stroke="var(--border)" strokeWidth="2.5" fill="none" />
                    <circle cx="10" cy="10" r="8" stroke={mod.color} strokeWidth="2.5" fill="none" strokeDasharray="50.2" strokeDashoffset="50.2" />
                  </svg>
                  <span className="text-[11px] font-bold text-text-muted">Interactive Module</span>
                </div>
                {mod.id === 'stocks' && (
                  <span className="text-[10px] uppercase font-extrabold text-accent bg-accent-bg px-2.5 py-1 rounded-md border border-accent/20">Recommended</span>
                )}
              </div>
            </motion.div>
          </Link>
        ))}
      </div>

      {/* Official & Globally Recognised Knowledge Vault */}
      <section className="pt-4 border-t border-border/70">
        <ExternalKnowledgeVault />
      </section>
    </div>
  );
}
