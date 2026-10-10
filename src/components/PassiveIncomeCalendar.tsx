'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, DollarSign, TrendingUp, Sparkles, 
  Building2, Landmark, ShieldCheck, ArrowRight, ChevronLeft, ChevronRight 
} from 'lucide-react';

export function PassiveIncomeCalendar() {
  const [selectedMonth, setSelectedMonth] = useState('May 2026');

  const monthlyForecasts = [
    { month: 'Apr 2026', total: 6400, items: 2 },
    { month: 'May 2026', total: 14200, items: 4 },
    { month: 'Jun 2026', total: 8800, items: 3 },
    { month: 'Jul 2026', total: 18500, items: 5 },
    { month: 'Aug 2026', total: 5200, items: 2 },
    { month: 'Sep 2026', total: 12900, items: 4 },
  ];

  const monthPayouts: Record<string, Array<{ title: string; assetType: string; payoutDate: string; perUnit: string; totalAmount: number; icon: string }>> = {
    'May 2026': [
      { title: 'Embassy Office Parks REIT', assetType: 'REIT Rental Yield', payoutDate: '14 May 2026', perUnit: '₹5.40/unit', totalAmount: 5400, icon: '🏢' },
      { title: '7.85% GOI Treasury Bond', assetType: 'Sovereign Bond Coupon', payoutDate: '21 May 2026', perUnit: 'Half-yearly coupon', totalAmount: 3925, icon: '📜' },
      { title: 'ITC Limited', assetType: 'Equity Dividend', payoutDate: '28 May 2026', perUnit: '₹6.25/share', totalAmount: 3125, icon: '📈' },
      { title: 'POWERGRID InvIT', assetType: 'Infrastructure Yield', payoutDate: '30 May 2026', perUnit: '₹3.50/unit', totalAmount: 1750, icon: '⚡' },
    ],
    'Jun 2026': [
      { title: 'TCS Limited', assetType: 'Final Dividend', payoutDate: '10 Jun 2026', perUnit: '₹28.00/share', totalAmount: 5600, icon: '💻' },
      { title: 'Mindspace Business Parks REIT', assetType: 'REIT Yield', payoutDate: '18 Jun 2026', perUnit: '₹4.80/unit', totalAmount: 3200, icon: '🏢' },
    ],
    'Jul 2026': [
      { title: 'Reliance Industries', assetType: 'Equity Dividend', payoutDate: '08 Jul 2026', perUnit: '₹10.00/share', totalAmount: 8500, icon: '⛽' },
      { title: 'Sovereign Gold Bond (SGB 2028)', assetType: 'Gold Interest', payoutDate: '15 Jul 2026', perUnit: '2.5% Annual', totalAmount: 6250, icon: '🪙' },
      { title: 'HDFC Bank Limited', assetType: 'Equity Dividend', payoutDate: '25 Jul 2026', perUnit: '₹19.50/share', totalAmount: 3750, icon: '🏦' },
    ]
  };

  const activePayouts = monthPayouts[selectedMonth] || monthPayouts['May 2026'];
  const totalAnnualYield = 78600;

  return (
    <div className="card p-6 bg-surface border border-border rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-500 flex items-center justify-center border border-amber-500/20 shadow-sm shrink-0">
            <Calendar size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-500 text-[10px] font-black uppercase tracking-wider border border-amber-500/20">
                Multi-Asset Yield Tracker
              </span>
              <span className="text-[10px] font-bold text-gain flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gain animate-pulse"></span> Auto-Sync Active
              </span>
            </div>
            <h3 className="font-extrabold text-lg text-text-primary mt-0.5">
              Passive Income & Dividend Cash-Flow Calendar
            </h3>
          </div>
        </div>

        <div className="p-3 rounded-2xl bg-bg border border-border text-xs font-bold text-text-secondary flex items-center gap-3">
          <span className="text-[10px] font-bold uppercase text-text-muted">Est. Annual Cash Yield:</span>
          <span className="text-base font-mono font-black text-gain">₹{totalAnnualYield.toLocaleString('en-IN')}</span>
        </div>
      </div>

      {/* Monthly Forecast Selector Bar */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
        {monthlyForecasts.map((mf) => (
          <button
            key={mf.month}
            onClick={() => setSelectedMonth(mf.month)}
            className={`p-3 rounded-2xl border text-left transition-all cursor-pointer ${
              selectedMonth === mf.month 
                ? 'bg-accent/15 border-accent text-text-primary ring-2 ring-accent/30' 
                : 'bg-bg border-border text-text-secondary hover:border-text-muted'
            }`}
          >
            <span className="text-[10px] font-extrabold uppercase text-text-muted block">{mf.month}</span>
            <span className="text-sm font-mono font-black text-text-primary block mt-0.5">₹{mf.total.toLocaleString()}</span>
            <span className="text-[9px] text-accent font-bold mt-1 block">{mf.items} Payouts</span>
          </button>
        ))}
      </div>

      {/* Selected Month Cash Inflow List */}
      <div className="space-y-3">
        <div className="flex justify-between items-center">
          <h4 className="font-extrabold text-xs text-text-primary uppercase tracking-wider flex items-center gap-2">
            <Sparkles size={14} className="text-amber-500" /> Projected Payouts for {selectedMonth}:
          </h4>
          <span className="text-xs font-mono font-bold text-gain">
            Total Month Inflow: ₹{activePayouts.reduce((sum, item) => sum + item.totalAmount, 0).toLocaleString()}
          </span>
        </div>

        <div className="space-y-2.5">
          {activePayouts.map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-bg border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-surface border border-border flex items-center justify-center text-lg shrink-0 shadow-sm">
                  {item.icon}
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-extrabold text-text-primary text-sm">{item.title}</span>
                    <span className="px-2 py-0.5 rounded bg-surface border border-border text-[9px] font-bold text-text-muted">
                      {item.assetType}
                    </span>
                  </div>
                  <span className="text-[11px] text-text-muted font-medium mt-0.5 block">
                    Expected Deposit: <strong>{item.payoutDate}</strong> • Rate: {item.perUnit}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-[10px] font-bold text-text-muted uppercase">Direct Deposit:</span>
                <span className="text-sm font-mono font-black text-gain bg-gain-bg px-3 py-1 rounded-xl border border-gain/20">
                  +₹{item.totalAmount.toLocaleString()}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
