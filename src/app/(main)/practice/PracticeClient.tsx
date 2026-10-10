'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TrendingUp, DollarSign, RefreshCw, AlertTriangle, ShieldCheck, ArrowRightLeft } from 'lucide-react';

const EXTENDED_ASSETS = [
  { symbol: 'RELIANCE', name: 'Reliance Industries', type: 'EQUITY', basePrice: 2985.40, vol: 0.04 },
  { symbol: 'HDFCBANK', name: 'HDFC Bank Ltd', type: 'EQUITY', basePrice: 1680.50, vol: 0.035 },
  { symbol: 'TCS', name: 'Tata Consultancy Services', type: 'EQUITY', basePrice: 4120.00, vol: 0.03 },
  { symbol: 'INFY', name: 'Infosys Ltd', type: 'EQUITY', basePrice: 1890.20, vol: 0.038 },
  { symbol: 'BAJFINANCE', name: 'Bajaj Finance Ltd', type: 'EQUITY', basePrice: 7210.00, vol: 0.05 },
  { symbol: 'TATAMOTORS', name: 'Tata Motors Ltd', type: 'EQUITY', basePrice: 940.50, vol: 0.055 },
  { symbol: 'SBIN', name: 'State Bank of India', type: 'EQUITY', basePrice: 820.00, vol: 0.04 },
  { symbol: 'ITC', name: 'ITC Ltd', type: 'EQUITY', basePrice: 475.00, vol: 0.025 },
  { symbol: 'NHAI_8%', name: 'NHAI 8% Tax Free Bond', type: 'DEBT', basePrice: 1000.00, vol: 0.01, yield: 0.08 },
  { symbol: 'EMBASSY', name: 'Embassy Office Parks REIT', type: 'REIT', basePrice: 375.00, vol: 0.02, yield: 0.065 },
  { symbol: 'PGINVIT', name: 'POWERGRID Infrastructure InvIT', type: 'INVIT', basePrice: 98.00, vol: 0.015, yield: 0.09 },
  { symbol: 'PPFAS', name: 'PPFAS Flexi Cap Fund', type: 'MUTUAL_FUND', basePrice: 68.40, vol: 0.03 }
];

export default function PracticeClient({ initialState }: { initialState: any }) {
  const [cash, setCash] = useState(1000000);
  const [holdings, setHoldings] = useState<any[]>([
    { symbol: 'RELIANCE', assetType: 'EQUITY', quantity: 50, avgBuyPrice: 2850, currentPrice: 2985.40 },
    { symbol: 'HDFCBANK', assetType: 'EQUITY', quantity: 100, avgBuyPrice: 1600, currentPrice: 1680.50 }
  ]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [tradeAsset, setTradeAsset] = useState(EXTENDED_ASSETS[0].symbol);
  const [tradeQty, setTradeQty] = useState(10);
  const [tradeAction, setTradeAction] = useState<'BUY' | 'SELL'>('BUY');
  const [lesson, setLesson] = useState<string | null>("Welcome to Practice Mode! Test trading strategies risk-free with ₹10,00,000 virtual capital.");

  useEffect(() => {
    const initP: Record<string, number> = {};
    EXTENDED_ASSETS.forEach(a => { initP[a.symbol] = a.basePrice; });
    setPrices(initP);

    if (initialState?.holdings?.length > 0) {
      setHoldings(initialState.holdings);
    }
  }, [initialState]);

  const executeTrade = () => {
    const asset = EXTENDED_ASSETS.find(a => a.symbol === tradeAsset)!;
    const price = prices[tradeAsset] || asset.basePrice;
    const cost = price * tradeQty;

    if (tradeAction === 'BUY' && cash < cost) {
      alert("Insufficient virtual cash!");
      return;
    }

    let newHoldings = [...holdings];
    const existingIndex = newHoldings.findIndex(h => h.symbol === tradeAsset);

    if (tradeAction === 'BUY') {
      setCash(c => c - cost);
      if (existingIndex >= 0) {
        const h = newHoldings[existingIndex];
        const oldVal = h.quantity * h.avgBuyPrice;
        h.quantity += tradeQty;
        h.avgBuyPrice = (oldVal + cost) / h.quantity;
        h.currentPrice = price;
      } else {
        newHoldings.push({
          symbol: tradeAsset,
          assetType: asset.type,
          quantity: tradeQty,
          avgBuyPrice: price,
          currentPrice: price
        });
      }
      setLesson(`Successfully bought ${tradeQty} units of ${tradeAsset} at ₹${price.toFixed(2)}. Capital remaining: ₹${Math.round(cash - cost).toLocaleString('en-IN')}`);
    } else {
      if (existingIndex < 0 || newHoldings[existingIndex].quantity < tradeQty) {
        alert("Insufficient quantity to sell!");
        return;
      }
      setCash(c => c + cost);
      const h = newHoldings[existingIndex];
      h.quantity -= tradeQty;
      if (h.quantity <= 0) {
        newHoldings = newHoldings.filter((_, idx) => idx !== existingIndex);
      }
      setLesson(`Successfully sold ${tradeQty} units of ${tradeAsset} at ₹${price.toFixed(2)}. Cash credited: ₹${Math.round(cost).toLocaleString('en-IN')}`);
    }

    setHoldings(newHoldings);
  };

  const simulateMarketMovement = (months: number, scenario?: string) => {
    const nextPrices = { ...prices };
    const nextHoldings = JSON.parse(JSON.stringify(holdings));
    let nextCash = cash;

    EXTENDED_ASSETS.forEach(a => {
      let change = (Math.random() * a.vol * 2) - a.vol;

      if (scenario === 'CRASH' && (a.type === 'EQUITY' || a.type === 'MUTUAL_FUND')) change = -0.28;
      if (scenario === 'RATE_HIKE' && a.type === 'DEBT') change = -0.06;

      nextPrices[a.symbol] = Math.max(10, (nextPrices[a.symbol] || a.basePrice) * (1 + change));
    });

    nextHoldings.forEach((h: any) => {
      if (nextPrices[h.symbol]) {
        h.currentPrice = nextPrices[h.symbol];
      }
    });

    setPrices(nextPrices);
    setHoldings(nextHoldings);
    setCash(nextCash);

    if (scenario === 'CRASH') {
      setLesson("Market Shock Simulated! Equities experienced a 28% drawback. Notice how fixed income & REIT yields provide portfolio stability.");
    } else {
      setLesson(`Simulated ${months} month market movement. Prices fluctuated based on rolling standard deviation volatility.`);
    }
  };

  const totalHoldingsVal = holdings.reduce((sum, h) => sum + (h.quantity * (h.currentPrice || h.avgBuyPrice)), 0);
  const totalNetWorth = cash + totalHoldingsVal;

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 relative z-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="heading-hero text-4xl text-gradient">Practice Trading Studio</h1>
          <p className="text-text-secondary mt-1 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-accent-bg text-accent text-[10px] font-bold tracking-widest uppercase border border-accent/20">Virtual Sandbox</span>
            Execute real-time paper trades across Indian stocks, REITs, InvITs, and bonds.
          </p>
        </div>

        <div className="text-right card p-4 bg-surface border border-border">
          <p className="text-[10px] text-text-muted font-bold uppercase tracking-wider">Total Virtual Net Worth</p>
          <p className="text-3xl font-extrabold text-gain tabular-nums">
            ₹{Math.round(totalNetWorth).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {/* Lesson Banner */}
      {lesson && (
        <motion.div initial={{ opacity: 0, y: -5 }} animate={{ opacity: 1, y: 0 }} className="card p-4 bg-accent-bg border border-accent/30 text-accent flex gap-3 items-center">
          <ShieldCheck size={20} className="shrink-0" />
          <p className="text-xs font-bold leading-relaxed">{lesson}</p>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left: Trade Execution Box */}
        <div className="space-y-6">
          <div className="card p-6 bg-surface border border-border">
            <h2 className="font-bold text-base mb-4 flex items-center gap-2 text-text-primary">
              <ArrowRightLeft className="text-accent" size={18} /> Execute Practice Order
            </h2>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-text-muted uppercase">Scrip / Asset</label>
                <select 
                  value={tradeAsset} 
                  onChange={e => setTradeAsset(e.target.value)} 
                  className="w-full mt-1 bg-bg border border-border rounded-xl p-3 text-xs font-bold text-text-primary focus:outline-none focus:border-accent"
                >
                  {EXTENDED_ASSETS.map(a => (
                    <option key={a.symbol} value={a.symbol}>{a.name} ({a.symbol}) • {a.type}</option>
                  ))}
                </select>
                <div className="flex justify-between items-center mt-2 text-xs">
                  <span className="text-text-muted">Live Price:</span>
                  <span className="font-bold text-text-primary">₹{(prices[tradeAsset] || 3000).toFixed(2)}</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-bold text-text-muted uppercase">Action</label>
                  <div className="flex mt-1 bg-bg rounded-xl border border-border p-1">
                    <button 
                      onClick={() => setTradeAction('BUY')} 
                      className={`flex-1 text-xs py-2 rounded-lg font-bold transition-all ${tradeAction === 'BUY' ? 'bg-gain text-white shadow-sm' : 'text-text-muted'}`}
                    >
                      BUY
                    </button>
                    <button 
                      onClick={() => setTradeAction('SELL')} 
                      className={`flex-1 text-xs py-2 rounded-lg font-bold transition-all ${tradeAction === 'SELL' ? 'bg-loss text-white shadow-sm' : 'text-text-muted'}`}
                    >
                      SELL
                    </button>
                  </div>
                </div>

                <div>
                  <label className="text-xs font-bold text-text-muted uppercase">Quantity</label>
                  <input 
                    type="number" 
                    min={1} 
                    value={tradeQty} 
                    onChange={e => setTradeQty(Math.max(1, Number(e.target.value)))} 
                    className="w-full mt-1 bg-bg border border-border rounded-xl p-2.5 text-xs font-bold text-text-primary tabular-nums focus:outline-none focus:border-accent"
                  />
                </div>
              </div>

              <div className="p-3 rounded-xl bg-bg border border-border flex justify-between items-center text-xs">
                <span className="text-text-muted">Est. Total Value:</span>
                <span className="font-bold text-text-primary">₹{((prices[tradeAsset] || 3000) * tradeQty).toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
              </div>

              <button 
                onClick={executeTrade} 
                className={`w-full py-3 rounded-xl font-extrabold text-xs text-white transition-all shadow-md ${
                  tradeAction === 'BUY' ? 'bg-gain hover:bg-gain/90' : 'bg-loss hover:bg-loss/90'
                }`}
              >
                CONFIRM {tradeAction} ORDER
              </button>
            </div>
          </div>

          {/* Market Fast-Forward Controls */}
          <div className="card p-6 bg-surface border border-border">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2">
              <RefreshCw className="text-accent" size={16} /> Fast-Forward Simulation
            </h3>
            <p className="text-xs text-text-secondary mb-4">Simulate future price drift and volatility scenarios.</p>

            <div className="grid grid-cols-2 gap-2 mb-3">
              <button onClick={() => simulateMarketMovement(1)} className="py-2.5 bg-bg border border-border hover:border-accent rounded-xl text-xs font-bold text-text-primary transition-all">
                +1 Month Drift
              </button>
              <button onClick={() => simulateMarketMovement(12)} className="py-2.5 bg-bg border border-border hover:border-accent rounded-xl text-xs font-bold text-text-primary transition-all">
                +1 Year Drift
              </button>
            </div>

            <button 
              onClick={() => simulateMarketMovement(1, 'CRASH')} 
              className="w-full py-2.5 bg-loss-bg border border-loss/30 text-loss rounded-xl text-xs font-bold hover:bg-loss/20 transition-all flex justify-center items-center gap-2"
            >
              <AlertTriangle size={14} /> Trigger Market Shock (-28%)
            </button>
          </div>
        </div>

        {/* Right: Virtual Holdings Table */}
        <div className="lg:col-span-2 space-y-6">
          <div className="card p-6 bg-surface border border-border">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-base text-text-primary">Virtual Portfolio Holdings</h2>
              <div className="text-xs font-bold px-3 py-1 rounded-full bg-gain-bg text-gain border border-gain/20">
                Cash Balance: ₹{Math.round(cash).toLocaleString('en-IN')}
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-[10px] font-bold text-text-muted uppercase tracking-wider border-b border-border bg-bg">
                  <tr>
                    <th className="p-3">Scrip</th>
                    <th className="p-3 text-right">Qty</th>
                    <th className="p-3 text-right">Avg Price</th>
                    <th className="p-3 text-right">Current LTP</th>
                    <th className="p-3 text-right">Unrealized P&L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {holdings.length === 0 ? (
                    <tr>
                      <td colSpan={5} className="py-8 text-center text-text-muted text-xs">
                        No virtual holdings. Select a scrip and confirm an order to begin.
                      </td>
                    </tr>
                  ) : (
                    holdings.map((h, i) => {
                      const ltp = h.currentPrice || prices[h.symbol] || h.avgBuyPrice;
                      const invested = h.quantity * h.avgBuyPrice;
                      const currentVal = h.quantity * ltp;
                      const pnl = currentVal - invested;
                      const pnlPct = invested > 0 ? (pnl / invested) * 100 : 0;

                      return (
                        <tr key={`${h.symbol}-${i}`} className="hover:bg-bg transition-colors">
                          <td className="p-3">
                            <p className="font-bold text-sm text-text-primary">{h.symbol}</p>
                            <p className="text-[10px] text-text-muted">{h.assetType}</p>
                          </td>
                          <td className="p-3 text-right font-mono font-bold text-text-primary text-xs">{h.quantity}</td>
                          <td className="p-3 text-right font-mono text-text-secondary text-xs">₹{h.avgBuyPrice.toFixed(2)}</td>
                          <td className="p-3 text-right font-mono font-bold text-text-primary text-xs">₹{ltp.toFixed(2)}</td>
                          <td className="p-3 text-right font-mono text-xs">
                            <p className={`font-bold ${pnl >= 0 ? 'text-gain' : 'text-loss'}`}>
                              {pnl >= 0 ? '+' : ''}₹{pnl.toLocaleString('en-IN', { maximumFractionDigits: 2 })}
                            </p>
                            <p className={`text-[10px] font-bold ${pnl >= 0 ? 'text-gain/80' : 'text-loss/80'}`}>
                              {pnl >= 0 ? '+' : ''}{pnlPct.toFixed(2)}%
                            </p>
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
