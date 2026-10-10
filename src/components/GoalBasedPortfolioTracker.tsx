'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Target, ShieldCheck, TrendingUp, Sparkles, 
  Home, GraduationCap, Umbrella, CheckCircle2, Plus 
} from 'lucide-react';

export function GoalBasedPortfolioTracker() {
  const [goals, setGoals] = useState([
    {
      id: 1,
      title: 'Retirement Wealth Corpus (2040)',
      category: 'Retirement',
      targetAmount: 25000000,
      currentAllocated: 9500000,
      targetYear: 2040,
      cagrNeeded: 12.5,
      icon: '🏖️',
      color: '#7C3AED',
      probability: 92
    },
    {
      id: 2,
      title: 'House Down Payment (2028)',
      category: 'Real Estate',
      targetAmount: 5000000,
      currentAllocated: 2800000,
      targetYear: 2028,
      cagrNeeded: 10.8,
      icon: '🏠',
      color: '#10B981',
      probability: 88
    },
    {
      id: 3,
      title: 'Emergency Liquidity Buffer',
      category: 'Safety Net',
      targetAmount: 600000,
      currentAllocated: 600000,
      targetYear: 2026,
      cagrNeeded: 6.5,
      icon: '🛡️',
      color: '#F59E0B',
      probability: 100
    },
    {
      id: 4,
      title: 'Child Higher Education (2035)',
      category: 'Education',
      targetAmount: 7500000,
      currentAllocated: 2200000,
      targetYear: 2035,
      cagrNeeded: 11.2,
      icon: '🎓',
      color: '#EC4899',
      probability: 84
    }
  ]);

  return (
    <div className="card p-6 bg-surface border border-border rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-accent-bg text-accent flex items-center justify-center border border-accent/20 shadow-sm shrink-0">
            <Target size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-accent-bg text-accent text-[10px] font-black uppercase tracking-wider border border-accent/20">
                Life Goal Buckets
              </span>
              <span className="text-[10px] font-bold text-text-muted">Monte Carlo Inflation Models</span>
            </div>
            <h3 className="font-extrabold text-lg text-text-primary mt-0.5">
              Goal-Based Portfolio Bucketing & Milestone Tracker
            </h3>
          </div>
        </div>

        <button className="px-4 py-2 rounded-xl bg-bg border border-border hover:border-accent text-xs font-extrabold text-text-primary flex items-center gap-2 transition-colors cursor-pointer shrink-0">
          <Plus size={16} className="text-accent" />
          <span>Add New Goal Bucket</span>
        </button>
      </div>

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {goals.map((g) => {
          const progressPct = Math.min(100, (g.currentAllocated / g.targetAmount) * 100);
          return (
            <div key={g.id} className="p-5 rounded-2xl bg-bg border border-border space-y-4 flex flex-col justify-between">
              
              <div>
                <div className="flex justify-between items-start gap-2 mb-2">
                  <div className="flex items-center gap-2.5">
                    <span className="text-2xl p-1.5 rounded-xl bg-surface border border-border shadow-sm">{g.icon}</span>
                    <div>
                      <h4 className="font-extrabold text-sm text-text-primary">{g.title}</h4>
                      <span className="text-[10px] text-text-muted font-bold">Target Year: {g.targetYear}</span>
                    </div>
                  </div>
                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider ${
                    progressPct === 100 ? 'bg-gain-bg text-gain border border-gain/30' : 'bg-accent-bg text-accent border border-accent/30'
                  }`}>
                    {progressPct.toFixed(0)}% Achieved
                  </span>
                </div>

                {/* Progress Bar */}
                <div className="space-y-1.5 mt-3">
                  <div className="w-full h-2.5 bg-surface rounded-full overflow-hidden p-0.5 border border-border">
                    <div 
                      className="h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${progressPct}%`, backgroundColor: g.color }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-[11px] font-mono font-bold text-text-secondary pt-0.5">
                    <span>Allocated: ₹{g.currentAllocated.toLocaleString('en-IN')}</span>
                    <span>Target: ₹{g.targetAmount.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-surface border border-border flex justify-between items-center text-[11px] font-bold text-text-secondary">
                <span className="flex items-center gap-1">
                  📈 Required CAGR: <strong className="text-text-primary">{g.cagrNeeded}%</strong>
                </span>
                <span className="text-gain flex items-center gap-1">
                  <CheckCircle2 size={13} /> {g.probability}% Success Probability
                </span>
              </div>

            </div>
          );
        })}
      </div>

    </div>
  );
}
