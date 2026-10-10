'use client';

import { useState, useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';

const ASSETS = [
  { id: 'NIFTY', name: 'NIFTY 50 (Equity)', cagr: 0.14, color: 'var(--accent)' },
  { id: 'GOLD', name: 'Physical Gold', cagr: 0.08, color: 'var(--asset-funds)' },
  { id: 'FD', name: 'Bank FD', cagr: 0.06, color: 'var(--asset-cash)' },
];

export default function TimeMachineClient() {
  const [assetId, setAssetId] = useState('NIFTY');
  const [amount, setAmount] = useState(100000);
  const [startYear, setStartYear] = useState(2014);
  const currentYear = 2024;

  const selectedAsset = ASSETS.find(a => a.id === assetId)!;

  const data = useMemo(() => {
    const pts = [];
    let currentVal = amount;
    for (let y = startYear; y <= currentYear; y++) {
      pts.push({
        year: y,
        value: currentVal,
      });
      // Add some random volatility if it's not FD
      const volatility = assetId === 'FD' ? 0 : (((y * 13) % 10) * 0.01 - 0.03); 
      currentVal = currentVal * (1 + selectedAsset.cagr + volatility);
    }
    return pts;
  }, [assetId, amount, startYear, currentYear, selectedAsset.cagr]);

  const finalValue = data[data.length - 1].value;
  const totalProfit = finalValue - amount;
  const multiplier = (finalValue / amount).toFixed(2);

  return (
    <div className="max-w-6xl mx-auto pb-20 relative z-10">
      <div className="mb-8">
        <h1 className="heading-hero text-4xl text-gradient">Time Machine</h1>
        <p className="text-text-secondary mt-2 flex items-center gap-2">
          <span className="px-2 py-0.5 rounded bg-white/5 border border-border text-[10px] font-bold text-accent tracking-widest uppercase">Educational Only</span>
          Not investment advice. Past performance does not guarantee future results.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Controls */}
        <div className="card p-6 flex flex-col gap-6">
          <div>
            <label className="text-xs font-bold text-foreground/50 uppercase tracking-wider">Asset Class</label>
            <div className="mt-2 space-y-2">
              {ASSETS.map(a => (
                <button 
                  key={a.id} 
                  onClick={() => setAssetId(a.id)}
                  className={`w-full text-left px-4 py-3 rounded-xl border transition-all flex items-center gap-3 ${assetId === a.id ? 'bg-white/10 border-accent/50 text-white shadow-[0_0_15px_rgba(34,211,238,0.15)]' : 'bg-white/5 border-border text-foreground/70 hover:bg-white/10'}`}
                >
                  <span className="w-3 h-3 rounded-full" style={{ backgroundColor: a.color }}></span>
                  {a.name}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="text-xs font-bold text-foreground/50 uppercase tracking-wider">Lumpsum Investment (₹)</label>
            <input 
              type="range" 
              min="10000" 
              max="1000000" 
              step="10000" 
              value={amount} 
              onChange={e => setAmount(Number(e.target.value))}
              className="w-full mt-3 accent-primary"
            />
            <div className="text-xl font-bold font-display mt-2">₹{amount.toLocaleString('en-IN')}</div>
          </div>

          <div>
            <label className="text-xs font-bold text-foreground/50 uppercase tracking-wider">Start Year</label>
            <input 
              type="range" 
              min="2000" 
              max={currentYear - 1} 
              step="1" 
              value={startYear} 
              onChange={e => setStartYear(Number(e.target.value))}
              className="w-full mt-3 accent-primary"
            />
            <div className="text-xl font-bold font-display mt-2">{startYear}</div>
          </div>
        </div>

        {/* Results */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="card p-5">
              <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider">Final Value</p>
              <p className="text-3xl font-display font-bold text-gradient mt-1">₹{Math.round(finalValue).toLocaleString('en-IN')}</p>
            </div>
            <div className="card p-5">
              <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider">Total Profit</p>
              <p className="text-2xl font-display font-bold text-success mt-1">+₹{Math.round(totalProfit).toLocaleString('en-IN')}</p>
            </div>
            <div className="card p-5">
              <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider">Wealth Multiplier</p>
              <p className="text-2xl font-display font-bold text-accent mt-1">{multiplier}x</p>
            </div>
          </div>

          <div className="card p-6 h-[400px] flex flex-col">
            <h3 className="font-bold text-sm mb-4">Historical Trajectory ({startYear} - {currentYear})</h3>
            <div className="flex-1 -ml-4">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data}>
                  <defs>
                    <linearGradient id="timeColor" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor={selectedAsset.color} stopOpacity={0.5}/>
                      <stop offset="95%" stopColor={selectedAsset.color} stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="year" stroke="#475569" fontSize={10} tickLine={false} axisLine={false} />
                  <YAxis stroke="#475569" fontSize={10} tickLine={false} axisLine={false} tickFormatter={(val) => `₹${(val/1000).toFixed(0)}k`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: 'rgba(15, 10, 42, 0.9)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }} 
                    formatter={(val: any) => [`₹${Math.round(val).toLocaleString('en-IN')}`, 'Value']}
                  />
                  <Area type="monotone" dataKey="value" stroke={selectedAsset.color} strokeWidth={3} fillOpacity={1} fill="url(#timeColor)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
