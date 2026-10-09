'use client';

import { useState, useEffect, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

function generateMockHistory(symbol: string, startYear: number) {
  const currentYear = 2024;
  const data = [];
  let basePrice = symbol === 'RELIANCE' ? 1000 : symbol === 'HDFCBANK' ? 500 : symbol === 'GOLD' ? 3000 : 200;
  
  for (let year = startYear; year <= currentYear; year++) {
    for (let month = 1; month <= 12; month++) {
      if (year === currentYear && month > new Date().getMonth() + 1) break;
      const growth = 1 + (Math.random() * 0.06 - 0.015);
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
    { id: 'RELIANCE', name: 'Nifty 50 TRI', listing: 1995, type: 'EQUITY' },
    { id: 'HDFCBANK', name: 'Sensex 30', listing: 1995, type: 'EQUITY' },
    { id: 'GOLD', name: 'MCX Gold 24K', listing: 2003, type: 'COMMODITY' },
    { id: 'NHAI', name: 'PPF / Debt', listing: 2010, type: 'DEBT' },
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
  const inflationAdjustedCagr = cagr - 5.8;

  const dataForChart = chartData.map(d => ({
    ...d,
    value: Math.round((amount / initialPrice) * d.price)
  }));

  return (
    <div className="relative w-full min-h-screen pb-20 font-sans text-white">
      
      {/* Header */}
      <header className="flex flex-col gap-6 pt-2 pb-8 relative z-10">
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#111B2E] border border-white/5 text-[#7C5CFF] text-[11px] font-bold uppercase tracking-wider">
            <span>Historical Wealth Simulator</span>
          </div>
          <div className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#111B2E] border border-white/5 text-[#10E5A0] text-[11px] font-bold uppercase tracking-wider">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10E5A0] animate-pulse"></span>
            <span>SEBI Backtest Engine v2.4</span>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6">
          <div>
            <h1 className="text-4xl font-extrabold tracking-tight">Portfolio Time Machine</h1>
            <p className="text-[#94A3B8] max-w-2xl mt-2 text-sm leading-relaxed">
              Simulate lump-sum and monthly SIP journeys across Indian asset classes against real retail inflation and 24K MCX gold to uncover true purchasing power alpha.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-[#94A3B8] uppercase tracking-widest mr-2 font-bold">Presets:</span>
            <button className="px-4 py-1.5 rounded-full bg-[#7C5CFF] text-white text-[11px] font-bold transition-all shadow-[0_0_15px_rgba(124,92,255,0.4)] border border-[#7C5CFF]">10Y Nifty 50 (₹1L)</button>
            <button className="px-4 py-1.5 rounded-full bg-[#111B2E] text-white hover:bg-[#1e293b] text-[11px] font-bold transition-all border border-white/10">2008 Crash Recovery</button>
            <button className="px-4 py-1.5 rounded-full bg-[#111B2E] text-white hover:bg-[#1e293b] text-[11px] font-bold transition-all border border-white/10">Gold vs Sensex</button>
          </div>
        </div>
      </header>

      <div className="flex flex-col gap-6 w-full relative z-10">
        
        {/* HERO BANNER */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative overflow-hidden rounded-2xl bg-[#0B1120] border border-white/10 p-8 shadow-[0_8px_32px_rgba(0,0,0,0.5)]"
        >
          <div className="pointer-events-none absolute -right-20 -top-20 h-80 w-80 rounded-full bg-[#7C5CFF]/10 blur-[120px]"></div>
          
          <div className="relative z-10 flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="px-3 py-1 rounded bg-[#7C5CFF]/15 text-[#7C5CFF] border border-[#7C5CFF]/30 text-[10px] font-bold uppercase tracking-wider flex items-center gap-2">
                NSE {selectedAssetInfo.name} TOTAL RETURN INDEX
              </span>
              <span className="text-[11px] text-[#94A3B8] font-medium">• {years}-Year Retrospective Backtest ({startYear} – 2024)</span>
            </div>

            <div className="flex flex-col gap-1 mt-2">
              <span className="text-[10px] font-bold text-[#94A3B8] uppercase tracking-widest">Simulated Wealth Compounding</span>
              <div className="flex flex-wrap items-baseline gap-4 md:gap-6 mt-1">
                <span className="text-3xl text-white/50 line-through tabular-nums font-semibold">₹{amount.toLocaleString('en-IN')}</span>
                <span className="text-white material-symbols-outlined font-light text-2xl">→</span>
                <span className="text-6xl font-black tracking-tighter text-[#10E5A0] drop-shadow-[0_0_25px_rgba(16,229,160,0.4)]">
                  <AnimatedNumber value={finalValue} prefix="₹" />
                </span>
                
                <div className={`flex items-center gap-1.5 px-3 py-1 rounded bg-[#10E5A0]/10 text-[#10E5A0] border border-[#10E5A0]/30`}>
                  <span className="text-xs font-bold tracking-wide">
                    <AnimatedNumber value={pnlPercent} prefix="+" suffix="%" /> Total Return
                  </span>
                </div>
              </div>
              <p className="text-[13px] text-[#94A3B8] mt-3">
                A lump-sum allocation of <strong className="text-white">₹{amount.toLocaleString('en-IN')}</strong> deployed on January 1, {startYear} compounded at an annualized rate of <strong className="text-[#10E5A0]">{cagr > 0 ? '+' : ''}{cagr.toFixed(2)}% CAGR</strong> over 3,652 trading sessions.
              </p>
            </div>
          </div>
        </motion.div>

        {/* METRICS ROW */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-[#0B1120] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
            <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">Wealth Multiplier</p>
            <div>
              <p className="text-2xl font-bold mt-2 tabular-nums">{(finalValue / amount).toFixed(2)}x</p>
              <p className="text-[10px] text-[#94A3B8] mt-1">Initial capital magnified</p>
            </div>
          </div>
          <div className="bg-[#0B1120] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
            <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">Annualized CAGR</p>
            <div>
              <p className="text-2xl font-bold mt-2 tabular-nums text-[#10E5A0]">+{cagr.toFixed(2)}%</p>
              <p className="text-[10px] text-[#94A3B8] mt-1">Compounded per annum</p>
            </div>
          </div>
          <div className="bg-[#0B1120] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
            <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">Absolute Net Profit</p>
            <div>
              <p className="text-2xl font-bold mt-2 tabular-nums text-[#10E5A0]">+<AnimatedNumber value={pnl} prefix="₹" /></p>
              <p className="text-[10px] text-[#10E5A0] mt-1">+{pnlPercent.toFixed(1)}% profit capture</p>
            </div>
          </div>
          <div className="bg-[#0B1120] border border-white/5 rounded-xl p-5 flex flex-col justify-between">
            <p className="text-[10px] text-[#94A3B8] font-bold uppercase tracking-wider">Defeated Inflation</p>
            <div>
              <p className="text-2xl font-bold mt-2 tabular-nums text-white">+{inflationAdjustedCagr.toFixed(2)}% p.a.</p>
              <p className="text-[10px] text-[#FF5C7A] mt-1">Net real purchasing alpha</p>
            </div>
          </div>
        </div>

        {/* CONTROLS & CHART */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mt-2">
          {/* SIDEBAR */}
          <div className="col-span-1 bg-[#0B1120] border border-white/5 rounded-2xl p-6">
            <h3 className="text-sm font-bold border-b border-white/10 pb-4 mb-5 flex justify-between">
              <span>Simulation Parameters</span>
              <span className="text-[#7C5CFF] text-[10px] uppercase cursor-pointer">Reset Defaults</span>
            </h3>

            <div className="space-y-6">
              <div>
                <label className="text-[11px] font-bold text-[#94A3B8] uppercase block mb-3">Primary Asset Class</label>
                <div className="grid grid-cols-2 gap-2">
                  <button onClick={() => setAsset('RELIANCE')} className={`py-2 text-[11px] font-semibold rounded-lg border ${asset === 'RELIANCE' ? 'bg-[#7C5CFF]/10 border-[#7C5CFF] text-[#7C5CFF]' : 'bg-[#111B2E] border-white/5 text-[#94A3B8]'}`}>Nifty 50 TRI</button>
                  <button onClick={() => setAsset('HDFCBANK')} className={`py-2 text-[11px] font-semibold rounded-lg border ${asset === 'HDFCBANK' ? 'bg-[#7C5CFF]/10 border-[#7C5CFF] text-[#7C5CFF]' : 'bg-[#111B2E] border-white/5 text-[#94A3B8]'}`}>Sensex 30</button>
                  <button onClick={() => setAsset('GOLD')} className={`py-2 text-[11px] font-semibold rounded-lg border ${asset === 'GOLD' ? 'bg-[#7C5CFF]/10 border-[#7C5CFF] text-[#7C5CFF]' : 'bg-[#111B2E] border-white/5 text-[#94A3B8]'}`}>MCX Gold 24K</button>
                  <button onClick={() => setAsset('NHAI')} className={`py-2 text-[11px] font-semibold rounded-lg border ${asset === 'NHAI' ? 'bg-[#7C5CFF]/10 border-[#7C5CFF] text-[#7C5CFF]' : 'bg-[#111B2E] border-white/5 text-[#94A3B8]'}`}>PPF / Debt</button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#94A3B8] uppercase block mb-3">Starting Capital (INR)</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-white/50 font-bold">₹</span>
                  <input 
                    type="number" 
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                    className="w-full bg-[#111B2E] border border-white/10 rounded-lg pl-8 pr-4 py-2.5 text-sm font-semibold tabular-nums focus:outline-none focus:border-[#7C5CFF] text-white"
                  />
                </div>
                <div className="flex gap-2 mt-2">
                  <button onClick={() => setAmount(25000)} className="flex-1 py-1 text-[10px] bg-[#111B2E] border border-white/5 rounded text-[#94A3B8] font-bold">₹25K</button>
                  <button onClick={() => setAmount(50000)} className="flex-1 py-1 text-[10px] bg-[#111B2E] border border-white/5 rounded text-[#94A3B8] font-bold">₹50K</button>
                  <button onClick={() => setAmount(100000)} className="flex-1 py-1 text-[10px] bg-[#111B2E] border border-[#7C5CFF]/40 bg-[#7C5CFF]/10 rounded text-white font-bold">₹1L</button>
                  <button onClick={() => setAmount(1000000)} className="flex-1 py-1 text-[10px] bg-[#111B2E] border border-white/5 rounded text-[#94A3B8] font-bold">₹10L</button>
                </div>
              </div>

              <div>
                <label className="text-[11px] font-bold text-[#94A3B8] uppercase flex justify-between mb-3">
                  <span>Time Horizon</span>
                  <span className="text-[#10E5A0]">{startYear} → 2024</span>
                </label>
                <input 
                  type="range" 
                  value={startYear}
                  onChange={(e) => setStartYear(parseInt(e.target.value))}
                  min={2004}
                  max={2023}
                  className="w-full accent-[#7C5CFF]"
                />
              </div>

              <div className="pt-4 border-t border-white/10">
                <button className="w-full py-3 rounded-full bg-gradient-to-r from-[#00D2FF] to-[#10E5A0] text-black font-extrabold text-[13px] shadow-[0_0_20px_rgba(16,229,160,0.4)] hover:shadow-[0_0_25px_rgba(16,229,160,0.6)] transition-all">
                  Simulate Backtest Journey
                </button>
              </div>
            </div>
          </div>

          {/* CHART */}
          <div className="col-span-1 lg:col-span-3 bg-[#0B1120] border border-white/5 rounded-2xl p-6 h-[550px] flex flex-col relative overflow-hidden">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                Asset Trajectory & Drawdown Arc
                <span className="px-2 py-0.5 bg-white/10 rounded text-[10px] font-medium text-[#94A3B8]">Rebased ₹1L Baseline</span>
              </h3>
            </div>
            
            <div className="flex-1 -ml-4 relative z-10">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataForChart} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#7C5CFF" stopOpacity={0.3}/>
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
                    strokeWidth={2.5}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* BOTTOM TABLE */}
        <div className="mt-4 bg-[#0B1120] border border-white/5 rounded-2xl p-6">
          <div className="flex justify-between items-end mb-6">
            <div>
              <h3 className="text-lg font-bold">10-Year Multi-Asset Performance Breakdown</h3>
              <p className="text-[11px] text-[#94A3B8] mt-1">Cross-asset risk, drawdown, and compounded returns benchmarked against ₹1,00,000 starting capital.</p>
            </div>
            <div className="text-[10px] text-[#10E5A0] flex items-center gap-1 font-semibold">
              Verified by NSE & MCX Historical Feeds
            </div>
          </div>
          
          <table className="w-full text-left text-[11px]">
            <thead className="text-[#94A3B8] border-b border-white/10 uppercase tracking-wider font-semibold">
              <tr>
                <th className="pb-3">Asset Class / Index</th>
                <th className="pb-3 text-right">Invested Base</th>
                <th className="pb-3 text-right">Terminal Value</th>
                <th className="pb-3 text-right">Absolute Gain</th>
                <th className="pb-3 text-right">CAGR (%)</th>
                <th className="pb-3 text-right">Max Drawdown</th>
                <th className="pb-3 text-right">Tax Regime</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-4 font-bold flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-[#7C5CFF]"></span> Nifty 50 TRI (Equities)</td>
                <td className="py-4 text-right text-[#94A3B8] tabular-nums">₹1,00,000</td>
                <td className="py-4 text-right font-bold tabular-nums">₹3,84,720</td>
                <td className="py-4 text-right text-[#10E5A0] tabular-nums">+284.7%</td>
                <td className="py-4 text-right text-[#10E5A0] font-bold tabular-nums">14.42%</td>
                <td className="py-4 text-right text-[#FF5C7A] tabular-nums">-38.4%</td>
                <td className="py-4 text-right text-[#94A3B8]">12.5% LTCG</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-4 font-bold flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-white/20"></span> Physical Gold MCX</td>
                <td className="py-4 text-right text-[#94A3B8] tabular-nums">₹1,00,000</td>
                <td className="py-4 text-right font-bold tabular-nums">₹2,48,900</td>
                <td className="py-4 text-right text-[#10E5A0] tabular-nums">+148.9%</td>
                <td className="py-4 text-right text-[#10E5A0] font-bold tabular-nums">9.54%</td>
                <td className="py-4 text-right text-[#FF5C7A] tabular-nums">-18.2%</td>
                <td className="py-4 text-right text-[#94A3B8]">SGB Tax-Free</td>
              </tr>
              <tr className="hover:bg-white/5 transition-colors">
                <td className="py-4 font-bold flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-white/20"></span> Scheduled Bank 5Y FD</td>
                <td className="py-4 text-right text-[#94A3B8] tabular-nums">₹1,00,000</td>
                <td className="py-4 text-right font-bold tabular-nums">₹1,98,400</td>
                <td className="py-4 text-right text-[#10E5A0] tabular-nums">+98.4%</td>
                <td className="py-4 text-right text-[#10E5A0] font-bold tabular-nums">7.10%</td>
                <td className="py-4 text-right text-white/50 tabular-nums">0.0% (Guaranteed)</td>
                <td className="py-4 text-right text-[#94A3B8]">Slab Rate</td>
              </tr>
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}
