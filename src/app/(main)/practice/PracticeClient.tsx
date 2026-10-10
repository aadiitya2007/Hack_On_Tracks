'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { savePracticeState } from '@/lib/practice-actions';

const ASSETS = [
  { symbol: 'RELIANCE', name: 'Reliance Ind.', type: 'EQUITY', basePrice: 3000, vol: 0.05 },
  { symbol: 'NHAI_8%', name: 'NHAI 8% Bond', type: 'DEBT', basePrice: 1000, vol: 0.01, yield: 0.08 },
  { symbol: 'EMBASSY', name: 'Embassy REIT', type: 'REIT', basePrice: 350, vol: 0.03, yield: 0.06 },
  { symbol: 'PPFAS', name: 'PPFAS Flexi Cap', type: 'MUTUAL_FUND', basePrice: 80, vol: 0.04 },
];

export default function PracticeClient({ initialState }: { initialState: any }) {
  const [cash, setCash] = useState(1000000);
  const [holdings, setHoldings] = useState<any[]>([]);
  const [prices, setPrices] = useState<Record<string, number>>({});
  const [sipActive, setSipActive] = useState(false);
  const [sipAmount, setSipAmount] = useState(5000);
  
  const [tradeAsset, setTradeAsset] = useState(ASSETS[0].symbol);
  const [tradeQty, setTradeQty] = useState(10);
  const [lesson, setLesson] = useState<string | null>(null);

  // Initialize
  useEffect(() => {
    const initialPrices: any = {};
    ASSETS.forEach(a => initialPrices[a.symbol] = a.basePrice);
    setPrices(initialPrices);

    if (initialState?.holdings?.length > 0) {
      setHoldings(initialState.holdings);
      // Rough cash estimate (assuming 1M start and no realized PnL tracking for simplicity)
      const invested = initialState.holdings.reduce((acc: number, h: any) => acc + (h.quantity * h.avgBuyPrice), 0);
      setCash(1000000 - invested);
      
      // Load current prices from db state if available
      initialState.holdings.forEach((h: any) => {
        if (h.currentPrice) initialPrices[h.symbol] = h.currentPrice;
      });
      setPrices({...initialPrices});
    }
  }, [initialState]);

  // Persist periodically
  useEffect(() => {
    const t = setTimeout(() => {
      savePracticeState(cash, holdings);
    }, 2000);
    return () => clearTimeout(t);
  }, [cash, holdings]);

  const executeTrade = (type: 'BUY' | 'SELL') => {
    const asset = ASSETS.find(a => a.symbol === tradeAsset)!;
    const price = prices[tradeAsset];
    const cost = price * tradeQty;

    if (type === 'BUY' && cash < cost) {
      alert("Not enough virtual cash!");
      return;
    }

    let newHoldings = [...holdings];
    const existing = newHoldings.find(h => h.symbol === tradeAsset);

    if (type === 'BUY') {
      setCash(c => c - cost);
      if (existing) {
        const oldVal = existing.quantity * existing.avgBuyPrice;
        existing.quantity += tradeQty;
        existing.avgBuyPrice = (oldVal + cost) / existing.quantity;
      } else {
        newHoldings.push({ symbol: tradeAsset, assetType: asset.type, quantity: tradeQty, avgBuyPrice: price, currentPrice: price });
      }
    } else {
      if (!existing || existing.quantity < tradeQty) {
        alert("Not enough quantity to sell!");
        return;
      }
      setCash(c => c + cost);
      existing.quantity -= tradeQty;
      if (existing.quantity === 0) {
        newHoldings = newHoldings.filter(h => h.symbol !== tradeAsset);
      }
    }
    
    setHoldings(newHoldings);
    setLesson(`You ${type === 'BUY' ? 'bought' : 'sold'} ${tradeQty} units of ${tradeAsset}. Watch how it performs over time.`);
  };

  const simulateTime = (months: number, scenario?: string) => {
    let currentCash = cash;
    const currentPrices = { ...prices };
    const currentHoldings = JSON.parse(JSON.stringify(holdings));
    
    for (let m = 1; m <= months; m++) {
      // 1. Process SIP
      if (sipActive && currentCash >= sipAmount) {
        currentCash -= sipAmount;
        const pPrice = currentPrices['PPFAS'];
        const qty = sipAmount / pPrice;
        const p = currentHoldings.find((h:any) => h.symbol === 'PPFAS');
        if (p) {
          const oldVal = p.quantity * p.avgBuyPrice;
          p.quantity += qty;
          p.avgBuyPrice = (oldVal + sipAmount) / p.quantity;
        } else {
          currentHoldings.push({ symbol: 'PPFAS', assetType: 'MUTUAL_FUND', quantity: qty, avgBuyPrice: pPrice, currentPrice: pPrice });
        }
      }

      // 2. Price movements & Yields
      ASSETS.forEach(a => {
        // Yield payouts (monthly equivalent)
        if (a.yield) {
          const h = currentHoldings.find((x:any) => x.symbol === a.symbol);
          if (h) {
            const payout = (h.quantity * a.basePrice) * (a.yield / 12);
            currentCash += payout;
          }
        }
        
        // Random walk
        let change = (Math.random() * a.vol * 2) - a.vol; 
        
        // Apply Scenarios
        if (scenario === 'CRASH' && a.type === 'EQUITY' && m === 1) change = -0.30;
        if (scenario === 'CRASH' && a.type === 'MUTUAL_FUND' && m === 1) change = -0.25;
        if (scenario === 'RATE_HIKE' && a.type === 'DEBT' && m === 1) change = -0.08;

        currentPrices[a.symbol] = currentPrices[a.symbol] * (1 + change);
      });
    }

    // Update holdings with new prices
    currentHoldings.forEach((h:any) => {
      h.currentPrice = currentPrices[h.symbol];
    });

    setPrices(currentPrices);
    setCash(currentCash);
    setHoldings(currentHoldings);

    // Set Lesson based on action
    if (scenario === 'CRASH') {
      setLesson("Market Crash! Equities dropped by 30%. Notice how your Bonds (NHAI) held their value. This is why diversification matters.");
    } else if (scenario === 'RATE_HIKE') {
      setLesson("Interest rates rose! When new bonds offer higher rates, older bonds lose value. Your NHAI bond price dropped, but it still pays the fixed 8% coupon.");
    } else if (sipActive && months >= 12) {
      setLesson(`Rupee Cost Averaging in action: Over ${months} months, your SIP automatically bought more units when prices dipped and fewer when they rose.`);
    } else {
      setLesson(`Fast forwarded ${months} month(s). Markets fluctuated, and any bonds or REITs paid out their periodic cash yields into your balance.`);
    }
  };

  const totalPortfolioValue = cash + holdings.reduce((acc, h) => acc + (h.quantity * h.currentPrice), 0);

  return (
    <div className="max-w-6xl mx-auto pb-20 relative z-10">
      <div className="mb-8 flex justify-between items-end">
        <div>
          <h1 className="heading-hero text-4xl text-gradient">Practice Trading</h1>
          <p className="text-foreground/60 mt-2 flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-bold text-accent tracking-widest uppercase">Virtual Money</span>
            Test strategies safely with ₹10,00,000 mock capital and our time-warp engine.
          </p>
        </div>
        <div className="text-right">
          <p className="text-[10px] text-foreground/50 font-bold uppercase tracking-wider">Total Net Worth</p>
          <p className="text-3xl font-display font-bold text-success tabular-nums drop-shadow-[0_0_12px_rgba(16,229,160,0.3)]">
            ₹{Math.round(totalPortfolioValue).toLocaleString('en-IN')}
          </p>
        </div>
      </div>

      {lesson && (
        <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} className="mb-6 glass-card p-4 border-accent/30 bg-accent/5 flex gap-4 items-start">
          <div className="text-2xl">💡</div>
          <div>
            <h3 className="font-bold text-accent">Learning Moment</h3>
            <p className="text-sm text-foreground/80 mt-1 leading-relaxed">{lesson}</p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Col: Trading & Time Controls */}
        <div className="col-span-1 space-y-6">
          <div className="glass-card p-6">
            <h3 className="font-bold mb-4 flex items-center gap-2"><span className="w-2 h-2 rounded-full bg-primary"></span> Execute Trade</h3>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-bold text-foreground/50 uppercase">Asset</label>
                <select value={tradeAsset} onChange={e=>setTradeAsset(e.target.value)} className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg p-2 text-sm">
                  {ASSETS.map(a => <option key={a.symbol} value={a.symbol}>{a.name} ({a.type})</option>)}
                </select>
                <p className="text-xs text-foreground/50 mt-1 tabular-nums">Current Price: ₹{(prices[tradeAsset] || 0).toFixed(2)}</p>
              </div>
              <div>
                <label className="text-xs font-bold text-foreground/50 uppercase">Quantity</label>
                <input type="number" min={1} value={tradeQty} onChange={e=>setTradeQty(Number(e.target.value))} className="w-full mt-1 bg-white/5 border border-white/10 rounded-lg p-2 text-sm tabular-nums" />
              </div>
              <div className="flex gap-2">
                <button onClick={() => executeTrade('BUY')} className="flex-1 py-2 rounded-lg bg-success/20 text-success font-bold border border-success/30 hover:bg-success/30 transition-colors">BUY</button>
                <button onClick={() => executeTrade('SELL')} className="flex-1 py-2 rounded-lg bg-destructive/20 text-destructive font-bold border border-destructive/30 hover:bg-destructive/30 transition-colors">SELL</button>
              </div>
            </div>

            <div className="mt-6 pt-6 border-t border-white/10">
              <div className="flex justify-between items-center mb-2">
                <h3 className="font-bold text-sm">Monthly SIP (PPFAS)</h3>
                <button onClick={() => setSipActive(!sipActive)} className={`w-10 h-5 rounded-full relative transition-colors ${sipActive ? 'bg-success' : 'bg-white/20'}`}>
                  <span className={`absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white transition-all ${sipActive ? 'left-6' : 'left-1'}`}></span>
                </button>
              </div>
              {sipActive && (
                <input type="number" value={sipAmount} onChange={e=>setSipAmount(Number(e.target.value))} className="w-full bg-white/5 border border-white/10 rounded-lg p-2 text-sm tabular-nums mt-2" />
              )}
            </div>
          </div>

          <div className="glass-card p-6 bg-gradient-to-b from-[#0A0720] to-[#1a1140]">
            <h3 className="font-bold mb-4 flex items-center gap-2"><span className="text-accent">⏳</span> Time Machine Engine</h3>
            <p className="text-xs text-foreground/60 mb-4">Fast-forward time to simulate market movements and compound interest.</p>
            <div className="grid grid-cols-3 gap-2 mb-4">
              <button onClick={() => simulateTime(1)} className="py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold border border-white/10">1 Month</button>
              <button onClick={() => simulateTime(12)} className="py-2 bg-white/5 hover:bg-white/10 rounded-lg text-xs font-bold border border-white/10">1 Year</button>
              <button onClick={() => simulateTime(60)} className="py-2 bg-primary/20 hover:bg-primary/40 text-primary rounded-lg text-xs font-bold border border-primary/30">5 Years</button>
            </div>
            
            <h4 className="text-[10px] font-bold text-foreground/50 uppercase mb-2 mt-6">Guided Scenarios</h4>
            <div className="space-y-2">
              <button onClick={() => simulateTime(1, 'CRASH')} className="w-full text-left p-2 rounded-lg bg-destructive/10 border border-destructive/20 text-xs font-medium text-destructive hover:bg-destructive/20 transition-colors">
                📉 Simulate Market Crash (-30%)
              </button>
              <button onClick={() => simulateTime(1, 'RATE_HIKE')} className="w-full text-left p-2 rounded-lg bg-yellow-500/10 border border-yellow-500/20 text-xs font-medium text-yellow-500 hover:bg-yellow-500/20 transition-colors">
                🏦 Simulate Rate Hike (Bonds Drop)
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Portfolio */}
        <div className="col-span-1 lg:col-span-2 space-y-6">
          <div className="glass-card p-6">
            <h3 className="font-bold mb-4">Virtual Portfolio</h3>
            
            <div className="flex justify-between items-center p-4 bg-white/5 rounded-xl border border-white/10 mb-6">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-success/20 flex items-center justify-center text-success border border-success/30">₹</div>
                <div>
                  <p className="text-xs font-bold text-foreground/50 uppercase">Available Cash</p>
                  <p className="font-display font-bold text-xl tabular-nums">₹{Math.round(cash).toLocaleString('en-IN')}</p>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-[10px] font-bold text-foreground/50 uppercase border-b border-white/10">
                  <tr>
                    <th className="pb-3">Asset</th>
                    <th className="pb-3 text-right">Qty</th>
                    <th className="pb-3 text-right">Avg Price</th>
                    <th className="pb-3 text-right">LTP</th>
                    <th className="pb-3 text-right">P&L</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  <AnimatePresence>
                    {holdings.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="py-8 text-center text-foreground/40 text-sm">
                          No virtual holdings yet. Execute a trade to start learning.
                        </td>
                      </tr>
                    ) : (
                      holdings.map((h: any, i) => {
                        const invested = h.quantity * h.avgBuyPrice;
                        const val = h.quantity * h.currentPrice;
                        const pnl = val - invested;
                        const pnlPct = (pnl / invested) * 100;
                        
                        return (
                          <motion.tr 
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            key={`${h.symbol}-${i}`} 
                          >
                            <td className="py-4">
                              <p className="font-bold text-sm">{h.symbol}</p>
                              <p className="text-[10px] text-foreground/50">{h.assetType}</p>
                            </td>
                            <td className="py-4 text-right tabular-nums text-sm font-medium">{h.quantity.toFixed(2)}</td>
                            <td className="py-4 text-right tabular-nums text-sm text-foreground/70">₹{h.avgBuyPrice.toFixed(2)}</td>
                            <td className="py-4 text-right tabular-nums text-sm font-bold">₹{h.currentPrice.toFixed(2)}</td>
                            <td className="py-4 text-right">
                              <p className={`font-bold text-sm tabular-nums text-${pnl >= 0 ? 'success' : 'destructive'}`}>
                                {pnl >= 0 ? '+' : ''}₹{Math.round(pnl).toLocaleString('en-IN')}
                              </p>
                              <p className={`text-[10px] font-bold tabular-nums text-${pnl >= 0 ? 'success' : 'destructive'}/70`}>
                                {pnl >= 0 ? '+' : ''}{pnlPct.toFixed(2)}%
                              </p>
                            </td>
                          </motion.tr>
                        )
                      })
                    )}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
