'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FloatingCard } from '@/components/ui/floating-card';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

// Mock generation since DB is not connected
function generateMockHistory(symbol: string, startYear: number) {
  const currentYear = new Date().getFullYear();
  const data = [];
  let basePrice = symbol === 'RELIANCE' ? 1000 : symbol === 'HDFCBANK' ? 500 : 200;
  
  for (let year = startYear; year <= currentYear; year++) {
    for (let month = 1; month <= 12; month++) {
      if (year === currentYear && month > new Date().getMonth() + 1) break;
      
      const growth = 1 + (Math.random() * 0.08 - 0.02); // slight upward bias
      basePrice = basePrice * growth;
      
      data.push({
        date: `${year}-${month.toString().padStart(2, '0')}`,
        price: basePrice,
      });
    }
  }
  return data;
}

// Animated Counter component
function AnimatedNumber({ value, prefix = '' }: { value: number, prefix?: string }) {
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    // Simple fast count up
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

  return <span>{prefix}{Math.round(displayValue).toLocaleString('en-IN')}</span>;
}

export default function TimeMachine() {
  const [asset, setAsset] = useState('RELIANCE');
  const [startYear, setStartYear] = useState(2018);
  const [amount, setAmount] = useState(100000);

  const assets = [
    { id: 'RELIANCE', name: 'Reliance Industries', listing: 1995 },
    { id: 'HDFCBANK', name: 'HDFC Bank', listing: 1995 },
    { id: 'EMBASSY', name: 'Embassy Office Parks REIT', listing: 2019 },
    { id: 'NHAI', name: 'NHAI Bonds', listing: 2010 },
  ];

  const selectedAssetInfo = assets.find(a => a.id === asset)!;

  const chartData = useMemo(() => {
    return generateMockHistory(asset, startYear);
  }, [asset, startYear]);

  const initialPrice = chartData[0]?.price || 1;
  const finalPrice = chartData[chartData.length - 1]?.price || 1;
  const units = amount / initialPrice;
  const finalValue = units * finalPrice;
  const pnl = finalValue - amount;

  const dataForChart = chartData.map(d => ({
    ...d,
    value: Math.round((amount / initialPrice) * d.price)
  }));

  // Handle year constraints
  const handleYearChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    let year = parseInt(e.target.value);
    if (year < selectedAssetInfo.listing) year = selectedAssetInfo.listing;
    if (year > new Date().getFullYear()) year = new Date().getFullYear();
    setStartYear(year);
  };

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Time Machine</h1>
        <p className="text-slate-400 mt-2">See what would have happened if you invested in the past.</p>
        <p className="text-xs text-slate-500 mt-1 uppercase tracking-wider font-semibold">Educational, not investment advice</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="col-span-1 space-y-6">
          <FloatingCard className="p-6">
            <h3 className="font-semibold mb-4 text-lg">Configure Simulation</h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Select Asset</label>
                <select 
                  value={asset}
                  onChange={(e) => {
                    setAsset(e.target.value);
                    const newAsset = assets.find(a => a.id === e.target.value)!;
                    if (startYear < newAsset.listing) setStartYear(newAsset.listing);
                  }}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                >
                  {assets.map(a => (
                    <option key={a.id} value={a.id}>{a.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Start Year</label>
                <input 
                  type="number" 
                  value={startYear}
                  onChange={handleYearChange}
                  min={selectedAssetInfo.listing}
                  max={new Date().getFullYear()}
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
                <p className="text-xs text-slate-500 mt-1">Listed in {selectedAssetInfo.listing}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-400 mb-1">Investment Amount (₹)</label>
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(Number(e.target.value))}
                  step="10000"
                  min="1000"
                  className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 focus:outline-none focus:border-blue-500"
                />
              </div>
            </div>
          </FloatingCard>

          <FloatingCard className="p-6">
            <h3 className="text-sm font-medium text-slate-400 mb-1">Simulated Value Today</h3>
            <div className="text-4xl font-bold text-white mb-2">
              <AnimatedNumber value={finalValue} prefix="₹" />
            </div>
            <div className={`text-sm font-medium ${pnl >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
              {pnl >= 0 ? '+' : ''}<AnimatedNumber value={pnl} prefix="₹" /> ({(pnl/amount*100).toFixed(2)}%)
            </div>
          </FloatingCard>
        </div>

        <div className="col-span-1 lg:col-span-2">
          <FloatingCard className="p-6 h-full min-h-[400px] flex flex-col">
            <h3 className="font-semibold mb-6">Growth Over Time</h3>
            <div className="flex-1 -ml-6 -mb-6">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={dataForChart} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorValue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <XAxis dataKey="date" stroke="#475569" fontSize={12} tickMargin={10} minTickGap={30} />
                  <YAxis stroke="#475569" fontSize={12} tickFormatter={(val) => `₹${(val/100000).toFixed(1)}L`} />
                  <Tooltip 
                    contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '8px' }}
                    itemStyle={{ color: '#f8fafc' }}
                    formatter={(value: number) => [`₹${value.toLocaleString('en-IN')}`, 'Portfolio Value']}
                    labelStyle={{ color: '#94a3b8' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#3b82f6" 
                    strokeWidth={2}
                    fillOpacity={1} 
                    fill="url(#colorValue)" 
                    animationDuration={1500}
                    animationEasing="ease-out"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </FloatingCard>
        </div>
      </div>
    </div>
  );
}
