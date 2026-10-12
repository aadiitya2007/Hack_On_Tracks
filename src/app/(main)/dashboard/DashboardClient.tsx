'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { simulateTradeAction } from '@/lib/actions';
import { StockInsightsCard } from '@/components/StockInsightsCard';
import { TaxLossHarvestingCard } from '@/components/TaxLossHarvestingCard';
import { PassiveIncomeCalendar } from '@/components/PassiveIncomeCalendar';
import { GoalBasedPortfolioTracker } from '@/components/GoalBasedPortfolioTracker';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { 
  Brain, Award, Sparkles, BookOpen, TrendingUp, TrendingDown, 
  Layers, ShieldCheck, ArrowRight, Clock, Zap, AlertTriangle, RefreshCw,
  CheckCircle2, X, Activity, History, Lock
} from 'lucide-react';

export const SCRIP_METADATA: Record<string, { name: string; price: number; assetType: string; isin: string }> = {
  'RELIANCE': { name: 'Reliance Industries Ltd', price: 2985.40, assetType: 'EQUITY', isin: 'INE002A01018' },
  'HDFCBANK': { name: 'HDFC Bank Ltd', price: 1680.50, assetType: 'EQUITY', isin: 'INE040A01034' },
  'TCS': { name: 'Tata Consultancy Services', price: 4120.00, assetType: 'EQUITY', isin: 'INE467B01029' },
  'INFY': { name: 'Infosys Ltd', price: 1720.10, assetType: 'EQUITY', isin: 'INE009A01021' },
  'TATAMOTORS': { name: 'Tata Motors Ltd', price: 890.00, assetType: 'EQUITY', isin: 'INE155A01022' },
  'SBIN': { name: 'State Bank of India', price: 785.60, assetType: 'EQUITY', isin: 'INE062A01020' },
  'ITC': { name: 'ITC Ltd', price: 475.20, assetType: 'EQUITY', isin: 'INE154A01025' },
  'BHARTIARTL': { name: 'Bharti Airtel Ltd', price: 1290.00, assetType: 'EQUITY', isin: 'INE397D01024' },
  'PPFAS': { name: 'Parag Parikh Flexi Cap Fund', price: 68.40, assetType: 'MUTUAL_FUND', isin: 'INF179KC1DP4' },
  'NIFTYBEES': { name: 'Nippon India Nifty 50 BeES ETF', price: 268.50, assetType: 'MUTUAL_FUND', isin: 'INF732E01015' },
  'EMBASSY': { name: 'Embassy Office Parks REIT', price: 382.50, assetType: 'REIT', isin: 'INE041025011' },
  'GS2033': { name: 'Government of India 7.18% GS 2033', price: 101.40, assetType: 'DEBT', isin: 'IN0020230085' },
  'GOLDBEES': { name: 'Nippon India ETF Gold BeES', price: 64.20, assetType: 'COMMODITY', isin: 'INF732E01037' },
  'LIQUIDBEES': { name: 'Nippon India ETF Liquid BeES', price: 1000.00, assetType: 'CASH', isin: 'INF732E01049' },
};

export const TIER_DETAILS: Record<string, { title: string; desc: string; badgeColor: string }> = {
  Fresher: {
    title: 'Fresher Investor (Neophyte)',
    desc: 'New to financial markets. Focus on low-cost index funds, basic asset allocation, and fundamental financial concepts.',
    badgeColor: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
  },
  Beginner: {
    title: 'Beginner Investor',
    desc: 'Building an initial direct equity & mutual fund portfolio. Needs guidance on asset allocation and cost leakage.',
    badgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30'
  },
  Intermediate: {
    title: 'Intermediate Investor & Swing Trader',
    desc: 'Familiar with direct stocks, chart analysis, and quarterly earnings. Working on risk diversification.',
    badgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30'
  },
  Advanced: {
    title: 'Advanced Multi-Asset Investor',
    desc: 'Solid experience across equities, REITs, bonds, and technical indicators. Active portfolio rebalancer.',
    badgeColor: 'bg-purple-500/10 text-purple-400 border-purple-500/30'
  },
  Pro: {
    title: 'Pro Trader & Quant Specialist',
    desc: 'High expertise in financial derivatives, options hedging, delta neutrality, and algorithmic trading models.',
    badgeColor: 'bg-rose-500/10 text-rose-400 border-rose-500/30'
  }
};

export const TIER_PORTFOLIOS: Record<string, any[]> = {
  Fresher: [
    { id: 'f1', symbol: 'PPFAS', isin: 'INF179KC1DP4', assetType: 'MUTUAL_FUND', quantity: 1200, avgBuyPrice: 55, currentPrice: 68.40, broker: 'Groww' },
    { id: 'f2', symbol: 'NIFTYBEES', isin: 'INF732E01015', assetType: 'MUTUAL_FUND', quantity: 130, avgBuyPrice: 245, currentPrice: 268.50, broker: 'Zerodha' },
    { id: 'f3', symbol: 'GS2033', isin: 'IN0020230085', assetType: 'DEBT', quantity: 600, avgBuyPrice: 98, currentPrice: 101.40, broker: 'CDSL' },
    { id: 'f4', symbol: 'HDFCBANK', isin: 'INE040A01034', assetType: 'EQUITY', quantity: 30, avgBuyPrice: 1520, currentPrice: 1680.50, broker: 'Zerodha' },
    { id: 'f5', symbol: 'LIQUIDBEES', isin: 'INF732E01049', assetType: 'CASH', quantity: 22, avgBuyPrice: 1000, currentPrice: 1000.00, broker: 'Groww' },
  ],
  Beginner: [
    { id: 'b1', symbol: 'RELIANCE', isin: 'INE002A01018', assetType: 'EQUITY', quantity: 50, avgBuyPrice: 2600, currentPrice: 2985.40, broker: 'Zerodha' },
    { id: 'b2', symbol: 'TCS', isin: 'INE467B01029', assetType: 'EQUITY', quantity: 20, avgBuyPrice: 3650, currentPrice: 4120.00, broker: 'Zerodha' },
    { id: 'b3', symbol: 'INFY', isin: 'INE009A01021', assetType: 'EQUITY', quantity: 25, avgBuyPrice: 1510, currentPrice: 1720.10, broker: 'Groww' },
    { id: 'b4', symbol: 'PPFAS', isin: 'INF179KC1DP4', assetType: 'MUTUAL_FUND', quantity: 1800, avgBuyPrice: 52, currentPrice: 68.40, broker: 'Groww' },
    { id: 'b5', symbol: 'GOLDBEES', isin: 'INF732E01037', assetType: 'COMMODITY', quantity: 700, avgBuyPrice: 56, currentPrice: 64.20, broker: 'Zerodha' },
    { id: 'b6', symbol: 'LIQUIDBEES', isin: 'INF732E01049', assetType: 'CASH', quantity: 38, avgBuyPrice: 1000, currentPrice: 1000.00, broker: 'Upstox' },
  ],
  Intermediate: [
    { id: 'i1', symbol: 'RELIANCE', isin: 'INE002A01018', assetType: 'EQUITY', quantity: 60, avgBuyPrice: 2580, currentPrice: 2985.40, broker: 'Zerodha' },
    { id: 'i2', symbol: 'TATAMOTORS', isin: 'INE155A01022', assetType: 'EQUITY', quantity: 150, avgBuyPrice: 750, currentPrice: 890.00, broker: 'Groww' },
    { id: 'i3', symbol: 'SBIN', isin: 'INE062A01020', assetType: 'EQUITY', quantity: 120, avgBuyPrice: 680, currentPrice: 785.60, broker: 'Upstox' },
    { id: 'i4', symbol: 'TCS', isin: 'INE467B01029', assetType: 'EQUITY', quantity: 20, avgBuyPrice: 3700, currentPrice: 4120.00, broker: 'Zerodha' },
    { id: 'i5', symbol: 'PPFAS', isin: 'INF179KC1DP4', assetType: 'MUTUAL_FUND', quantity: 2000, avgBuyPrice: 54, currentPrice: 68.40, broker: 'Groww' },
    { id: 'i6', symbol: 'EMBASSY', isin: 'INE041025011', assetType: 'REIT', quantity: 350, avgBuyPrice: 330, currentPrice: 382.50, broker: 'Zerodha' },
    { id: 'i7', symbol: 'GOLDBEES', isin: 'INF732E01037', assetType: 'COMMODITY', quantity: 1500, avgBuyPrice: 57, currentPrice: 64.20, broker: 'Zerodha' },
  ],
  Advanced: [
    { id: 'a1', symbol: 'RELIANCE', isin: 'INE002A01018', assetType: 'EQUITY', quantity: 100, avgBuyPrice: 2500, currentPrice: 2985.40, broker: 'Zerodha' },
    { id: 'a2', symbol: 'BHARTIARTL', isin: 'INE397D01024', assetType: 'EQUITY', quantity: 150, avgBuyPrice: 1050, currentPrice: 1290.00, broker: 'Groww' },
    { id: 'a3', symbol: 'INFY', isin: 'INE009A01021', assetType: 'EQUITY', quantity: 80, avgBuyPrice: 1500, currentPrice: 1720.10, broker: 'Upstox' },
    { id: 'a4', symbol: 'EMBASSY', isin: 'INE041025011', assetType: 'REIT', quantity: 700, avgBuyPrice: 340, currentPrice: 382.50, broker: 'Zerodha' },
    { id: 'a5', symbol: 'GS2033', isin: 'IN0020230085', assetType: 'DEBT', quantity: 2200, avgBuyPrice: 97, currentPrice: 101.40, broker: 'CDSL' },
    { id: 'a6', symbol: 'GOLDBEES', isin: 'INF732E01037', assetType: 'COMMODITY', quantity: 3000, avgBuyPrice: 55, currentPrice: 64.20, broker: 'Zerodha' },
    { id: 'a7', symbol: 'LIQUIDBEES', isin: 'INF732E01049', assetType: 'CASH', quantity: 135, avgBuyPrice: 1000, currentPrice: 1000.00, broker: 'Upstox' },
  ],
  Pro: [
    { id: 'p1', symbol: 'RELIANCE', isin: 'INE002A01018', assetType: 'EQUITY', quantity: 150, avgBuyPrice: 2550, currentPrice: 2985.40, broker: 'Zerodha' },
    { id: 'p2', symbol: 'TCS', isin: 'INE467B01029', assetType: 'EQUITY', quantity: 50, avgBuyPrice: 3600, currentPrice: 4120.00, broker: 'Zerodha' },
    { id: 'p3', symbol: 'TATAMOTORS', isin: 'INE155A01022', assetType: 'EQUITY', quantity: 250, avgBuyPrice: 720, currentPrice: 890.00, broker: 'Groww' },
    { id: 'p4', symbol: 'LIQUIDBEES', isin: 'INF732E01049', assetType: 'CASH', quantity: 500, avgBuyPrice: 1000, currentPrice: 1000.00, broker: 'Zerodha' },
    { id: 'p5', symbol: 'EMBASSY', isin: 'INE041025011', assetType: 'REIT', quantity: 1200, avgBuyPrice: 345, currentPrice: 382.50, broker: 'Zerodha' },
    { id: 'p6', symbol: 'GS2033', isin: 'IN0020230085', assetType: 'DEBT', quantity: 3700, avgBuyPrice: 98, currentPrice: 101.40, broker: 'CDSL' },
    { id: 'p7', symbol: 'GOLDBEES', isin: 'INF732E01037', assetType: 'COMMODITY', quantity: 4200, avgBuyPrice: 58, currentPrice: 64.20, broker: 'Groww' },
  ],
};

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
  'all': '/logos/unify.png',
  'zerodha': '/logos/zerodha.webp',
  'zerodha kite': '/logos/zerodha.webp',
  'groww': '/logos/groww.png',
  'upstox': '/logos/upstox.png',
  'upstox pro': '/logos/upstox.png',
  'angel one': '/logos/angelone.svg',
  'angel': '/logos/angelone.svg',
  'cdsl': '/logos/cdsl.webp',
  'unify': '/logos/unify.png',
};

const BROKER_FILTERS = [
  { id: 'All', label: 'All Accounts', logo: '/logos/unify.png' },
  { id: 'Zerodha', label: 'Zerodha', logo: '/logos/zerodha.webp' },
  { id: 'Groww', label: 'Groww', logo: '/logos/groww.png' },
  { id: 'Upstox', label: 'Upstox', logo: '/logos/upstox.png' },
  { id: 'Angel One', label: 'Angel One', logo: '/logos/angelone.svg' },
  { id: 'CDSL', label: 'CDSL CAS', logo: '/logos/cdsl.webp' },
];

const TIMEFRAME_CONFIG: Record<string, {
  labels: string[];
  portfolio: number[];
  benchmark: Record<string, number[]>;
}> = {
  '1M': {
    labels: ['4w ago', '3w ago', '2w ago', 'Last week', '3d ago', 'Today'],
    portfolio: [0.972, 0.981, 0.976, 0.989, 0.995, 1.000],
    benchmark: {
      NIFTY50: [0.972, 0.976, 0.979, 0.983, 0.987, 0.991],
      SENSEX: [0.972, 0.975, 0.978, 0.982, 0.986, 0.990],
      MIDCAP: [0.972, 0.979, 0.974, 0.986, 0.992, 0.994],
    }
  },
  '3M': {
    labels: ['Mar W1', 'Mar W3', 'Apr W1', 'Apr W3', 'May W1', 'May W3', 'Current'],
    portfolio: [0.935, 0.948, 0.962, 0.974, 0.986, 0.994, 1.000],
    benchmark: {
      NIFTY50: [0.935, 0.942, 0.950, 0.958, 0.966, 0.972, 0.978],
      SENSEX: [0.935, 0.941, 0.949, 0.957, 0.964, 0.970, 0.976],
      MIDCAP: [0.935, 0.945, 0.956, 0.968, 0.978, 0.984, 0.988],
    }
  },
  '6M': {
    labels: ['Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
    portfolio: [0.880, 0.902, 0.925, 0.952, 0.978, 1.000],
    benchmark: {
      NIFTY50: [0.880, 0.889, 0.905, 0.920, 0.938, 0.948],
      SENSEX: [0.880, 0.887, 0.902, 0.918, 0.935, 0.945],
      MIDCAP: [0.880, 0.895, 0.916, 0.934, 0.955, 0.965],
    }
  },
  '1Y': {
    labels: ['Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'],
    portfolio: [0.805, 0.824, 0.816, 0.838, 0.862, 0.886, 0.912, 0.905, 0.938, 0.962, 0.984, 1.000],
    benchmark: {
      NIFTY50: [0.805, 0.814, 0.819, 0.826, 0.842, 0.856, 0.872, 0.864, 0.882, 0.896, 0.908, 0.914],
      SENSEX: [0.805, 0.812, 0.817, 0.824, 0.839, 0.853, 0.868, 0.860, 0.878, 0.892, 0.904, 0.910],
      MIDCAP: [0.805, 0.828, 0.815, 0.840, 0.868, 0.880, 0.900, 0.888, 0.918, 0.942, 0.958, 0.968],
    }
  },
  'ALL': {
    labels: ['Q1 \'22', 'Q2 \'22', 'Q3 \'22', 'Q4 \'22', 'Q1 \'23', 'Q2 \'23', 'Q3 \'23', 'Q4 \'23', 'Q1 \'24', 'Q2 \'24', 'Q3 \'24', 'Current'],
    portfolio: [0.550, 0.585, 0.620, 0.665, 0.710, 0.760, 0.815, 0.850, 0.895, 0.935, 0.970, 1.000],
    benchmark: {
      NIFTY50: [0.550, 0.570, 0.598, 0.630, 0.665, 0.700, 0.742, 0.770, 0.805, 0.838, 0.865, 0.884],
      SENSEX: [0.550, 0.568, 0.595, 0.626, 0.660, 0.695, 0.736, 0.764, 0.798, 0.831, 0.858, 0.876],
      MIDCAP: [0.550, 0.580, 0.612, 0.650, 0.690, 0.735, 0.785, 0.818, 0.860, 0.902, 0.938, 0.955],
    }
  }
};

const BENCHMARK_METAS: Record<string, { label: string; short: string; color: string; desc: string }> = {
  NIFTY50: { label: 'NIFTY 50 (TRI)', short: 'NIFTY 50', color: '#06B6D4', desc: 'NSE Benchmark (Large Cap Top 50)' },
  SENSEX: { label: 'BSE SENSEX 30', short: 'SENSEX', color: '#38BDF8', desc: 'BSE Benchmark (Top 30 Indian Bluechips)' },
  MIDCAP: { label: 'NIFTY Midcap 150', short: 'Midcap 150', color: '#F59E0B', desc: 'NSE Midcap High-Beta Benchmark' },
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
  const { t } = useLanguage();
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

  // Trajectory Chart State
  const [chartTimeframe, setChartTimeframe] = useState<'1M' | '3M' | '6M' | '1Y' | 'ALL'>('1Y');
  const [benchmarkType, setBenchmarkType] = useState<'NIFTY50' | 'SENSEX' | 'MIDCAP'>('NIFTY50');
  const [chartMode, setChartMode] = useState<'VALUE' | 'PERCENT'>('VALUE');

  // Trade state
  const [tradeSymbol, setTradeSymbol] = useState('RELIANCE');
  const [tradeBroker, setTradeBroker] = useState('Zerodha');
  const [tradeAction, setTradeAction] = useState<'BUY' | 'SELL'>('BUY');
  const [tradeQty, setTradeQty] = useState(10);

  // Holdings state (reactive to simulated trades, live feeds, and trader tier selection)
  const [holdings, setHoldings] = useState<any[]>(() => {
    return initialData?.holdings?.length > 0 ? initialData.holdings : TIER_PORTFOLIOS['Beginner'];
  });

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLevel = localStorage.getItem('unify_trader_level');
      const level = savedLevel && TIER_DETAILS[savedLevel] ? savedLevel : 'Beginner';
      const meta = TIER_DETAILS[level];
      
      setUserLevel(level);
      setUserTitle(meta.title);
      setUserDesc(meta.desc);

      // Initialize holdings to match classified test tier
      if (TIER_PORTFOLIOS[level]) {
        setHoldings(TIER_PORTFOLIOS[level]);
      }
    }
  }, []);

  const handleSelectTier = (tier: string) => {
    const meta = TIER_DETAILS[tier] || TIER_DETAILS['Beginner'];
    setUserLevel(tier);
    setUserTitle(meta.title);
    setUserDesc(meta.desc);
    if (typeof window !== 'undefined') {
      localStorage.setItem('unify_trader_level', tier);
      localStorage.setItem('unify_trader_title', meta.title);
      localStorage.setItem('unify_trader_desc', meta.desc);
    }
    if (TIER_PORTFOLIOS[tier]) {
      setHoldings(TIER_PORTFOLIOS[tier]);
    }
    setTradeToast({
      show: true,
      type: 'info',
      title: `Portfolio Switched to ${tier} Level`,
      message: `Asset allocation, scrips, and AI advisory reconfigured for ${meta.title}.`
    });
  };
  const [recentTrades, setRecentTrades] = useState<Array<{
    id: string;
    symbol: string;
    broker: string;
    action: 'BUY' | 'SELL';
    qty: number;
    price: number;
    time: string;
  }>>([]);
  const [tradeToast, setTradeToast] = useState<{
    show: boolean;
    type: 'success' | 'info' | 'error';
    title: string;
    message: string;
  } | null>(null);
  const [marketMovementPct, setMarketMovementPct] = useState(0.79);
  const [lastSyncTime, setLastSyncTime] = useState('2m ago');

  useEffect(() => {
    if (tradeToast) {
      const timer = setTimeout(() => {
        setTradeToast(null);
      }, 4500);
      return () => clearTimeout(timer);
    }
  }, [tradeToast]);
  
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

  // Growth Chart & Benchmark Trajectory Data
  const baseVal = Math.max(10000, Math.round(totalValue));
  const activeBenchmarkMeta = BENCHMARK_METAS[benchmarkType] || BENCHMARK_METAS['NIFTY50'];

  const chartData = useMemo(() => {
    const config = TIMEFRAME_CONFIG[chartTimeframe] || TIMEFRAME_CONFIG['1Y'];
    const pMults = config.portfolio;
    const bMults = config.benchmark[benchmarkType] || config.benchmark['NIFTY50'];
    const initialP = pMults[0];
    const initialB = bMults[0];

    return config.labels.map((lbl, idx) => {
      const pRaw = baseVal * pMults[idx];
      const bRaw = baseVal * bMults[idx];
      const pVal = Math.round(pRaw);
      const bVal = Math.round(bRaw);

      const pPct = +(((pMults[idx] - initialP) / initialP) * 100).toFixed(2);
      const bPct = +(((bMults[idx] - initialB) / initialB) * 100).toFixed(2);

      return {
        label: lbl,
        portfolio: chartMode === 'VALUE' ? pVal : pPct,
        benchmark: chartMode === 'VALUE' ? bVal : bPct,
        portfolioVal: pVal,
        benchmarkVal: bVal,
        portfolioPct: pPct,
        benchmarkPct: bPct,
      };
    });
  }, [baseVal, chartTimeframe, benchmarkType, chartMode]);

  const latestPoint = chartData[chartData.length - 1] || { portfolioPct: 0, benchmarkPct: 0, portfolioVal: 0, benchmarkVal: 0 };
  const currentPortfolioPct = latestPoint.portfolioPct;
  const currentBenchmarkPct = latestPoint.benchmarkPct;
  const currentAlphaPct = +(currentPortfolioPct - currentBenchmarkPct).toFixed(2);
  const netAlphaValue = Math.max(0, latestPoint.portfolioVal - latestPoint.benchmarkVal);

  // Time Machine compounding calculation on Dashboard
  const estimatedCagr = predictSymbol === 'RELIANCE' ? 14.5 : (predictSymbol === 'TCS' ? 12.8 : 13.5);
  const totalMonths = sipDuration * 12;
  const totalInvestedSip = sipAmount * totalMonths;
  const monthlyRate = estimatedCagr / 100 / 12;
  const estimatedFutureValue = Math.round(
    sipAmount * ((Math.pow(1 + monthlyRate, totalMonths) - 1) / monthlyRate) * (1 + monthlyRate)
  );

  const handleSimulate = async () => {
    const currentLtp = SCRIP_METADATA[tradeSymbol]?.price || 1500;
    const currentHolding = holdings.find((h: any) => h.symbol === tradeSymbol && h.broker === tradeBroker);

    if (tradeAction === 'SELL') {
      if (!currentHolding || currentHolding.quantity <= 0) {
        setTradeToast({
          show: true,
          type: 'error',
          title: 'Position Not Found',
          message: `Cannot SELL ${tradeSymbol} on ${tradeBroker}: You have 0 shares in this account. Select BUY or pick an account with active holdings.`
        });
        return;
      }
      if (tradeQty > currentHolding.quantity) {
        setTradeToast({
          show: true,
          type: 'error',
          title: 'Exceeds Owned Quantity',
          message: `Cannot SELL ${tradeQty} shares: You only hold ${currentHolding.quantity} shares of ${tradeSymbol} on ${tradeBroker}.`
        });
        return;
      }
    }

    setTradeLoading(true);

    try {
      await simulateTradeAction(tradeSymbol, tradeBroker, tradeAction, tradeQty, currentLtp);
    } catch (e) {
      console.log('Server simulation action note (running demo state fallback):', e);
    }

    // Optimistically update React state
    setHoldings(prev => {
      const next = [...prev];
      const idx = next.findIndex((h: any) => h.symbol === tradeSymbol && h.broker === tradeBroker);
      
      if (tradeAction === 'BUY') {
        if (idx >= 0) {
          const old = next[idx];
          const oldQty = old.quantity;
          const oldAvg = old.avgBuyPrice || currentLtp;
          const newQty = oldQty + tradeQty;
          const newAvg = ((oldQty * oldAvg) + (tradeQty * currentLtp)) / newQty;
          next[idx] = {
            ...old,
            quantity: newQty,
            avgBuyPrice: Math.round(newAvg * 100) / 100,
            currentPrice: currentLtp
          };
        } else {
          next.push({
            id: 'sim-' + Date.now(),
            userId: 'demo',
            accountId: tradeBroker.toLowerCase(),
            symbol: tradeSymbol,
            isin: SCRIP_METADATA[tradeSymbol]?.isin || 'INE' + Date.now(),
            assetType: SCRIP_METADATA[tradeSymbol]?.assetType || 'EQUITY',
            quantity: tradeQty,
            avgBuyPrice: currentLtp,
            currentPrice: currentLtp,
            broker: tradeBroker
          });
        }
      } else {
        // SELL
        if (idx >= 0) {
          const old = next[idx];
          const remQty = old.quantity - tradeQty;
          if (remQty <= 0) {
            next.splice(idx, 1);
          } else {
            next[idx] = {
              ...old,
              quantity: remQty
            };
          }
        }
      }
      return next;
    });

    // Add to recent simulated orders log
    setRecentTrades(prev => [
      {
        id: 'tr-' + Date.now(),
        symbol: tradeSymbol,
        broker: tradeBroker,
        action: tradeAction,
        qty: tradeQty,
        price: currentLtp,
        time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' })
      },
      ...prev
    ]);

    setTradeLoading(false);
    setSimulateModalOpen(false);

    setTradeToast({
      show: true,
      type: 'success',
      title: `Order Executed: ${tradeAction} ${tradeQty} ${tradeSymbol}`,
      message: `Executed on ${tradeBroker} @ ₹${currentLtp.toLocaleString('en-IN')}. Portfolio net worth, holdings, and allocations updated!`
    });
  };

  const handleLiveSync = () => {
    setSyncing(true);
    setTimeout(() => {
      setHoldings(prev => {
        return prev.map((h: any) => {
          // Subtle realistic fluctuation (-0.8% to +1.2%)
          const tickPct = (Math.random() * 2.0 - 0.8) / 100;
          const updatedPrice = Math.round(h.currentPrice * (1 + tickPct) * 100) / 100;
          return { ...h, currentPrice: updatedPrice };
        });
      });
      const newMktPct = +(0.5 + Math.random() * 0.8).toFixed(2);
      setMarketMovementPct(newMktPct);
      setLastSyncTime('Just now (Live)');
      setSyncing(false);
      setTradeToast({
        show: true,
        type: 'info',
        title: 'Live Market Telemetry Synced',
        message: 'Refreshed real-time LTP ticks across Zerodha, Groww & Upstox accounts!'
      });
    }, 700);
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
            {t('dashboard_title', 'Portfolio Dashboard')}
          </h1>
          <p className="text-text-secondary mt-1 flex items-center gap-2 font-medium">
            {t('dashboard_subtitle', 'Consolidated real-time telemetry across linked Indian brokerages')}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={handleLiveSync} 
            disabled={syncing}
            className="card px-4 py-2.5 text-sm font-semibold flex items-center gap-2 text-gain hover:bg-success/10 transition-all border border-gain/20 shadow-sm active:scale-95 cursor-pointer disabled:opacity-60"
            title="Fetch real-time LTP ticks from NSE/BSE"
          >
            <span className={`w-2.5 h-2.5 rounded-full ${syncing ? 'bg-success animate-ping' : 'bg-success animate-pulse'}`}></span>
            {syncing ? t('syncing_feeds', 'Syncing Feeds...') : t('live_feed', 'Live Feed')}
          </button>
          <button 
            onClick={() => setSimulateModalOpen(true)} 
            className="btn-primary flex items-center gap-2 shadow-md shadow-accent/25 active:scale-95 cursor-pointer"
          >
            <Sparkles size={16} />
            {t('simulate_trade', '+ Simulate Trade')}
          </button>
        </div>
      </div>

      {/* AI ADVISORY & CLASSIFIED USER TIER PANEL */}
      <div className="card p-6 md:p-8 bg-surface border border-accent/30 relative overflow-hidden rounded-3xl z-10 shadow-xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-5 pb-5 border-b border-border">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 rounded-2xl bg-accent-bg text-accent flex items-center justify-center font-bold border border-accent/20 shrink-0">
              <Award size={30} />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h2 className="text-xl font-black text-text-primary">{t('ai_advisory_title', 'AI Advisory & Portfolio Strategy')}</h2>
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-accent text-white shadow-sm">
                  {userTitle}
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-1 max-w-xl font-medium">
                {userDesc}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-bg border border-border text-xs font-bold text-text-muted shrink-0 shadow-xs">
            <Lock size={13} className="text-accent" />
            <span>Assigned via Diagnostic Quiz</span>
          </div>
        </div>

        {/* Automatic Classified Trader Profile Status Bar (Read-Only & Synced) */}
        <div className="mb-6 p-4 rounded-2xl bg-bg/80 border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-inner">
          <div className="flex items-center gap-2.5">
            <Activity size={18} className="text-accent shrink-0 animate-pulse" />
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xs font-black uppercase tracking-wider text-text-primary">
                  Classified Trader Profile:
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded bg-gain-bg text-gain border border-gain/20 flex items-center gap-1">
                  <CheckCircle2 size={11} /> Auto-Calibrated
                </span>
              </div>
              <p className="text-[11px] text-text-muted mt-0.5">
                Your portfolio telemetry, risk advisory, and scrips are automatically calibrated to your assessed risk profile.
              </p>
            </div>
          </div>

          {/* Locked Badge Display of Current User Level */}
          <div className="flex items-center gap-2 shrink-0">
            <div className="px-3.5 py-1.5 rounded-xl bg-accent text-white text-xs font-black shadow-md shadow-accent/20 flex items-center gap-2 border border-accent/40">
              <Sparkles size={13} />
              <span>{userLevel} Profile</span>
            </div>
          </div>
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
          <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider mb-2">{t('total_net_portfolio', 'Total Net Portfolio')}</p>
          <h2 className="text-4xl font-display font-bold text-gradient tabular-nums">
            <AnimatedNumber value={totalValue} prefix="₹" isCurrency />
          </h2>
          <div className="mt-6 flex justify-between text-[11px] font-medium text-text-secondary border-t border-border pt-3">
            <span>{t('invested', 'Invested')}:</span>
            <span className="text-text-primary">₹{Math.round(totalInvested).toLocaleString('en-IN')}</span>
          </div>
        </div>

        {/* Realized & Unrealized PnL */}
        <div className="card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider w-1/2 leading-relaxed">{t('realized_unrealized_pnl', 'Total Realized & Unrealized P&L')}</p>
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
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider w-1/2 leading-relaxed">{t('today_market_movement', "Today's Market Movement")}</p>
            <span className="px-2 py-1 rounded bg-success/10 text-gain text-[10px] font-bold border border-success/20">
              +{marketMovementPct.toFixed(2)}%
            </span>
          </div>
          <h2 className="text-3xl font-display font-bold tabular-nums mt-2 text-gain">
            +<AnimatedNumber value={totalValue * (marketMovementPct / 100)} prefix="₹" isCurrency />
          </h2>
          <div className="mt-4 flex justify-between text-[11px] font-medium text-text-secondary border-t border-border pt-3">
            <span className="flex items-center gap-1"><span className="w-1.5 h-1.5 rounded-full bg-success"></span> NSE/BSE Open</span>
            <span>{holdings.length} scrips tracked</span>
          </div>
        </div>

        {/* Telemetry Status */}
        <div className="card p-6 flex flex-col justify-between">
          <div className="flex justify-between items-start">
            <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">{t('multi_broker_telemetry', 'Multi-Broker Telemetry')}</p>
            <span className="px-2 py-1 rounded bg-success/10 text-gain text-[10px] font-bold border border-success/20 flex gap-1 items-center">
              <div className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></div>
              Sync: {lastSyncTime}
            </span>
          </div>
          <h2 className="text-2xl font-display font-bold mt-2">
            4 <span className="text-base font-sans font-medium text-text-primary/70">{t('brokers_live', 'Brokers Live')}</span>
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
                <h3 className="font-extrabold text-sm text-text-primary">{t('time_machine_projections', 'Time Machine Projections')}</h3>
              </div>
              <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-accent-bg text-accent">SIP Engine</span>
            </div>

            <p className="text-xs text-text-secondary mb-4 leading-relaxed">
              {t('time_machine_desc', 'Historical SIP & Lump Sum compounding growth analytics.')} <strong className="text-text-primary">{predictSymbol}</strong>.
            </p>

            <div className="space-y-3 mb-6">
              <div>
                <div className="flex justify-between text-xs font-bold text-text-muted mb-1">
                  <span>{t('monthly_sip', 'Monthly SIP Amount')}</span>
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
                  <span>{t('time_horizon', 'Duration')} ({t('years', 'Years')})</span>
                  <span className="text-text-primary font-mono">{sipDuration} {t('years', 'Years')}</span>
                </div>
                <div className="flex gap-2">
                  {[1, 3, 5].map(y => (
                    <button 
                      key={y}
                      onClick={() => setSipDuration(y)} 
                      className={`flex-1 py-1 rounded-lg text-xs font-bold border transition-colors ${sipDuration === y ? 'bg-accent text-white border-accent' : 'bg-bg border-border text-text-secondary'}`}
                    >
                      {y} {t('years', 'Yr')}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-2xl bg-bg border border-border space-y-1">
                <div className="flex justify-between text-xs font-medium text-text-muted">
                  <span>{t('invested', 'Total Invested')}:</span>
                  <span className="text-text-primary font-mono font-bold">₹{totalInvestedSip.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between text-sm font-extrabold text-gain">
                  <span>{t('expected_portfolio', 'Projected Value')}:</span>
                  <span className="font-mono">₹{estimatedFutureValue.toLocaleString('en-IN')}</span>
                </div>
              </div>
            </div>
          </div>

          <Link href="/time-machine" className="btn-primary w-full py-2.5 text-xs text-center font-bold flex justify-center items-center gap-1.5">
            {t('run_projection', 'Full Time Machine Analytics')} <ArrowRight size={14} />
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
                <Layers size={22} className="text-accent" /> {t('asset_allocation', 'Asset Allocation & Capital Invested')}
              </h3>
              <p className="text-xs text-text-secondary mt-1 font-medium">
                Detailed capital distribution and portfolio percentage share across {allocData.length} asset classes
              </p>
            </div>
            <span className="px-3.5 py-1.5 rounded-full bg-accent-bg text-accent text-xs font-black uppercase tracking-wider self-start sm:self-auto border border-accent/20">
              {t('invested', 'Total Invested')}: ₹{Math.round(totalInvested).toLocaleString('en-IN')}
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
                    formatter={(value: any) => [`₹${Math.round(Number(value)).toLocaleString('en-IN')}`, 'Invested Amount']}
                  />
                </PieChart>
              </ResponsiveContainer>
              
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none text-center">
                <p className="text-[10px] text-text-muted uppercase tracking-widest font-black">Net Portfolio Value</p>
                <p className="text-3xl font-black text-text-primary tracking-tight font-display">₹{(totalValue/100000).toFixed(2)}L</p>
                <p className="text-xs font-bold text-gain mt-0.5">₹{Math.round(totalValue).toLocaleString('en-IN')}</p>
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
                      <span className="font-mono font-black text-text-primary text-base">₹{Math.round(item.amount).toLocaleString('en-IN')}</span>
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

        {/* Growth & Benchmark Trajectory Analytics Card */}
        <div className="card p-6 md:p-8 col-span-1 lg:col-span-3 min-h-[520px] flex flex-col justify-between rounded-3xl bg-surface border border-border space-y-6">
          {/* Card Header */}
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4 pb-5 border-b border-border">
            <div>
              <div className="flex flex-wrap items-center gap-2.5">
                <h3 className="text-xl font-black text-text-primary flex items-center gap-2">
                  <TrendingUp size={22} className="text-accent" /> Portfolio Trajectory vs Benchmark
                </h3>
                <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
                  currentAlphaPct >= 0 
                    ? 'bg-success/15 text-gain border border-success/30' 
                    : 'bg-destructive/15 text-loss border border-destructive/30'
                }`}>
                  {currentAlphaPct >= 0 ? `+${currentAlphaPct}% Benchmark Alpha` : `${currentAlphaPct}% Benchmark Lag`}
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-1 font-medium">
                Tracking your consolidated {userTitle} capital growth against {activeBenchmarkMeta.desc}
              </p>
            </div>

            {/* Quick Mode Toggle (Value in INR vs % Return) */}
            <div className="flex items-center gap-1.5 bg-bg p-1 rounded-2xl border border-border self-start lg:self-auto">
              <button
                onClick={() => setChartMode('VALUE')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  chartMode === 'VALUE' 
                    ? 'bg-accent text-white shadow-sm font-black' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                ₹ Capital Value
              </button>
              <button
                onClick={() => setChartMode('PERCENT')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  chartMode === 'PERCENT' 
                    ? 'bg-accent text-white shadow-sm font-black' 
                    : 'text-text-secondary hover:text-text-primary'
                }`}
              >
                % Cumulative Return
              </button>
            </div>
          </div>

          {/* Actionable Filter Controls Row */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
            {/* Benchmark Selection Pills */}
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-[11px] font-extrabold uppercase text-text-muted tracking-wider mr-1">Benchmark:</span>
              {(['NIFTY50', 'SENSEX', 'MIDCAP'] as const).map(bKey => {
                const bMeta = BENCHMARK_METAS[bKey];
                const isActive = benchmarkType === bKey;
                return (
                  <button
                    key={bKey}
                    onClick={() => setBenchmarkType(bKey)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                      isActive
                        ? 'bg-cyan-500/15 text-cyan-400 border border-cyan-500/40 font-black shadow-sm'
                        : 'bg-bg text-text-secondary hover:text-text-primary hover:bg-surface border border-border'
                    }`}
                  >
                    <span className="w-2 h-2 rounded-full" style={{ backgroundColor: bMeta.color }}></span>
                    <span>{bMeta.short}</span>
                  </button>
                );
              })}
            </div>

            {/* Timeframe Pills */}
            <div className="flex items-center gap-1 bg-bg p-1 rounded-2xl border border-border">
              {(['1M', '3M', '6M', '1Y', 'ALL'] as const).map(tf => {
                const isActive = chartTimeframe === tf;
                return (
                  <button
                    key={tf}
                    onClick={() => setChartTimeframe(tf)}
                    className={`px-3 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      isActive
                        ? 'bg-accent text-white shadow-sm font-black'
                        : 'text-text-secondary hover:text-text-primary hover:bg-surface'
                    }`}
                  >
                    {tf}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chart Display Container */}
          <div className="h-[290px] w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 10, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPortfolio" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#8B5CF6" stopOpacity={0.45}/>
                    <stop offset="95%" stopColor="#8B5CF6" stopOpacity={0.02}/>
                  </linearGradient>
                  <linearGradient id="colorBenchmark" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor={activeBenchmarkMeta.color} stopOpacity={0.25}/>
                    <stop offset="95%" stopColor={activeBenchmarkMeta.color} stopOpacity={0.01}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.4} />
                <XAxis 
                  dataKey="label" 
                  stroke="var(--text-muted)" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false} 
                />
                <YAxis 
                  stroke="var(--text-muted)" 
                  fontSize={11} 
                  tickLine={false} 
                  axisLine={false}
                  domain={['auto', 'auto']}
                  tickFormatter={(v: number) => {
                    if (chartMode === 'PERCENT') return `${v >= 0 ? '+' : ''}${v.toFixed(0)}%`;
                    if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`;
                    if (v >= 1000) return `₹${(v / 1000).toFixed(0)}k`;
                    return `₹${v}`;
                  }}
                />
                <Tooltip 
                  content={({ active, payload, label }: any) => {
                    if (active && payload && payload.length) {
                      const pItem = payload.find((p: any) => p.dataKey === 'portfolio');
                      const bItem = payload.find((p: any) => p.dataKey === 'benchmark');
                      const pVal = pItem ? pItem.payload.portfolioVal : 0;
                      const bVal = bItem ? bItem.payload.benchmarkVal : 0;
                      const pPct = pItem ? pItem.payload.portfolioPct : 0;
                      const bPct = bItem ? bItem.payload.benchmarkPct : 0;
                      const alphaPct = +(pPct - bPct).toFixed(2);
                      const alphaVal = pVal - bVal;

                      return (
                        <div className="p-4 rounded-2xl bg-surface/95 border border-border shadow-2xl backdrop-blur-md text-xs space-y-3 min-w-[240px]">
                          <div className="flex justify-between items-center pb-2 border-b border-border/80">
                            <span className="font-black text-text-primary uppercase tracking-wider">{label}</span>
                            <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full ${
                              alphaPct >= 0 
                                ? 'bg-success/15 text-gain border border-success/30' 
                                : 'bg-destructive/15 text-loss border border-destructive/30'
                            }`}>
                              {alphaPct >= 0 ? `+${alphaPct}% Alpha` : `${alphaPct}% Drag`}
                            </span>
                          </div>

                          <div className="space-y-2">
                            <div className="flex justify-between items-center">
                              <span className="flex items-center gap-2 text-text-secondary font-medium">
                                <span className="w-2.5 h-2.5 rounded-full bg-accent shadow-sm"></span>
                                Your Portfolio:
                              </span>
                              <div className="text-right">
                                <span className="font-mono font-black text-text-primary">
                                  ₹{Math.round(pVal).toLocaleString('en-IN')}
                                </span>
                                <span className="text-[10px] text-gain ml-1.5 font-mono font-bold">
                                  ({pPct >= 0 ? '+' : ''}{pPct}%)
                                </span>
                              </div>
                            </div>

                            <div className="flex justify-between items-center">
                              <span className="flex items-center gap-2 text-text-secondary font-medium">
                                <span className="w-2.5 h-2.5 rounded-full shadow-sm" style={{ backgroundColor: activeBenchmarkMeta.color }}></span>
                                {activeBenchmarkMeta.short}:
                              </span>
                              <div className="text-right">
                                <span className="font-mono font-bold text-text-secondary">
                                  ₹{Math.round(bVal).toLocaleString('en-IN')}
                                </span>
                                <span className="text-[10px] text-text-muted ml-1.5 font-mono">
                                  ({bPct >= 0 ? '+' : ''}{bPct}%)
                                </span>
                              </div>
                            </div>
                          </div>

                          <div className="pt-2 border-t border-border/80 flex justify-between items-center text-[11px]">
                            <span className="text-text-muted font-bold">Net Outperformance:</span>
                            <span className="font-mono font-extrabold text-gain">
                              {alphaVal >= 0 ? `+₹${Math.round(alphaVal).toLocaleString('en-IN')}` : `-₹${Math.round(Math.abs(alphaVal)).toLocaleString('en-IN')}`}
                            </span>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area 
                  type="monotone" 
                  dataKey="portfolio" 
                  name="Your Portfolio" 
                  stroke="#8B5CF6" 
                  strokeWidth={3} 
                  fillOpacity={1} 
                  fill="url(#colorPortfolio)" 
                />
                <Area 
                  type="monotone" 
                  dataKey="benchmark" 
                  name={activeBenchmarkMeta.label} 
                  stroke={activeBenchmarkMeta.color} 
                  strokeWidth={2} 
                  strokeDasharray="4 4" 
                  fillOpacity={1} 
                  fill="url(#colorBenchmark)" 
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Bottom Telemetry Performance Metric Bar */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 pt-3 border-t border-border">
            {/* Metric 1: Portfolio Return */}
            <div className="p-3.5 rounded-2xl bg-bg border border-border space-y-1">
              <span className="text-[10px] uppercase font-bold text-text-muted flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-accent"></span> Your Portfolio
              </span>
              <div className="text-lg font-black text-text-primary font-mono">
                {currentPortfolioPct >= 0 ? '+' : ''}{currentPortfolioPct}%
              </div>
              <p className="text-[10px] text-text-secondary font-medium">Return in {chartTimeframe} window</p>
            </div>

            {/* Metric 2: Benchmark Return */}
            <div className="p-3.5 rounded-2xl bg-bg border border-border space-y-1">
              <span className="text-[10px] uppercase font-bold text-text-muted flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full" style={{ backgroundColor: activeBenchmarkMeta.color }}></span> {activeBenchmarkMeta.short}
              </span>
              <div className="text-lg font-black text-text-secondary font-mono">
                {currentBenchmarkPct >= 0 ? '+' : ''}{currentBenchmarkPct}%
              </div>
              <p className="text-[10px] text-text-secondary font-medium">TRI Index return</p>
            </div>

            {/* Metric 3: Generated Alpha */}
            <div className="p-3.5 rounded-2xl bg-bg border border-border space-y-1">
              <span className="text-[10px] uppercase font-bold text-text-muted flex items-center gap-1.5">
                <Sparkles size={11} className="text-gain" /> Net Alpha
              </span>
              <div className={`text-lg font-black font-mono ${currentAlphaPct >= 0 ? 'text-gain' : 'text-loss'}`}>
                {currentAlphaPct >= 0 ? `+${currentAlphaPct}%` : `${currentAlphaPct}%`}
              </div>
              <p className="text-[10px] text-gain font-mono font-semibold">
                +₹{Math.round(netAlphaValue).toLocaleString('en-IN')} value lead
              </p>
            </div>

            {/* Metric 4: Max Drawdown */}
            <div className="p-3.5 rounded-2xl bg-bg border border-border space-y-1">
              <span className="text-[10px] uppercase font-bold text-text-muted flex items-center gap-1.5">
                <ShieldCheck size={11} className="text-emerald-400" /> Max Drawdown
              </span>
              <div className="text-lg font-black text-text-primary font-mono">
                -4.12%
              </div>
              <p className="text-[10px] text-emerald-400 font-semibold">
                vs {activeBenchmarkMeta.short} -7.85%
              </p>
            </div>
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

      {/* Live Simulated Execution Log */}
      {recentTrades.length > 0 && (
        <div className="card p-5 border border-accent/30 bg-surface rounded-2xl shadow-md">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-2">
              <History size={16} className="text-accent" />
              <h3 className="text-sm font-black text-text-primary">
                Live Simulated Execution Log ({recentTrades.length} {recentTrades.length === 1 ? 'order' : 'orders'})
              </h3>
            </div>
            <button 
              onClick={() => setRecentTrades([])}
              className="text-[11px] font-bold text-text-muted hover:text-text-primary transition-colors cursor-pointer"
            >
              Clear Log
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {recentTrades.map((t) => (
              <div key={t.id} className="p-3 bg-bg border border-border rounded-xl flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${t.action === 'BUY' ? 'bg-success/15 text-gain border border-success/30' : 'bg-destructive/15 text-loss border border-destructive/30'}`}>
                    {t.action}
                  </span>
                  <div>
                    <span className="font-extrabold text-text-primary">{t.qty}x {t.symbol}</span>
                    <div className="text-[10px] text-text-muted">via {t.broker} • ₹{t.price.toLocaleString('en-IN')}</div>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono font-bold text-gain flex items-center justify-end gap-1">
                    <CheckCircle2 size={11} /> Completed
                  </span>
                  <span className="text-[10px] text-text-muted font-mono">{t.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Holdings Table */}
      <div className="card overflow-hidden">
        <div className="p-5 border-b border-border flex flex-col md:flex-row justify-between items-start md:items-center gap-4 bg-bg">
          <div className="flex items-center gap-3 overflow-x-auto w-full md:w-auto pb-2 md:pb-0 scrollbar-none">
            <span className="text-xs font-black uppercase text-text-muted tracking-wider shrink-0 mr-1">{t('all_accounts', 'Filter')}:</span>
            {BROKER_FILTERS.map(b => {
              const active = filter === b.id;
              const displayLabel = b.id === 'All' ? t('all_accounts', 'All Accounts') : b.label;
              return (
                <button 
                  key={b.id}
                  onClick={() => setFilter(b.id)} 
                  className={`px-5 py-2.5 rounded-2xl text-sm font-extrabold transition-all flex items-center gap-2.5 shrink-0 border-2 cursor-pointer ${
                    active 
                      ? 'bg-accent text-white border-accent shadow-md shadow-accent/25 scale-[1.02]' 
                      : 'bg-surface text-text-primary border-border hover:border-accent/40 hover:bg-surface-hover shadow-sm'
                  }`}
                >
                  <div className={`w-6 h-6 rounded-full p-0.5 flex items-center justify-center shrink-0 ${active ? 'bg-white shadow-sm' : 'bg-bg border border-border'}`}>
                    <img src={b.logo} alt={displayLabel} className="w-full h-full object-contain rounded-full" />
                  </div>
                  <span className={active ? 'text-white font-extrabold' : 'text-text-primary font-bold'}>{displayLabel}</span>
                </button>
              );
            })}
          </div>
          <span className="text-xs font-black text-text-secondary bg-surface px-3.5 py-2 rounded-xl border border-border font-mono shrink-0 shadow-sm">
            {filteredHoldings.length} {t('positions_shown', 'Positions Shown')}
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-bg text-text-muted font-bold uppercase tracking-wider border-b border-border">
              <tr>
                <th className="p-4">{t('col_asset', 'Asset')}</th>
                <th className="p-4">{t('col_broker', 'Broker')}</th>
                <th className="p-4 text-right">{t('col_qty', 'Qty')}</th>
                <th className="p-4 text-right">{t('col_avg_price', 'Avg Price')}</th>
                <th className="p-4 text-right">{t('col_ltp', 'LTP')}</th>
                <th className="p-4 text-right">{t('col_current_value', 'Current Value')}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filteredHoldings.map((h: any, idx: number) => {
                const val = h.quantity * h.currentPrice;
                const bKey = (h.broker || '').toLowerCase();
                const logoSrc = BROKER_LOGOS[bKey] || BROKER_LOGOS[bKey.split(' ')[0]] || '/logos/unify.png';
                return (
                  <tr key={idx} className="hover:bg-surface-hover/50 transition-colors">
                    <td className="p-4 font-bold text-text-primary text-sm">
                      <div className="flex items-center gap-2">
                        <span>{h.symbol}</span>
                        {SCRIP_METADATA[h.symbol] && (
                          <span className="text-[10px] text-text-muted font-normal hidden sm:inline">
                            {SCRIP_METADATA[h.symbol].name.split(' ')[0]}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="px-3 py-1.5 rounded-xl bg-bg border border-border font-extrabold text-text-primary flex items-center gap-2 w-fit text-xs shadow-sm">
                        <img src={logoSrc} alt={h.broker} className="w-4 h-4 object-contain rounded-full bg-white p-0.5 border border-border/50" />
                        {h.broker}
                      </span>
                    </td>
                    <td className="p-4 text-right font-mono font-bold text-sm">{h.quantity}</td>
                    <td className="p-4 text-right font-mono text-text-secondary font-medium">₹{(h.avgBuyPrice || h.currentPrice * 0.9).toFixed(2)}</td>
                    <td className="p-4 text-right font-mono font-bold text-text-primary text-sm">₹{h.currentPrice.toFixed(2)}</td>
                    <td className="p-4 text-right font-mono font-extrabold text-sm text-text-primary">₹{Math.round(val).toLocaleString('en-IN')}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* NEW FEATURE MODULES: TAX-LOSS HARVESTING, PASSIVE YIELD CALENDAR, GOAL BUCKETS */}
      <TaxLossHarvestingCard holdings={holdings} />
      <PassiveIncomeCalendar />
      <GoalBasedPortfolioTracker />

      {/* Trade Simulation Modal */}
      {simulateModalOpen && (() => {
        const activeScripMeta = SCRIP_METADATA[tradeSymbol] || { name: tradeSymbol, price: 1500, assetType: 'EQUITY', isin: '' };
        const holdingInTarget = holdings.find((h: any) => h.symbol === tradeSymbol && h.broker === tradeBroker);
        const estTotalValue = tradeQty * activeScripMeta.price;

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSimulateModalOpen(false)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }} 
              animate={{ opacity: 1, scale: 1 }} 
              className="card w-full max-w-lg p-6 md:p-7 relative rounded-3xl border border-border bg-surface z-10 shadow-2xl space-y-5"
            >
              {/* Header */}
              <div className="flex justify-between items-start">
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-xl font-black text-text-primary">Simulate Trade Action</h2>
                    <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded bg-accent/15 text-accent border border-accent/25">
                      Sandbox
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">
                    Mock order fills immediately and recalculates your live portfolio telemetry.
                  </p>
                </div>
                <button 
                  onClick={() => setSimulateModalOpen(false)} 
                  className="p-1 rounded-xl text-text-muted hover:text-text-primary hover:bg-bg transition-colors"
                >
                  <X size={18} />
                </button>
              </div>

              {/* Scrip Selection & Live Price Badge */}
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-text-muted uppercase">Select Equity Scrip</label>
                    <span className="text-xs font-mono font-bold text-gain flex items-center gap-1.5 bg-success/10 px-2 py-0.5 rounded-full border border-success/20">
                      <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse"></span>
                      LTP: ₹{activeScripMeta.price.toLocaleString('en-IN', { minimumFractionDigits: 2 })}
                    </span>
                  </div>
                  <select 
                    value={tradeSymbol} 
                    onChange={e => setTradeSymbol(e.target.value)} 
                    className="w-full bg-bg border border-border rounded-xl p-3 text-sm font-bold text-text-primary focus:border-accent focus:outline-none"
                  >
                    {Object.keys(SCRIP_METADATA).map(sym => (
                      <option key={sym} value={sym}>
                        {sym} — {SCRIP_METADATA[sym].name} (₹{SCRIP_METADATA[sym].price.toFixed(2)})
                      </option>
                    ))}
                  </select>
                </div>

                {/* Target Broker Account */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-text-muted uppercase">Target Brokerage Account</label>
                    {holdingInTarget ? (
                      <span className="text-[11px] text-text-primary font-bold">
                        Owned: <strong className="text-accent">{holdingInTarget.quantity} shares</strong>
                      </span>
                    ) : (
                      <span className="text-[11px] text-text-muted">No current position</span>
                    )}
                  </div>
                  <select 
                    value={tradeBroker} 
                    onChange={e => setTradeBroker(e.target.value)} 
                    className="w-full bg-bg border border-border rounded-xl p-3 text-sm font-bold text-text-primary focus:border-accent focus:outline-none"
                  >
                    <option value="Zerodha">Zerodha Kite (Demat)</option>
                    <option value="Groww">Groww (Demat)</option>
                    <option value="Upstox">Upstox Pro (Demat)</option>
                  </select>
                </div>

                {/* Order Action: BUY / SELL */}
                <div>
                  <label className="text-xs font-bold text-text-muted uppercase mb-1.5 block">Order Direction</label>
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      type="button"
                      onClick={() => setTradeAction('BUY')} 
                      className={`py-2.5 rounded-xl text-xs font-extrabold border transition-all flex items-center justify-center gap-1.5 ${
                        tradeAction === 'BUY' 
                          ? 'bg-gain text-white border-gain shadow-md shadow-gain/20' 
                          : 'bg-bg border-border text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <TrendingUp size={14} />
                      BUY (Add Long)
                    </button>
                    <button 
                      type="button"
                      onClick={() => setTradeAction('SELL')} 
                      className={`py-2.5 rounded-xl text-xs font-extrabold border transition-all flex items-center justify-center gap-1.5 ${
                        tradeAction === 'SELL' 
                          ? 'bg-loss text-white border-loss shadow-md shadow-loss/20' 
                          : 'bg-bg border-border text-text-secondary hover:text-text-primary'
                      }`}
                    >
                      <TrendingDown size={14} />
                      SELL (Trim / Exit)
                    </button>
                  </div>
                </div>

                {/* Quantity with quick buttons */}
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <label className="text-xs font-bold text-text-muted uppercase">Quantity Shares</label>
                    <div className="flex gap-1.5">
                      {[5, 10, 25, 50].map(qty => (
                        <button
                          key={qty}
                          type="button"
                          onClick={() => setTradeQty(qty)}
                          className="px-2 py-0.5 rounded bg-bg border border-border text-[10px] font-bold text-text-muted hover:text-accent hover:border-accent transition-colors"
                        >
                          +{qty}
                        </button>
                      ))}
                      {tradeAction === 'SELL' && holdingInTarget && holdingInTarget.quantity > 0 && (
                        <button
                          type="button"
                          onClick={() => setTradeQty(holdingInTarget.quantity)}
                          className="px-2 py-0.5 rounded bg-loss/10 border border-loss/30 text-[10px] font-bold text-loss hover:bg-loss/20 transition-colors"
                        >
                          All ({holdingInTarget.quantity})
                        </button>
                      )}
                    </div>
                  </div>
                  <input 
                    type="number" 
                    min={1}
                    value={tradeQty} 
                    onChange={e => setTradeQty(Math.max(1, Number(e.target.value)))} 
                    className="w-full bg-bg border border-border rounded-xl p-3 text-sm font-bold text-text-primary focus:border-accent focus:outline-none" 
                  />
                </div>

                {/* Order Summary Preview Card */}
                <div className="p-3.5 rounded-2xl bg-bg border border-border space-y-2 text-xs">
                  <div className="flex justify-between text-text-secondary">
                    <span>Order Type:</span>
                    <span className="font-bold text-text-primary">Market Order (Instant Fill)</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Execution Price:</span>
                    <span className="font-mono font-bold text-text-primary">₹{activeScripMeta.price.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-text-secondary">
                    <span>Brokerage & STT:</span>
                    <span className="font-bold text-gain">₹0.00 (Demo Sandbox)</span>
                  </div>
                  <div className="flex justify-between text-text-primary font-bold border-t border-border pt-2">
                    <span>Estimated Order Value:</span>
                    <span className="text-sm font-mono font-extrabold text-accent">
                      ₹{Math.round(estTotalValue).toLocaleString('en-IN')}
                    </span>
                  </div>
                </div>

                {tradeAction === 'SELL' && (!holdingInTarget || holdingInTarget.quantity <= 0) && (
                  <div className="p-3 rounded-xl bg-destructive/10 border border-destructive/25 text-xs text-loss flex items-center gap-2">
                    <AlertTriangle size={15} className="shrink-0" />
                    <span>You hold 0 shares in {tradeBroker}. Please select BUY or switch brokerage account.</span>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-2">
                <button 
                  type="button"
                  onClick={() => setSimulateModalOpen(false)} 
                  className="flex-1 py-3 bg-bg border border-border rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="button"
                  onClick={handleSimulate} 
                  disabled={tradeLoading || (tradeAction === 'SELL' && (!holdingInTarget || holdingInTarget.quantity <= 0))} 
                  className={`flex-1 py-3 rounded-xl text-xs font-extrabold text-white transition-all shadow-md cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed ${
                    tradeAction === 'BUY' 
                      ? 'bg-gain hover:brightness-110 shadow-gain/20' 
                      : 'bg-loss hover:brightness-110 shadow-loss/20'
                  }`}
                >
                  {tradeLoading ? 'Executing Order...' : `Execute ${tradeAction} Order`}
                </button>
              </div>
            </motion.div>
          </div>
        );
      })()}

      {/* Floating Toast Notification Banner */}
      <AnimatePresence>
        {tradeToast && tradeToast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className={`fixed top-6 right-6 z-50 max-w-md p-4 rounded-2xl shadow-2xl border backdrop-blur-md flex items-start gap-3 ${
              tradeToast.type === 'success' 
                ? 'bg-surface/95 border-success/40 text-text-primary' 
                : tradeToast.type === 'error'
                ? 'bg-surface/95 border-destructive/40 text-text-primary'
                : 'bg-surface/95 border-accent/40 text-text-primary'
            }`}
          >
            <div className={`p-2 rounded-xl shrink-0 ${
              tradeToast.type === 'success' 
                ? 'bg-success/15 text-gain' 
                : tradeToast.type === 'error'
                ? 'bg-destructive/15 text-loss'
                : 'bg-accent/15 text-accent'
            }`}>
              {tradeToast.type === 'success' ? <CheckCircle2 size={18} /> : tradeToast.type === 'error' ? <AlertTriangle size={18} /> : <Zap size={18} />}
            </div>
            <div className="flex-1 pr-2">
              <h4 className="text-xs font-black text-text-primary">{tradeToast.title}</h4>
              <p className="text-[11px] text-text-secondary mt-0.5 leading-relaxed">{tradeToast.message}</p>
            </div>
            <button 
              onClick={() => setTradeToast(null)}
              className="text-text-muted hover:text-text-primary p-1 rounded-lg transition-colors cursor-pointer"
            >
              <X size={14} />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
