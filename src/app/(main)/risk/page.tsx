'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Info, Sliders, ChevronRight } from 'lucide-react';
import { getPortfolioRiskProfile } from '@/lib/actions.risk';

export default function RiskPage() {
  const [data, setData] = useState<any>(null);
  const [shiftBonds, setShiftBonds] = useState(0);

  useEffect(() => {
    getPortfolioRiskProfile().then(res => setData(res));
  }, []);

  if (!data) return (
    <div className="max-w-4xl mx-auto py-12 flex justify-center animate-pulse">
      <div className="text-text-muted font-bold text-lg">Crunching Portfolio Mathematics...</div>
    </div>
  );

  const { riskProfile, metrics, totalPortfolioValue } = data;

  // Basic What-If calculation approximation for demo
  const simulatedVolatility = Math.max(0.05, metrics.annualVolatility - (shiftBonds * 0.0015));
  const simulatedDrawdown = Math.max(0.10, metrics.maxDrawdown - (shiftBonds * 0.002));
  const simulatedRisk = riskProfile.score - Math.round(shiftBonds * 0.3);

  return (
    <div className="max-w-4xl mx-auto space-y-10 pb-24">
      <div className="flex flex-col gap-2">
        <div className="sub-heading">Deep Analytics</div>
        <h1 className="text-4xl font-extrabold text-text-primary">Portfolio Risk Engine</h1>
        <p className="text-text-secondary text-lg max-w-2xl mt-2">
          Understand your true exposure. We calculate mathematically derived risk scores based on Modern Portfolio Theory, looking at how your specific assets correlate with one another.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="card p-8 col-span-1 md:col-span-1 bg-surface flex flex-col justify-center items-center text-center">
          <ShieldAlert size={48} className={simulatedRisk > 70 ? 'text-loss' : simulatedRisk > 40 ? 'text-accent' : 'text-gain'} />
          <h2 className="text-5xl font-extrabold mt-6 mb-2">{simulatedRisk}</h2>
          <p className="font-bold text-text-secondary">Overall Risk Score</p>
          <div className="mt-6 text-left w-full text-xs space-y-2 text-text-muted">
            <div className="flex justify-between"><span>Volatility</span><span>{riskProfile.breakdown.volatility}/40</span></div>
            <div className="flex justify-between"><span>Concentration</span><span>{riskProfile.breakdown.concentration}/30</span></div>
            <div className="flex justify-between"><span>Drawdown</span><span>{riskProfile.breakdown.drawdown}/30</span></div>
            <div className="flex justify-between"><span>Data Penalty</span><span>{riskProfile.breakdown.penalty}/50</span></div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="card p-6">
            <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
              <Sliders className="text-accent" size={20} />
              "What-If" Scenario Engine
            </h3>
            <p className="text-sm text-text-secondary mb-6">
              How would your risk profile change if you shifted capital from Equities into fixed-income Bonds?
            </p>
            <div className="space-y-6">
              <div>
                <div className="flex justify-between text-sm font-bold mb-2">
                  <span>Current Portfolio</span>
                  <span className="text-accent">Shift {shiftBonds}% to Bonds</span>
                </div>
                <input 
                  type="range" min="0" max="100" 
                  value={shiftBonds} 
                  onChange={e => setShiftBonds(Number(e.target.value))} 
                  className="w-full accent-accent"
                />
              </div>
              
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="bg-bg border border-border p-3 rounded-lg">
                  <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Vol (Ann.)</p>
                  <p className="text-lg font-bold">{(simulatedVolatility * 100).toFixed(1)}%</p>
                </div>
                <div className="bg-bg border border-border p-3 rounded-lg">
                  <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Max Drawdown</p>
                  <p className="text-lg font-bold">{(simulatedDrawdown * 100).toFixed(1)}%</p>
                </div>
                <div className="bg-bg border border-border p-3 rounded-lg">
                  <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Risk Score</p>
                  <p className="text-lg font-bold">{simulatedRisk}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="card p-6">
            <h3 className="font-bold text-lg mb-4">Educational Suggestions</h3>
            <div className="space-y-4">
              <a href="/learn/bonds" className="block p-4 rounded-xl border border-border bg-surface-hover hover:border-accent transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-sm">Learn how Bonds lower portfolio volatility</h4>
                  <ChevronRight size={16} className="text-text-muted" />
                </div>
                <p className="text-xs text-text-secondary">Fixed-income assets generally have low correlation with equities, reducing overall portfolio swings.</p>
              </a>
              <a href="/learn/mutual-funds" className="block p-4 rounded-xl border border-border bg-surface-hover hover:border-accent transition-colors">
                <div className="flex justify-between items-center mb-1">
                  <h4 className="font-bold text-sm">Diversification using Mutual Funds</h4>
                  <ChevronRight size={16} className="text-text-muted" />
                </div>
                <p className="text-xs text-text-secondary">If your HHI concentration is high, mutual funds offer instant broad market exposure.</p>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="card p-4 flex gap-3 text-xs bg-surface-hover text-text-muted">
        <Info size={16} className="shrink-0 mt-0.5" />
        <p>
          <strong>Disclaimer:</strong> Educational, not investment advice. Risk scores are mathematical aggregates of historical volatility, drawdown, and concentration. They do not predict future losses.
        </p>
      </div>
    </div>
  );
}
