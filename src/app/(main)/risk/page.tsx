'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  ShieldAlert, Sliders, Info, TrendingUp, TrendingDown, 
  Sparkles, CheckCircle2, AlertTriangle, Layers, Grid, RefreshCw, HelpCircle, ArrowRight 
} from 'lucide-react';
import { 
  ASSET_DOMAINS, 
  CORRELATION_MATRIX_7X7, 
  calculateMultiAssetRiskProfile 
} from '@/lib/risk-analytics';

export default function RiskPage() {
  // Baseline initial allocation across 7 domains
  const [weights, setWeights] = useState<Record<string, number>>({
    stocks: 45,
    mutualFunds: 20,
    etfs: 10,
    bonds: 10,
    reits: 5,
    invits: 5,
    fno: 5,
  });

  const [activeMetricExplain, setActiveMetricExplain] = useState<string | null>(null);
  const [portfolioValue, setPortfolioValue] = useState(1000000);

  // Initial baseline risk profile
  const initialProfile = useMemo(() => {
    return calculateMultiAssetRiskProfile({
      stocks: 45, mutualFunds: 20, etfs: 10, bonds: 10, reits: 5, invits: 5, fno: 5
    }, portfolioValue);
  }, [portfolioValue]);

  // Current live risk profile recalculated dynamically from sliders
  const currentProfile = useMemo(() => {
    return calculateMultiAssetRiskProfile(weights, portfolioValue);
  }, [weights, portfolioValue]);

  // Handle slider weight changes
  const handleWeightChange = (key: string, val: number) => {
    setWeights(prev => ({
      ...prev,
      [key]: val
    }));
  };

  // Preset Allocation Blueprints
  const applyPreset = (preset: 'conservative' | 'balanced' | 'aggressive') => {
    if (preset === 'conservative') {
      setWeights({ stocks: 15, mutualFunds: 20, etfs: 10, bonds: 35, reits: 10, invits: 10, fno: 0 });
    } else if (preset === 'balanced') {
      setWeights({ stocks: 35, mutualFunds: 25, etfs: 15, bonds: 15, reits: 5, invits: 5, fno: 0 });
    } else if (preset === 'aggressive') {
      setWeights({ stocks: 60, mutualFunds: 15, etfs: 10, bonds: 5, reits: 0, invits: 0, fno: 10 });
    }
  };

  // Risk Reduction Deltas
  const scoreDelta = currentProfile.score - initialProfile.score;
  const volDelta = (currentProfile.annualVolatility - initialProfile.annualVolatility) * 100;
  const varDelta = currentProfile.var1m - initialProfile.var1m;
  const sharpeDelta = currentProfile.sharpeRatio - initialProfile.sharpeRatio;

  // Metric Explanations dictionary
  const METRIC_EXPLANATIONS: Record<string, { title: string; desc: string; formula: string; impact: string }> = {
    'score': {
      title: 'Overall Portfolio Risk Score (0–100)',
      desc: 'Composite index evaluating portfolio vulnerability. Combines 40% Annual Volatility, 30% Concentration (HHI), 30% Max Drawdown, plus a leverage penalty for F&O derivative exposure.',
      formula: 'Score = 0.40(Vol) + 0.30(HHI) + 0.30(Drawdown) + F&O Penalty',
      impact: 'Scores <35 represent Conservative stability; 35-65 represents Balanced compounding; >65 represents High risk exposure.'
    },
    'volatility': {
      title: 'Annualized Volatility (Standard Deviation σ)',
      desc: 'Measures the standard deviation of return fluctuations over a 252-day trading year. High volatility implies wide swing ranges.',
      formula: 'σ_ann = √(252 × w^T Σ w)',
      impact: 'Lower volatility protects portfolio capital during turbulent market sell-offs.'
    },
    'drawdown': {
      title: 'Maximum Drawdown (MDD)',
      desc: 'The worst historical peak-to-trough loss percentage your portfolio allocation experienced during market crashes.',
      formula: 'MDD = ∑ (w_i × MDD_i)',
      impact: 'Adding non-correlated assets like REITs and Bonds dampens peak-to-trough drops significantly.'
    },
    'var': {
      title: '95% 1-Month Value-at-Risk (VaR)',
      desc: 'The statistical maximum rupees your portfolio could lose over a 30-day period at a 95% confidence level.',
      formula: 'VaR_95% = Portfolio Value × 1.645 × (σ_ann / √12)',
      impact: 'Directly quantifies worst-case monthly rupees at risk under normal market distributions.'
    },
    'hhi': {
      title: 'Herfindahl-Hirschman Concentration Index (HHI)',
      desc: 'Measures asset class over-exposure. High HHI indicates single-point failure risk, while lower HHI indicates healthy asset class distribution.',
      formula: 'HHI = 10,500 × ∑ (w_i)^2',
      impact: 'Distributing capital across 7 asset domains drives HHI down from 10,000 to safe levels (<2,000).'
    },
    'sharpe': {
      title: 'Risk-Adjusted Sharpe Ratio',
      desc: 'Measures the excess return generated per unit of portfolio volatility above the 6.5% risk-free Indian Treasury rate.',
      formula: 'Sharpe = (Expected Return - 6.5%) / Annual Volatility',
      impact: 'Sharpe ratios > 1.2 indicate highly efficient portfolios where returns outweigh risk.'
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-10 pb-20 relative z-10">
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 rounded-2xl bg-accent-bg text-accent flex items-center justify-center border border-accent/20 shadow-sm">
              <ShieldAlert size={22} />
            </div>
            <h1 className="text-4xl font-extrabold text-text-primary">7-Domain Portfolio Risk Engine</h1>
          </div>
          <p className="text-text-secondary text-base max-w-2xl">
            Real-time mathematical risk profile model calculated across <strong>Stocks, Mutual Funds, ETFs, Bonds, REITs, InvITs, and F&O Derivatives</strong>.
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

      {/* TOP METRICS OVERVIEW CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        
        {/* Risk Score Card */}
        <div className={`card p-6 bg-surface border-t-4 shadow-md flex flex-col justify-between ${
          currentProfile.category === 'High' ? 'border-t-loss' : currentProfile.category === 'Moderate' ? 'border-t-accent' : 'border-t-gain'
        }`}>
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-text-muted">Overall Risk Score</span>
              <button onClick={() => setActiveMetricExplain('score')} className="text-text-muted hover:text-accent transition-colors">
                <HelpCircle size={16} />
              </button>
            </div>
            
            <div className="flex items-baseline gap-3 my-2">
              <span className="text-5xl font-black text-text-primary">{currentProfile.score}</span>
              <span className="text-sm font-bold text-text-muted">/ 100</span>
              {scoreDelta !== 0 && (
                <span className={`text-xs font-extrabold px-2 py-0.5 rounded-full ${scoreDelta < 0 ? 'bg-gain-bg text-gain' : 'bg-loss-bg text-loss'}`}>
                  {scoreDelta < 0 ? `↓ ${Math.abs(scoreDelta)} pts` : `↑ +${scoreDelta} pts`}
                </span>
              )}
            </div>
          </div>

          <div className="mt-4 pt-4 border-t border-border flex items-center justify-between">
            <span className={`px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider ${
              currentProfile.category === 'High' ? 'bg-loss-bg text-loss border border-loss/20' :
              currentProfile.category === 'Moderate' ? 'bg-accent-bg text-accent border border-accent/20' : 'bg-gain-bg text-gain border border-gain/20'
            }`}>
              {currentProfile.category} Risk Profile
            </span>
            <span className="text-[10px] text-text-muted font-bold">40% Vol + 30% HHI + 30% MDD</span>
          </div>
        </div>

        {/* Annual Volatility Card */}
        <div className="card p-6 bg-surface border border-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-text-muted">Annual Volatility (σ)</span>
              <button onClick={() => setActiveMetricExplain('volatility')} className="text-text-muted hover:text-accent transition-colors">
                <HelpCircle size={16} />
              </button>
            </div>
            
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-4xl font-black text-text-primary">{(currentProfile.annualVolatility * 100).toFixed(1)}%</span>
              {volDelta !== 0 && (
                <span className={`text-xs font-extrabold ${volDelta < 0 ? 'text-gain' : 'text-loss'}`}>
                  {volDelta < 0 ? `↓ ${volDelta.toFixed(1)}%` : `↑ +${volDelta.toFixed(1)}%`}
                </span>
              )}
            </div>
          </div>
          <p className="text-[11px] text-text-secondary mt-2 font-medium">Standard deviation of 252-day return fluctuations</p>
        </div>

        {/* 95% 1-Month Value-at-Risk (VaR) Card */}
        <div className="card p-6 bg-surface border border-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-text-muted">95% 1-Month VaR</span>
              <button onClick={() => setActiveMetricExplain('var')} className="text-text-muted hover:text-accent transition-colors">
                <HelpCircle size={16} />
              </button>
            </div>
            
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-3xl font-black text-loss">₹{Math.round(currentProfile.var1m).toLocaleString('en-IN')}</span>
            </div>
          </div>
          <p className="text-[11px] text-text-secondary mt-2 font-medium">Estimated 30-day max rupee loss at 95% confidence</p>
        </div>

        {/* Max Drawdown Card */}
        <div className="card p-6 bg-surface border border-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-text-muted">Maximum Drawdown</span>
              <button onClick={() => setActiveMetricExplain('drawdown')} className="text-text-muted hover:text-accent transition-colors">
                <HelpCircle size={16} />
              </button>
            </div>
            
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-3xl font-black text-text-primary">-{(currentProfile.maxDrawdown * 100).toFixed(1)}%</span>
            </div>
          </div>
          <p className="text-[11px] text-text-secondary mt-2 font-medium">Worst peak-to-trough crash decline percentage</p>
        </div>

        {/* HHI Concentration Index Card */}
        <div className="card p-6 bg-surface border border-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-text-muted">Concentration (HHI)</span>
              <button onClick={() => setActiveMetricExplain('hhi')} className="text-text-muted hover:text-accent transition-colors">
                <HelpCircle size={16} />
              </button>
            </div>
            
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-3xl font-black text-text-primary">{Math.round(currentProfile.hhi)}</span>
              <span className="text-xs text-text-muted font-bold">/ 10,000</span>
            </div>
          </div>
          <p className="text-[11px] text-text-secondary mt-2 font-medium">Herfindahl asset class concentration index</p>
        </div>

        {/* Sharpe Ratio Card */}
        <div className="card p-6 bg-surface border border-border shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-2">
              <span className="text-xs font-black uppercase tracking-wider text-text-muted">Sharpe Ratio (Efficiency)</span>
              <button onClick={() => setActiveMetricExplain('sharpe')} className="text-text-muted hover:text-accent transition-colors">
                <HelpCircle size={16} />
              </button>
            </div>
            
            <div className="flex items-baseline gap-2 my-2">
              <span className="text-3xl font-black text-gain">{currentProfile.sharpeRatio.toFixed(2)}</span>
              {sharpeDelta !== 0 && (
                <span className={`text-xs font-extrabold ${sharpeDelta > 0 ? 'text-gain' : 'text-loss'}`}>
                  {sharpeDelta > 0 ? `↑ +${sharpeDelta.toFixed(2)}` : `↓ ${sharpeDelta.toFixed(2)}`}
                </span>
              )}
            </div>
          </div>
          <p className="text-[11px] text-text-secondary mt-2 font-medium">Excess return per unit of volatility above 6.5% Risk-Free Rate</p>
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
                <button onClick={() => setActiveMetricExplain(null)} className="text-text-muted hover:text-text-primary text-sm font-bold w-7 h-7 rounded-full bg-bg border border-border flex items-center justify-center">✕</button>
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

      {/* 7-DOMAIN DIVERSIFICATION "WHAT-IF" SIMULATOR */}
      <div className="card p-6 md:p-8 bg-surface border border-border rounded-3xl space-y-8 shadow-xl">
        <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-border">
          <div>
            <h2 className="text-2xl font-black text-text-primary flex items-center gap-2.5">
              <Sliders className="text-accent" size={24} /> 7-Domain Multi-Asset "What-If" Rebalancer
            </h2>
            <p className="text-xs text-text-secondary mt-1 font-medium">
              Adjust sliders across all 7 asset domains. Mathematical risk profile, volatility, and VaR recalculate dynamically in real-time.
            </p>
          </div>

          {/* Strategy Presets */}
          <div className="flex flex-wrap gap-2">
            <button onClick={() => applyPreset('conservative')} className="px-3 py-1.5 rounded-xl bg-gain-bg border border-gain/30 text-gain text-xs font-bold hover:scale-105 transition-all">
              🛡️ Conservative
            </button>
            <button onClick={() => applyPreset('balanced')} className="px-3 py-1.5 rounded-xl bg-accent-bg border border-accent/30 text-accent text-xs font-bold hover:scale-105 transition-all">
              ⚖️ Balanced
            </button>
            <button onClick={() => applyPreset('aggressive')} className="px-3 py-1.5 rounded-xl bg-loss-bg border border-loss/30 text-loss text-xs font-bold hover:scale-105 transition-all">
              🚀 Aggressive
            </button>
          </div>
        </div>

        {/* 7 Sliders Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {ASSET_DOMAINS.map((domain) => {
            const currentVal = weights[domain.key] || 0;
            return (
              <div key={domain.key} className="p-4 rounded-2xl bg-bg border border-border space-y-3">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2.5">
                    <span className="w-3.5 h-3.5 rounded-full shrink-0 shadow-sm" style={{ backgroundColor: domain.color }}></span>
                    <span className="font-extrabold text-xs text-text-primary">{domain.label}</span>
                  </div>
                  <span className="font-mono font-black text-sm text-text-primary">{currentVal}%</span>
                </div>

                <input 
                  type="range" 
                  min="0" 
                  max="100" 
                  step="5"
                  value={currentVal}
                  onChange={(e) => handleWeightChange(domain.key, Number(e.target.value))}
                  className="w-full h-2 bg-surface rounded-lg appearance-none cursor-pointer accent-accent"
                />

                <div className="flex justify-between text-[10px] text-text-muted font-mono font-bold">
                  <span>Vol: {(domain.vol * 100).toFixed(1)}%</span>
                  <span>Max Drawdown: -{(domain.mdd * 100).toFixed(1)}%</span>
                  <span>Est Return: {(domain.expReturn * 100).toFixed(1)}%</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* REAL-TIME DIVERSIFICATION ADVISORY & DELTA REPORT */}
        <div className="p-6 rounded-3xl bg-accent-bg border border-accent/30 space-y-4">
          <div className="flex items-center gap-2">
            <Sparkles className="text-accent" size={20} />
            <h3 className="font-extrabold text-base text-accent">Real-Time Risk & AI Advisory Telemetry</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
            <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
              <span className="text-[10px] text-text-muted font-bold uppercase">Risk Score Shift</span>
              <p className="text-lg font-black text-text-primary flex items-center gap-2">
                {currentProfile.score} pts
                <span className={`text-xs font-bold ${scoreDelta <= 0 ? 'text-gain' : 'text-loss'}`}>
                  ({scoreDelta <= 0 ? `Reduced by ${Math.abs(scoreDelta)} pts` : `Increased by +${scoreDelta} pts`})
                </span>
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
              <span className="text-[10px] text-text-muted font-bold uppercase">1-Month VaR Impact</span>
              <p className="text-lg font-black text-text-primary flex items-center gap-2">
                ₹{Math.round(currentProfile.var1m).toLocaleString('en-IN')}
                <span className={`text-xs font-bold ${varDelta <= 0 ? 'text-gain' : 'text-loss'}`}>
                  ({varDelta <= 0 ? `Saved ₹${Math.abs(Math.round(varDelta)).toLocaleString('en-IN')}` : `+₹${Math.round(varDelta).toLocaleString('en-IN')}`})
                </span>
              </p>
            </div>

            <div className="p-3.5 rounded-2xl bg-surface border border-border space-y-1">
              <span className="text-[10px] text-text-muted font-bold uppercase">Sharpe Efficiency</span>
              <p className="text-lg font-black text-gain flex items-center gap-2">
                {currentProfile.sharpeRatio.toFixed(2)}
                <span className="text-xs font-bold text-accent">
                  ({sharpeDelta >= 0 ? `+${sharpeDelta.toFixed(2)} Sharpe` : `${sharpeDelta.toFixed(2)} Sharpe`})
                </span>
              </p>
            </div>
          </div>

          {/* AI Guidance Text */}
          <div className="p-4 rounded-2xl bg-surface border border-border text-xs text-text-secondary leading-relaxed font-medium space-y-1.5">
            <p className="font-extrabold text-text-primary flex items-center gap-1.5">
              <CheckCircle2 size={16} className="text-gain" /> Strategic Allocation Guidance:
            </p>
            {weights.bonds + weights.reits + weights.invits >= 30 ? (
              <p>
                ✓ <strong>Excellent Diversification!</strong> Allocating <strong>{weights.bonds + weights.reits + weights.invits}%</strong> into low-correlation Bonds, REITs & InvITs reduces portfolio drawdown risk during market crashes while locking in a steady 7.5%–9.5% annual yield baseline.
              </p>
            ) : weights.fno > 10 ? (
              <p className="text-loss font-bold">
                ⚠️ <strong>High Derivatives Risk Warning!</strong> You have allocated {weights.fno}% to Futures & Options. Derivatives carry 3.5x leverage penalties and extreme drawdown risks. Consider reducing F&O allocation below 10%.
              </p>
            ) : (
              <p>
                💡 <strong>Optimization Suggestion:</strong> Shift 15% of heavy equity weight into REITs (commercial property yield) or Fixed Income Bonds to reduce annual volatility below 12% without sacrificing compounding gains.
              </p>
            )}
          </div>
        </div>
      </div>

      {/* 7X7 CROSS-ASSET CORRELATION MATRIX VIEWER */}
      <div className="card p-6 md:p-8 bg-surface border border-border rounded-3xl space-y-6 shadow-md">
        <div>
          <h2 className="text-xl font-black text-text-primary flex items-center gap-2">
            <Grid className="text-accent" size={20} /> 7x7 Cross-Asset Correlation Matrix (Σ)
          </h2>
          <p className="text-xs text-text-secondary mt-1 font-medium">
            Mathematical correlation matrix (ρ_ij) between asset classes. Negative or low correlations (e.g. Stocks vs Bonds = -0.15) mean assets move independently, creating natural diversification protection.
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

    </div>
  );
}
