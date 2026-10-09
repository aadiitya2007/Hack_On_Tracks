'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function generateMockHistory(symbol: string, startYear: number) {
  const currentYear = 2024;
  const data = [];
  let basePrice = symbol === 'RELIANCE' ? 1000 : symbol === 'HDFCBANK' ? 500 : symbol === 'GOLD' ? 3000 : 200;
  
  for (let year = startYear; year <= currentYear; year++) {
    for (let month = 1; month <= 12; month++) {
      if (year === currentYear && month > new Date().getMonth() + 1) break;
      const growth = 1 + (Math.random() * 0.08 - 0.02);
      basePrice = basePrice * growth;
      data.push({
        date: `${year}-${month.toString().padStart(2, '0')}`,
        price: basePrice,
      });
    }
  }
  return data;
}

function AnimatedNumber({ value, prefix = '', suffix = '' }: { value: number, prefix?: string, suffix?: string }) {
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

  return <span className="tabular-nums">{prefix}{Math.round(displayValue).toLocaleString('en-IN')}{suffix}</span>;
}

export default function TimeMachine() {
  const [asset, setAsset] = useState('RELIANCE');
  const [startYear, setStartYear] = useState(2014);
  const [amount, setAmount] = useState(100000);
  const [chartData, setChartData] = useState<{date: string, price: number}[]>([]);

  const assets = [
    { id: 'RELIANCE', name: 'Reliance Industries (Equities)', listing: 1995, type: 'EQUITY' },
    { id: 'HDFCBANK', name: 'HDFC Bank (Equities)', listing: 1995, type: 'EQUITY' },
    { id: 'GOLD', name: '24K MCX Gold (Commodity)', listing: 2003, type: 'COMMODITY' },
    { id: 'NHAI', name: 'NHAI Bonds (Debt)', listing: 2010, type: 'DEBT' },
  ];

  const selectedAssetInfo = assets.find(a => a.id === asset)!;

  useEffect(() => {
    setChartData(generateMockHistory(asset, startYear));
  }, [asset, startYear]);

  const initialPrice = chartData[0]?.price || 1;
  const finalPrice = chartData[chartData.length - 1]?.price || 1;
  const units = amount / initialPrice;
  const finalValue = units * finalPrice;
  const pnl = finalValue - amount;
  const pnlPercent = (pnl / amount) * 100;
  
  const years = 2024 - startYear || 1;
  const cagr = (Math.pow((finalValue / amount), (1 / years)) - 1) * 100;

  const dataForChart = chartData.map(d => ({
    ...d,
    value: Math.round((amount / initialPrice) * d.price)
  }));

  return (
    <div className="relative w-full min-h-screen pb-20 overflow-hidden font-sans">
      {/* Top Ambient Glow Aura */}
      <div className="pointer-events-none absolute -top-12 left-1/4 h-72 w-96 rounded-full bg-primary/10 blur-[120px]"></div>
      <div className="pointer-events-none absolute top-20 right-10 h-80 w-80 rounded-full bg-secondary/10 blur-[140px]"></div>
      
      <header className="flex flex-col gap-6 pt-10 pb-8 relative z-10">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-card/80 border border-border text-primary text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              <span>Historical Wealth Simulator</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-card/50 border border-border text-muted-foreground text-xs font-semibold uppercase tracking-wider backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              <span>SEBI Backtest Engine v2.4</span>
            </div>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl md:text-5xl font-bold text-foreground tracking-tight">Portfolio Time Machine</h1>
            <p className="text-muted-foreground max-w-3xl mt-2 text-lg">
              Simulate lump-sum journeys across Indian asset classes to uncover true purchasing power alpha.
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest mr-2">Presets:</span>
            <button onClick={() => { setAsset('RELIANCE'); setStartYear(2014); setAmount(100000); }} className="px-4 py-1.5 rounded-full bg-primary/20 text-primary hover:bg-primary/30 text-xs font-semibold transition-all border border-primary/30">10Y Equities</button>
            <button onClick={() => { setAsset('GOLD'); setStartYear(2010); setAmount(500000); }} className="px-4 py-1.5 rounded-full bg-card text-foreground hover:bg-secondary text-xs font-semibold transition-all border border-border">Gold vs Inflation</button>
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-8 w-full relative z-10">
        {/* HUGE BOLD HEADLINE HERO OUTCOME BANNER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-card via-[#0b1120] to-[#070b14] backdrop-blur-2xl p-8 shadow-2xl border border-border/50"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-primary/10 blur-[130px]"></div>
          
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-primary/10 text-primary border border-primary/20 text-xs font-bold uppercase tracking-wider flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/></svg>
                  {selectedAssetInfo.name}
                </span>
                <span className="text-sm text-muted-foreground font-medium">• {years}-Year Retrospective Backtest ({startYear} – 2024)</span>
              </div>
            </div>

            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pt-2">
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-muted-foreground uppercase tracking-widest">Simulated Wealth Compounding</span>
                <div className="flex flex-wrap items-baseline gap-4 md:gap-6">
                  <span className="text-2xl md:text-3xl text-muted-foreground/60 line-through tabular-nums font-semibold">₹{amount.toLocaleString('en-IN')}</span>
                  <svg className="w-6 h-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                  <span className="text-5xl md:text-7xl font-black tracking-tighter text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-400 to-[#10E5A0]">
                    <AnimatedNumber value={finalValue} prefix="₹" />
                  </span>
                  
                  <div className={`flex items-center gap-1.5 px-4 py-1.5 rounded-full border ${pnl >= 0 ? 'bg-[#10E5A0]/10 text-[#10E5A0] border-[#10E5A0]/30 shadow-[0_0_16px_rgba(16,229,160,0.2)]' : 'bg-[#FF5C7A]/10 text-[#FF5C7A] border-[#FF5C7A]/30'}`}>
                    <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d={pnl >= 0 ? "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" : "M13 17h8m0 0v-8m0 8l-8-8-4 4-6-6"} /></svg>
                    <span className="text-sm font-bold tracking-wide">
                      <AnimatedNumber value={pnlPercent} prefix={pnl >= 0 ? '+' : ''} suffix="%" /> Total Return
                    </span>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  A lump-sum allocation of <strong className="text-foreground">₹{amount.toLocaleString('en-IN')}</strong> deployed on Jan 1, {startYear} compounded at an annualized rate of <strong className={pnl >= 0 ? 'text-[#10E5A0]' : 'text-[#FF5C7A]'}>{cagr > 0 ? '+' : ''}{cagr.toFixed(2)}% CAGR</strong>.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Controls and Graph */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="col-span-1 space-y-6"
          >
            <div className="bg-card/50 backdrop-blur-xl border border-border/50 rounded-2xl p-6">
              <h3 className="font-bold text-lg mb-6">Parameters</h3>
              
              <div className="space-y-6">
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Asset Class</label>
                  <select 
                    value={asset}
                    onChange={(e) => {
                      setAsset(e.target.value);
                      const newAsset = assets.find(a => a.id === e.target.value)!;
                      if (startYear < newAsset.listing) setStartYear(newAsset.listing);
                    }}
                    className="w-full bg-[#070b14] border border-border/80 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-inner appearance-none"
                  >
                    {assets.map(a => (
                      <option key={a.id} value={a.id}>{a.name}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <div className="flex justify-between items-center mb-3">
                    <label className="text-xs font-bold uppercase tracking-wider text-muted-foreground">Entry Year</label>
                    <span className="text-primary font-bold">{startYear}</span>
                  </div>
                  <input 
                    type="range" 
                    value={startYear}
                    onChange={(e) => {
                      let year = parseInt(e.target.value);
                      if (year < selectedAssetInfo.listing) year = selectedAssetInfo.listing;
                      setStartYear(year);
                    }}
                    min={selectedAssetInfo.listing}
                    max={2026}
                    className="w-full accent-primary"
                  />
                  <p className="text-[10px] font-medium text-muted-foreground mt-2 text-right">Earliest data: {selectedAssetInfo.listing}</p>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-3">Capital Deployed (₹)</label>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    step="50000"
                    min="1000"
                    className="w-full bg-[#070b14] border border-border/80 rounded-xl px-4 py-3 text-sm font-semibold tabular-nums focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary shadow-inner"
                  />
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="col-span-1 lg:col-span-3 h-[500px]"
          >
            <div className="bg-card/30 backdrop-blur-md border border-border/50 rounded-2xl p-6 h-full flex flex-col relative overflow-hidden">
              <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-primary/5 to-transparent pointer-events-none"></div>
              
              <div className="flex justify-between items-center mb-6 relative z-10">
                <h3 className="font-bold text-lg">Value Trajectory</h3>
              </div>
              
              <div className="flex-1 -ml-4 relative z-10">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={dataForChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <defs>
                      <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#7C5CFF" stopOpacity={0.4}/>
                        <stop offset="95%" stopColor="#7C5CFF" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#475569" fontSize={11} tickMargin={12} minTickGap={40} axisLine={false} tickLine={false} />
                    <YAxis stroke="#475569" fontSize={11} tickFormatter={(val) => `₹${(val/100000).toFixed(1)}L`} axisLine={false} tickLine={false} />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#0B1120', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}
                      itemStyle={{ color: '#FFFFFF', fontWeight: 600 }}
                      formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Portfolio Value']}
                      labelStyle={{ color: '#94A3B8', fontSize: '12px', marginBottom: '4px' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="value" 
                      stroke="#7C5CFF" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorValue)" 
                      animationDuration={1500}
                      animationEasing="ease-out"
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
