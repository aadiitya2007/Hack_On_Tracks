'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, Info, TrendingUp, TrendingDown, 
  Sparkles, CheckCircle2, AlertTriangle, Layers, Grid, HelpCircle, 
  ArrowRight, ShieldCheck, Zap, BarChart3, PieChart, Sliders
} from 'lucide-react';
import { 
  ASSET_DOMAINS, 
  CORRELATION_MATRIX_7X7, 
  calculateMultiAssetRiskProfile 
} from '@/lib/risk-analytics';
import { RebalanceBasketModal } from '@/components/RebalanceBasketModal';

export default function RiskPage() {
  // Base portfolio value
  const [portfolioValue, setPortfolioValue] = useState<number>(1000000);

  // Current baseline portfolio weights (User's actual allocation)
  const initialWeights: Record<string, number> = useMemo(() => ({
    stocks: 45,
    mutualFunds: 20,
    etfs: 10,
    bonds: 10,
    reits: 5,
    invits: 5,
    fno: 5,
  }), []);

  // Live active target weights selected by user choices
  const [targetWeights, setTargetWeights] = useState<Record<string, number>>({
    stocks: 45,
    mutualFunds: 20,
    etfs: 10,
    bonds: 10,
    reits: 5,
    invits: 5,
    fno: 5,
  });

  const [activeStrategyPreset, setActiveStrategyPreset] = useState<string>('current');
  const [activeMetricExplain, setActiveMetricExplain] = useState<string | null>(null);
  const [basketModalOpen, setBasketModalOpen] = useState<boolean>(false);

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
      // Volatility Neutralizer (Boost Mutual Funds & Index ETFs)
      setTargetWeights({ stocks: 20, mutualFunds: 40, etfs: 20, bonds: 10, reits: 10, invits: 0, fno: 0 });
    } else if (presetKey === 'preservation') {
      // Capital Preservation & Fixed Yield (High Bonds & REITs)
      setTargetWeights({ stocks: 10, mutualFunds: 20, etfs: 10, bonds: 35, reits: 15, invits: 10, fno: 0 });
    } else if (presetKey === 'balanced7') {
      // 7-Domain Balanced Master Strategy
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
      
      {/* PAGE HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-accent-bg text-accent flex items-center justify-center border border-accent/20 shadow-sm">
              <ShieldAlert size={22} />
            </div>
            <h1 className="text-4xl font-extrabold text-text-primary">Portfolio Risk Diagnostic & Advisory</h1>
          </div>
          <p className="text-text-secondary text-base max-w-2xl">
            Mathematical risk analysis engine ground in <strong>7-Domain Multi-Asset Correlation Models</strong>. Diagnostic report, smart AI suggestions, and future consequence simulator.
          </p>
        </div>

        {/* Portfolio Value Selector */}
        <div className="card p-3 bg-surface border border-border flex items-center gap-3 self-stretch md:self-auto">
          <span className="text-xs font-bold text-text-muted uppercase">Portfolio Base:</span>
          <select 
            value={portfolioValue} 
            onChange={e => setPortfolioValue(Number(e.target.value))}
            className="bg-bg border border-border rounded-xl px-3 py-1.5 text-xs font-extrabold text-text-primary focus:outline-none focus:border-accent"
          >
            <option value={500000}>₹5,00,000</option>
            <option value={1000000}>₹10,00,000</option>
            <option value={2500000}>₹25,00,000</option>
            <option value={5000000}>₹50,00,000</option>
          </select>
        </div>
      </div>

      {/* SECTION 1: CURRENT RISK DIAGNOSTIC REPORT (DIAGNOSIS FIRST) */}
      <div className="card p-6 md:p-8 bg-surface border border-border rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
        
        {/* Header Badge */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 pb-6 border-b border-border">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-white font-black text-xl shadow-md ${
              currentProfile.category === 'High' ? 'bg-loss' : currentProfile.category === 'Moderate' ? 'bg-accent' : 'bg-gain'
            }`}>
              {currentProfile.score}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                  currentProfile.category === 'High' ? 'bg-loss-bg text-loss border border-loss/30' :
                  currentProfile.category === 'Moderate' ? 'bg-accent-bg text-accent border border-accent/30' :
                  'bg-gain-bg text-gain border border-gain/30'
                }`}>
                  Current Risk Level: {currentProfile.category} Risk
                </span>
                <span className="text-xs text-text-muted font-extrabold">Score: {currentProfile.score} / 100</span>
              </div>
              <h2 className="text-xl font-extrabold text-text-primary mt-1">
                Current Risk Diagnostic Report
              </h2>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-bg border border-border text-xs font-bold text-text-secondary flex items-center gap-2">
            <BarChart3 size={16} className="text-accent" />
            <span>Algorithm: XGBoost & 7x7 Covariance Matrix</span>
          </div>
        </div>

        {/* Diagnostic Explanation Narrative */}
        <div className="p-5 rounded-2xl bg-bg border border-border space-y-2">
          <h3 className="font-extrabold text-sm text-text-primary flex items-center gap-2">
            <Info size={16} className="text-accent" /> Model Diagnosis & Risk Origin Breakdown:
          </h3>
          <p className="text-xs text-text-secondary leading-relaxed font-medium">
            Your current portfolio has a <strong>{currentProfile.score}/100 ({currentProfile.category}) Risk Profile</strong>. 
            This is primarily driven by a heavy <strong>50% combined exposure to direct stocks ({initialWeights.stocks}%) and F&O derivatives ({initialWeights.fno}%)</strong>. 
            Under 252-day market stress simulations, this allocation exposes your portfolio to a <strong>-{(currentProfile.maxDrawdown * 100).toFixed(1)}% maximum peak-to-trough drawdown</strong> 
            and a 30-day 95% Value-at-Risk (VaR) of <strong>₹{Math.round(currentProfile.var1m).toLocaleString('en-IN')}</strong>.
          </p>
        </div>

        {/* 6 Key Diagnostic Metrics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* Risk Score */}
          <div className="p-4 rounded-2xl bg-bg border border-border space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase text-text-muted">Overall Risk Score</span>
              <button onClick={() => setActiveMetricExplain('score')} className="text-text-muted hover:text-accent">
                <HelpCircle size={14} />
              </button>
            </div>
            <p className="text-2xl font-black text-text-primary">{currentProfile.score} <span className="text-xs font-bold text-text-muted">/ 100</span></p>
            <p className="text-[10px] text-text-muted font-medium">40% Vol + 30% HHI + 30% MDD</p>
          </div>

          {/* Volatility */}
          <div className="p-4 rounded-2xl bg-bg border border-border space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase text-text-muted">Annual Volatility (σ)</span>
              <button onClick={() => setActiveMetricExplain('volatility')} className="text-text-muted hover:text-accent">
                <HelpCircle size={14} />
              </button>
            </div>
            <p className="text-2xl font-black text-text-primary">{(currentProfile.annualVolatility * 100).toFixed(1)}%</p>
            <p className="text-[10px] text-text-muted font-medium">252-day standard deviation</p>
          </div>

          {/* 1-Month VaR */}
          <div className="p-4 rounded-2xl bg-bg border border-border space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase text-text-muted">95% 1-Month VaR</span>
              <button onClick={() => setActiveMetricExplain('var')} className="text-text-muted hover:text-accent">
                <HelpCircle size={14} />
              </button>
            </div>
            <p className="text-2xl font-black text-loss">₹{Math.round(currentProfile.var1m).toLocaleString('en-IN')}</p>
            <p className="text-[10px] text-text-muted font-medium">Max 30-day loss at 95% confidence</p>
          </div>

          {/* Max Drawdown */}
          <div className="p-4 rounded-2xl bg-bg border border-border space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase text-text-muted">Max Drawdown</span>
              <button onClick={() => setActiveMetricExplain('drawdown')} className="text-text-muted hover:text-accent">
                <HelpCircle size={14} />
              </button>
            </div>
            <p className="text-2xl font-black text-text-primary">-{(currentProfile.maxDrawdown * 100).toFixed(1)}%</p>
            <p className="text-[10px] text-text-muted font-medium">Historical crash decline</p>
          </div>

          {/* Concentration Index */}
          <div className="p-4 rounded-2xl bg-bg border border-border space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase text-text-muted">Concentration (HHI)</span>
              <button onClick={() => setActiveMetricExplain('hhi')} className="text-text-muted hover:text-accent">
                <HelpCircle size={14} />
              </button>
            </div>
            <p className="text-2xl font-black text-text-primary">{Math.round(currentProfile.hhi)} <span className="text-xs font-bold text-text-muted">/ 10,000</span></p>
            <p className="text-[10px] text-text-muted font-medium">Herfindahl asset concentration</p>
          </div>

          {/* Sharpe Ratio */}
          <div className="p-4 rounded-2xl bg-bg border border-border space-y-1">
            <div className="flex justify-between items-center">
              <span className="text-[10px] font-bold uppercase text-text-muted">Sharpe Efficiency</span>
              <button onClick={() => setActiveMetricExplain('sharpe')} className="text-text-muted hover:text-accent">
                <HelpCircle size={14} />
              </button>
            </div>
            <p className="text-2xl font-black text-gain">{currentProfile.sharpeRatio.toFixed(2)}</p>
            <p className="text-[10px] text-text-muted font-medium">Return per unit risk over 6.5% Rf</p>
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

      {/* SECTION 2: PERSONALIZED AI IMPROVEMENT SUGGESTIONS (WHAT SHOULD I DO?) */}
      <div className="card p-6 md:p-8 bg-surface border border-border rounded-3xl space-y-6 shadow-xl">
        <div className="flex items-center gap-2.5 pb-4 border-b border-border">
          <Sparkles className="text-accent" size={24} />
          <div>
            <h2 className="text-2xl font-black text-text-primary">Personalized Risk Reduction Suggestions</h2>
            <p className="text-xs text-text-secondary mt-0.5 font-medium">
              Model-driven action plan to control risk, neutralize volatility, and build passive yield cushions.
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Suggestion 1 */}
          <div className="p-5 rounded-2xl bg-bg border border-border space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-amber-500 font-extrabold text-xs">
                <ShieldCheck size={18} />
                <span>Recommendation 1: Neutralize Equity Volatility</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Reallocate <strong>15% from single stocks into Flexi-Cap Mutual Funds & Index ETFs</strong>. Mutual funds pool holdings across 50+ companies, dampening individual stock volatility while maintaining compound market returns.
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-[11px] font-bold text-amber-400">
              🎯 Result: Lowers stock volatility by ~8.5% while preserving 12-14% CAGR.
            </div>
          </div>

          {/* Suggestion 2 */}
          <div className="p-5 rounded-2xl bg-bg border border-border space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gain font-extrabold text-xs">
                <Zap size={18} />
                <span>Recommendation 2: Fixed Income & Yield Buffer</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Allocate <strong>20% to Sovereign Bonds & REITs (Real Estate Investment Trusts)</strong>. Non-correlated bond yields (-0.15 correlation with stocks) act as a shock absorber during equity market crashes.
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-gain-bg border border-gain/20 text-[11px] font-bold text-gain">
              🎯 Result: Locks in a 7.5%–9.5% annual cash yield buffer (~₹85,000/yr).
            </div>
          </div>

          {/* Suggestion 3 */}
          <div className="p-5 rounded-2xl bg-bg border border-border space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-loss font-extrabold text-xs">
                <AlertTriangle size={18} />
                <span>Recommendation 3: Eliminate Derivative Leverage Penalty</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Reduce <strong>Futures & Options (F&O) derivative allocation to 0%</strong>. SEBI reports that 90% of retail F&O traders suffer net losses. F&O introduces a 3.5x leverage drawdown penalty in risk calculations.
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-loss-bg border border-loss/20 text-[11px] font-bold text-loss">
              🎯 Result: Instantly cuts Risk Score by 15 points and eliminates leverage drag.
            </div>
          </div>

          {/* Suggestion 4 */}
          <div className="p-5 rounded-2xl bg-bg border border-border space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-accent font-extrabold text-xs">
                <Layers size={18} />
                <span>Recommendation 4: Consolidate Multi-Broker Holdings</span>
              </div>
              <p className="text-xs text-text-secondary leading-relaxed">
                Consolidate duplicate stocks (e.g. RELIANCE held across Zerodha & Groww) under a single DP account to eliminate hidden DP charge leaks.
              </p>
            </div>
            <div className="p-2.5 rounded-xl bg-accent-bg border border-accent/20 text-[11px] font-bold text-accent">
              🎯 Result: Saves ₹420/year per duplicate scrip overlap automatically.
            </div>
          </div>

        </div>
      </div>

      {/* SECTION 3: INTERACTIVE STRATEGY REBALANCER & PERSONAL CHOICE CARDS */}
      <div className="card p-6 md:p-8 bg-surface border border-border rounded-3xl space-y-8 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-border">
          <div>
            <h2 className="text-2xl font-black text-text-primary flex items-center gap-2.5">
              <Sliders className="text-accent" size={24} /> Interactive Strategy Action Blueprint
            </h2>
            <p className="text-xs text-text-secondary mt-1 font-medium">
              Select a structured personal choice strategy below or customize percentages to see exact before-and-after risk consequences.
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

        {/* 4 Personal Strategy Action Cards */}
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
            <p className="text-xs font-bold text-text-primary mb-1">Original Portfolio</p>
            <p className="text-[10px] text-text-muted">45% Stocks, 20% MFs, 10% ETFs, 10% Bonds, 5% REITs, 5% InvITs, 5% F&O</p>
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
              <div key={domain.key} className="p-3 rounded-2xl bg-bg border border-border flex justify-between items-center">
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

      {/* SECTION 4: FUTURE CONSEQUENCES & IMPACT FORECAST (BEFORE VS AFTER) */}
      <div className="card p-6 md:p-8 bg-surface border border-border rounded-3xl space-y-6 shadow-xl">
        <div>
          <h2 className="text-xl font-black text-text-primary flex items-center gap-2">
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

      {/* SECTION 5: 7X7 CROSS-ASSET CORRELATION MATRIX (Σ) */}
      <div className="card p-6 md:p-8 bg-surface border border-border rounded-3xl space-y-6 shadow-md">
        <div>
          <h2 className="text-xl font-black text-text-primary flex items-center gap-2">
            <Grid className="text-accent" size={20} /> 7x7 Cross-Asset Correlation Matrix (Σ)
          </h2>
          <p className="text-xs text-text-secondary mt-1 font-medium">
            Mathematical correlation matrix (ρ_ij) between asset classes. Negative or low correlations (e.g. Stocks vs Bonds = -0.15) create natural downside diversification protection.
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
