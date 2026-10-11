'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Target, ShieldCheck, TrendingUp, Sparkles, 
  Home, GraduationCap, CheckCircle2, Plus, 
  X, Calendar, Calculator, ArrowRight, Trash2, 
  Clock, DollarSign, Layers, PieChart as PieIcon,
  Percent, AlertCircle, RefreshCw, ChevronRight, Zap
} from 'lucide-react';

export interface GoalBucket {
  id: string;
  title: string;
  category: string;
  targetAmount: number;
  currentAllocated: number;
  targetYear: number;
  expectedCagr: number;
  cagrNeeded: number;
  icon: string;
  color: string;
  probability: number;
  monthlySip: number;
  recommendedStrategy: string;
  linkedHoldings: string[];
  notes?: string;
}

const TEMPLATE_PRESETS = [
  {
    title: 'Retirement Wealth Corpus',
    category: 'Retirement',
    icon: '🏖️',
    color: '#7C3AED',
    defaultYears: 15,
    defaultTarget: 25000000,
    defaultAllocated: 5000000,
    expectedCagr: 12.5,
    strategy: '70% Equity Index & Flexi Cap + 30% Govt G-Secs / Corporate Bonds'
  },
  {
    title: 'Dream Home Down Payment',
    category: 'Real Estate',
    icon: '🏠',
    color: '#10B981',
    defaultYears: 4,
    defaultTarget: 5000000,
    defaultAllocated: 1500000,
    expectedCagr: 10.5,
    strategy: '50% Large Cap Equity + 50% Short Duration Debt Funds'
  },
  {
    title: 'Child Higher Education / College',
    category: 'Education',
    icon: '🎓',
    color: '#EC4899',
    defaultYears: 10,
    defaultTarget: 7500000,
    defaultAllocated: 1200000,
    expectedCagr: 12.0,
    strategy: '80% Equity Multi-Cap Funds + 20% Sovereign Gold Bonds (SGB)'
  },
  {
    title: 'Electric Vehicle / Luxury Car',
    category: 'Automobile',
    icon: '🚗',
    color: '#06B6D4',
    defaultYears: 3,
    defaultTarget: 2500000,
    defaultAllocated: 600000,
    expectedCagr: 9.5,
    strategy: '40% Hybrid Balanced Advantage + 60% Corporate Bond Funds'
  },
  {
    title: 'International Luxury World Tour',
    category: 'Lifestyle',
    icon: '✈️',
    color: '#F59E0B',
    defaultYears: 2,
    defaultTarget: 1200000,
    defaultAllocated: 400000,
    expectedCagr: 8.5,
    strategy: '30% Arbitrage / Conservative Equity + 70% Ultra Short Debt'
  },
  {
    title: 'Emergency Liquidity Buffer (12 Months)',
    category: 'Safety Net',
    icon: '🛡️',
    color: '#6366F1',
    defaultYears: 1,
    defaultTarget: 1000000,
    defaultAllocated: 750000,
    expectedCagr: 6.8,
    strategy: '100% Liquid Funds & Overnight Treasury Bills'
  },
  {
    title: 'Financial Independence & Early Retirement (FIRE)',
    category: 'Independence',
    icon: '🚀',
    color: '#8B5CF6',
    defaultYears: 12,
    defaultTarget: 40000000,
    defaultAllocated: 8000000,
    expectedCagr: 13.0,
    strategy: '85% Nifty 50, Midcap 150 & Nasdaq 100 + 15% Gold & Reits'
  }
];

const INITIAL_GOALS: GoalBucket[] = [
  {
    id: 'g-1',
    title: 'Retirement Wealth Corpus (2040)',
    category: 'Retirement',
    targetAmount: 25000000,
    currentAllocated: 9500000,
    targetYear: 2040,
    expectedCagr: 12.5,
    cagrNeeded: 12.5,
    icon: '🏖️',
    color: '#7C3AED',
    probability: 92,
    monthlySip: 42500,
    recommendedStrategy: '70% Equity Index & Flexi Cap + 30% Govt G-Secs',
    linkedHoldings: ['RELIANCE', 'PPFAS', 'TCS']
  },
  {
    id: 'g-2',
    title: 'House Down Payment (2028)',
    category: 'Real Estate',
    targetAmount: 5000000,
    currentAllocated: 2800000,
    targetYear: 2028,
    expectedCagr: 10.8,
    cagrNeeded: 10.8,
    icon: '🏠',
    color: '#10B981',
    probability: 88,
    monthlySip: 28400,
    recommendedStrategy: '50% Large Cap Equity + 50% Short Duration Debt',
    linkedHoldings: ['HDFCBANK', 'INFY']
  },
  {
    id: 'g-3',
    title: 'Emergency Liquidity Buffer',
    category: 'Safety Net',
    targetAmount: 600000,
    currentAllocated: 600000,
    targetYear: 2026,
    expectedCagr: 6.5,
    cagrNeeded: 6.5,
    icon: '🛡️',
    color: '#F59E0B',
    probability: 100,
    monthlySip: 0,
    recommendedStrategy: '100% Liquid Funds & Overnight Treasury Bills',
    linkedHoldings: ['CASH']
  },
  {
    id: 'g-4',
    title: 'Child Higher Education (2035)',
    category: 'Education',
    targetAmount: 7500000,
    currentAllocated: 2200000,
    targetYear: 2035,
    expectedCagr: 11.2,
    cagrNeeded: 11.2,
    icon: '🎓',
    color: '#EC4899',
    probability: 84,
    monthlySip: 21800,
    recommendedStrategy: '80% Equity Multi-Cap Funds + 20% Gold ETFs',
    linkedHoldings: ['TATAMOTORS', 'SBIN']
  }
];

// SIP & Compounding Math Calculation Utility
function calculateGoalPlanning(
  targetAmount: number,
  currentAllocated: number,
  targetYear: number,
  expectedCagr: number
) {
  const currentYear = new Date().getFullYear();
  const years = Math.max(1, targetYear - currentYear);
  const totalMonths = years * 12;
  const monthlyRate = expectedCagr / 100 / 12;

  // Compounded value of current allocated capital
  const fvOfCurrent = currentAllocated * Math.pow(1 + monthlyRate, totalMonths);
  const shortfall = Math.max(0, targetAmount - fvOfCurrent);

  let monthlySip = 0;
  if (shortfall > 0 && monthlyRate > 0) {
    // Standard annuity formula for monthly SIP:
    // SIP = Shortfall * r / ( ((1 + r)^n - 1) * (1 + r) )
    const factor = (Math.pow(1 + monthlyRate, totalMonths) - 1) * (1 + monthlyRate);
    monthlySip = Math.round((shortfall * monthlyRate) / factor);
  }

  // Monte Carlo success probability heuristic based on horizon & allocation
  let probability = 85;
  if (currentAllocated >= targetAmount) {
    probability = 100;
  } else if (years >= 10) {
    probability = Math.min(96, Math.max(78, Math.round(92 + (currentAllocated / targetAmount) * 8)));
  } else if (years >= 5) {
    probability = Math.min(92, Math.max(74, Math.round(86 + (currentAllocated / targetAmount) * 10)));
  } else {
    probability = Math.min(88, Math.max(68, Math.round(80 + (currentAllocated / targetAmount) * 12)));
  }

  // Required CAGR if no new SIP added
  let cagrNeeded = expectedCagr;
  if (currentAllocated > 0 && currentAllocated < targetAmount) {
    const rawCagr = (Math.pow(targetAmount / currentAllocated, 1 / years) - 1) * 100;
    cagrNeeded = Math.round(rawCagr * 10) / 10;
  }

  // Inflation adjusted target (assumes 6% annual inflation)
  const inflationTarget = Math.round(targetAmount * Math.pow(1 + 0.06, years));

  return {
    years,
    totalMonths,
    fvOfCurrent: Math.round(fvOfCurrent),
    shortfall: Math.round(shortfall),
    monthlySip,
    probability,
    cagrNeeded,
    inflationTarget
  };
}

export function GoalBasedPortfolioTracker() {
  const [goals, setGoals] = useState<GoalBucket[]>(INITIAL_GOALS);
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [selectedGoalForPlan, setSelectedGoalForPlan] = useState<GoalBucket | null>(null);
  const [topUpModalGoal, setTopUpModalGoal] = useState<GoalBucket | null>(null);
  const [topUpAmount, setTopUpAmount] = useState(100000);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Form State for Adding New Goal
  const [formTitle, setFormTitle] = useState('');
  const [formCategory, setFormCategory] = useState('Wealth Creation');
  const [formIcon, setFormIcon] = useState('🎯');
  const [formColor, setFormColor] = useState('#7C3AED');
  const [formTargetAmount, setFormTargetAmount] = useState(2500000);
  const [formCurrentAllocated, setFormCurrentAllocated] = useState(200000);
  const [formTargetYear, setFormTargetYear] = useState(new Date().getFullYear() + 5);
  const [formExpectedCagr, setFormExpectedCagr] = useState(12.0);
  const [formStrategy, setFormStrategy] = useState('70% Equity Index Funds + 30% Fixed Income');

  // Load and persist to localStorage
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('unify_goal_buckets');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setGoals(parsed);
          }
        } catch (e) {
          console.error('Failed to parse stored goals:', e);
        }
      }
    }
  }, []);

  const saveGoals = (updated: GoalBucket[]) => {
    setGoals(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('unify_goal_buckets', JSON.stringify(updated));
    }
  };

  // Toast timer
  useEffect(() => {
    if (toastMessage) {
      const t = setTimeout(() => setToastMessage(null), 4000);
      return () => clearTimeout(t);
    }
  }, [toastMessage]);

  // Handle template selection
  const handleSelectTemplate = (template: typeof TEMPLATE_PRESETS[0]) => {
    const currentYr = new Date().getFullYear();
    setFormTitle(template.title);
    setFormCategory(template.category);
    setFormIcon(template.icon);
    setFormColor(template.color);
    setFormTargetYear(currentYr + template.defaultYears);
    setFormTargetAmount(template.defaultTarget);
    setFormCurrentAllocated(template.defaultAllocated);
    setFormExpectedCagr(template.expectedCagr);
    setFormStrategy(template.strategy);
  };

  // Computed planning for currently open form
  const formPlan = calculateGoalPlanning(
    formTargetAmount,
    formCurrentAllocated,
    formTargetYear,
    formExpectedCagr
  );

  // Submit New Goal
  const handleCreateGoal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    const newGoal: GoalBucket = {
      id: 'g-' + Date.now(),
      title: formTitle,
      category: formCategory,
      targetAmount: Number(formTargetAmount),
      currentAllocated: Number(formCurrentAllocated),
      targetYear: Number(formTargetYear),
      expectedCagr: Number(formExpectedCagr),
      cagrNeeded: formPlan.cagrNeeded,
      icon: formIcon,
      color: formColor,
      probability: formPlan.probability,
      monthlySip: formPlan.monthlySip,
      recommendedStrategy: formStrategy,
      linkedHoldings: ['RELIANCE', 'PPFAS']
    };

    const updated = [newGoal, ...goals];
    saveGoals(updated);
    setAddModalOpen(false);
    setToastMessage(`✓ Goal "${newGoal.title}" created with ₹${newGoal.monthlySip.toLocaleString('en-IN')}/mo SIP Plan!`);

    // Reset defaults
    setFormTitle('');
  };

  // Delete Goal
  const handleDeleteGoal = (goalId: string, title: string) => {
    const updated = goals.filter(g => g.id !== goalId);
    saveGoals(updated);
    if (selectedGoalForPlan?.id === goalId) setSelectedGoalForPlan(null);
    setToastMessage(`✓ Removed goal bucket "${title}"`);
  };

  // Top Up Goal Capital
  const handleExecuteTopUp = () => {
    if (!topUpModalGoal) return;
    const updated = goals.map(g => {
      if (g.id === topUpModalGoal.id) {
        const newAlloc = g.currentAllocated + topUpAmount;
        const newPlan = calculateGoalPlanning(g.targetAmount, newAlloc, g.targetYear, g.expectedCagr);
        return {
          ...g,
          currentAllocated: newAlloc,
          monthlySip: newPlan.monthlySip,
          probability: newPlan.probability,
          cagrNeeded: newPlan.cagrNeeded
        };
      }
      return g;
    });

    saveGoals(updated);
    setTopUpModalGoal(null);
    setToastMessage(`✓ Allocated +₹${topUpAmount.toLocaleString('en-IN')} to "${topUpModalGoal.title}"!`);
  };

  return (
    <div className="card p-6 md:p-8 bg-surface border border-border rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-2xl bg-accent-bg text-accent flex items-center justify-center border border-accent/20 shadow-md shrink-0">
            <Target size={24} />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="px-2.5 py-0.5 rounded-full bg-accent-bg text-accent text-[10px] font-black uppercase tracking-wider border border-accent/20">
                Life Goal Buckets
              </span>
              <span className="text-[10px] font-bold text-text-muted flex items-center gap-1">
                <Sparkles size={11} className="text-accent" /> Monte Carlo Inflation & Compounding Engine
              </span>
            </div>
            <h3 className="font-extrabold text-xl text-text-primary mt-1">
              Goal-Based Portfolio Bucketing & Milestone Tracker
            </h3>
          </div>
        </div>

        {/* Actionable Add Button */}
        <button 
          type="button"
          onClick={() => {
            handleSelectTemplate(TEMPLATE_PRESETS[1]); // Default to House template
            setAddModalOpen(true);
          }}
          className="btn-primary py-2.5 px-4 text-xs font-extrabold flex items-center gap-2 shadow-md shadow-accent/25 active:scale-95 cursor-pointer shrink-0"
        >
          <Plus size={16} />
          <span>Add New Goal Bucket</span>
        </button>
      </div>

      {/* Goal Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {goals.map((g) => {
          const progressPct = Math.min(100, (g.currentAllocated / g.targetAmount) * 100);
          const currentYr = new Date().getFullYear();
          const yearsRemaining = Math.max(1, g.targetYear - currentYr);

          return (
            <div 
              key={g.id} 
              className="p-5 sm:p-6 rounded-3xl bg-bg border border-border hover:border-accent/40 transition-all flex flex-col justify-between space-y-5 shadow-sm group"
            >
              <div>
                {/* Card Top Row */}
                <div className="flex justify-between items-start gap-2 mb-3">
                  <div className="flex items-center gap-3">
                    <span className="text-2xl p-2 rounded-2xl bg-surface border border-border shadow-sm group-hover:scale-105 transition-transform">
                      {g.icon}
                    </span>
                    <div>
                      <h4 className="font-extrabold text-base text-text-primary leading-tight">
                        {g.title}
                      </h4>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className="text-[11px] text-text-muted font-bold">
                          Target: {g.targetYear} ({yearsRemaining}y left)
                        </span>
                        <span className="text-[10px] uppercase font-extrabold px-1.5 py-0.2 rounded bg-surface border border-border text-text-muted">
                          {g.category}
                        </span>
                      </div>
                    </div>
                  </div>

                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider shrink-0 ${
                    progressPct >= 100 
                      ? 'bg-gain-bg text-gain border border-gain/30' 
                      : 'bg-accent-bg text-accent border border-accent/30'
                  }`}>
                    {progressPct.toFixed(0)}% Achieved
                  </span>
                </div>

                {/* Progress Bar & Financial Figures */}
                <div className="space-y-2 mt-4">
                  <div className="w-full h-3 bg-surface rounded-full overflow-hidden p-0.5 border border-border">
                    <div 
                      className="h-full rounded-full transition-all duration-1000" 
                      style={{ width: `${Math.max(3, progressPct)}%`, backgroundColor: g.color }}
                    />
                  </div>
                  
                  <div className="flex justify-between text-xs font-mono font-bold text-text-secondary pt-0.5">
                    <span>
                      Allocated: <strong className="text-text-primary">₹{g.currentAllocated.toLocaleString('en-IN')}</strong>
                    </span>
                    <span>
                      Target: <strong className="text-text-primary">₹{g.targetAmount.toLocaleString('en-IN')}</strong>
                    </span>
                  </div>
                </div>
              </div>

              {/* Real Planning Metrics Box */}
              <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-2 text-xs">
                <div className="flex justify-between items-center text-[11px] font-bold text-text-secondary">
                  <span className="flex items-center gap-1.5">
                    📈 Required CAGR: <strong className="text-text-primary">{g.cagrNeeded}%</strong>
                  </span>
                  <span className="text-gain flex items-center gap-1 font-bold">
                    <CheckCircle2 size={13} /> {g.probability}% Success Chance
                  </span>
                </div>

                <div className="flex justify-between items-center text-[11px] border-t border-border/60 pt-2 text-text-muted">
                  <span>Required Monthly SIP:</span>
                  <span className="font-extrabold font-mono text-accent">
                    {g.monthlySip > 0 ? `₹${g.monthlySip.toLocaleString('en-IN')}/month` : 'Target Fully Funded!'}
                  </span>
                </div>
              </div>

              {/* Action Buttons Row */}
              <div className="flex items-center gap-2 pt-1 border-t border-border/40">
                <button
                  type="button"
                  onClick={() => setSelectedGoalForPlan(g)}
                  className="flex-1 py-2 px-3 rounded-xl bg-surface border border-border hover:border-accent hover:text-accent text-[11px] font-extrabold text-text-primary flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Calculator size={13} />
                  <span>View Milestone Plan</span>
                </button>

                <button
                  type="button"
                  onClick={() => setTopUpModalGoal(g)}
                  className="py-2 px-3 rounded-xl bg-accent-bg border border-accent/25 hover:bg-accent hover:text-white text-[11px] font-extrabold text-accent transition-colors flex items-center gap-1 cursor-pointer"
                  title="Allocate capital to this goal"
                >
                  <Plus size={13} />
                  <span>Top Up</span>
                </button>

                <button
                  type="button"
                  onClick={() => handleDeleteGoal(g.id, g.title)}
                  className="p-2 rounded-xl text-text-muted hover:text-loss hover:bg-destructive/10 transition-colors cursor-pointer"
                  title="Delete goal"
                >
                  <Trash2 size={14} />
                </button>
              </div>

            </div>
          );
        })}
      </div>

      {/* MODAL 1: ADD NEW GOAL BUCKET & DEPLOY PLAN */}
      <AnimatePresence>
        {addModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setAddModalOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              className="w-full max-w-2xl bg-surface border border-border rounded-3xl p-6 md:p-8 relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6"
            >
              {/* Modal Header */}
              <div className="flex justify-between items-start border-b border-border pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="p-1.5 rounded-xl bg-accent-bg text-accent"><Target size={20} /></span>
                    <h3 className="text-xl font-black text-text-primary">Create New Life Goal Bucket</h3>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">
                    Deploy institutional Monte Carlo inflation modeling and real-time SIP planning.
                  </p>
                </div>
                <button
                  onClick={() => setAddModalOpen(false)}
                  className="p-1.5 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Template Quick Selection */}
              <div>
                <label className="text-[10px] font-black uppercase text-text-muted tracking-wider block mb-2">
                  Select Goal Preset / Template
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {TEMPLATE_PRESETS.slice(0, 8).map((tpl, i) => (
                    <button
                      key={i}
                      type="button"
                      onClick={() => handleSelectTemplate(tpl)}
                      className={`p-2.5 rounded-2xl border text-left flex flex-col justify-between transition-all cursor-pointer ${
                        formTitle === tpl.title 
                          ? 'bg-accent/15 border-accent shadow-sm' 
                          : 'bg-bg border-border hover:border-accent/40'
                      }`}
                    >
                      <span className="text-xl">{tpl.icon}</span>
                      <span className="text-[11px] font-extrabold text-text-primary mt-1 line-clamp-1">
                        {tpl.title}
                      </span>
                      <span className="text-[9px] text-text-muted mt-0.5">
                        ₹{(tpl.defaultTarget / 100000).toFixed(0)}L • {tpl.defaultYears}y
                      </span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Form Input Fields */}
              <form onSubmit={handleCreateGoal} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div className="sm:col-span-2">
                    <label className="text-[10px] font-extrabold uppercase text-text-muted">Goal Title</label>
                    <input 
                      type="text" 
                      value={formTitle}
                      onChange={e => setFormTitle(e.target.value)}
                      placeholder="e.g. Dream House Down Payment"
                      required
                      className="w-full mt-1 bg-bg border border-border rounded-xl px-3.5 py-2.5 text-xs font-bold text-text-primary focus:outline-none focus:border-accent"
                    />
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase text-text-muted">Target Year</label>
                    <select
                      value={formTargetYear}
                      onChange={e => setFormTargetYear(Number(e.target.value))}
                      className="w-full mt-1 bg-bg border border-border rounded-xl px-3.5 py-2.5 text-xs font-bold text-text-primary focus:outline-none focus:border-accent cursor-pointer"
                    >
                      {Array.from({ length: 25 }, (_, i) => new Date().getFullYear() + i + 1).map(yr => (
                        <option key={yr} value={yr}>
                          {yr} ({yr - new Date().getFullYear()} yrs)
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] font-extrabold uppercase text-text-muted">Target Corpus Needed</label>
                      <span className="text-[11px] font-mono font-bold text-accent">
                        ₹{(formTargetAmount / 100000).toFixed(1)} Lakhs
                      </span>
                    </div>
                    <input 
                      type="number" 
                      min={100000}
                      step={50000}
                      value={formTargetAmount}
                      onChange={e => setFormTargetAmount(Number(e.target.value))}
                      required
                      className="w-full bg-bg border border-border rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-text-primary focus:outline-none focus:border-accent"
                    />
                    <div className="flex gap-1 mt-1.5">
                      {[1000000, 2500000, 5000000, 10000000].map(amt => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setFormTargetAmount(amt)}
                          className="px-2 py-0.5 rounded bg-bg border border-border text-[9px] font-bold text-text-muted hover:text-accent hover:border-accent"
                        >
                          ₹{amt / 100000}L
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-1">
                      <label className="text-[10px] font-extrabold uppercase text-text-muted">Initial Seed Capital Allocated</label>
                      <span className="text-[11px] font-mono font-bold text-gain">
                        ₹{(formCurrentAllocated / 100000).toFixed(1)} Lakhs
                      </span>
                    </div>
                    <input 
                      type="number" 
                      min={0}
                      step={25000}
                      value={formCurrentAllocated}
                      onChange={e => setFormCurrentAllocated(Number(e.target.value))}
                      className="w-full bg-bg border border-border rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-text-primary focus:outline-none focus:border-accent"
                    />
                    <div className="flex gap-1 mt-1.5">
                      {[100000, 500000, 1000000, 2000000].map(amt => (
                        <button
                          key={amt}
                          type="button"
                          onClick={() => setFormCurrentAllocated(amt)}
                          className="px-2 py-0.5 rounded bg-bg border border-border text-[9px] font-bold text-text-muted hover:text-accent hover:border-accent"
                        >
                          ₹{amt / 100000}L
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Return Expectations & Asset Class Strategy */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-[10px] font-extrabold uppercase text-text-muted">Expected Annual CAGR (%)</label>
                    <select
                      value={formExpectedCagr}
                      onChange={e => setFormExpectedCagr(Number(e.target.value))}
                      className="w-full mt-1 bg-bg border border-border rounded-xl px-3.5 py-2.5 text-xs font-bold text-text-primary focus:outline-none focus:border-accent cursor-pointer"
                    >
                      <option value={13.0}>Aggressive Equity (13.0% CAGR)</option>
                      <option value={12.0}>Diversified Equity / Flexi Cap (12.0% CAGR)</option>
                      <option value={10.5}>Balanced Advantage / Hybrid (10.5% CAGR)</option>
                      <option value={8.5}>Conservative Debt + Gold (8.5% CAGR)</option>
                      <option value={7.0}>Capital Preservation / Fixed Income (7.0% CAGR)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase text-text-muted">Recommended Asset Mix</label>
                    <input 
                      type="text" 
                      value={formStrategy}
                      onChange={e => setFormStrategy(e.target.value)}
                      className="w-full mt-1 bg-bg border border-border rounded-xl px-3.5 py-2.5 text-xs font-bold text-text-primary focus:outline-none focus:border-accent"
                    />
                  </div>
                </div>

                {/* REAL-TIME PLANNING ENGINE METRICS PREVIEW */}
                <div className="p-4 rounded-2xl bg-bg border border-accent/30 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-accent tracking-wider flex items-center gap-1.5">
                      <Zap size={13} /> Monte Carlo Financial Plan Summary
                    </span>
                    <span className="text-[11px] font-bold text-gain flex items-center gap-1">
                      <CheckCircle2 size={12} /> {formPlan.probability}% Success Probability
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-xs">
                    <div className="p-2.5 rounded-xl bg-surface border border-border">
                      <span className="text-[10px] text-text-muted block">Required Monthly SIP</span>
                      <span className="text-base font-black font-mono text-accent">
                        ₹{formPlan.monthlySip.toLocaleString('en-IN')}/mo
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-surface border border-border">
                      <span className="text-[10px] text-text-muted block">Compounded Seed Capital</span>
                      <span className="text-sm font-black font-mono text-text-primary">
                        ₹{formPlan.fvOfCurrent.toLocaleString('en-IN')}
                      </span>
                    </div>

                    <div className="p-2.5 rounded-xl bg-surface border border-border col-span-2 sm:col-span-1">
                      <span className="text-[10px] text-text-muted block">Inflation Adjusted Target (6%)</span>
                      <span className="text-sm font-black font-mono text-text-secondary">
                        ₹{formPlan.inflationTarget.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Submit Buttons */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setAddModalOpen(false)}
                    className="flex-1 py-3 bg-bg border border-border rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="flex-1 btn-primary py-3 text-xs font-extrabold shadow-lg shadow-accent/25 cursor-pointer"
                  >
                    Deploy Life Goal Bucket →
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* MODAL 2: DETAILED MILESTONE PLAN MODAL */}
      <AnimatePresence>
        {selectedGoalForPlan && (() => {
          const plan = calculateGoalPlanning(
            selectedGoalForPlan.targetAmount,
            selectedGoalForPlan.currentAllocated,
            selectedGoalForPlan.targetYear,
            selectedGoalForPlan.expectedCagr
          );
          const currentYr = new Date().getFullYear();

          return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
              <motion.div 
                initial={{ opacity: 0 }} 
                animate={{ opacity: 1 }} 
                exit={{ opacity: 0 }}
                onClick={() => setSelectedGoalForPlan(null)}
                className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
              />

              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="w-full max-w-xl bg-surface border border-border rounded-3xl p-6 md:p-8 relative z-10 shadow-2xl max-h-[90vh] overflow-y-auto space-y-6"
              >
                {/* Header */}
                <div className="flex justify-between items-start border-b border-border pb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl p-2 rounded-2xl bg-bg border border-border">
                      {selectedGoalForPlan.icon}
                    </span>
                    <div>
                      <h3 className="text-xl font-black text-text-primary">
                        {selectedGoalForPlan.title}
                      </h3>
                      <p className="text-xs text-text-secondary mt-0.5">
                        {selectedGoalForPlan.category} • Target Horizon: {selectedGoalForPlan.targetYear} ({plan.years} years remaining)
                      </p>
                    </div>
                  </div>
                  <button
                    onClick={() => setSelectedGoalForPlan(null)}
                    className="p-1 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg transition-colors"
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Progress Overview */}
                <div className="p-4 rounded-2xl bg-bg border border-border space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-text-muted">Target Corpus</span>
                    <span className="font-mono font-extrabold text-base text-text-primary">
                      ₹{selectedGoalForPlan.targetAmount.toLocaleString('en-IN')}
                    </span>
                  </div>

                  <div className="w-full h-3 bg-surface rounded-full overflow-hidden p-0.5 border border-border">
                    <div 
                      className="h-full rounded-full" 
                      style={{ 
                        width: `${Math.min(100, (selectedGoalForPlan.currentAllocated / selectedGoalForPlan.targetAmount) * 100)}%`,
                        backgroundColor: selectedGoalForPlan.color 
                      }} 
                    />
                  </div>

                  <div className="flex justify-between text-xs font-mono font-bold text-text-secondary">
                    <span>Allocated: ₹{selectedGoalForPlan.currentAllocated.toLocaleString('en-IN')}</span>
                    <span>Remaining Gap: ₹{plan.shortfall.toLocaleString('en-IN')}</span>
                  </div>
                </div>

                {/* SIP & Compounding Breakdown */}
                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3.5 rounded-2xl bg-bg border border-border space-y-1">
                    <span className="text-[10px] text-text-muted uppercase font-bold">Recommended Monthly SIP</span>
                    <p className="text-lg font-black font-mono text-accent">
                      {plan.monthlySip > 0 ? `₹${plan.monthlySip.toLocaleString('en-IN')}` : '₹0 (Achieved)'}
                    </p>
                    <span className="text-[10px] text-text-secondary block">Assumes {selectedGoalForPlan.expectedCagr}% CAGR</span>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-bg border border-border space-y-1">
                    <span className="text-[10px] text-text-muted uppercase font-bold">Monte Carlo Probability</span>
                    <p className="text-lg font-black font-mono text-gain flex items-center gap-1">
                      <CheckCircle2 size={16} /> {plan.probability}%
                    </p>
                    <span className="text-[10px] text-text-secondary block">Based on 1,000 market simulations</span>
                  </div>
                </div>

                {/* Recommended Asset Allocation Strategy */}
                <div className="p-4 rounded-2xl bg-bg border border-border space-y-2 text-xs">
                  <div className="flex items-center gap-2 text-text-primary font-bold">
                    <Layers size={14} className="text-accent" />
                    <span>Recommended Asset Allocation & Portfolio Route</span>
                  </div>
                  <p className="text-xs text-text-secondary leading-relaxed">
                    {selectedGoalForPlan.recommendedStrategy}
                  </p>
                  <div className="flex items-center gap-2 pt-2 border-t border-border/50 text-[11px] text-text-muted">
                    <span>Eligible Holdings in Account:</span>
                    <span className="font-mono font-bold text-text-primary">
                      {selectedGoalForPlan.linkedHoldings.join(', ')}
                    </span>
                  </div>
                </div>

                {/* Annual Milestone Checklist */}
                <div>
                  <h4 className="text-xs font-black uppercase text-text-muted mb-2 tracking-wider">
                    Milestone Horizon Milestones
                  </h4>
                  <div className="space-y-2">
                    {[0, Math.floor(plan.years / 2), plan.years].map((offset, idx) => {
                      const yr = currentYr + offset;
                      const milestonePct = idx === 0 ? Math.round((selectedGoalForPlan.currentAllocated / selectedGoalForPlan.targetAmount) * 100) : (idx === 1 ? 65 : 100);
                      const targetMilestone = Math.round(selectedGoalForPlan.targetAmount * (milestonePct / 100));

                      return (
                        <div key={yr} className="p-3 bg-bg border border-border rounded-xl flex items-center justify-between text-xs">
                          <div className="flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-surface border border-border flex items-center justify-center font-bold text-[10px]">
                              {idx + 1}
                            </span>
                            <div>
                              <span className="font-extrabold text-text-primary">Year {yr} Milestone</span>
                              <div className="text-[10px] text-text-muted">Projected Target: {milestonePct}% Corpus</div>
                            </div>
                          </div>
                          <span className="font-mono font-black text-text-primary">
                            ₹{targetMilestone.toLocaleString('en-IN')}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="flex gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => {
                      setTopUpModalGoal(selectedGoalForPlan);
                      setSelectedGoalForPlan(null);
                    }}
                    className="flex-1 btn-primary py-3 text-xs font-extrabold"
                  >
                    + Top Up Capital to this Bucket
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectedGoalForPlan(null)}
                    className="px-5 py-3 rounded-xl bg-bg border border-border text-xs font-bold text-text-secondary hover:text-text-primary"
                  >
                    Close
                  </button>
                </div>
              </motion.div>
            </div>
          );
        })()}
      </AnimatePresence>

      {/* MODAL 3: TOP UP CAPITAL QUICK ACTION */}
      <AnimatePresence>
        {topUpModalGoal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setTopUpModalGoal(null)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-surface border border-border rounded-3xl p-6 relative z-10 shadow-2xl space-y-5"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="text-lg font-black text-text-primary">Top Up Goal Capital</h3>
                  <p className="text-xs text-text-secondary mt-0.5">
                    Allocate capital to <strong className="text-text-primary">{topUpModalGoal.title}</strong>
                  </p>
                </div>
                <button onClick={() => setTopUpModalGoal(null)} className="p-1 rounded-lg text-text-muted hover:text-text-primary">
                  <X size={16} />
                </button>
              </div>

              <div>
                <label className="text-[10px] font-bold uppercase text-text-muted mb-1 block">
                  Amount to Allocate (INR)
                </label>
                <input 
                  type="number"
                  min={1000}
                  step={10000}
                  value={topUpAmount}
                  onChange={e => setTopUpAmount(Number(e.target.value))}
                  className="w-full bg-bg border border-border rounded-xl px-4 py-2.5 text-sm font-mono font-bold text-text-primary focus:outline-none focus:border-accent"
                />

                <div className="flex gap-1.5 mt-2">
                  {[25000, 50000, 100000, 250000].map(amt => (
                    <button
                      key={amt}
                      type="button"
                      onClick={() => setTopUpAmount(amt)}
                      className="px-2.5 py-1 rounded-lg bg-bg border border-border text-[10px] font-bold text-text-muted hover:text-accent hover:border-accent cursor-pointer"
                    >
                      +₹{amt / 1000}k
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-bg border border-border text-xs space-y-1">
                <div className="flex justify-between text-text-secondary">
                  <span>Current Allocated:</span>
                  <span className="font-mono font-bold">₹{topUpModalGoal.currentAllocated.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-text-primary font-bold border-t border-border/50 pt-1">
                  <span>New Allocated Total:</span>
                  <span className="font-mono text-gain">₹{(topUpModalGoal.currentAllocated + topUpAmount).toLocaleString('en-IN')}</span>
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={() => setTopUpModalGoal(null)}
                  className="flex-1 py-2.5 bg-bg border border-border rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleExecuteTopUp}
                  className="flex-1 btn-primary py-2.5 text-xs font-extrabold"
                >
                  Confirm Allocation →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Celebratory Toast */}
      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 max-w-sm p-4 rounded-2xl shadow-2xl border border-accent/40 bg-surface/95 backdrop-blur-md flex items-start gap-3"
          >
            <div className="p-2 rounded-xl bg-accent/15 text-accent shrink-0">
              <CheckCircle2 size={18} />
            </div>
            <p className="text-xs font-bold text-text-primary leading-relaxed mt-0.5">
              {toastMessage}
            </p>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
