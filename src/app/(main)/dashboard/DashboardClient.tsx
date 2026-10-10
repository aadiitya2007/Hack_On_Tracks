'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { simulateTradeAction } from '@/lib/actions';
import { StockInsightsCard } from '@/components/StockInsightsCard';
import Link from 'next/link';
import { 
  Brain, Award, Sparkles, BookOpen, TrendingUp, TrendingDown, 
  Layers, ShieldCheck, ArrowRight, Clock, Zap, AlertTriangle, RefreshCw 
} from 'lucide-react';

const ASSET_COLORS: Record<string, string> = {
  EQUITY: 'var(--asset-stocks)',
  MUTUAL_FUND: 'var(--asset-funds)',
  DEBT: 'var(--asset-bonds)',
  COMMODITY: 'var(--asset-reits)',
  REIT: 'var(--asset-reits)',
  CASH: 'var(--asset-cash)',
};

const ASSET_LABELS: Record<string, string> = {
  EQUITY: 'Equities (Stocks)',
  MUTUAL_FUND: 'Mutual Funds',
  DEBT: 'Bonds & Fixed Income',
  REIT: 'REITs & Real Estate',
  COMMODITY: 'Commodities (Gold/Silver)',
  CASH: 'Cash & Liquid Funds',
};

const ASSET_THEME_COLORS: Record<string, string> = {
  EQUITY: '#7C3AED',
  MUTUAL_FUND: '#EC4899',
  DEBT: '#F59E0B',
  REIT: '#10B981',
  COMMODITY: '#06B6D4',
  CASH: '#64748B',
};

const BROKER_LOGOS: Record<string, string> = {
  'zerodha': '/logos/zerodha.webp',
  'groww': '/logos/groww.png',
  'upstox': '/logos/upstox.png',
  'cdsl': '/logos/cdsl.webp',
};

// Animated Number Component
function AnimatedNumber({ value, prefix = '', suffix = '', isCurrency = false }: { value: number, prefix?: string, suffix?: string, isCurrency?: boolean }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let start = displayValue;
    const end = value;
    if (start === end) return;
    const duration = 800;
    const increment = (end - start) / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if ((increment > 0 && start >= end) || (increment < 0 && start <= end)) {
        start = end;
        clearInterval(timer);
      }
      setDisplayValue(start);
    }, 16);
    return () => clearInterval(timer);
  }, [value]);

  const formatted = isCurrency 
    ? Math.round(displayValue).toLocaleString('en-IN')
    : displayValue.toFixed(2);

  return <span className="tabular-nums">{prefix}{formatted}{suffix}</span>;
}

export default function DashboardClient({ initialData }: { initialData: any }) {
  const [filter, setFilter] = useState<string>('All');
  const [syncing, setSyncing] = useState(false);
  const [tradeLoading, setTradeLoading] = useState(false);
  const [simulateModalOpen, setSimulateModalOpen] = useState(false);
  
  // User Classification State
  const [userLevel, setUserLevel] = useState<string>('Beginner');
  const [userTitle, setUserTitle] = useState<string>('Beginner Investor');
  const [userDesc, setUserDesc] = useState<string>('Building an initial equity & mutual fund portfolio.');

  // Time Machine & Prediction state
  const [predictSymbol, setPredictSymbol] = useState('RELIANCE');
  const [sipAmount, setSipAmount] = useState(10000);
  const [sipDuration, setSipDuration] = useState(3); // 3 years

  // Trade state
  const [tradeSymbol, setTradeSymbol] = useState('RELIANCE');
  const [tradeBroker, setTradeBroker] = useState('Zerodha');
  const [tradeAction, setTradeAction] = useState<'BUY' | 'SELL'>('BUY');
  const [tradeQty, setTradeQty] = useState(10);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const level = localStorage.getItem('unify_trader_level');
      const title = localStorage.getItem('unify_trader_title');
      const desc = localStorage.getItem('unify_trader_desc');
      if (level) setUserLevel(level);
      if (title) setUserTitle(title);
      if (desc) setUserDesc(desc);
    }
  }, []);

  const holdings = initialData.holdings;
  
  const filteredHoldings = filter === 'All' 
    ? holdings 
    : holdings.filter((h: any) => h.broker === filter);

  // Derived metrics
  let totalValue = 0;
  let totalInvested = 0;
  
  filteredHoldings.forEach((h: any) => {
    const val = h.quantity * h.currentPrice;
    totalValue += val;
    if (h.avgBuyPrice) {
      totalInvested += h.quantity * h.avgBuyPrice;
    } else {
      totalInvested += val; 
    }
  });

  const totalPnl = totalValue - totalInvested;
  const totalPnlPercent = totalInvested > 0 ? (totalPnl / totalInvested) * 100 : 0;

  // Duplicate logic
  const symbolCounts = holdings.reduce((acc: any, h: any) => {
    acc[h.symbol] = (acc[h.symbol] || 0) + 1;
    return acc;
  }, {});
  const duplicateSymbols = Object.keys(symbolCounts).filter(s => symbolCounts[s] > 1);

  // Allocation data
  const allocMap = holdings.reduce((acc: any, h: any) => {
    acc[h.assetType] = (acc[h.assetType] || 0) + (h.quantity * h.currentPrice);
    return acc;
  }, {});
  const allocData = Object.keys(allocMap).map(k => ({ name: k, value: allocMap[k] }));

  const assetBreakdown = allocData.map(item => {
    const amount = item.value;
    const pct = totalValue > 0 ? (amount / totalValue) * 100 : 0;
    return {
      key: item.name,
      label: ASSET_LABELS[item.name] || item.name,
      amount,
      pct,
      color: ASSET_THEME_COLORS[item.name] || ASSET_COLORS[item.name] || '#7C3AED'
    };
  }).sort((a, b) => b.amount - a.amount);

  // Growth Chart Mock Data
  const mockHistory = Array.from({ length: 7 }).map((_, i) => {
    return {
      month: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'][i],
      value: totalValue * (0.8 + (i * 0.05) + (Math.random() * 0.02))
    }
  });

  // Time Machine compounding calculation on Dashboard
  const estimatedCagr = predictSymbol === 'RELIANCE' ? 14.5 : (predictSymbol === 'TCS' ? 12.8 : 13.5);
  const totalMonths = sipDuration * 12;
  const totalInvestedSip = sipAmount * totalMonths;
  const monthlyRate = estimatedCagr / 100 / 12;
  const estimatedFutureValue = Math.round(
    sipAmount * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate)
  );

  const handleSimulate = async () => {
    setTradeLoading(true);
    await simulateTradeAction(tradeSymbol, tradeBroker, tradeAction, tradeQty, 3000);
    setTradeLoading(false);
    setSimulateModalOpen(false);
  };

  const handleLiveSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  };

  // Tailored AI Advisory Guidance points based on Classified Level & Portfolio Telemetry
  const getAdvisorRecommendations = () => {
    switch (userLevel) {
      case 'Fresher':
        return [
          { title: 'Core Allocation Strategy', text: 'As a Fresher investor, build a 60% baseline in low-cost Nifty 50 Index ETFs before picking individual stocks.', tag: 'Foundation' },
          { title: 'Reduce Stock Volatility', text: 'Your current linked portfolio has 82% equity concentration. Consider adding Debt Mutual Funds for capital safety.', tag: 'Risk Control' },
          { title: 'Avoid High-Leverage Products', text: 'Steer clear of Futures & Options until you complete basic financial literacy modules.', tag: 'Safety' },
          { title: 'Academy Recommendation', text: 'Start with the Stocks & Mutual Funds Masterclass.', link: '/learn/stocks', tag: 'Learning' }
        ];
      case 'Intermediate':
        return [
          { title: 'Drawdown Control & VaR', text: 'Monitor your 1-month Value-at-Risk (95% VaR) and keep maximum portfolio drawdown below 12%.', tag: 'Risk Management' },
          { title: 'XGBoost Signal Confirmation', text: 'Validate XGBoost ML return signals (RSI-14 & 10/50 MAs) before executing swing trades.', tag: 'Technical Edge' },
          { title: 'Cost & DP Fee Leakage', text: 'Consolidate duplicate RELIANCE scrips between Zerodha & Groww to save ₹420 annual DP charges.', tag: 'Cost Saving' },
          { title: 'Academy Recommendation', text: 'Explore the REITs & InvITs Masterclass for yield diversification.', link: '/learn/reits', tag: 'Learning' }
        ];
      case 'Advanced':
        return [
          { title: 'Multi-Asset Rebalancing', text: 'Rebalance across equities, InvITs, and AAA corporate bonds to maintain optimal Sharpe ratio.', tag: 'Portfolio Alpha' },
          { title: 'Protective Options Hedges', text: 'Hedge long equity positions with Put options during high-volatility earnings quarters.', tag: 'Hedging' },
          { title: 'Tax-Loss Harvesting', text: 'Utilize tax-loss harvesting on short-term capital gains before financial year end.', tag: 'Tax Strategy' },
          { title: 'Academy Recommendation', text: 'Study the Futures & Options (F&O) Masterclass.', link: '/learn/futures-options', tag: 'Learning' }
        ];
      case 'Pro':
        return [
          { title: 'Quant & Delta Neutrality', text: 'Maintain strict delta-neutral or iron-condor options position structures.', tag: 'Derivatives' },
          { title: 'SEBI Compliance & Margin Alert', text: 'Keep total F&O margin utilization below 35% of net portfolio worth to avoid margin calls.', tag: 'Capital Discipline' },
          { title: 'Automated Stop-Loss Execution', text: 'SEBI reports 89% of retail F&O traders incur net losses. Enforce strict mechanical stop-loss limits.', tag: 'Loss Control' },
          { title: 'Academy Recommendation', text: 'Explore Time Machine compounding SIP vs Lump Sum analytics.', link: '/time-machine', tag: 'Analytics' }
        ];
      case 'Beginner':
      default:
        return [
          { title: 'Balanced Asset Foundation', text: 'As a Beginner investor, balance high-growth equity scrips with stable large-cap dividend payers.', tag: 'Asset Allocation' },
          { title: 'Explore Alternative Yields', text: 'Expand into REITs (e.g., Embassy) or InvITs for steady 6–8% rental yield without buying real estate.', tag: 'Yield Diversification' },
          { title: 'Cross-Broker DP Charge Leak', text: 'You hold duplicate scrips across Zerodha & Groww. Merging them saves ₹420/yr in depository fees.', tag: 'Cost Savings' },
          { title: 'Academy Recommendation', text: 'Explore the Mutual Funds & ETFs Masterclasses.', link: '/learn/mutual-funds', tag: 'Learning' }
        ];
    }
  };

  const recommendations = getAdvisorRecommendations();

  return (
    <div className="space-y-8 pb-20">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-6 relative z-10">
        <div>
          <h1 className="heading-hero text-4xl md:text-5xl text-gradient pb-2 drop-shadow-[0_0_20px_rgba(34,211,238,0.25)]">
            Portfolio Dashboard
          </h1>
          <p className="text-text-secondary mt-1 flex items-center gap-2 font-medium">
            Consolidated real-time telemetry across linked Indian brokerages
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={handleLiveSync} className="card px-4 py-2 text-sm font-semibold flex items-center gap-2 text-gain hover:bg-success/10 transition-colors">
            <span className={`w-2 h-2 rounded-full ${syncing ? 'bg-success animate-ping' : 'bg-success'}`}></span>
            {syncing ? 'Syncing...' : 'Live Feed'}
          </button>
          <button onClick={() => setSimulateModalOpen(true)} className="btn-primary">
            + Simulate Trade
          </button>
        </div>
      </div>

      {/* AI ADVISORY & CLASSIFIED USER TIER PANEL */}
      <div className="card p-6 md:p-8 bg-surface border border-accent/30 relative overflow-hidden rounded-3xl z-10 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6 pb-6 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-accent-bg text-accent flex items-center justify-center font-bold border border-accent/20 shrink-0">
              <Award size={30} />
            </div>
            <div>
              <div className="flex items-center gap-2.5">
                <h2 className="text-xl font-black text-text-primary">AI Advisory & Portfolio Strategy</h2>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-accent text-white shadow-sm">
                  {userTitle}
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-1 max-w-xl">
                Personalized LLM guidance tailored to your <strong className="text-text-primary">{userLevel}</strong> classification level and live portfolio telemetry.
              </p>
            </div>
          </div>

          <Link href="/onboarding" className="px-4 py-2.5 rounded-xl bg-bg border border-border text-xs font-bold text-text-secondary hover:text-accent hover:border-accent transition-colors flex items-center gap-2 shrink-0">
            <RefreshCw size={14} /> Re-take Skill Quiz
          </Link>
        </div>

        {/* 4 Custom Recommendations Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {recommendations.map((rec, i) => (
            <div key={i} className="p-4 rounded-2xl bg-bg border border-border hover:border-accent/40 transition-all flex flex-col justify-between">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-accent-bg text-accent border border-accent/20">
                    {rec.tag}
                  </span>
                  <Sparkles size={14} className="text-accent" />
                </div>
                <h3 className="font-extrabold text-sm text-text-primary mb-1">{rec.title}</h3>
                <p className="text-xs text-text-secondary leading-relaxed">{rec.text}</p>
              </div>

              {rec.link && (
                <Link href={rec.link} className="mt-3 text-xs font-bold text-accent hover:underline flex items-center gap-1">
                  View Masterclass Module <ArrowRight size={14} />
                </Link>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Hero Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
        
        {/* Net Portfolio */}
        <div className="card p-6 flex flex-col justify-between">
          <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider mb-2">Total Net Portfolio</p>
          <h2 className="text-4xl font-display font-bold text-gradient tabular-nums">
            <AnimatedNumber value={totalValue} prefix="₹" isCurrency />
          </h2>
          <div className="mt-6 flex justify-between text-[11px] font-medium text-text-secondary border-t border-border pt-3">
            <span>Invested:</span>
            <span className="text-text-primary">₹{totalInvested.toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Realized & Unrealized PnL */}
        <div className="card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider w-1/2 leading-relaxed">Total Realized & Unrealized P&L</p>
            <span className={`px-2 py-1 rounded bg-${totalPnl >= 0 ? 'success' : 'destructive'}/10 text-${totalPnl >= 0 ? 'success' : 'destructive'} text-[10px] font-bold border border-${totalPnl >= 0 ? 'success' : 'destructive'}/20`}>
              {totalPnl >= 0 ? '+' : ''}{totalPnlPercent.toFixed(2)}%
            </span>
          </div>
          <h2 className={`text-4xl font-display font-bold tabular-nums mt-2 text-${totalPnl >= 0 ? 'success' : 'destructive'} drop-shadow-[0_0_12px_rgba(16,229,160,0.4)]`}>
            {totalPnl >= 0 ? '+' : ''}
            <AnimatedNumber value={totalPnl} prefix="₹" isCurrency />
          </h2>
          <div className="mt-4 flex justify-between text-[11px] font-medium text-text-secondary border-t border-border pt-3">
            <span>XIRR: <strong className="text-text-primary">22.84%</strong></span>
            <span className="text-gain flex items-center gap-1">vs NIFTY 14.2%</span>
          </div>
        </div>

        {/* Today's Movement */}
        <div className="card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider w-1/2 leading-relaxed">Today's Market Movement</p>
            <span className="px-2 py-1 rounded bg-success/10 text-gain text-[10px] font-bold border border-success/20">
              +0.79%
            </span>
          </div>
          <h2 className="text-3xl font-display font-bold tabular-nums mt-2 text-gain">
            +₹38,410.25
          </h2>
          <div className="mt-4 flex justify-between text-[11px] font-medium text-text-secondary border-t border-border pt-3">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-success"></span> NSE/BSE Open</span>
            <span>14 of 18 stocks up</span>
          </div>
        </div>

        {/* Telemetry Status */}
        <div className="card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Multi-Broker Telemetry</p>
            <span className="px-2 py-1 rounded bg-success/10 text-gain text-[10px] font-bold border border-success/20 flex gap-1 items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></div>
              Sync: 2m ago
            </span>
          </div>
          <h2 className="text-2xl font-display font-bold mt-2">
            4 <span className="text-base font-sans font-medium text-text-primary/70">Brokers Live</span>
          </h2>
          <div className="flex flex-wrap gap-2 mt-4">
            {['Zerodha', 'Groww', 'Upstox', 'CDSL'].map(b => (
              <span key={b} className="px-2.5 py-1 bg-bg border border-border rounded-lg text-[10px] font-bold text-text-primary flex items-center gap-1.5 shadow-sm">
                {BROKER_LOGOS[b.toLowerCase()] ? (
                  <img src={BROKER_LOGOS[b.toLowerCase()]} alt={b} className="w-3.5 h-3.5 object-contain" />
                ) : (
                  <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                )}
                {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* PROMINENT PREDICTION & TIME MACHINE WIDGET ON DASHBOARD */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        
        {/* ML Stock Insight Prediction (2 cols) */}
        <div className="lg:col-span-2">
          <StockInsightsCard symbol={predictSymbol} />
        </div>

        {/* Time Machine Quick Compounding Simulator (1 col) */}
        <div className="card p-6 bg-surface border border-border flex flex-col justify-between rounded-3xl">
          <div>
            <div className="flex justify-between items-center mb-3">
              <div className="flex items-center gap-2">
                <Clock className="text-accent" size={18} />
                <h3 className="font-extrabold text-sm text-text-primary">Time Machine Projections</h3>
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-accent-bg text-accent">SIP Engine</span>
            </div>

            <p className="text-xs text-text-secondary mb-4 leading-relaxed">
              Historical SIP & Lump Sum compounding growth for <strong className="text-text-primary">{predictSymbol}</strong>.
            </p>

            <div className="space-y-3 mb-6">
              <div>
                <div className="flex justify-between text-xs font-bold text-text-muted mb-1">
                  <span>Monthly SIP Amount</span>
                  <span className="text-text-primary font-mono">₹{sipAmount.toLocaleString('en-IN')}</span>
                </div>
                <input 
                  type="range" 
                  min={1000} 
                  max={50000} 
                  step={1000} 
                  value={sipAmount} 
                  onChange={e => setSipAmount(Number(e.target.value))}
                  className="w-full accent-accent"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-bold text-text-muted mb-1">
                  <span>Duration (Years)</span>
                  <span className="text-text-primary font-mono">{sipDuration} Years</span>
                </div>
                <div className="flex gap-2">
                  {[1, 3, 5].map(y => (
                    <button 
                      key={y}
                      onClick={() => setSipDuration(y)} 
                      className={`flex-1 py-1 rounded-lg text-xs font-bold border transition-colors ${sipDuration === y ? 'bg-accent text-white border-accent' : 'bg-bg border-border text-text-secondary'}`}
                    >
                      {y} Yr
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-bg border border-border space-y-1">
                <div className="flex justify-between text-xs font-medium text-text-muted">
                  <span>Total Invested:</span>
                  <span className="text-text-primary font-mono font-bold">₹{totalInvestedSip.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-gain">
                  <span>Projected Value:</span>
                  <span className="font-mono">₹{estimatedFutureValue.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          <Link href="/time-machine" className="btn-primary w-full py-2.5 text-xs text-center font-bold flex justify-center items-center gap-1.5">
            Full Time Machine Analytics <ArrowRight size={14} />
          </Link>
        </div>

      </div>

      {/* Asset Allocation & Trajectory Row */}
      <div className="space-y-6 relative z-10">
        
        {/* Full Asset Allocation & Capital Invested Breakdown Card */}
        <div className="card p-6 md:p-8 bg-surface border border-border rounded-3xl space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-4 border-b border-border">
            <div>
              <h3 className="text-xl font-extrabold text-text-primary flex items-center gap-2">
                <Layers size={22} className="text-accent" /> Asset Allocation & Capital Invested
              </h3>
              <p className="text-xs text-text-secondary mt-1 font-medium">
                Detailed capital distribution and portfolio percentage share across {allocData.length} asset classes
              </p>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-accent-bg text-accent text-xs font-black uppercase tracking-wider self-start sm:self-auto border border-accent/20">
              Total Invested: ₹{totalInvested.toLocaleString('en-IN')}
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Left: Donut Chart with Net Worth Center */}
            <div className="lg:col-span-5 h-[280px] relative flex items-center justify-center">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie 
                    data={allocData} 
                    innerRadius={80} 
                    outerRadius={110} 
                    paddingAngle={4} 
                    dataKey="value" 
                    stroke="none"
                  >
                    {allocData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={ASSET_THEME_COLORS[entry.name] || ASSET_COLORS[entry.name] || '#7C3AED'} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '14px', color: 'var(--text-primary)', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}
                    formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Invested Amount']}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <p className="text-[10px] text-text-muted uppercase tracking-widest font-black">Net Portfolio Value</p>
                <p className="text-3xl font-black text-text-primary tracking-tight font-display">₹{(totalValue/100000).toFixed(2)}L</p>
                <p className="text-xs font-bold text-gain mt-0.5">₹{totalValue.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Right: Rich Breakdown Table showing Exact Amount & % */}
            <div className="lg:col-span-7 space-y-3.5">
              {assetBreakdown.map((item) => (
                <div key={item.key} className="p-4 rounded-2xl bg-bg border border-border hover:border-accent/40 transition-all space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-3">
                      <span className="w-4 h-4 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: item.color }}></span>
                      <span className="font-extrabold text-text-primary text-sm">{item.label}</span>
                    </div>
                    <div className="text-right">
                      <span className="font-mono font-black text-text-primary text-base">₹{item.amount.toLocaleString('en-IN')}</span>
                      <span className="text-xs font-bold text-accent ml-2 font-mono">({item.pct.toFixed(1)}%)</span>
                    </div>
                  </div>

                  {/* Progress bar */}
                  <div className="w-full bg-surface h-2 rounded-full overflow-hidden border border-border/50">
                    <div 
                      className="h-full rounded-full transition-all duration-500" 
                      style={{ width: `${Math.max(item.pct, 4)}%`, backgroundColor: item.color }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Growth Chart */}
        <div className="card p-6 md:p-8 col-span-1 lg:col-span-3 h-[360px] flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-extrabold text-lg text-text-primary">Portfolio Trajectory vs NIFTY 50 Benchmark</h3>
              <p className="text-xs text-text-secondary mt-0.5 font-medium">12-month consolidated compounded growth trajectory</p>
            </div>
            <span className="px-3 py-1 rounded-full bg-success/10 text-gain text-xs font-bold border border-success/20">
              +8.64% Benchmark Alpha
            </span>
          </div>
          <div className="flex-1 -ml-4">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={mockHistory}>
                <defs>
                  <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.4}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={11} tickLine={false} axisLine={false} />
                <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text-primary)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }} itemStyle={{ color: 'var(--accent)', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="value" stroke="var(--accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Duplicate Alert */}
      <AnimatePresence>
        {duplicateSymbols.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="card border-destructive/30 bg-destructive/5 p-5 flex items-start gap-4">
            <div className="w-10 h-10 rounded-full bg-destructive/20 flex items-center justify-center text-loss shrink-0">
              <AlertTriangle size={20} />
            </div>
            <div>
              <h3 className="font-bold text-loss">Cross-Broker Overlap Detected</h3>
              <p className="text-sm text-text-primary/70 mt-1">Holding identical scrips across accounts causes duplicate DP charges and fragmented allocation telemetry.</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {duplicateSymbols.map(sym => (
                  <span key={sym} className="px-2 py-1 rounded bg-bg border border-border text-xs font-medium">
                    {sym} is held in multiple brokers. Est. ₹420 annual duplicate DP fee leak.
                  </span>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Holdings Table */}
      <div className="card overflow-hidden">
        <div className="p-4 border-b border-border flex flex-col sm:flex-row justify-between items-center gap-4 bg-bg">
          <div className="flex gap-2">
            <button onClick={() => setFilter('All')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filter === 'All' ? 'bg-primary text-white shadow-[0_0_12px_rgba(124,58,237,0.5)]' : 'bg-surface border border-border text-text-secondary hover:text-text-primary'}`}>All Brokers</button>
            <button onClick={() => setFilter('Zerodha')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filter === 'Zerodha' ? 'bg-primary text-white shadow-[0_0_12px_rgba(124,58,237,0.5)]' : 'bg-surface border border-border text-text-secondary hover:text-text-primary'}`}>Zerodha</button>
            <button onClick={() => setFilter('Groww')} className={`px-4 py-1.5 rounded-full text-xs font-bold transition-all ${filter === 'Groww' ? 'bg-primary text-white shadow-[0_0_12px_rgba(124,58,237,0.5)]' : 'bg-surface border border-border text-text-secondary hover:text-text-primary'}`}>Groww</button>
          </div>
          <span className="text-xs text-text-muted font-mono">{filteredHoldings.length} Positions</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-bg text-text-muted font-bold uppercase tracking-wider border-b border-border">
              <tr>
                <th className="p-4">Asset</th>
                <th className="p-4">Broker</th>
                <th className="p-4 text-right">Qty</th>
                <th className="p-4 text-right">Avg Price</th>
                <th className="p-4 text-right">LTP</th>
                <th className="p-4 text-right">Current Value</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredHoldings.map((h: any, idx: number) => {
                const val = h.quantity * h.currentPrice;
                return (
                  <tr key={idx} className="hover:bg-surface-hover/50 transition-colors">
                    <td className="p-4 font-bold text-text-primary">{h.symbol}</td>
                    <td className="p-4">
                      <span className="px-2 py-0.5 rounded bg-bg border border-border font-medium text-text-secondary">
                        {h.broker}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono">{h.quantity}</td>
                    <td className="p-4 text-right font-mono">₹{(h.avgBuyPrice || h.currentPrice * 0.9).toFixed(2)}</td>
                    <td className="p-4 text-right font-mono font-bold text-text-primary">₹{h.currentPrice.toFixed(2)}</td>
                    <td className="p-4 text-right font-mono font-bold">₹{val.toLocaleString('en-IN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Trade Simulation Modal */}
      {simulateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSimulateModalOpen(false)}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }} 
            animate={{ opacity: 1, scale: 1 }} 
            className="card w-full max-w-md p-6 relative rounded-2xl border border-border bg-surface z-10"
          >
            <h2 className="text-xl font-extrabold mb-4 text-text-primary">Simulate Trade Action</h2>
            <p className="text-xs text-text-secondary mb-6">Test how executing a order impacts multi-broker asset allocation telemetry without real capital risk.</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-bold text-text-muted uppercase">Select Scrip</label>
                <select value={tradeSymbol} onChange={e => setTradeSymbol(e.target.value)} className="w-full mt-1 bg-bg border border-border rounded-xl p-3 text-sm font-bold text-text-primary">
                  <option>RELIANCE</option>
                  <option>HDFCBANK</option>
                  <option>TCS</option>
                  <option>INFY</option>
                  <option>TATAMOTORS</option>
                  <option>SBIN</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-text-muted uppercase">Target Broker Account</label>
                <select value={tradeBroker} onChange={e => setTradeBroker(e.target.value)} className="w-full mt-1 bg-bg border border-border rounded-xl p-3 text-sm font-bold text-text-primary">
                  <option>Zerodha</option>
                  <option>Groww</option>
                  <option>Upstox</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button onClick={() => setTradeAction('BUY')} className={`py-2.5 rounded-xl text-xs font-bold border transition-colors ${tradeAction === 'BUY' ? 'bg-gain text-white border-gain' : 'bg-bg border-border text-text-secondary'}`}>
                  BUY (Long)
                </button>
                <button onClick={() => setTradeAction('SELL')} className={`py-2.5 rounded-xl text-xs font-bold border transition-colors ${tradeAction === 'SELL' ? 'bg-loss text-white border-loss' : 'bg-bg border-border text-text-secondary'}`}>
                  SELL (Short)
                </button>
              </div>

              <div>
                <label className="text-xs font-bold text-text-muted uppercase">Quantity Shares</label>
                <input type="number" value={tradeQty} onChange={e => setTradeQty(Number(e.target.value))} className="w-full mt-1 bg-bg border border-border rounded-xl p-3 text-sm font-bold text-text-primary" />
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setSimulateModalOpen(false)} className="flex-1 py-3 bg-bg border border-border rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary">
                Cancel
              </button>
              <button onClick={handleSimulate} disabled={tradeLoading} className="flex-1 btn-primary py-3 text-xs">
                {tradeLoading ? 'Simulating...' : 'Execute Mock Order'}
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
