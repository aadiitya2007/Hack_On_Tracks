'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, BarChart, Bar, Cell, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer, ReferenceLine } from 'recharts';
import { getAvailableSymbols, getPriceHistory } from '@/lib/actions.time-machine';
import { calculateCAGR, calculateDrawdown, calculateCalendarReturns, calculateVolatility, PricePoint } from '@/lib/analytics';

export default function TimeMachineClient() {
  const [symbols, setSymbols] = useState<string[]>([]);
  const [selectedSymbol, setSelectedSymbol] = useState<string>('');
  const [amount, setAmount] = useState<number>(100000);
  const [startDate, setStartDate] = useState<string>('2012-01-01');
  const [endDate, setEndDate] = useState<string>('2022-01-11');
  const [isSip, setIsSip] = useState(false);
  
  const [loading, setLoading] = useState(false);
  const [rawPrices, setRawPrices] = useState<PricePoint[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getAvailableSymbols().then(syms => {
      setSymbols(syms);
      if (syms.length > 0) setSelectedSymbol('TCS'); // Default fallback
    });
  }, []);

  const handleSimulate = async () => {
    if (!selectedSymbol) return;
    setLoading(true);
    setError(null);
    try {
      const data = await getPriceHistory(selectedSymbol, startDate, endDate);
      if (data.length < 30) {
        setError("Too short a period. Need at least 30 trading days of data.");
        setRawPrices([]);
      } else {
        setRawPrices(data.map((d: any) => ({ date: new Date(d.date), price: d.price })));
      }
    } catch (e) {
      setError("Failed to fetch historical data.");
    }
    setLoading(false);
  };

  // Run automatically when symbol changes if dates are valid
  useEffect(() => {
    if (selectedSymbol) handleSimulate();
  }, [selectedSymbol]);

  // Derived Analytics
  const { growthData, drawdownData, calendarData, metrics } = useMemo(() => {
    if (rawPrices.length === 0) return { growthData: [], drawdownData: [], calendarData: [], metrics: null };

    const first = rawPrices[0];
    const last = rawPrices[rawPrices.length - 1];
    const years = (last.date.getTime() - first.date.getTime()) / (1000 * 60 * 60 * 24 * 365);
    
    // Simulate Growth
    let totalInvested = amount;
    let finalValue = 0;
    const gData = [];
    const dData = [];
    
    if (isSip) {
      // Very basic Monthly SIP simulation approximation
      let accumulatedUnits = 0;
      let investedSoFar = 0;
      let lastMonth = -1;
      
      for (const p of rawPrices) {
        const currentMonth = p.date.getMonth();
        if (currentMonth !== lastMonth) {
          accumulatedUnits += amount / p.price;
          investedSoFar += amount;
          lastMonth = currentMonth;
        }
        const currentValue = accumulatedUnits * p.price;
        gData.push({ date: p.date.toISOString().split('T')[0], value: currentValue, invested: investedSoFar });
      }
      totalInvested = investedSoFar;
      finalValue = gData[gData.length - 1].value;
    } else {
      // Lump Sum
      const shares = amount / first.price;
      let peak = amount;
      for (const p of rawPrices) {
        const val = shares * p.price;
        if (val > peak) peak = val;
        
        gData.push({ date: p.date.toISOString().split('T')[0], value: val, invested: amount });
        dData.push({ date: p.date.toISOString().split('T')[0], drawdown: ((val - peak) / peak) * 100 });
      }
      finalValue = shares * last.price;
    }

    const absReturn = finalValue - totalInvested;
    const pctReturn = (absReturn / totalInvested) * 100;
    const cagr = calculateCAGR(totalInvested, finalValue, years) * 100;
    
    // Risk Metrics
    const dd = calculateDrawdown(rawPrices);
    const vol = calculateVolatility(rawPrices) * 100;
    const calReturns = calculateCalendarReturns(rawPrices).map(c => ({...c, returnPct: c.returnPct * 100}));

    return {
      growthData: gData,
      drawdownData: dData,
      calendarData: calReturns,
      metrics: {
        totalInvested, finalValue, absReturn, pctReturn, cagr, 
        maxDrawdown: dd.maxDrawdown * 100,
        volatility: vol,
        startDate: first.date.toISOString().split('T')[0],
        endDate: last.date.toISOString().split('T')[0]
      }
    };
  }, [rawPrices, amount, isSip]);

  return (
    <div className="flex flex-col lg:flex-row gap-6 max-w-7xl mx-auto">
      {/* Left Panel: Controls */}
      <div className="w-full lg:w-80 flex flex-col gap-6 shrink-0">
        <div className="card p-6 sticky top-24">
          <h2 className="text-lg font-bold mb-6 flex items-center gap-2">
            <span className="w-8 h-8 rounded bg-accent/20 text-accent flex items-center justify-center">⚙️</span>
            Time Machine Setup
          </h2>
          
          <div className="space-y-5">
            <div>
              <label className="text-xs font-bold text-text-muted uppercase mb-1.5 block">Asset Class</label>
              <select className="w-full bg-bg border border-border rounded-lg p-2.5 text-sm font-medium" disabled>
                <option>Indian Equities (Stocks)</option>
              </select>
              <p className="text-[10px] text-text-muted mt-1">Only Stocks are available in this historical dataset.</p>
            </div>

            <div>
              <label className="text-xs font-bold text-text-muted uppercase mb-1.5 block">Symbol</label>
              <select 
                value={selectedSymbol} 
                onChange={e => setSelectedSymbol(e.target.value)}
                className="w-full bg-bg border border-border rounded-lg p-2.5 text-sm font-medium"
              >
                <option value="">Select Symbol...</option>
                {symbols.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-text-muted uppercase mb-1.5 block">Start Date</label>
                <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} className="w-full bg-bg border border-border rounded-lg p-2 text-sm" />
              </div>
              <div>
                <label className="text-xs font-bold text-text-muted uppercase mb-1.5 block">End Date</label>
                <input type="date" value={endDate} onChange={e=>setEndDate(e.target.value)} className="w-full bg-bg border border-border rounded-lg p-2 text-sm" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-text-muted uppercase mb-1.5 block">Investment Amount (₹)</label>
              <input type="number" value={amount} onChange={e=>setAmount(Number(e.target.value))} className="w-full bg-bg border border-border rounded-lg p-2.5 text-sm font-bold tabular-nums" />
            </div>

            <div>
              <label className="text-xs font-bold text-text-muted uppercase mb-1.5 block">Mode</label>
              <div className="flex bg-bg rounded-lg border border-border p-1">
                <button onClick={()=>setIsSip(false)} className={`flex-1 text-xs py-1.5 rounded-md font-bold transition-all ${!isSip ? 'bg-surface shadow-sm text-text-primary' : 'text-text-muted'}`}>Lump Sum</button>
                <button onClick={()=>setIsSip(true)} className={`flex-1 text-xs py-1.5 rounded-md font-bold transition-all ${isSip ? 'bg-surface shadow-sm text-text-primary' : 'text-text-muted'}`}>Monthly SIP</button>
              </div>
            </div>

            <button onClick={handleSimulate} disabled={loading} className="btn-primary w-full mt-2">
              {loading ? 'Simulating...' : 'Run Simulation'}
            </button>
            <p className="text-[9px] text-text-muted text-center mt-2 leading-relaxed">Past performance does not guarantee future results. Educational, not investment advice. Prices are unadjusted for splits/dividends.</p>
          </div>
        </div>
      </div>

      {/* Right Panel: Results */}
      <div className="flex-1 flex flex-col gap-6 min-w-0">
        {error ? (
          <div className="card p-10 flex flex-col items-center justify-center text-center h-64 border-loss/30 bg-loss-bg">
            <p className="text-loss font-bold mb-2">Simulation Failed</p>
            <p className="text-sm text-loss/80">{error}</p>
          </div>
        ) : !metrics ? (
          <div className="card p-10 flex items-center justify-center h-64">
            <p className="text-text-muted font-medium animate-pulse">Select a symbol to travel back in time...</p>
          </div>
        ) : (
          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
            
            {/* Header Result */}
            <div className="card p-8 bg-surface border-t-4 border-t-accent">
              <h1 className="text-2xl md:text-3xl font-light text-text-primary leading-tight">
                If you had invested <strong className="font-bold">₹{metrics.totalInvested.toLocaleString('en-IN')}</strong> in <strong className="text-accent font-bold">{selectedSymbol}</strong> on {metrics.startDate}, it would be worth...
              </h1>
              <div className="mt-6 flex flex-wrap items-baseline gap-4">
                <span className={`text-5xl font-extrabold tracking-tight tabular-nums ${metrics.absReturn >= 0 ? 'text-gain' : 'text-loss'}`}>
                  ₹{metrics.finalValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}
                </span>
                <span className={`px-3 py-1 rounded-full text-sm font-bold ${metrics.absReturn >= 0 ? 'bg-gain-bg text-gain' : 'bg-loss-bg text-loss'}`}>
                  {metrics.absReturn >= 0 ? '▲' : '▼'} {metrics.pctReturn.toFixed(2)}% Total
                </span>
              </div>
              <p className="text-sm text-text-muted mt-3">Data ending on {metrics.endDate}.</p>
            </div>

            {/* Metrics Grid */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="card p-5">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">CAGR</p>
                <p className={`text-xl font-bold tabular-nums ${metrics.cagr >= 0 ? 'text-gain' : 'text-loss'}`}>{metrics.cagr.toFixed(2)}%</p>
              </div>
              <div className="card p-5">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Max Drawdown</p>
                <p className="text-xl font-bold tabular-nums text-loss">-{metrics.maxDrawdown.toFixed(2)}%</p>
              </div>
              <div className="card p-5">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Volatility (Ann.)</p>
                <p className="text-xl font-bold tabular-nums text-text-primary">{metrics.volatility.toFixed(2)}%</p>
              </div>
              <div className="card p-5">
                <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">Total Invested</p>
                <p className="text-xl font-bold tabular-nums text-text-primary">₹{metrics.totalInvested.toLocaleString('en-IN')}</p>
              </div>
            </div>

            {/* Main Growth Chart */}
            <div className="card p-6 h-[350px] flex flex-col">
              <h3 className="font-bold text-sm mb-4">Investment Growth Over Time</h3>
              <div className="flex-1 min-h-0">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={growthData} margin={{ top: 10, right: 10, left: 20, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                    <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} minTickGap={50} />
                    <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v)=>`₹${(v/1000).toFixed(0)}k`} />
                    <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text-primary)' }} itemStyle={{ color: 'var(--accent)', fontWeight: 'bold' }} />
                    <ReferenceLine y={metrics.totalInvested} stroke="var(--text-muted)" strokeDasharray="3 3" label={{ position: 'insideTopLeft', value: 'Amount Invested', fill: 'var(--text-muted)', fontSize: 10 }} />
                    <Area type="monotone" dataKey="value" name="Portfolio Value" stroke="var(--accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorVal)" isAnimationActive={false} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Bottom Row Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Drawdown Chart */}
              {!isSip && (
                <div className="card p-6 h-[280px] flex flex-col">
                  <h3 className="font-bold text-sm mb-4">Drawdown Profile (Pain Index)</h3>
                  <div className="flex-1 min-h-0">
                    <ResponsiveContainer width="100%" height="100%">
                      <AreaChart data={drawdownData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                        <defs>
                          <linearGradient id="colorLoss" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="var(--loss)" stopOpacity={0.3}/>
                            <stop offset="95%" stopColor="var(--loss)" stopOpacity={0}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                        <XAxis dataKey="date" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} minTickGap={50} />
                        <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v)=>`${v.toFixed(0)}%`} domain={['auto', 0]} />
                        <Tooltip contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text-primary)' }} itemStyle={{ color: 'var(--loss)', fontWeight: 'bold' }} />
                        <Area type="monotone" dataKey="drawdown" name="Drawdown %" stroke="var(--loss)" strokeWidth={2} fillOpacity={1} fill="url(#colorLoss)" isAnimationActive={false} />
                      </AreaChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Calendar Year Returns */}
              <div className={`card p-6 h-[280px] flex flex-col ${isSip ? 'lg:col-span-2' : ''}`}>
                <h3 className="font-bold text-sm mb-4">Calendar Year Returns</h3>
                <div className="flex-1 min-h-0">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={calendarData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                      <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                      <XAxis dataKey="year" stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} />
                      <YAxis stroke="var(--text-muted)" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(v)=>`${v.toFixed(0)}%`} />
                      <Tooltip 
                        contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text-primary)' }}
                        cursor={{fill: 'var(--surface-hover)'}}
                      />
                      <Bar dataKey="returnPct" name="Return %" isAnimationActive={false}>
                        {calendarData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.returnPct >= 0 ? 'var(--gain)' : 'var(--loss)'} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </div>
            </div>

          </motion.div>
        )}
      </div>
    </div>
  );
}
