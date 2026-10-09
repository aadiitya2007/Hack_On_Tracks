'use client';

import { motion } from 'framer-motion';
import { FloatingCard } from '@/components/ui/floating-card';

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.1 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
};

export default function Explore() {
  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Explore Alternatives</h1>
        <p className="text-slate-400 mt-2">Discover high-yield assets beyond traditional stocks and mutual funds.</p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-3 gap-6"
      >
        <motion.div variants={item}>
          <FloatingCard className="p-6 h-full flex flex-col group border-t-4 border-t-blue-500">
            <h3 className="text-xl font-bold mb-2 text-blue-400">REITs</h3>
            <p className="text-sm text-slate-300 font-medium mb-4">Real Estate Investment Trusts</p>
            <p className="text-sm text-slate-400 mb-6 flex-1">
              Invest in income-generating real estate like office spaces and malls without buying physical property. They are mandated to distribute 90% of their taxable income as dividends.
            </p>
            <div className="pt-4 border-t border-slate-800">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Typical Yield</span>
                <span className="font-medium text-emerald-400">6% - 8%</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-slate-500">Risk Profile</span>
                <span className="font-medium text-amber-400">Moderate</span>
              </div>
            </div>
          </FloatingCard>
        </motion.div>

        <motion.div variants={item}>
          <FloatingCard className="p-6 h-full flex flex-col group border-t-4 border-t-purple-500">
            <h3 className="text-xl font-bold mb-2 text-purple-400">InvITs</h3>
            <p className="text-sm text-slate-300 font-medium mb-4">Infrastructure Investment Trusts</p>
            <p className="text-sm text-slate-400 mb-6 flex-1">
              Similar to REITs, but for infrastructure projects like highways, power transmission lines, and gas pipelines. Backed by long-term government or corporate contracts.
            </p>
            <div className="pt-4 border-t border-slate-800">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Typical Yield</span>
                <span className="font-medium text-emerald-400">8% - 11%</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-slate-500">Risk Profile</span>
                <span className="font-medium text-amber-400">Moderate</span>
              </div>
            </div>
          </FloatingCard>
        </motion.div>

        <motion.div variants={item}>
          <FloatingCard className="p-6 h-full flex flex-col group border-t-4 border-t-emerald-500">
            <h3 className="text-xl font-bold mb-2 text-emerald-400">Govt Bonds</h3>
            <p className="text-sm text-slate-300 font-medium mb-4">Sovereign Debt</p>
            <p className="text-sm text-slate-400 mb-6 flex-1">
              Lend money to the government in exchange for regular interest payments. The safest investment instrument available in the Indian market with guaranteed returns.
            </p>
            <div className="pt-4 border-t border-slate-800">
              <div className="flex justify-between items-center text-sm">
                <span className="text-slate-500">Typical Yield</span>
                <span className="font-medium text-emerald-400">7% - 7.5%</span>
              </div>
              <div className="flex justify-between items-center text-sm mt-2">
                <span className="text-slate-500">Risk Profile</span>
                <span className="font-medium text-emerald-400">Very Low</span>
              </div>
            </div>
          </FloatingCard>
        </motion.div>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8"
      >
        <FloatingCard className="p-8">
          <h3 className="text-xl font-bold mb-6">Mix Comparison</h3>
          <div className="space-y-6">
            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Conservative Portfolio (Target 8%)</span>
              </div>
              <div className="w-full h-4 rounded-full flex overflow-hidden">
                <div className="bg-emerald-500 h-full w-[60%]" title="Bonds 60%"></div>
                <div className="bg-blue-500 h-full w-[30%]" title="Stocks 30%"></div>
                <div className="bg-purple-500 h-full w-[10%]" title="InvITs 10%"></div>
              </div>
              <div className="flex gap-4 mt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Bonds (60%)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Stocks (30%)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> InvITs (10%)</span>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-sm mb-2">
                <span className="font-medium">Yield-Focused Portfolio (Target 10%)</span>
              </div>
              <div className="w-full h-4 rounded-full flex overflow-hidden">
                <div className="bg-purple-500 h-full w-[40%]" title="InvITs 40%"></div>
                <div className="bg-blue-400 h-full w-[30%]" title="REITs 30%"></div>
                <div className="bg-emerald-500 h-full w-[20%]" title="Bonds 20%"></div>
                <div className="bg-blue-500 h-full w-[10%]" title="Stocks 10%"></div>
              </div>
              <div className="flex gap-4 mt-2 text-xs text-slate-400">
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-purple-500"></span> InvITs (40%)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-400"></span> REITs (30%)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-emerald-500"></span> Bonds (20%)</span>
                <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Stocks (10%)</span>
              </div>
            </div>
          </div>
        </FloatingCard>
      </motion.div>
    </div>
  );
}
