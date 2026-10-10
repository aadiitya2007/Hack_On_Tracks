'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { BookOpen, CheckCircle2 } from 'lucide-react';

const MODULES = [
  { id: 'stocks', title: 'Stocks', subtitle: 'Own a Piece of a Company', color: 'var(--asset-stocks)', bg: 'rgba(109, 40, 217, 0.08)' },
  { id: 'mutual-funds', title: 'Mutual Funds', subtitle: 'Invest Through a Basket', color: 'var(--asset-funds)', bg: 'rgba(249, 115, 22, 0.08)' },
  { id: 'etfs', title: 'ETFs', subtitle: 'A Basket You Can Trade', color: 'var(--asset-stocks)', bg: 'rgba(37, 99, 235, 0.08)' },
  { id: 'bonds', title: 'Bonds', subtitle: 'Become a Lender', color: 'var(--asset-bonds)', bg: 'rgba(217, 119, 6, 0.08)' },
  { id: 'reits', title: 'REITs', subtitle: 'Real Estate Without the Building', color: 'var(--asset-reits)', bg: 'rgba(13, 148, 136, 0.08)' },
  { id: 'invits', title: 'InvITs', subtitle: 'Infrastructure Behind Everyday Life', color: 'var(--asset-invits)', bg: 'rgba(124, 58, 237, 0.08)' }
];

export default function LearnIndex() {
  return (
    <div className="max-w-6xl mx-auto space-y-10">
      <div className="flex flex-col gap-2">
        <div className="sub-heading">Financial Engine Modules</div>
        <h1 className="text-4xl font-extrabold text-text-primary">Learn & Simulate</h1>
        <p className="text-text-secondary text-lg max-w-2xl mt-2">
          Master the mechanics of 6 core asset classes. Read plain-language breakdowns, chat with virtual mentors, and experiment with risk-free interactive simulations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {MODULES.map((mod, idx) => (
          <Link href={`/learn/${mod.id}`} key={mod.id}>
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              className="card p-8 flex flex-col items-start hover:-translate-y-1 h-full cursor-pointer group"
            >
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-transform group-hover:scale-110" style={{ backgroundColor: mod.bg, color: mod.color }}>
                <BookOpen size={24} />
              </div>
              <h2 className="text-2xl font-bold mb-2">{mod.title}</h2>
              <p className="text-text-secondary font-medium mb-8 flex-1">{mod.subtitle}</p>
              
              <div className="w-full flex items-center justify-between pt-6 border-t border-border">
                <div className="flex items-center gap-2">
                  {/* Mock progress ring */}
                  <svg className="w-6 h-6 transform -rotate-90">
                    <circle cx="12" cy="12" r="10" stroke="var(--border)" strokeWidth="3" fill="none" />
                    <circle cx="12" cy="12" r="10" stroke={mod.color} strokeWidth="3" fill="none" strokeDasharray="62.8" strokeDashoffset={mod.id === 'stocks' ? "62.8" : "62.8"} />
                  </svg>
                  <span className="text-xs font-bold text-text-muted">0% Complete</span>
                </div>
                {mod.id === 'stocks' && (
                  <span className="text-[10px] uppercase font-bold text-accent bg-accent-bg px-2 py-1 rounded-md">Recommended</span>
                )}
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
