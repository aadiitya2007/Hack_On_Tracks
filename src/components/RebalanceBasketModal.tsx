'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Zap, CheckCircle2, Copy, ExternalLink, RefreshCw, 
  ArrowRight, ShieldAlert, ShoppingBag, X, Layers 
} from 'lucide-react';

export function RebalanceBasketModal({
  isOpen,
  onClose,
  currentWeights,
  targetWeights,
  portfolioValue = 1000000
}: {
  isOpen: boolean;
  onClose: () => void;
  currentWeights: Record<string, number>;
  targetWeights: Record<string, number>;
  portfolioValue?: number;
}) {
  const [copied, setCopied] = useState(false);
  const [executing, setExecuting] = useState(false);
  const [executed, setExecuted] = useState(false);

  // Compute rebalance trade actions
  const assetLabels: Record<string, string> = {
    stocks: 'Direct Equities (Stocks)',
    mutualFunds: 'Flexi-Cap Mutual Funds',
    etfs: 'Nifty 50 & Sensex ETFs',
    bonds: 'Sovereign Bonds & Fixed Income',
    reits: 'Commercial REITs',
    invits: 'Infrastructure InvITs',
    fno: 'Futures & Options Derivatives',
  };

  const tradeOrders = Object.keys(targetWeights).map(key => {
    const curPct = currentWeights[key] || 0;
    const tgtPct = targetWeights[key] || 0;
    const diffPct = tgtPct - curPct;
    const diffRupees = Math.round((diffPct / 100) * portfolioValue);

    return {
      key,
      label: assetLabels[key] || key,
      action: diffRupees > 0 ? ('BUY' as const) : diffRupees < 0 ? ('SELL' as const) : ('HOLD' as const),
      amount: Math.abs(diffRupees),
      pctChange: diffPct
    };
  }).filter(order => order.action !== 'HOLD');

  const handleCopyBasket = () => {
    const jsonStr = JSON.stringify(tradeOrders, null, 2);
    navigator.clipboard.writeText(jsonStr);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleExecuteBasket = () => {
    setExecuting(true);
    setTimeout(() => {
      setExecuting(false);
      setExecuted(true);
    }, 1500);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose} />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="card w-full max-w-xl p-6 relative rounded-3xl border border-border bg-surface z-10 space-y-6 shadow-2xl"
      >
        {/* Header */}
        <div className="flex justify-between items-center pb-4 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-accent-bg text-accent flex items-center justify-center border border-accent/20 shrink-0">
              <ShoppingBag size={20} />
            </div>
            <div>
              <h3 className="font-extrabold text-base text-text-primary">One-Click Rebalance Order Basket</h3>
              <p className="text-[11px] text-text-muted font-bold">Kite Publisher & Groww Order Format</p>
            </div>
          </div>
          <button onClick={onClose} className="w-8 h-8 rounded-full bg-bg border border-border flex items-center justify-center text-text-muted hover:text-text-primary text-xs font-bold cursor-pointer">
            <X size={16} />
          </button>
        </div>

        {/* Order List */}
        <div className="space-y-3">
          <div className="flex justify-between items-center text-[10px] font-extrabold uppercase text-text-muted">
            <span>Asset Domain</span>
            <span>Action & Rupee Amount</span>
          </div>

          <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
            {tradeOrders.map((order, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-bg border border-border flex justify-between items-center text-xs font-bold">
                <div className="flex items-center gap-2">
                  <span className={`px-2 py-0.5 rounded text-[10px] font-black uppercase ${
                    order.action === 'BUY' ? 'bg-gain-bg text-gain border border-gain/20' : 'bg-loss-bg text-loss border border-loss/20'
                  }`}>
                    {order.action}
                  </span>
                  <span className="text-text-primary">{order.label}</span>
                </div>
                <div className="text-right font-mono font-extrabold">
                  <span className={order.action === 'BUY' ? 'text-gain' : 'text-loss'}>
                    {order.action === 'BUY' ? '+' : '-'}₹{order.amount.toLocaleString('en-IN')}
                  </span>
                  <span className="text-[10px] text-text-muted block font-medium">({order.pctChange > 0 ? '+' : ''}{order.pctChange}%)</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-2 border-t border-border flex flex-col sm:flex-row gap-3">
          <button 
            onClick={handleCopyBasket}
            className="flex-1 py-3 px-4 rounded-xl bg-bg border border-border hover:border-accent text-text-primary font-bold text-xs flex items-center justify-center gap-2 transition-colors cursor-pointer"
          >
            <Copy size={16} className="text-accent" />
            <span>{copied ? '✓ JSON Basket Copied!' : 'Copy Order Basket JSON'}</span>
          </button>

          <button 
            onClick={handleExecuteBasket}
            disabled={executing || executed}
            className="flex-1 py-3 px-4 rounded-xl bg-accent text-white font-extrabold text-xs hover:bg-accent/90 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-60 cursor-pointer"
          >
            {executing ? (
              <>
                <RefreshCw size={16} className="animate-spin" />
                <span>Transmitting Orders...</span>
              </>
            ) : executed ? (
              <>
                <CheckCircle2 size={16} />
                <span>Orders Transmitted to Brokers</span>
              </>
            ) : (
              <>
                <Zap size={16} />
                <span>Execute Order Basket</span>
              </>
            )}
          </button>
        </div>
      </motion.div>
    </div>
  );
}
