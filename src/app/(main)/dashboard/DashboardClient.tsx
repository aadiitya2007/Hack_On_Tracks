'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { PieChart, Pie, Cell, AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { simulateTradeAction } from '@/lib/actions';
import { RiskPanel } from '@/components/RiskPanel';
import { StockInsightsCard } from '@/components/StockInsightsCard';

const ASSET_COLORS: Record<string, string> = {
  EQUITY: 'var(--asset-stocks)',
  MUTUAL_FUND: 'var(--asset-funds)', // magenta
  DEBT: 'var(--asset-bonds)',
  COMMODITY: 'var(--asset-reits)',
  REIT: 'var(--asset-reits)',
  CASH: 'var(--asset-cash)',
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
  
  // Trade state
  const [tradeSymbol, setTradeSymbol] = useState('RELIANCE');
  const [tradeBroker, setTradeBroker] = useState('Zerodha');
  const [tradeAction, setTradeAction] = useState<'BUY' | 'SELL'>('BUY');
  const [tradeQty, setTradeQty] = useState(10);
  
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
      // If no buy price, assume 0 invested for PnL logic or use current price to avoid huge false PnL
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

  // Growth Chart Mock Data
  const mockHistory = Array.from({ length: 7 }).map((_, i) => {
    return {
      month: ['Nov', 'Dec', 'Jan', 'Feb', 'Mar', 'Apr', 'May'][i],
      value: totalValue * (0.8 + (i * 0.05) + (Math.random() * 0.02))
    }
  });

  const handleSimulate = async () => {
    setTradeLoading(true);
    await simulateTradeAction(tradeSymbol, tradeBroker, tradeAction, tradeQty, 3000); // mock price 3000
    setTradeLoading(false);
    setSimulateModalOpen(false);
  };

  const handleLiveSync = () => {
    setSyncing(true);
    setTimeout(() => setSyncing(false), 2000);
  };

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
            {['Zerodha', 'Groww', 'Upstox', 'Angel'].map(b => (
              <span key={b} className="px-2 py-1 bg-bg border border-border rounded text-[10px] text-text-primary/80 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 rounded-full bg-accent"></span> {b}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Stock Insights Card */}
      <div className="relative z-10">
        <StockInsightsCard symbol="RELIANCE" />
      </div>

      {/* Middle Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 relative z-10">
        
        {/* Allocation */}
        <div className="card p-6 col-span-1 h-[320px] flex flex-col relative">
          <h3 className="font-bold text-sm mb-2">Asset Allocation</h3>
          <p className="text-xs text-text-muted mb-4">{allocData.length} asset classes cross-indexed</p>
          <div className="flex-1 absolute inset-0 mt-16 pointer-events-none">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={allocData} innerRadius={60} outerRadius={85} paddingAngle={4} dataKey="value" stroke="none">
                  {allocData.map((entry, index) => <Cell key={`cell-${index}`} fill={ASSET_COLORS[entry.name] || '#ffffff'} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
          </div>
          
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 translate-y-[20px] text-center">
            <p className="text-[10px] text-text-muted uppercase tracking-widest font-bold">Portfolio</p>
            <p className="text-lg font-display font-bold">₹{(totalValue/100000).toFixed(2)}L</p>
          </div>
        </div>

        {/* Growth Chart */}
        <div className="card p-6 col-span-1 lg:col-span-2 h-[320px] flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <div>
              <h3 className="font-bold text-sm">Trajectory vs NIFTY 50</h3>
              <p className="text-xs text-text-muted">12-month consolidated compounded trajectory</p>
            </div>
            <span className="px-2 py-1 rounded bg-success/10 text-gain text-[10px] font-bold border border-success/20">
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
                <XAxis dataKey="month" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
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
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/></svg>
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
          <div className="relative">
            <input type="text" placeholder="Filter holdings..." className="bg-surface border border-border rounded-full pl-8 pr-4 py-1.5 text-xs focus:outline-none focus:border-accent" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="text-[10px] font-bold text-text-muted uppercase tracking-wider border-b border-border bg-surface-hover">
              <tr>
                <th className="px-6 py-4">Stock / Asset</th>
                <th className="px-6 py-4">Broker(s)</th>
                <th className="px-6 py-4 text-right">Qty & Avg</th>
                <th className="px-6 py-4 text-right">LTP</th>
                <th className="px-6 py-4 text-right">Overall P&L</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <AnimatePresence>
                {filteredHoldings.map((h: any) => {
                  const hInvested = h.avgBuyPrice ? h.quantity * h.avgBuyPrice : 0;
                  const hValue = h.quantity * h.currentPrice;
                  const hPnl = hInvested > 0 ? hValue - hInvested : 0;
                  const hPnlPct = hInvested > 0 ? (hPnl / hInvested) * 100 : 0;
                  
                  return (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      key={h.id} 
                      className="hover:bg-bg transition-colors group"
                    >
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-bg border border-border flex items-center justify-center font-bold text-xs">
                            {h.symbol.substring(0, 2)}
                          </div>
                          <div>
                            <p className="font-bold text-sm">{h.symbol}</p>
                            <p className="text-[10px] text-text-muted">{h.assetType}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className="px-2 py-1 bg-bg border border-border rounded text-[10px]">{h.broker}</span>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-bold text-sm tabular-nums">{h.quantity} sh</p>
                        <p className="text-[10px] text-text-muted tabular-nums">
                          {h.avgBuyPrice ? `₹${h.avgBuyPrice.toFixed(2)}` : <span className="text-accent">Buy price needed</span>}
                        </p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <p className="font-bold text-sm tabular-nums">₹{h.currentPrice.toFixed(2)}</p>
                      </td>
                      <td className="px-6 py-4 text-right">
                        {hInvested > 0 ? (
                          <>
                            <p className={`font-bold text-sm tabular-nums text-${hPnl >= 0 ? 'success' : 'destructive'}`}>
                              {hPnl >= 0 ? '+' : ''}₹{hPnl.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </p>
                            <p className={`text-[10px] font-bold tabular-nums text-${hPnl >= 0 ? 'success' : 'destructive'}/70`}>
                              {hPnl >= 0 ? '+' : ''}{hPnlPct.toFixed(2)}%
                            </p>
                          </>
                        ) : (
                          <p className="text-sm text-text-muted">-</p>
                        )}
                      </td>
                    </motion.tr>
                  )
                })}
              </AnimatePresence>
            </tbody>
          </table>
        </div>
      </div>
      <div className="mt-6"><RiskPanel /></div>

      {/* Simulate Modal */}
      {simulateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setSimulateModalOpen(false)}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card-overlay w-full max-w-md p-6 relative rounded-2xl border border-border"
          >
            <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
              <span className="w-8 h-8 rounded bg-primary/20 text-primary flex items-center justify-center">✨</span>
              Trade Simulator
            </h2>
            <p className="text-sm text-text-secondary mb-6">Simulate a hypothetical trade to test allocation impacts before executing on your broker.</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-bold text-text-muted uppercase">Select Scrip</label>
                <select value={tradeSymbol} onChange={e=>setTradeSymbol(e.target.value)} className="w-full mt-1 bg-bg border border-border rounded-lg p-2 text-sm">
                  {holdings.map((h:any) => <option key={h.id} value={h.symbol}>{h.symbol}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-bold text-text-muted uppercase">Action</label>
                  <div className="flex mt-1 bg-bg rounded-lg border border-border p-1">
                    <button onClick={()=>setTradeAction('BUY')} className={`flex-1 text-xs py-1.5 rounded ${tradeAction==='BUY' ? 'bg-success text-black font-bold' : ''}`}>BUY</button>
                    <button onClick={()=>setTradeAction('SELL')} className={`flex-1 text-xs py-1.5 rounded ${tradeAction==='SELL' ? 'bg-destructive text-white font-bold' : ''}`}>SELL</button>
                  </div>
                </div>
                <div>
                  <label className="text-xs font-bold text-text-muted uppercase">Destination</label>
                  <select value={tradeBroker} onChange={e=>setTradeBroker(e.target.value)} className="w-full mt-1 bg-bg border border-border rounded-lg p-2 text-sm">
                    <option>Zerodha</option>
                    <option>Groww</option>
                    <option>Upstox</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="text-xs font-bold text-text-muted uppercase">Quantity</label>
                <input type="number" value={tradeQty} onChange={e=>setTradeQty(Number(e.target.value))} className="w-full mt-1 bg-bg border border-border rounded-lg p-2 text-sm tabular-nums" />
              </div>
            </div>

            <button onClick={handleSimulate} disabled={tradeLoading} className="btn-primary w-full py-3 flex justify-center items-center gap-2">
              {tradeLoading ? <span className="animate-spin text-white">↻</span> : 'Simulate Trade'}
            </button>
          </motion.div>
        </div>
      )}

    </div>
  );
}
