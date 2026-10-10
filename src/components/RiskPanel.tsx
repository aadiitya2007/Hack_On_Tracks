import Link from 'next/link';
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';
import { useState, useEffect } from 'react';
import { ShieldAlert, AlertTriangle, CheckCircle, Info } from 'lucide-react';
import { getPortfolioRiskProfile } from '@/lib/actions.risk';

export function RiskPanel() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getPortfolioRiskProfile().then(res => {
      setData(res);
      setLoading(false);
    });
  }, []);

  if (loading) return (
    <div className="card p-6 h-64 animate-pulse bg-surface flex items-center justify-center">
      <div className="text-text-muted font-bold text-sm">Analysing Portfolio Risk...</div>
    </div>
  );

  if (!data) return null;

  const { riskProfile, metrics, unanalysedHoldings, totalPortfolioValue } = data;

  return (
    <div className="card bg-surface overflow-hidden flex flex-col">
      <div className="p-5 border-b border-border flex justify-between items-center bg-surface-hover">
        <div className="flex items-center gap-2">
          <ShieldAlert size={18} className={riskProfile.category === 'High' ? 'text-loss' : riskProfile.category === 'Moderate' ? 'text-accent' : 'text-gain'} />
          <h3 className="font-bold text-sm">Portfolio Risk Analysis</h3>
        </div>
        <div className={`px-3 py-1 rounded-full text-xs font-bold ${
          riskProfile.category === 'High' ? 'bg-loss-bg text-loss' : 
          riskProfile.category === 'Moderate' ? 'bg-accent-bg text-accent' : 'bg-gain-bg text-gain'
        }`}>
          {riskProfile.category} Risk ({riskProfile.score}/100)
        </div>
      </div>

      <div className="p-6 flex-1 flex flex-col gap-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-bg p-4 rounded-xl border border-border">
            <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Max Historical Drawdown</p>
            <p className="text-xl font-bold text-loss">-{ (metrics.maxDrawdown * 100).toFixed(1) }%</p>
          </div>
          <div className="bg-bg p-4 rounded-xl border border-border">
            <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Annual Volatility</p>
            <p className="text-xl font-bold">{ (metrics.annualVolatility * 100).toFixed(1) }%</p>
          </div>
          <div className="bg-bg p-4 rounded-xl border border-border">
            <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Concentration (HHI)</p>
            <p className="text-xl font-bold">{ metrics.hhi.toFixed(0) }</p>
          </div>
          <div className="bg-bg p-4 rounded-xl border border-border">
            <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Value at Risk (1-Mo 95%)</p>
            <p className="text-xl font-bold text-loss">₹{ metrics.var1m.toLocaleString('en-IN', {maximumFractionDigits:0}) }</p>
          </div>
        </div>

        {unanalysedHoldings.length > 0 && (
          <div className="bg-surface-hover border border-border p-3 rounded-lg flex gap-3 text-xs">
            <Info size={16} className="text-text-muted shrink-0 mt-0.5" />
            <p className="text-text-muted">
              <strong>{unanalysedHoldings.length} assets unmapped.</strong> { (data.missingDataPct * 100).toFixed(1) }% of your portfolio (₹{unanalysedHoldings.reduce((sum:number, h:any)=>sum+h.value, 0).toLocaleString()}) lacks historical data and is excluded from mathematical risk calculations.
            </p>
          </div>
        )}

        <div className="mt-auto pt-4 border-t border-border">
          <p className="text-sm font-bold mb-2">Key Findings</p>
          <ul className="text-xs space-y-2 text-text-secondary">
            {metrics.hhi > 2500 ? (
              <li className="flex items-start gap-2"><AlertTriangle size={14} className="text-loss shrink-0 mt-0.5"/> Your portfolio is highly concentrated. Consider <Link href="/learn/mutual-funds" className="text-accent hover:underline">Mutual Funds</Link> for diversification.</li>
            ) : (
              <li className="flex items-start gap-2"><CheckCircle size={14} className="text-gain shrink-0 mt-0.5"/> Good diversification across mapped assets.</li>
            )}
            
            {metrics.annualVolatility > 0.25 && (
              <li className="flex items-start gap-2"><AlertTriangle size={14} className="text-accent shrink-0 mt-0.5"/> High volatility detected. You could offset this risk by adding fixed-income like <Link href="/learn/bonds" className="text-accent hover:underline">Bonds</Link>.</li>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
}
