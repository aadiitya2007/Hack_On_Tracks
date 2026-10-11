'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, Info, TrendingUp, TrendingDown, 
  Sparkles, CheckCircle2, AlertTriangle, Layers, Grid, HelpCircle, 
  ArrowRight, ShieldCheck, Zap, BarChart3, PieChart, Sliders,
  Send, Loader2, Bot, BookOpen, ExternalLink, RefreshCw, Activity,
  Award, Copy, Check, ChevronRight
} from 'lucide-react';
import { 
  ASSET_DOMAINS, 
  CORRELATION_MATRIX_7X7, 
  calculateMultiAssetRiskProfile 
} from '@/lib/risk-analytics';
import { RebalanceBasketModal } from '@/components/RebalanceBasketModal';
import { TIER_DETAILS } from '../dashboard/DashboardClient';

// Institutional Macroeconomic Stress Test Scenarios
interface StressScenario {
  id: string;
  title: string;
  icon: string;
  tagline: string;
  description: string;
  shocks: Record<string, number>; // Asset percentage return shock e.g. -0.15 for -15%
  volMultiplier: number;
  varMultiplier: number;
  mitigationTip: string;
  defensiveWeights: Record<string, number>;
}

const STRESS_SCENARIOS: StressScenario[] = [
  {
    id: 'tech_crash',
    title: '15% NIFTY High-Beta Correction',
    icon: '📉',
    tagline: 'Tech Sell-off & Liquidity Drawdown',
    description: 'A global tech sell-off and foreign institutional outflows trigger a 15% broad market correction in high-beta Indian equities.',
    shocks: {
      stocks: -0.18,
      mutualFunds: -0.09,
      etfs: -0.12,
      bonds: 0.035, // Flight to safety
      reits: -0.04,
      invits: -0.02,
      fno: -0.55 // Unhedged leverage amplified loss
    },
    volMultiplier: 1.35,
    varMultiplier: 1.45,
    mitigationTip: 'Flexi-Cap Mutual Funds and Sovereign Bonds cushion equity drawdowns by providing cash buffers and negative correlation.',
    defensiveWeights: { stocks: 20, mutualFunds: 40, etfs: 20, bonds: 10, reits: 10, invits: 0, fno: 0 }
  },
  {
    id: 'rbi_hike',
    title: 'RBI Repo Rate Hike (+75 bps)',
    icon: '🏛️',
    tagline: 'Aggressive Monetary Tightening',
    description: 'Persistent food inflation forces the RBI to hike the policy repo rate by 75 bps, increasing bond yields and compressing stock valuations.',
    shocks: {
      stocks: -0.045,
      mutualFunds: -0.02,
      etfs: -0.035,
      bonds: -0.038, // Mark-to-market duration loss
      reits: -0.052, // Yield spread widening
      invits: -0.03,
      fno: -0.12
    },
    volMultiplier: 1.15,
    varMultiplier: 1.18,
    mitigationTip: 'Transition bond duration into ultra-short term Liquid BeES & short T-Bills to capture rising yield accruals.',
    defensiveWeights: { stocks: 25, mutualFunds: 30, etfs: 15, bonds: 20, reits: 10, invits: 0, fno: 0 }
  },
  {
    id: 'crude_shock',
    title: 'Crude Oil Surge ($105/bbl)',
    icon: '🛢️',
    tagline: 'Imported Inflation & CAD Pressure',
    description: 'Geopolitical supply choke points spike Brent Crude beyond $105/bbl, driving rupee depreciation and margin compression in Indian manufacturing.',
    shocks: {
      stocks: -0.075,
      mutualFunds: -0.04,
      etfs: -0.05,
      bonds: -0.02,
      reits: 0.01,
      invits: 0.025, // Toll roads benefit from inflation indexing
      fno: -0.25
    },
    volMultiplier: 1.25,
    varMultiplier: 1.28,
    mitigationTip: 'Allocate 5-10% to Sovereign Gold Bonds & InvITs as organic hedges against imported currency depreciation.',
    defensiveWeights: { stocks: 25, mutualFunds: 25, etfs: 15, bonds: 15, reits: 10, invits: 10, fno: 0 }
  },
  {
    id: 'black_swan',
    title: 'Black Swan Liquidity Freeze',
    icon: '⚡',
    tagline: 'COVID / 2008 Style Systemic Shock',
    description: 'A global credit freeze or geopolitical conflict triggers emergency margin calls across exchanges, halting secondary liquidity.',
    shocks: {
      stocks: -0.28,
      mutualFunds: -0.16,
      etfs: -0.22,
      bonds: 0.055, // Massive institutional flight to sovereign debt
      reits: -0.14,
      invits: -0.10,
      fno: -0.85 // Heavy leverage wipeout
    },
    volMultiplier: 1.70,
    varMultiplier: 1.85,
    mitigationTip: 'Capital preservation relies on sovereign G-Sec holdings and zero unhedged derivative leverage.',
    defensiveWeights: { stocks: 15, mutualFunds: 25, etfs: 10, bonds: 35, reits: 10, invits: 5, fno: 0 }
  }
];

// Tier-Specific Baseline Portfolio Allocations & Base Values
const TIER_BASELINE_DATA: Record<string, { weights: Record<string, number>; defaultBase: number; narrative: string }> = {
  Fresher: {
    weights: { stocks: 20, mutualFunds: 40, etfs: 14, bonds: 26, reits: 0, invits: 0, fno: 0 },
    defaultBase: 250000,
    narrative: 'As a Fresher Investor, your capital is heavily anchored in Flexi-Cap Mutual Funds, Index ETFs, and Sovereign Debt. This keeps your volatility low (10.2%) and shields your principal from wild market fluctuations.'
  },
  Beginner: {
    weights: { stocks: 57, mutualFunds: 26, etfs: 9, bonds: 8, reits: 0, invits: 0, fno: 0 },
    defaultBase: 500000,
    narrative: 'As a Beginner Investor, your portfolio features a strong core of bluechip direct equities and mutual funds. Single-stock exposure raises your 1-Month Value-at-Risk, which can be optimized with broader index funds.'
  },
  Intermediate: {
    weights: { stocks: 45, mutualFunds: 15, etfs: 11, bonds: 14, reits: 15, invits: 0, fno: 0 },
    defaultBase: 1000000,
    narrative: 'As an Intermediate Investor, you have introduced Commercial REITs and Sovereign Bonds alongside direct equities. This multi-asset mix dampens drawdowns while unlocking regular quarterly dividend yields.'
  },
  Advanced: {
    weights: { stocks: 40, mutualFunds: 10, etfs: 12, bonds: 18, reits: 15, invits: 5, fno: 0 },
    defaultBase: 2500000,
    narrative: 'As an Advanced Multi-Asset Investor, your portfolio is diversified across 6 non-correlated asset classes including REITs and InvITs, establishing a resilient institutional Sharpe ratio.'
  },
  Pro: {
    weights: { stocks: 42, mutualFunds: 0, etfs: 8, bonds: 15, reits: 12, invits: 8, fno: 15 },
    defaultBase: 5000000,
    narrative: 'As a Pro Trader, your allocation includes tactical F&O derivatives and aggressive growth equities. Derivative leverage increases your potential upside but introduces a significant leverage penalty in your Risk Score.'
  }
};

export default function RiskPage() {
  // Trader Level state synchronized with onboarding & dashboard
  const [userLevel, setUserLevel] = useState<string>('Beginner');
  const [portfolioValue, setPortfolioValue] = useState<number>(500000);

  // Current baseline portfolio weights
  const [initialWeights, setInitialWeights] = useState<Record<string, number>>(TIER_BASELINE_DATA['Beginner'].weights);

  // Live active target weights selected by user choices
  const [targetWeights, setTargetWeights] = useState<Record<string, number>>(TIER_BASELINE_DATA['Beginner'].weights);

  const [activeStrategyPreset, setActiveStrategyPreset] = useState<string>('current');
  const [activeMetricExplain, setActiveMetricExplain] = useState<string | null>(null);
  const [basketModalOpen, setBasketModalOpen] = useState<boolean>(false);

  // Macro Stress Testing Simulation State
  const [activeStressScenario, setActiveStressScenario] = useState<StressScenario | null>(null);

  // AI Risk Copilot State
  const [aiPrompt, setAiPrompt] = useState<string>('');
  const [aiLoading, setAiLoading] = useState<boolean>(false);
  const [aiResponse, setAiResponse] = useState<string | null>(null);
  const [copiedAi, setCopiedAi] = useState<boolean>(false);

  // Sync with localStorage on client mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedLevel = localStorage.getItem('unify_trader_level');
      if (savedLevel && TIER_BASELINE_DATA[savedLevel]) {
        setUserLevel(savedLevel);
        const baseline = TIER_BASELINE_DATA[savedLevel];
        setPortfolioValue(baseline.defaultBase);
        setInitialWeights(baseline.weights);
        setTargetWeights(baseline.weights);
      }
    }
  }, []);

  // Switch Trader Tier Level
  const handleSwitchTier = (tier: string) => {
    if (!TIER_BASELINE_DATA[tier]) return;
    setUserLevel(tier);
    const baseline = TIER_BASELINE_DATA[tier];
    setPortfolioValue(baseline.defaultBase);
    setInitialWeights(baseline.weights);
    setTargetWeights(baseline.weights);
    setActiveStrategyPreset('current');
    setActiveStressScenario(null);

    if (typeof window !== 'undefined') {
      localStorage.setItem('unify_trader_level', tier);
      const meta = TIER_DETAILS[tier];
      if (meta) {
        localStorage.setItem('unify_trader_title', meta.title);
        localStorage.setItem('unify_trader_desc', meta.desc);
      }
    }
  };

  // Calculate current baseline risk profile
  const currentProfile = useMemo(() => {
    return calculateMultiAssetRiskProfile(initialWeights, portfolioValue);
  }, [initialWeights, portfolioValue]);

  // Calculate target/rebalanced risk profile dynamically
  const targetProfile = useMemo(() => {
    return calculateMultiAssetRiskProfile(targetWeights, portfolioValue);
  }, [targetWeights, portfolioValue]);

  // Handle Strategy Preset Selection
  const applyPreset = (presetKey: string) => {
    setActiveStrategyPreset(presetKey);
    if (presetKey === 'current') {
      setTargetWeights({ ...initialWeights });
    } else if (presetKey === 'neutralizer') {
      setTargetWeights({ stocks: 20, mutualFunds: 40, etfs: 20, bonds: 10, reits: 10, invits: 0, fno: 0 });
    } else if (presetKey === 'preservation') {
      setTargetWeights({ stocks: 10, mutualFunds: 20, etfs: 10, bonds: 35, reits: 15, invits: 10, fno: 0 });
    } else if (presetKey === 'balanced7') {
      setTargetWeights({ stocks: 30, mutualFunds: 25, etfs: 15, bonds: 15, reits: 10, invits: 5, fno: 0 });
    }
  };

  // Custom Weight Adjuster
  const handleCustomWeightChange = (key: string, val: number) => {
    setActiveStrategyPreset('custom');
    setTargetWeights(prev => ({
      ...prev,
      [key]: Math.max(0, Math.min(100, val))
    }));
  };

  // Deltas between Current (Before) and Target (After)
  const scoreDelta = targetProfile.score - currentProfile.score;
  const volDelta = (targetProfile.annualVolatility - currentProfile.annualVolatility) * 100;
  const mddDelta = (targetProfile.maxDrawdown - currentProfile.maxDrawdown) * 100;
  const varDelta = targetProfile.var1m - currentProfile.var1m;
  const sharpeDelta = targetProfile.sharpeRatio - currentProfile.sharpeRatio;

  // Active stress test calculation
  const stressResults = useMemo(() => {
    if (!activeStressScenario) return null;

    const rawSum = Object.values(initialWeights).reduce((a, b) => a + b, 0) || 100;
    let portfolioReturnShock = 0;

    Object.entries(initialWeights).forEach(([key, weight]) => {
      const shock = activeStressScenario.shocks[key] || -0.05;
      const normalizedWeight = weight / rawSum;
      portfolioReturnShock += normalizedWeight * shock;
    });

    const rupeeLoss = Math.round(portfolioValue * portfolioReturnShock);
    const postShockValue = Math.max(0, portfolioValue + rupeeLoss);
    const postShockVaR = Math.round(currentProfile.var1m * activeStressScenario.varMultiplier);
    const postShockVol = (currentProfile.annualVolatility * activeStressScenario.volMultiplier) * 100;

    return {
      returnShockPct: portfolioReturnShock * 100,
      rupeeLoss,
      postShockValue,
      postShockVaR,
      postShockVol
    };
  }, [activeStressScenario, initialWeights, portfolioValue, currentProfile]);

  // Execute AI Copilot Query
  const handleAskAi = async (customPrompt?: string) => {
    const queryText = customPrompt || aiPrompt;
    if (!queryText.trim() || aiLoading) return;

    setAiLoading(true);
    setAiResponse(null);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: [{ role: 'user', text: queryText }],
          context: {
            tier: userLevel,
            portfolioValue,
            riskScore: currentProfile.score,
            var1m: Math.round(currentProfile.var1m),
            weights: initialWeights
          }
        })
      });

      if (res.ok) {
        const data = await res.json();
        setAiResponse(data.reply || 'Analysis completed.');
      } else {
        setAiResponse('Unable to fetch live model response. Please check network connectivity.');
      }
    } catch {
      setAiResponse('Network error connecting to Unify AI Risk Advisor. Please try again.');
    } finally {
      setAiLoading(false);
    }
  };

  const handleCopyAi = () => {
    if (!aiResponse) return;
    navigator.clipboard.writeText(aiResponse);
    setCopiedAi(true);
    setTimeout(() => setCopiedAi(false), 2000);
  };

  // Metric Explanations Dictionary
  const METRIC_EXPLANATIONS: Record<string, { title: string; desc: string; formula: string; impact: string }> = {
    'score': {
      title: 'Overall Risk Score (0–100)',
      desc: 'Composite risk index calculated from 40% Annual Volatility, 30% Herfindahl Concentration (HHI), 30% Max Drawdown, plus derivative leverage penalties.',
      formula: 'Risk Score = 0.40(Vol) + 0.30(HHI) + 0.30(MDD) + Leverage Penalty',
      impact: 'Scores <35 represent Low Conservative Risk; 35-65 represents Balanced Risk; >65 represents High Aggressive Exposure.'
    },
    'volatility': {
      title: 'Annualized Volatility (σ)',
      desc: 'Standard deviation of return fluctuations calculated over a 252-day trading year. High volatility indicates wide swing ranges.',
      formula: 'σ = √(w^T × Σ × w)',
      impact: 'Lower volatility protects capital during sudden market downturns.'
    },
    'drawdown': {
      title: 'Maximum Historical Drawdown (MDD)',
      desc: 'The worst peak-to-trough crash decline percentage your portfolio allocation experiences during market sell-offs.',
      formula: 'MDD = ∑ (w_i × MDD_i)',
      impact: 'Adding non-correlated assets like Bonds & REITs dampens max drawdown significantly.'
    },
    'var': {
      title: '95% 1-Month Value-at-Risk (VaR)',
      desc: 'Statistical maximum rupees your portfolio could lose over a 30-day period at a 95% confidence level.',
      formula: 'VaR_95% = Portfolio Value × 1.645 × (σ_annual / √12)',
      impact: 'Directly quantifies worst-case monthly rupees at risk.'
    },
    'hhi': {
      title: 'Herfindahl Concentration Index (HHI)',
      desc: 'Measures asset class over-concentration. High HHI indicates single-asset failure risk, while lower HHI indicates healthy multi-asset diversification.',
      formula: 'HHI = ∑ (w_i × 100)^2',
      impact: 'Diversifying across 7 asset classes drives HHI into the safe zone (<2,000).'
    },
    'sharpe': {
      title: 'Risk-Adjusted Sharpe Ratio',
      desc: 'Measures excess return generated per unit of portfolio volatility above the 6.5% risk-free Indian Treasury rate.',
      formula: 'Sharpe = (Expected Return - 6.5%) / Annual Volatility',
      impact: 'Sharpe ratio >1.2 indicates highly efficient return per unit of risk.'
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-24 relative z-10">
      
      {/* PAGE HEADER & TRADER TIER SELECTOR */}
      <div className="flex flex-col gap-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-2xl bg-accent-bg text-accent flex items-center justify-center border border-accent/20 shadow-sm">
                <ShieldAlert size={22} />
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-text-primary tracking-tight">
                Portfolio Risk Diagnostic & Advisory
              </h1>
            </div>
            <p className="text-text-secondary text-sm sm:text-base max-w-2xl font-medium">
              Institutional quantitative engine grounded in <strong>7-Domain Covariance Correlation Matrices</strong>, live stress-testing scenarios, and generative LLM advisory.
            </p>
          </div>

          {/* Portfolio Value Selector */}
          <div className="card p-3 bg-surface border border-border flex items-center gap-3 self-stretch md:self-auto rounded-2xl shadow-sm">
            <span className="text-xs font-bold text-text-muted uppercase">Portfolio Base:</span>
            <select 
              value={portfolioValue} 
              onChange={e => setPortfolioValue(Number(e.target.value))}
              className="bg-bg border border-border rounded-xl px-3 py-1.5 text-xs font-extrabold text-text-primary focus:outline-none focus:border-accent cursor-pointer"
            >
              <option value={250000}>₹2,50,000 (Fresher Base)</option>
              <option value={500000}>₹5,00,000 (Beginner Base)</option>
              <option value={1000000}>₹10,00,000 (Intermediate Base)</option>
              <option value={2500000}>₹25,00,000 (Advanced Base)</option>
              <option value={5000000}>₹50,00,000 (Pro Base)</option>
            </select>
          </div>
        </div>

        {/* Dynamic Trader Tier Selector Bar */}
        <div className="card p-4 bg-surface border border-border rounded-2xl flex flex-col md:flex-row justify-between items-start md:items-center gap-3 shadow-sm">
          <div className="flex items-center gap-2">
            <Activity size={16} className="text-accent" />
            <span className="text-xs font-extrabold text-text-primary">Active Classified Trader Level:</span>
            <span className={`px-2.5 py-0.5 rounded-full text-xs font-black border ${
              userLevel === 'Fresher' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' :
              userLevel === 'Beginner' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30' :
              userLevel === 'Intermediate' ? 'bg-amber-500/10 text-amber-400 border-amber-500/30' :
              userLevel === 'Advanced' ? 'bg-purple-500/10 text-purple-400 border-purple-500/30' :
              'bg-rose-500/10 text-rose-400 border-rose-500/30'
            }`}>
              {userLevel}
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto max-w-full pb-1 md:pb-0">
            {(['Fresher', 'Beginner', 'Intermediate', 'Advanced', 'Pro'] as const).map(tier => (
              <button
                key={tier}
                onClick={() => handleSwitchTier(tier)}
                className={`px-3 py-1 rounded-xl text-xs font-extrabold transition-all cursor-pointer shrink-0 ${
                  userLevel === tier 
                    ? 'bg-accent text-white shadow-sm' 
                    : 'bg-bg text-text-muted hover:text-text-primary hover:bg-border/40 border border-border'
                }`}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 1: CURRENT RISK DIAGNOSTIC REPORT */}
      <div className="card p-6 md:p-8 bg-surface border border-border rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
        
        {/* Header Badge */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-border">
          <div className="flex items-center gap-3.5">
            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-md ${
              currentProfile.category === 'High' ? 'bg-loss' : currentProfile.category === 'Moderate' ? 'bg-amber-500' : 'bg-gain'
            }`}>
              {currentProfile.score}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  currentProfile.category === 'High' ? 'bg-loss-bg text-loss border border-loss/30' :
                  currentProfile.category === 'Moderate' ? 'bg-amber-500/10 text-amber-500 border border-amber-500/30' :
                  'bg-gain-bg text-gain border border-gain/30'
                }`}>
                  Current Risk Level: {currentProfile.category} Risk
                </span>
                <span className="text-xs text-text-muted font-extrabold">Score: {currentProfile.score} / 100</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-text-primary mt-1">
                Risk Diagnostic Report ({userLevel} Portfolio)
              </h2>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-bg border border-border text-xs font-bold text-text-secondary flex items-center gap-2 shadow-inner">
            <BarChart3 size={16} className="text-accent" />
            <span>XGBoost Classifier & 7x7 Markowitz Covariance Matrix</span>
          </div>
        </div>

        {/* Dynamic Diagnostic Narrative */}
        <div className="p-5 rounded-2xl bg-bg border border-border space-y-2">
          <h3 className="font-extrabold text-sm text-text-primary flex items-center gap-2">
            <Info size={16} className="text-accent" /> Model Diagnosis & Risk Origin Breakdown:
          </h3>
          <p className="text-xs sm:text-sm text-text-secondary leading-relaxed font-medium">
            {TIER_BASELINE_DATA[userLevel]?.narrative || ''} Under 252-day market stress simulations on your <strong>₹{portfolioValue.toLocaleString('en-IN')}</strong> portfolio, 
            your current asset mix results in an annualized volatility of <strong>{(currentProfile.annualVolatility * 100).toFixed(1)}%</strong>, 
            a maximum drawdown exposure of <strong>-{(currentProfile.maxDrawdown * 100).toFixed(1)}%</strong>, 
            and a 95% 1-Month Value-at-Risk (VaR) of <strong>₹{Math.round(currentProfile.var1m).toLocaleString('en-IN')}</strong>.
          </p>
        </div>

        {/* 6 Key Diagnostic Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Risk Score */}
          <div className="p-4 rounded-2xl bg-bg border border-border space-y-1.5 hover:border-accent/40 transition-colors">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase text-text-muted">Overall Risk Score</span>
              <button onClick={() => setActiveMetricExplain('score')} className="text-text-muted hover:text-accent cursor-pointer">
                <HelpCircle size={14} />
              </button>
            </div>
            <p className="text-2xl font-black text-text-primary">{currentProfile.score} <span className="text-xs font-bold text-text-muted">/ 100</span></p>
            <p className="text-[10px] text-text-muted font-medium">40% Vol + 30% HHI + 30% MDD</p>
          </div>

          {/* Volatility */}
          <div className="p-4 rounded-2xl bg-bg border border-border space-y-1.5 hover:border-accent/40 transition-colors">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase text-text-muted">Annual Volatility (σ)</span>
              <button onClick={() => setActiveMetricExplain('volatility')} className="text-text-muted hover:text-accent cursor-pointer">
                <HelpCircle size={14} />
              </button>
            </div>
            <p className="text-2xl font-black text-text-primary">{(currentProfile.annualVolatility * 100).toFixed(1)}%</p>
            <p className="text-[10px] text-text-muted font-medium">252-day historical standard deviation</p>
          </div>

          {/* 1-Month VaR */}
          <div className="p-4 rounded-2xl bg-bg border border-border space-y-1.5 hover:border-accent/40 transition-colors">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase text-text-muted">95% 1-Month VaR</span>
              <button onClick={() => setActiveMetricExplain('var')} className="text-text-muted hover:text-accent cursor-pointer">
                <HelpCircle size={14} />
              </button>
            </div>
            <p className="text-2xl font-black text-loss">₹{Math.round(currentProfile.var1m).toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-text-muted font-medium">Max 30-day statistical loss (95% conf.)</p>
          </div>

          {/* Max Drawdown */}
          <div className="p-4 rounded-2xl bg-bg border border-border space-y-1.5 hover:border-accent/40 transition-colors">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase text-text-muted">Max Drawdown</span>
              <button onClick={() => setActiveMetricExplain('drawdown')} className="text-text-muted hover:text-accent cursor-pointer">
                <HelpCircle size={14} />
              </button>
            </div>
            <p className="text-2xl font-black text-text-primary">-{(currentProfile.maxDrawdown * 100).toFixed(1)}%</p>
            <p className="text-[10px] text-text-muted font-medium">Historical crash decline exposure</p>
          </div>

          {/* Concentration Index */}
          <div className="p-4 rounded-2xl bg-bg border border-border space-y-1.5 hover:border-accent/40 transition-colors">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase text-text-muted">Concentration (HHI)</span>
              <button onClick={() => setActiveMetricExplain('hhi')} className="text-text-muted hover:text-accent cursor-pointer">
                <HelpCircle size={14} />
              </button>
            </div>
            <p className="text-2xl font-black text-text-primary">{Math.round(currentProfile.hhi)} <span className="text-xs font-bold text-text-muted">/ 10,000</span></p>
            <p className="text-[10px] text-text-muted font-medium">Herfindahl asset concentration index</p>
          </div>

          {/* Sharpe Ratio */}
          <div className="p-4 rounded-2xl bg-bg border border-border space-y-1.5 hover:border-accent/40 transition-colors">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase text-text-muted">Sharpe Efficiency</span>
              <button onClick={() => setActiveMetricExplain('sharpe')} className="text-text-muted hover:text-accent cursor-pointer">
                <HelpCircle size={14} />
              </button>
            </div>
            <p className="text-2xl font-black text-gain">{currentProfile.sharpeRatio.toFixed(2)}</p>
            <p className="text-[10px] text-text-muted font-medium">Return per unit risk over 6.5% G-Sec Rf</p>
          </div>

        </div>
      </div>

      {/* SECTION 2: LIVE LLM AI RISK COPILOT & DIAGNOSTIC ORACLE */}
      <div className="card p-6 md:p-8 bg-surface border border-border rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent-bg text-accent flex items-center justify-center border border-accent/20">
              <Bot size={22} />
            </div>
            <div>
              <h2 className="text-xl sm:text-2xl font-black text-text-primary flex items-center gap-2">
                Unify AI Risk Copilot
                <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-accent/10 text-accent border border-accent/20">
                  Live Model
                </span>
              </h2>
              <p className="text-xs text-text-secondary mt-0.5 font-medium">
                Ask the quantitative LLM to stress-test your portfolio, explain formulas, or generate bespoke hedging baskets.
              </p>
            </div>
          </div>
        </div>

        {/* Quick Query Prompt Chips */}
        <div className="space-y-2">
          <span className="text-[11px] font-bold uppercase text-text-muted block">Instant Scenario Inquiries:</span>
          <div className="flex flex-wrap gap-2">
            {[
              { label: '🏛️ RBI 50 bps Repo Rate Hike Shock', q: 'Simulate an RBI 50 bps repo rate hike shock on my portfolio' },
              { label: '📉 15% NIFTY Tech Correction', q: 'What happens in a 15% NIFTY tech sell-off crash to my holdings?' },
              { label: '🛢️ Crude Oil Surge to $95/bbl', q: 'How does a crude oil surge to $95/bbl and inflation shock impact my portfolio?' },
              { label: '🛡️ Formulate Institutional Hedge Basket', q: 'Generate an institutional hedging basket for my portfolio tier' },
              { label: '📊 Explain My 95% 1-Month VaR', q: 'Explain my 95% 1-Month Value-at-Risk in plain English' },
            ].map((chip, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setAiPrompt(chip.q);
                  handleAskAi(chip.q);
                }}
                className="px-3 py-1.5 rounded-xl bg-bg hover:bg-border/40 border border-border text-xs font-semibold text-text-secondary hover:text-text-primary transition-all cursor-pointer text-left"
              >
                {chip.label}
              </button>
            ))}
          </div>
        </div>

        {/* Interactive Query Input */}
        <div className="flex gap-2">
          <input
            type="text"
            value={aiPrompt}
            onChange={e => setAiPrompt(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleAskAi();
            }}
            placeholder={`Ask AI Advisor about your ₹${portfolioValue.toLocaleString('en-IN')} ${userLevel} portfolio risk...`}
            className="flex-1 bg-bg border border-border rounded-2xl px-4 py-3 text-xs sm:text-sm text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent"
          />
          <button
            onClick={() => handleAskAi()}
            disabled={aiLoading || !aiPrompt.trim()}
            className="px-5 py-3 rounded-2xl bg-accent text-white text-xs sm:text-sm font-extrabold flex items-center gap-2 hover:bg-accent/90 disabled:opacity-50 transition-all cursor-pointer shrink-0"
          >
            {aiLoading ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
            <span>Analyze</span>
          </button>
        </div>

        {/* AI Output Card */}
        <AnimatePresence>
          {aiResponse && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="p-5 rounded-2xl bg-bg border border-border space-y-3 relative shadow-inner"
            >
              <div className="flex justify-between items-center pb-2 border-b border-border">
                <span className="text-xs font-black text-accent flex items-center gap-2">
                  <Sparkles size={16} /> AI Quantitative Risk Advisory Response
                </span>
                <button
                  onClick={handleCopyAi}
                  className="text-xs font-bold text-text-muted hover:text-text-primary flex items-center gap-1 cursor-pointer"
                >
                  {copiedAi ? <Check size={14} className="text-gain" /> : <Copy size={14} />}
                  <span>{copiedAi ? 'Copied' : 'Copy'}</span>
                </button>
              </div>

              <div className="text-xs sm:text-sm text-text-secondary leading-relaxed font-medium space-y-2 whitespace-pre-line">
                {aiResponse}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECTION 3: MACROECONOMIC STRESS-TESTING LAB */}
      <div className="card p-6 md:p-8 bg-surface border border-border rounded-3xl space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-3 pb-4 border-b border-border">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-text-primary flex items-center gap-2.5">
              <Activity className="text-accent" size={24} /> Macroeconomic Stress-Testing Lab
            </h2>
            <p className="text-xs text-text-secondary mt-1 font-medium">
              Simulate historical liquidity shocks, monetary policy hikes, and geopolitical commodity crises against your live portfolio allocation.
            </p>
          </div>
          {activeStressScenario && (
            <button
              onClick={() => setActiveStressScenario(null)}
              className="px-3 py-1.5 rounded-xl bg-bg border border-border text-xs font-bold text-text-muted hover:text-text-primary flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
            >
              <RefreshCw size={14} /> Reset Simulation
            </button>
          )}
        </div>

        {/* 4 Interactive Stress Scenario Selector Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {STRESS_SCENARIOS.map(scenario => {
            const isSelected = activeStressScenario?.id === scenario.id;
            return (
              <button
                key={scenario.id}
                onClick={() => setActiveStressScenario(scenario)}
                className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-accent/10 border-accent text-text-primary ring-2 ring-accent/30' 
                    : 'bg-bg border-border text-text-secondary hover:border-text-muted'
                }`}
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-2xl">{scenario.icon}</span>
                  {isSelected && <CheckCircle2 size={16} className="text-accent" />}
                </div>
                <h4 className="text-xs font-black text-text-primary mb-0.5">{scenario.title}</h4>
                <p className="text-[10px] text-accent font-extrabold uppercase mb-2">{scenario.tagline}</p>
                <p className="text-[11px] text-text-muted line-clamp-2 leading-relaxed">{scenario.description}</p>
              </button>
            );
          })}
        </div>

        {/* Active Stress Simulation Telemetry Box */}
        <AnimatePresence>
          {activeStressScenario && stressResults && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="p-5 md:p-6 rounded-2xl bg-bg border border-border space-y-5"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3 pb-3 border-b border-border">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xl">{activeStressScenario.icon}</span>
                    <h3 className="font-black text-base text-text-primary">
                      Stress Simulation Consequence: {activeStressScenario.title}
                    </h3>
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5">{activeStressScenario.description}</p>
                </div>

                <button
                  onClick={() => {
                    setTargetWeights(activeStressScenario.defensiveWeights);
                    setActiveStrategyPreset('custom');
                    setBasketModalOpen(true);
                  }}
                  className="px-4 py-2 rounded-xl bg-accent text-white text-xs font-extrabold flex items-center gap-1.5 shadow-sm hover:bg-accent/90 transition-all cursor-pointer shrink-0"
                >
                  <Zap size={14} /> Deploy Institutional Defense Basket
                </button>
              </div>

              {/* Stress Telemetry Indicators */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-3.5 rounded-xl bg-surface border border-border">
                  <span className="text-[10px] font-bold uppercase text-text-muted block">Estimated P&L Shock</span>
                  <p className={`text-lg font-black mt-1 ${stressResults.rupeeLoss < 0 ? 'text-loss' : 'text-gain'}`}>
                    {stressResults.rupeeLoss < 0 ? `-₹${Math.abs(stressResults.rupeeLoss).toLocaleString('en-IN')}` : `+₹${stressResults.rupeeLoss.toLocaleString('en-IN')}`}
                  </p>
                  <span className="text-[10px] font-bold text-text-muted">({stressResults.returnShockPct.toFixed(1)}% shift)</span>
                </div>

                <div className="p-3.5 rounded-xl bg-surface border border-border">
                  <span className="text-[10px] font-bold uppercase text-text-muted block">Post-Shock Valuation</span>
                  <p className="text-lg font-black text-text-primary mt-1">
                    ₹{stressResults.postShockValue.toLocaleString('en-IN')}
                  </p>
                  <span className="text-[10px] font-bold text-text-muted">From ₹{portfolioValue.toLocaleString('en-IN')}</span>
                </div>

                <div className="p-3.5 rounded-xl bg-surface border border-border">
                  <span className="text-[10px] font-bold uppercase text-text-muted block">Stress 1-Month VaR</span>
                  <p className="text-lg font-black text-loss mt-1">
                    ₹{stressResults.postShockVaR.toLocaleString('en-IN')}
                  </p>
                  <span className="text-[10px] font-bold text-text-muted">+{Math.round((activeStressScenario.varMultiplier - 1) * 100)}% tail risk</span>
                </div>

                <div className="p-3.5 rounded-xl bg-surface border border-border">
                  <span className="text-[10px] font-bold uppercase text-text-muted block">Stress Volatility (σ)</span>
                  <p className="text-lg font-black text-text-primary mt-1">
                    {stressResults.postShockVol.toFixed(1)}%
                  </p>
                  <span className="text-[10px] font-bold text-text-muted">From {(currentProfile.annualVolatility * 100).toFixed(1)}%</span>
                </div>
              </div>

              {/* Stress Defense Guidance */}
              <div className="p-3.5 rounded-xl bg-accent-bg border border-accent/20 text-accent text-xs font-medium flex items-center gap-2">
                <ShieldCheck size={18} className="shrink-0" />
                <span><strong>Model Defensive Assessment:</strong> {activeStressScenario.mitigationTip}</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* SECTION 4: PERSONALIZED ACTIONABLE RISK REDUCTION SUGGESTIONS */}
      <div className="card p-6 md:p-8 bg-surface border border-border rounded-3xl space-y-6 shadow-xl">
        <div className="flex items-center gap-2.5 pb-4 border-b border-border">
          <Sparkles className="text-accent" size={24} />
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-text-primary">Actionable Risk Reduction Plan</h2>
            <p className="text-xs text-text-secondary mt-0.5 font-medium">
              1-click rebalance execution and regulatory reference masterclasses to protect your principal.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Suggestion 1 */}
          <div className="p-5 rounded-2xl bg-bg border border-border space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-500 font-extrabold text-xs">
                <ShieldCheck size={18} />
                <span>Recommendation 1: Neutralize Equity Volatility</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Reallocate <strong>15% from single high-beta stocks into Flexi-Cap Mutual Funds & Index ETFs</strong>. Flexi-cap funds pool holdings across 50+ bluechip companies, cutting individual scrip drawdown risk while capturing compound index returns.
              </p>
              <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] font-bold text-amber-400">
                🎯 Result: Lowers portfolio volatility by ~8.5% while preserving compound CAGR.
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <button
                onClick={() => applyPreset('neutralizer')}
                className="px-3 py-1.5 rounded-xl bg-accent text-white text-xs font-extrabold hover:bg-accent/90 transition-all cursor-pointer"
              >
                Apply Volatility Neutralizer
              </button>
              <Link
                href="/learn/mutual-funds"
                className="px-3 py-1.5 rounded-xl bg-bg border border-border text-xs font-bold text-text-secondary hover:text-text-primary flex items-center gap-1"
              >
                <span>MF Masterclass</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* Suggestion 2 */}
          <div className="p-5 rounded-2xl bg-bg border border-border space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gain font-extrabold text-xs">
                <Zap size={18} />
                <span>Recommendation 2: Fixed Income & Yield Cushion</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Allocate <strong>20% to Sovereign Bonds (GS 2033) & Commercial REITs (Embassy)</strong>. Non-correlated bond yields (-0.15 correlation with direct equities) act as an institutional shock absorber during market pullbacks.
              </p>
              <div className="p-2.5 rounded-xl bg-gain-bg border border-gain/20 text-[11px] font-bold text-gain">
                🎯 Result: Locks in 7.5%–9.5% annual quarterly dividend cash yield (~₹{Math.round(portfolioValue * 0.08).toLocaleString('en-IN')}/yr).
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <button
                onClick={() => applyPreset('preservation')}
                className="px-3 py-1.5 rounded-xl bg-gain text-white text-xs font-extrabold hover:bg-gain/90 transition-all cursor-pointer"
              >
                Apply Fixed Income Shield
              </button>
              <Link
                href="/learn/reits"
                className="px-3 py-1.5 rounded-xl bg-bg border border-border text-xs font-bold text-text-secondary hover:text-text-primary flex items-center gap-1"
              >
                <span>REITs Masterclass</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* Suggestion 3 */}
          <div className="p-5 rounded-2xl bg-bg border border-border space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-loss font-extrabold text-xs">
                <AlertTriangle size={18} />
                <span>Recommendation 3: Eliminate Derivative Leverage Penalty</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Zero-out unhedged <strong>Futures & Options (F&O) derivative positions</strong>. Official SEBI market research shows that <strong>9 out of 10 retail traders incur net financial losses in F&O</strong>, adding a 3.5x leverage drawdown penalty to your Risk Score.
              </p>
              <div className="p-2.5 rounded-xl bg-loss-bg border border-loss/20 text-[11px] font-bold text-loss">
                🎯 Result: Instantly cuts Risk Score by 15 points and prevents leverage margin calls.
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <button
                onClick={() => handleCustomWeightChange('fno', 0)}
                className="px-3 py-1.5 rounded-xl bg-loss text-white text-xs font-extrabold hover:bg-loss/90 transition-all cursor-pointer"
              >
                Zero-Out F&O Leverage
              </button>
              <Link
                href="/learn/futures-options"
                className="px-3 py-1.5 rounded-xl bg-bg border border-border text-xs font-bold text-text-secondary hover:text-text-primary flex items-center gap-1"
              >
                <span>SEBI F&O Study</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>

          {/* Suggestion 4 */}
          <div className="p-5 rounded-2xl bg-bg border border-border space-y-4 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent font-extrabold text-xs">
                <Layers size={18} />
                <span>Recommendation 4: Consolidate Multi-Broker Overlaps</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Consolidate duplicate stocks (e.g. RELIANCE held across Zerodha & Groww) under a single DP depository participant account to eliminate recurring depository fee leaks.
              </p>
              <div className="p-2.5 rounded-xl bg-accent-bg border border-accent/20 text-[11px] font-bold text-accent">
                🎯 Result: Eliminates ₹420/year per duplicate scrip overlap automatically.
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 border-t border-border">
              <Link
                href="/accounts"
                className="px-3 py-1.5 rounded-xl bg-accent text-white text-xs font-extrabold hover:bg-accent/90 transition-all cursor-pointer flex items-center gap-1"
              >
                <span>Audit Multi-Broker Accounts</span>
                <ChevronRight size={14} />
              </Link>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 5: INTERACTIVE STRATEGY REBALANCER & PERSONAL CHOICE CARDS */}
      <div className="card p-6 md:p-8 bg-surface border border-border rounded-3xl space-y-8 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-border">
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-text-primary flex items-center gap-2.5">
              <Sliders className="text-accent" size={24} /> Interactive Strategy Action Blueprint
            </h2>
            <p className="text-xs text-text-secondary mt-1 font-medium">
              Select an institutional strategy preset below or customize asset weights to see before-and-after risk consequences.
            </p>
          </div>

          <button 
            onClick={() => setBasketModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-accent text-white text-xs font-extrabold flex items-center gap-2 shadow-md hover:bg-accent/90 transition-all cursor-pointer shrink-0"
          >
            <Zap size={16} />
            <span>Generate Rebalance Basket Order</span>
          </button>
        </div>

        {/* 4 Strategy Preset Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          {/* Preset Current */}
          <button 
            onClick={() => applyPreset('current')}
            className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
              activeStrategyPreset === 'current' 
                ? 'bg-accent/10 border-accent text-text-primary ring-2 ring-accent/30' 
                : 'bg-bg border-border text-text-secondary hover:border-text-muted'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-black uppercase">Current Profile</span>
              {activeStrategyPreset === 'current' && <CheckCircle2 size={16} className="text-accent" />}
            </div>
            <p className="text-xs font-bold text-text-primary mb-1">{userLevel} Baseline</p>
            <p className="text-[10px] text-text-muted">
              {Object.entries(initialWeights).filter(([,w]) => w > 0).map(([k, w]) => `${w}% ${k}`).join(', ')}
            </p>
          </button>

          {/* Preset Volatility Neutralizer */}
          <button 
            onClick={() => applyPreset('neutralizer')}
            className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
              activeStrategyPreset === 'neutralizer' 
                ? 'bg-accent/10 border-accent text-text-primary ring-2 ring-accent/30' 
                : 'bg-bg border-border text-text-secondary hover:border-text-muted'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-black uppercase text-amber-500">🛡️ Volatility Neutralizer</span>
              {activeStrategyPreset === 'neutralizer' && <CheckCircle2 size={16} className="text-accent" />}
            </div>
            <p className="text-xs font-bold text-text-primary mb-1">Mutual Fund Heavy</p>
            <p className="text-[10px] text-text-muted">40% MFs, 20% ETFs, 20% Stocks, 10% Bonds, 10% REITs</p>
          </button>

          {/* Preset Preservation */}
          <button 
            onClick={() => applyPreset('preservation')}
            className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
              activeStrategyPreset === 'preservation' 
                ? 'bg-accent/10 border-accent text-text-primary ring-2 ring-accent/30' 
                : 'bg-bg border-border text-text-secondary hover:border-text-muted'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-black uppercase text-gain">🏛️ Fixed Income Shield</span>
              {activeStrategyPreset === 'preservation' && <CheckCircle2 size={16} className="text-accent" />}
            </div>
            <p className="text-xs font-bold text-text-primary mb-1">Capital Protection</p>
            <p className="text-[10px] text-text-muted">35% Bonds, 15% REITs, 10% InvITs, 20% MFs, 10% Stocks</p>
          </button>

          {/* Preset Balanced 7 */}
          <button 
            onClick={() => applyPreset('balanced7')}
            className={`p-4 rounded-2xl text-left border transition-all cursor-pointer ${
              activeStrategyPreset === 'balanced7' 
                ? 'bg-accent/10 border-accent text-text-primary ring-2 ring-accent/30' 
                : 'bg-bg border-border text-text-secondary hover:border-text-muted'
            }`}
          >
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-black uppercase text-accent">⚖️ 7-Domain Master</span>
              {activeStrategyPreset === 'balanced7' && <CheckCircle2 size={16} className="text-accent" />}
            </div>
            <p className="text-xs font-bold text-text-primary mb-1">Optimal Diversification</p>
            <p className="text-[10px] text-text-muted">30% Stocks, 25% MFs, 15% ETFs, 15% Bonds, 10% REITs, 5% InvITs</p>
          </button>

        </div>

        {/* Structured Percentage Custom Control */}
        <div className="space-y-4 pt-4 border-t border-border">
          <div className="flex justify-between items-center">
            <h3 className="font-extrabold text-sm text-text-primary flex items-center gap-2">
              <PieChart size={16} className="text-accent" /> Fine-Tune Personal Allocation Percentages (%):
            </h3>
            <span className="text-xs font-mono font-bold text-text-muted">
              Total Weight: <span className={Object.values(targetWeights).reduce((a,b)=>a+b,0) === 100 ? 'text-gain font-black' : 'text-loss font-black'}>
                {Object.values(targetWeights).reduce((a,b)=>a+b,0)}%
              </span>
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            {ASSET_DOMAINS.map(domain => (
              <div key={domain.key} className="p-3 rounded-2xl bg-bg border border-border flex justify-between items-center hover:border-accent/40 transition-colors">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: domain.color }}></span>
                  <span className="text-xs font-bold text-text-primary">{domain.label.split(' ')[0]}</span>
                </div>
                <div className="flex items-center gap-1">
                  <input 
                    type="number" 
                    min="0" 
                    max="100" 
                    value={targetWeights[domain.key] || 0}
                    onChange={e => handleCustomWeightChange(domain.key, Number(e.target.value))}
                    className="w-14 bg-surface border border-border rounded-lg px-2 py-1 text-xs font-mono font-black text-right text-text-primary focus:outline-none focus:border-accent"
                  />
                  <span className="text-xs font-bold text-text-muted">%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* SECTION 6: FUTURE CONSEQUENCES & IMPACT FORECAST (BEFORE VS AFTER) */}
      <div className="card p-6 md:p-8 bg-surface border border-border rounded-3xl space-y-6 shadow-xl">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-text-primary flex items-center gap-2">
            <TrendingUp className="text-gain" size={22} /> Future Consequences & Impact Forecast
          </h2>
          <p className="text-xs text-text-secondary mt-1 font-medium">
            Side-by-side comparison of your Current Allocation vs Rebalanced Allocation and the long-term risk consequences.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-border text-[10px] font-black uppercase text-text-muted bg-bg/50">
                <th className="p-3.5 rounded-l-xl">Risk & Performance Metric</th>
                <th className="p-3.5">Current State (Before)</th>
                <th className="p-3.5">Target State (After Choice)</th>
                <th className="p-3.5 rounded-r-xl text-right">Future Consequence / Benefit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              
              {/* Row 1: Overall Risk Score */}
              <tr className="hover:bg-bg/40 transition-colors">
                <td className="p-4 font-extrabold text-text-primary flex items-center gap-2">
                  <ShieldAlert size={16} className="text-accent" /> Overall Risk Score (0–100)
                </td>
                <td className="p-4 font-mono font-bold text-text-secondary">{currentProfile.score} / 100 ({currentProfile.category})</td>
                <td className="p-4 font-mono font-black text-text-primary">{targetProfile.score} / 100 ({targetProfile.category})</td>
                <td className="p-4 text-right">
                  <span className={`px-2.5 py-1 rounded-lg font-mono font-extrabold text-xs ${
                    scoreDelta <= 0 ? 'bg-gain-bg text-gain border border-gain/30' : 'bg-loss-bg text-loss border border-loss/30'
                  }`}>
                    {scoreDelta <= 0 ? `↓ Reduced by ${Math.abs(scoreDelta)} pts` : `↑ Increased +${scoreDelta} pts`}
                  </span>
                </td>
              </tr>

              {/* Row 2: Maximum Drawdown */}
              <tr className="hover:bg-bg/40 transition-colors">
                <td className="p-4 font-extrabold text-text-primary flex items-center gap-2">
                  <TrendingDown size={16} className="text-loss" /> 1-Year Max Drawdown (MDD)
                </td>
                <td className="p-4 font-mono font-bold text-text-secondary">-{(currentProfile.maxDrawdown * 100).toFixed(1)}%</td>
                <td className="p-4 font-mono font-black text-text-primary">-{(targetProfile.maxDrawdown * 100).toFixed(1)}%</td>
                <td className="p-4 text-right">
                  <span className={`px-2.5 py-1 rounded-lg font-mono font-extrabold text-xs ${
                    mddDelta <= 0 ? 'bg-gain-bg text-gain border border-gain/30' : 'bg-loss-bg text-loss border border-loss/30'
                  }`}>
                    {mddDelta <= 0 ? `🛡️ ${Math.abs(mddDelta).toFixed(1)}% Crash Protection Cushion` : `⚠️ +${mddDelta.toFixed(1)}% Crash Risk`}
                  </span>
                </td>
              </tr>

              {/* Row 3: 1-Month Value-at-Risk */}
              <tr className="hover:bg-bg/40 transition-colors">
                <td className="p-4 font-extrabold text-text-primary flex items-center gap-2">
                  <AlertTriangle size={16} className="text-amber-500" /> 95% 1-Month Value-at-Risk
                </td>
                <td className="p-4 font-mono font-bold text-text-secondary">₹{Math.round(currentProfile.var1m).toLocaleString('en-IN')}</td>
                <td className="p-4 font-mono font-black text-text-primary">₹{Math.round(targetProfile.var1m).toLocaleString('en-IN')}</td>
                <td className="p-4 text-right">
                  <span className={`px-2.5 py-1 rounded-lg font-mono font-extrabold text-xs ${
                    varDelta <= 0 ? 'bg-gain-bg text-gain border border-gain/30' : 'bg-loss-bg text-loss border border-loss/30'
                  }`}>
                    {varDelta <= 0 ? `💰 ₹${Math.abs(Math.round(varDelta)).toLocaleString('en-IN')} Monthly Loss Saved` : `+₹${Math.round(varDelta).toLocaleString('en-IN')}`}
                  </span>
                </td>
              </tr>

              {/* Row 4: Annual Volatility */}
              <tr className="hover:bg-bg/40 transition-colors">
                <td className="p-4 font-extrabold text-text-primary flex items-center gap-2">
                  <Zap size={16} className="text-accent" /> Annual Volatility (σ)
                </td>
                <td className="p-4 font-mono font-bold text-text-secondary">{(currentProfile.annualVolatility * 100).toFixed(1)}%</td>
                <td className="p-4 font-mono font-black text-text-primary">{(targetProfile.annualVolatility * 100).toFixed(1)}%</td>
                <td className="p-4 text-right">
                  <span className={`px-2.5 py-1 rounded-lg font-mono font-extrabold text-xs ${
                    volDelta <= 0 ? 'bg-gain-bg text-gain border border-gain/30' : 'bg-loss-bg text-loss border border-loss/30'
                  }`}>
                    {volDelta <= 0 ? `↓ ${Math.abs(volDelta).toFixed(1)}% Less Swing Volatility` : `+${volDelta.toFixed(1)}% Volatility`}
                  </span>
                </td>
              </tr>

              {/* Row 5: Sharpe Efficiency */}
              <tr className="hover:bg-bg/40 transition-colors">
                <td className="p-4 font-extrabold text-text-primary flex items-center gap-2">
                  <Sparkles size={16} className="text-gain" /> Sharpe Risk Efficiency Ratio
                </td>
                <td className="p-4 font-mono font-bold text-text-secondary">{currentProfile.sharpeRatio.toFixed(2)}</td>
                <td className="p-4 font-mono font-black text-gain">{targetProfile.sharpeRatio.toFixed(2)}</td>
                <td className="p-4 text-right">
                  <span className={`px-2.5 py-1 rounded-lg font-mono font-extrabold text-xs ${
                    sharpeDelta >= 0 ? 'bg-gain-bg text-gain border border-gain/30' : 'bg-loss-bg text-loss border border-loss/30'
                  }`}>
                    {sharpeDelta >= 0 ? `📈 +${sharpeDelta.toFixed(2)} Better Risk-Adjusted Return` : `${sharpeDelta.toFixed(2)} Efficiency`}
                  </span>
                </td>
              </tr>

            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 7: 7X7 CROSS-ASSET CORRELATION MATRIX (Σ) */}
      <div className="card p-6 md:p-8 bg-surface border border-border rounded-3xl space-y-6 shadow-md">
        <div>
          <h2 className="text-xl sm:text-2xl font-black text-text-primary flex items-center gap-2">
            <Grid className="text-accent" size={20} /> 7x7 Cross-Asset Correlation Matrix (Σ)
          </h2>
          <p className="text-xs text-text-secondary mt-1 font-medium">
            Empirical correlation matrix (ρ_ij) across 7 asset domains. Negative or low correlations (e.g. Stocks vs Bonds = -0.15) create organic downside diversification protection.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center text-xs border-collapse">
            <thead>
              <tr className="border-b border-border text-[10px] font-black uppercase text-text-muted">
                <th className="p-2 text-left">Asset Domain</th>
                {ASSET_DOMAINS.map(d => (
                  <th key={d.key} className="p-2 shrink-0">{d.key.toUpperCase()}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {ASSET_DOMAINS.map((rowDomain, rIdx) => (
                <tr key={rowDomain.key} className="hover:bg-bg/60 transition-colors">
                  <td className="p-3 text-left font-extrabold text-text-primary flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: rowDomain.color }}></span>
                    {rowDomain.label}
                  </td>
                  {ASSET_DOMAINS.map((colDomain, cIdx) => {
                    const corr = CORRELATION_MATRIX_7X7[rIdx][cIdx];
                    return (
                      <td key={colDomain.key} className="p-3 font-mono font-extrabold">
                        <span className={`px-2 py-1 rounded-lg text-[11px] ${
                          corr === 1.0 ? 'bg-bg text-text-muted border border-border' :
                          corr < 0 ? 'bg-gain-bg text-gain font-black border border-gain/30' :
                          corr > 0.7 ? 'bg-loss-bg text-loss font-black border border-loss/20' :
                          'bg-accent-bg text-accent border border-accent/20'
                        }`}>
                          {corr > 0 ? `+${corr.toFixed(2)}` : corr.toFixed(2)}
                        </span>
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SECTION 8: OFFICIAL INSTITUTIONAL RISK RESOURCES (SEBI, RBI, NSE) */}
      <div className="card p-6 md:p-8 bg-surface border border-border rounded-3xl space-y-6 shadow-xl">
        <div className="flex items-center gap-2.5 pb-4 border-b border-border">
          <Award className="text-accent" size={24} />
          <div>
            <h2 className="text-xl sm:text-2xl font-black text-text-primary">Institutional Risk Knowledge Vault</h2>
            <p className="text-xs text-text-secondary mt-0.5 font-medium">
              Statutory guidelines, regulatory risk circulars, and official masterclasses from SEBI, RBI, and NSE.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          
          {/* Resource 1 */}
          <div className="p-5 rounded-2xl bg-bg border border-border space-y-3 flex flex-col justify-between hover:border-accent/40 transition-colors">
            <div className="space-y-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-accent-bg text-accent border border-accent/20">
                Statutory Regulator
              </span>
              <h3 className="font-extrabold text-sm text-text-primary">SEBI Risk-O-Meter Guidelines</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Learn how SEBI evaluates mutual fund scheme portfolio risk across 6 levels (Low to Very High) and monthly portfolio disclosure rules.
              </p>
            </div>
            <Link
              href="/learn/mutual-funds"
              className="text-xs font-bold text-accent hover:underline flex items-center gap-1 pt-2 border-t border-border"
            >
              <span>Explore Scheme Risk Framework</span>
              <ExternalLink size={12} />
            </Link>
          </div>

          {/* Resource 2 */}
          <div className="p-5 rounded-2xl bg-bg border border-border space-y-3 flex flex-col justify-between hover:border-accent/40 transition-colors">
            <div className="space-y-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-amber-500/10 text-amber-500 border border-amber-500/20">
                Central Bank Portal
              </span>
              <h3 className="font-extrabold text-sm text-text-primary">RBI Retail Direct G-Sec Scheme</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                Direct retail access to Government of India Dated Securities (G-Secs), State Development Loans (SDLs), and 91-day Treasury Bills with zero default risk.
              </p>
            </div>
            <Link
              href="/learn/bonds"
              className="text-xs font-bold text-accent hover:underline flex items-center gap-1 pt-2 border-t border-border"
            >
              <span>Sovereign Debt Masterclass</span>
              <ExternalLink size={12} />
            </Link>
          </div>

          {/* Resource 3 */}
          <div className="p-5 rounded-2xl bg-bg border border-border space-y-3 flex flex-col justify-between hover:border-accent/40 transition-colors">
            <div className="space-y-2">
              <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase bg-loss-bg text-loss border border-loss/20">
                Official Exchange
              </span>
              <h3 className="font-extrabold text-sm text-text-primary">NSE Volatility & Circuit Breakers</h3>
              <p className="text-xs text-text-secondary leading-relaxed">
                NSE guide on India VIX volatility index calculation, 10%/15%/20% market-wide index circuit filters, and trading halts.
              </p>
            </div>
            <Link
              href="/learn/stocks"
              className="text-xs font-bold text-accent hover:underline flex items-center gap-1 pt-2 border-t border-border"
            >
              <span>Market Volatility Mechanics</span>
              <ExternalLink size={12} />
            </Link>
          </div>

        </div>
      </div>

      {/* METRIC EXPLANATION MODAL POPUP */}
      <AnimatePresence>
        {activeMetricExplain && METRIC_EXPLANATIONS[activeMetricExplain] && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setActiveMetricExplain(null)}></div>
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="card w-full max-w-md p-6 relative rounded-3xl border border-border bg-surface z-10 space-y-4 shadow-2xl"
            >
              <div className="flex justify-between items-center pb-3 border-b border-border">
                <h3 className="font-extrabold text-base text-text-primary flex items-center gap-2">
                  <Info size={18} className="text-accent" /> {METRIC_EXPLANATIONS[activeMetricExplain].title}
                </h3>
                <button onClick={() => setActiveMetricExplain(null)} className="text-text-muted hover:text-text-primary text-sm font-bold w-7 h-7 rounded-full bg-bg border border-border flex items-center justify-center cursor-pointer">✕</button>
              </div>

              <p className="text-xs text-text-secondary leading-relaxed font-medium">
                {METRIC_EXPLANATIONS[activeMetricExplain].desc}
              </p>

              <div className="p-3 rounded-2xl bg-bg border border-border space-y-1">
                <span className="text-[10px] font-extrabold text-text-muted uppercase tracking-wider block">Mathematical Formula</span>
                <code className="text-xs font-mono font-bold text-accent">{METRIC_EXPLANATIONS[activeMetricExplain].formula}</code>
              </div>

              <div className="p-3 rounded-2xl bg-accent-bg border border-accent/20 text-accent text-xs font-medium">
                <strong>Portfolio Impact:</strong> {METRIC_EXPLANATIONS[activeMetricExplain].impact}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* ONE-CLICK REBALANCE BASKET MODAL */}
      <RebalanceBasketModal 
        isOpen={basketModalOpen}
        onClose={() => setBasketModalOpen(false)}
        currentWeights={initialWeights}
        targetWeights={targetWeights}
        portfolioValue={portfolioValue}
      />

    </div>
  );
}
