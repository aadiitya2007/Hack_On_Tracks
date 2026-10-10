'use client';
import Link from 'next/link';
/* eslint-disable @typescript-eslint/no-explicit-any */

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ShieldAlert, Info, Sliders, ChevronRight, AlertTriangle } from 'lucide-react';
import { getPortfolioRiskProfile } from '@/lib/actions.risk';

export default function RiskPage() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [shiftBonds, setShiftBonds] = useState(0);

  useEffect(() => {
    let mounted = true;
    getPortfolioRiskProfile()
      .then(res => {
        if (mounted) {
          setData(res);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error("Failed to load risk profile:", err);
        if (mounted) {
          setData({ error: true });
          setLoading(false);
        }
      });
    return () => { mounted = false; };
  }, []);

  if (loading) return (
    <div className="max-w-4xl mx-auto py-12 flex justify-center animate-pulse">
      <div className="text-text-muted font-bold text-lg">Crunching Portfolio Mathematics...</div>
    </div>
  );

  if (!data) return null;

  if (data.error) return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="p-8 text-center bg-loss-bg text-loss rounded-2xl border border-loss/20 mt-6 flex flex-col items-center gap-3">
        <AlertTriangle size={32} />
        <h3 className="font-bold text-lg">Error loading risk profile</h3>
        <p className="text-sm">Please ensure the database is seeded with valid holdings and historical price records, and try again.</p>
      </div>
    </div>
  );

  const { riskProfile, metrics, totalPortfolioValue } = data;

  // Basic What-If calculation approximation for demo
  const simulatedVolatility = Math.max(0.05, metrics.annualVolatility - (shiftBonds * 0.0015));
  const simulatedDrawdown = Math.max(0.10, metrics.maxDrawdown - (shiftBonds * 0.002));
  const simulatedRisk = riskProfile.score - Math.round(shiftBonds * 0.3);

  return (
    <div className="max-w-4xl mx-auto py-12">
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-10 h-10 rounded-full bg-accent-bg text-accent flex items-center justify-center">
            <ShieldAlert size={20} />
          </div>
          <h1 className="text-3xl font-extrabold text-text-primary">Portfolio Risk Engine</h1>
        </div>
        <p className="text-text-secondary text-lg">A deep dive into your mathematical risk exposure, calculated dynamically from your real holdings and 1-year covariance matrix.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        {/* Risk Score Card */}
        <div className="card bg-surface p-6 border-t-4" style={{ borderColor: riskProfile.category === 'High' ? 'var(--loss)' : riskProfile.category === 'Moderate' ? 'var(--accent)' : 'var(--gain)' }}>
          <h3 className="text-sm font-bold text-text-muted uppercase mb-4 tracking-wider">Overall Risk Score</h3>
          <div className="flex items-end gap-2 mb-2">
            <span className="text-5xl font-black text-text-primary">{riskProfile.score}</span>
            <span className="text-lg text-text-muted mb-1">/100</span>
          </div>
          <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
            riskProfile.category === 'High' ? 'bg-loss-bg text-loss' : 
            riskProfile.category === 'Moderate' ? 'bg-accent-bg text-accent' : 'bg-gain-bg text-gain'
          }`}>
            {riskProfile.category} Risk Profile
          </div>
        </div>

        {/* Detailed Metrics */}
        <div className="md:col-span-2 grid grid-cols-2 gap-4">
          <div className="card bg-surface p-5">
            <h4 className="text-xs font-bold text-text-muted uppercase mb-2">Annual Volatility</h4>
            <p className="text-2xl font-bold text-text-primary">{(metrics.annualVolatility * 100).toFixed(1)}%</p>
            <p className="text-xs text-text-muted mt-2">Standard deviation of 1-year returns</p>
          </div>
          <div className="card bg-surface p-5">
            <h4 className="text-xs font-bold text-text-muted uppercase mb-2">Maximum Drawdown</h4>
            <p className="text-2xl font-bold text-loss">-{(metrics.maxDrawdown * 100).toFixed(1)}%</p>
            <p className="text-xs text-text-muted mt-2">Worst peak-to-trough decline</p>
          </div>
          <div className="card bg-surface p-5">
            <h4 className="text-xs font-bold text-text-muted uppercase mb-2">Value at Risk (95%)</h4>
            <p className="text-2xl font-bold text-text-primary">₹{metrics.var1m.toLocaleString('en-IN', {maximumFractionDigits:0})}</p>
            <p className="text-xs text-text-muted mt-2">1-Month estimated maximum loss</p>
          </div>
          <div className="card bg-surface p-5">
            <h4 className="text-xs font-bold text-text-muted uppercase mb-2">Concentration (HHI)</h4>
            <p className="text-2xl font-bold text-text-primary">{metrics.hhi.toFixed(0)}</p>
            <p className="text-xs text-text-muted mt-2">Herfindahl-Hirschman Index</p>
          </div>
        </div>
      </div>

      {/* What-If Scenario Builder */}
      <div className="card bg-surface p-8 mb-8 border border-border">
        <div className="flex items-center gap-3 mb-6">
          <Sliders className="text-accent" />
          <h2 className="text-xl font-bold">"What-If" Scenario Engine</h2>
        </div>
        <p className="text-text-secondary text-sm mb-8">Shift allocation from Equities to Fixed Income (Bonds) to see how it mathematically reduces your portfolio volatility and max drawdown.</p>
        
        <div className="mb-12">
          <div className="flex justify-between text-sm font-bold mb-4">
            <span className="text-[var(--asset-stocks)]">Shift {shiftBonds}% from Stocks</span>
            <span className="text-[var(--asset-bonds)]">To Bonds</span>
          </div>
          <input 
            type="range" 
            min="0" 
            max="100" 
            step="10"
            value={shiftBonds} 
            onChange={(e) => setShiftBonds(Number(e.target.value))}
            className="w-full h-2 bg-surface-hover rounded-lg appearance-none cursor-pointer accent-accent"
          />
        </div>

        {shiftBonds > 0 && (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-accent-bg p-6 rounded-2xl border border-accent/20"
          >
            <h3 className="font-bold text-accent mb-4">Simulated Impact</h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <p className="text-xs text-text-muted mb-1">New Volatility</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-text-primary">{(simulatedVolatility * 100).toFixed(1)}%</span>
                  <span className="text-xs font-bold text-gain flex items-center">
                    ↓ {((metrics.annualVolatility - simulatedVolatility) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">New Max Drawdown</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-text-primary">-{(simulatedDrawdown * 100).toFixed(1)}%</span>
                  <span className="text-xs font-bold text-gain flex items-center">
                    Improved
                  </span>
                </div>
              </div>
              <div>
                <p className="text-xs text-text-muted mb-1">New Risk Score</p>
                <div className="flex items-center gap-2">
                  <span className="text-xl font-bold text-text-primary">{simulatedRisk}</span>
                  <span className="text-xs font-bold text-gain flex items-center">
                    ↓ {riskProfile.score - simulatedRisk} pts
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

    </div>
  );
}
