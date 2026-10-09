'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { getDashboardData, simulateTrade } from '@/lib/actions';
import { NormalizedHolding } from '@/lib/adapters';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, Tooltip } from 'recharts';
import { FloatingCard } from '@/components/ui/floating-card';

// Animated Counter component
function AnimatedNumber({ value, prefix = '' }: { value: number, prefix?: string }) {
  const [displayValue, setDisplayValue] = useState(value);
  const [color, setColor] = useState('text-foreground');

  useEffect(() => {
    if (value !== displayValue) {
      setColor(value > displayValue ? 'text-[var(--chart-2)]' : 'text-destructive');
      const timeout = setTimeout(() => setColor('text-foreground'), 1000);
      setDisplayValue(value);
      return () => clearTimeout(timeout);
    }
  }, [value, displayValue]);

  return (
    <span className={`transition-colors duration-300 ${color}`}>
      {prefix}{displayValue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
    </span>
  );
}

export default function Dashboard() {
  const [holdings, setHoldings] = useState<NormalizedHolding[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string | null>(null);
  const [highlightedRow, setHighlightedRow] = useState<string | null>(null);
  const [syncing, setSyncing] = useState(false);

  const fetchData = useCallback(async () => {
    try {
      const data = await getDashboardData();
      if (data.error) {
        // Fallback mock data if DB fails
        setHoldings([
          { id: '1', symbol: 'RELIANCE', isin: 'INE1', assetType: 'STOCK', quantity: 50, avgBuyPrice: 2400, currentPrice: 2950, broker: 'Zerodha', invested: 120000, value: 147500, pnl: 27500, pnlPercent: 22.9 },
          { id: '2', symbol: 'HDFCBANK', isin: 'INE2', assetType: 'STOCK', quantity: 100, avgBuyPrice: 1550, currentPrice: 1450, broker: 'Upstox', invested: 155000, value: 145000, pnl: -10000, pnlPercent: -6.4 },
        ]);
      } else if (data.holdings) {
        setHoldings(data.holdings);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
    // SSE or Polling mock
    const interval = setInterval(fetchData, 10000);
    return () => clearInterval(interval);
  }, [fetchData]);

  const handleSimulate = async () => {
    setSyncing(true);
    // Simulate trade (buy 10 Reliance)
    await simulateTrade('RELIANCE', 'Zerodha', 'BUY', 10, 2950);
    setHighlightedRow('RELIANCE');
    await fetchData();
    setTimeout(() => {
      setSyncing(false);
      setHighlightedRow(null);
    }, 2000);
  };

  const totalValue = holdings.reduce((sum, h) => sum + h.value, 0);
  const totalInvested = holdings.reduce((sum, h) => sum + (h.invested || 0), 0);
  const totalPnl = totalValue - totalInvested;

  const filteredHoldings = filter ? holdings.filter(h => h.broker === filter) : holdings;

  // Chart data
  const allocData = [
    { name: 'Stocks', value: holdings.filter(h => h.assetType === 'STOCK').reduce((s, h) => s + h.value, 0) },
    { name: 'Mutual Funds', value: 45000 },
    { name: 'Bonds', value: holdings.filter(h => h.assetType === 'BOND').reduce((s, h) => s + h.value, 0) },
  ].filter(d => d.value > 0);
  const COLORS = ['#3b82f6', '#10b981', '#8b5cf6'];

  const duplicateSymbols = Object.entries(
    holdings.reduce((acc, h) => {
      acc[h.symbol] = (acc[h.symbol] || new Set()).add(h.broker);
      return acc;
    }, {} as Record<string, Set<string>>)
  ).filter(([_, brokers]) => brokers.size > 1).map(([symbol]) => symbol);

  if (loading) {
    return (
      <div className="animate-pulse space-y-6">
        <div className="h-32 bg-card rounded-2xl"></div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="h-64 bg-card rounded-2xl col-span-1"></div>
          <div className="h-64 bg-card rounded-2xl col-span-2"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold">Portfolio Dashboard</h1>
          <p className="text-muted-foreground mt-1 flex items-center gap-2">
            <span className={`w-2 h-2 rounded-full ${syncing ? 'bg-emerald-400 animate-ping' : 'bg-blue-400'}`}></span>
            Live Sync {syncing && 'Active'}
          </p>
        </div>
        <button 
          onClick={handleSimulate}
          className="relative px-4 py-2 bg-primary hover:bg-primary/90 rounded-lg text-sm font-medium overflow-hidden"
        >
          {syncing && (
            <motion.div 
              initial={{ scale: 0, opacity: 0.5 }}
              animate={{ scale: 4, opacity: 0 }}
              transition={{ duration: 1 }}
              className="absolute inset-0 bg-white rounded-full"
            />
          )}
          Simulate a Trade
        </button>
      </div>

      {duplicateSymbols.length > 0 && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 rounded-xl bg-[var(--chart-5)]/10 border border-amber-500/20 flex items-start gap-3"
        >
          <svg className="w-5 h-5 text-[var(--chart-5)] mt-0.5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" /></svg>
          <div>
            <h4 className="text-[var(--chart-5)] font-medium text-sm">Duplicate Holdings Detected</h4>
            <p className="text-muted-foreground text-xs mt-1">You hold {duplicateSymbols.join(', ')} in multiple broker accounts. Consider consolidating them to reduce AMC fees.</p>
          </div>
        </motion.div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FloatingCard className="p-6">
          <p className="text-sm text-muted-foreground font-medium">Current Value</p>
          <h2 className="text-3xl font-bold mt-2">
            <AnimatedNumber value={totalValue} prefix="₹" />
          </h2>
        </FloatingCard>
        <FloatingCard className="p-6">
          <p className="text-sm text-muted-foreground font-medium">Total Invested</p>
          <h2 className="text-3xl font-bold mt-2 text-foreground/90">
            <AnimatedNumber value={totalInvested} prefix="₹" />
          </h2>
        </FloatingCard>
        <FloatingCard className="p-6">
          <p className="text-sm text-muted-foreground font-medium">Total P&L</p>
          <h2 className={`text-3xl font-bold mt-2 ${totalPnl >= 0 ? 'text-[var(--chart-2)]' : 'text-destructive'}`}>
            {totalPnl >= 0 ? '+' : ''}
            <AnimatedNumber value={totalPnl} prefix="₹" />
          </h2>
        </FloatingCard>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Allocation Donut */}
        <FloatingCard className="p-6 col-span-1 h-80 flex flex-col">
          <h3 className="font-semibold mb-4">Asset Allocation</h3>
          <div className="flex-1 -ml-6">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocData}
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                  animationBegin={200}
                  animationDuration={1000}
                >
                  {allocData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                  itemStyle={{ color: '#f8fafc' }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </FloatingCard>

        {/* Holdings Table */}
        <FloatingCard className="p-6 col-span-1 lg:col-span-2 overflow-hidden flex flex-col">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-semibold">Holdings</h3>
            <div className="flex gap-2">
              <button onClick={() => setFilter(null)} className={`px-3 py-1 rounded-full text-xs ${!filter ? 'bg-primary text-white' : 'bg-secondary text-foreground/90'}`}>All</button>
              <button onClick={() => setFilter('Zerodha')} className={`px-3 py-1 rounded-full text-xs ${filter === 'Zerodha' ? 'bg-primary text-white' : 'bg-secondary text-foreground/90'}`}>Zerodha</button>
              <button onClick={() => setFilter('Upstox')} className={`px-3 py-1 rounded-full text-xs ${filter === 'Upstox' ? 'bg-primary text-white' : 'bg-secondary text-foreground/90'}`}>Upstox</button>
            </div>
          </div>
          
          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left text-sm">
              <thead className="text-muted-foreground border-b border-border">
                <tr>
                  <th className="pb-3 font-medium">Asset</th>
                  <th className="pb-3 font-medium">Broker</th>
                  <th className="pb-3 font-medium text-right">Qty</th>
                  <th className="pb-3 font-medium text-right">Avg Price</th>
                  <th className="pb-3 font-medium text-right">Value</th>
                  <th className="pb-3 font-medium text-right">P&L</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50">
                <AnimatePresence mode="popLayout">
                  {filteredHoldings.map((h) => (
                    <motion.tr 
                      layout
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ 
                        opacity: 1, 
                        y: 0,
                        backgroundColor: highlightedRow === h.symbol ? 'rgba(16, 185, 129, 0.1)' : 'transparent'
                      }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      transition={{ duration: 0.4 }}
                      key={`${h.id}-${h.broker}`}
                      className="group"
                    >
                      <td className="py-4">
                        <p className="font-semibold">{h.symbol}</p>
                        <p className="text-xs text-foreground0">{h.assetType}</p>
                      </td>
                      <td className="py-4 text-muted-foreground">{h.broker}</td>
                      <td className="py-4 text-right">{h.quantity}</td>
                      <td className="py-4 text-right">{h.avgBuyPrice ? `₹${h.avgBuyPrice.toFixed(2)}` : 'Buy price needed'}</td>
                      <td className="py-4 text-right font-medium">₹{h.value.toLocaleString('en-IN')}</td>
                      <td className={`py-4 text-right ${!h.pnl ? 'text-foreground0' : h.pnl >= 0 ? 'text-[var(--chart-2)]' : 'text-destructive'}`}>
                        {h.pnl !== null ? (
                          <>
                            {h.pnl >= 0 ? '+' : ''}₹{h.pnl.toLocaleString('en-IN')}
                            <span className="block text-xs opacity-80">
                              {h.pnlPercent?.toFixed(2)}%
                            </span>
                          </>
                        ) : '-'}
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
          </div>
        </FloatingCard>
      </div>
    </div>
  );
}
