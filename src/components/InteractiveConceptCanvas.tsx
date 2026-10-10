'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, Layers, ShieldCheck, HelpCircle, Award, 
  TrendingUp, Building2, Landmark, ShieldAlert, ArrowRight, Zap, RefreshCw 
} from 'lucide-react';

type ConceptType = 'stocks' | 'mutual-funds' | 'etfs' | 'bonds' | 'reits' | 'invits' | 'futures-options' | string;

export function InteractiveConceptCanvas({ assetId, title }: { assetId: ConceptType; title: string }) {
  // Pizza Slices State (for Pizza / Basket Metaphors)
  const [sliceCount, setSliceCount] = useState(8);
  const [selectedSlice, setSelectedSlice] = useState<number | null>(null);

  // REIT Building Floors State
  const [floors, setFloors] = useState(5);
  
  // Bond Interest Coins State
  const [coinsCount, setCoinsCount] = useState(4);

  // F&O Leverage Multiplier State
  const [leverage, setLeverage] = useState(5);
  const [positionType, setPositionType] = useState<'CALL' | 'PUT'>('CALL');

  const assetKey = assetId.toLowerCase();

  return (
    <div className="card p-6 md:p-8 bg-surface border border-border rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
      
      {/* ANIMATED LEARNER FACE WITH FLOATING QUESTION MARKS HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          
          {/* Inquisitive Learner Avatar Face with Floating Question Marks */}
          <div className="relative">
            <motion.div 
              animate={{ y: [0, -4, 0] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: 'easeInOut' }}
              className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-accent via-purple-500 to-indigo-500 flex items-center justify-center text-2xl shadow-md border-2 border-white/20 relative"
            >
              🧑‍💻
            </motion.div>

            {/* Animated Floating Question Marks Floating Up */}
            <motion.div 
              animate={{ y: [-5, -28, -5], opacity: [0.2, 1, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeOut' }}
              className="absolute -top-3 -right-2 text-sm font-black text-amber-400 drop-shadow-md pointer-events-none"
            >
              ❓
            </motion.div>
            <motion.div 
              animate={{ y: [0, -22, 0], opacity: [0.1, 0.9, 0] }}
              transition={{ duration: 2.3, repeat: Infinity, ease: 'easeOut', delay: 0.6 }}
              className="absolute -top-4 -left-2 text-xs font-black text-cyan-400 drop-shadow-md pointer-events-none"
            >
              ❓
            </motion.div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-accent-bg text-accent text-[10px] font-extrabold uppercase tracking-widest border border-accent/20">
                Interactive Visual Analogy
              </span>
              <span className="text-[10px] text-gain font-extrabold flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gain animate-ping"></span> Live Concept Simulator
              </span>
            </div>
            <h3 className="font-extrabold text-lg text-text-primary mt-1">
              Visualizing Mechanics: {title}
            </h3>
          </div>
        </div>

        {/* Mentor Avatar */}
        <div className="flex items-center gap-2.5 bg-bg px-3.5 py-2 rounded-2xl border border-border shrink-0">
          <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center text-lg">
            🧙‍♂️
          </div>
          <div>
            <span className="text-[10px] font-extrabold text-text-primary block">AI Master Mentor</span>
            <span className="text-[9px] text-text-muted">Tap controls to experiment</span>
          </div>
        </div>
      </div>

      {/* DYNAMIC DEDICATED VISUAL ANIMATIONS ACCORDING TO METAPHOR */}
      
      {/* 🍕 PIZZA & ASSET BASKET ANIMATION (For Stocks, Mutual Funds, ETFs) */}
      {(assetKey.includes('stock') || assetKey.includes('fund') || assetKey.includes('etf')) && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium flex items-center gap-2">
            <Sparkles size={16} className="shrink-0" />
            <span>
              {assetKey.includes('fund') 
                ? '🍕 Mutual Fund Pizza Metaphor: Multiple investors pool money to purchase a full pizza packed with diverse company toppings!'
                : assetKey.includes('etf')
                ? '🍱 ETF Combo Box Metaphor: A pre-packaged index combo box traded live on the stock exchange!'
                : '🍕 Stock Pizza Metaphor: Each stock share represents 1 slice of company ownership & earnings!'}
            </span>
          </div>

          {/* Interactive Pizza Visualizer Display */}
          <div className="flex flex-col md:flex-row items-center justify-around gap-6 p-6 bg-bg rounded-3xl border border-border relative">
            
            {/* Animated Pizza Graphic with Slices */}
            <div className="relative w-56 h-56 flex items-center justify-center">
              <motion.div 
                animate={{ rotate: 360 }}
                transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
                className="w-48 h-48 rounded-full border-8 border-amber-600 bg-amber-500/20 shadow-[0_0_30px_rgba(245,158,11,0.3)] flex items-center justify-center relative overflow-hidden"
              >
                {/* Pizza Crust & Cheese Texture */}
                <div className="absolute inset-0 bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 opacity-80"></div>
                
                {/* Pizza Toppings (Pepperoni / Stock Chips) */}
                <div className="absolute inset-0 flex flex-wrap items-center justify-around p-4 opacity-90 pointer-events-none">
                  {Array.from({ length: sliceCount }).map((_, idx) => (
                    <motion.div 
                      key={idx}
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity, delay: idx * 0.2 }}
                      className="w-5 h-5 rounded-full bg-red-600 border border-amber-200 shadow-md flex items-center justify-center text-[8px] font-black text-white"
                    >
                      {idx % 2 === 0 ? 'RELI' : 'TCS'}
                    </motion.div>
                  ))}
                </div>

                {/* Slice Dividers */}
                {Array.from({ length: sliceCount }).map((_, idx) => (
                  <div 
                    key={idx} 
                    className="absolute w-full h-[2px] bg-amber-900/60"
                    style={{ transform: `rotate(${(360 / sliceCount) * idx}deg)` }}
                  />
                ))}
              </motion.div>

              {/* Floating Slice Interactive Label */}
              <div className="absolute -bottom-2 px-3 py-1 rounded-full bg-accent text-white text-[10px] font-black uppercase tracking-wider shadow-lg">
                {sliceCount} Share Slices Active
              </div>
            </div>

            {/* Interactive Pizza Slice Controls */}
            <div className="space-y-4 text-xs max-w-xs w-full">
              <div className="p-4 rounded-2xl bg-surface border border-border space-y-2">
                <div className="flex justify-between font-extrabold text-text-primary">
                  <span>Pizza Slice Allocation</span>
                  <span className="font-mono text-accent">{sliceCount} Slices</span>
                </div>
                <input 
                  type="range" 
                  min="4" 
                  max="12" 
                  step="2"
                  value={sliceCount}
                  onChange={e => setSliceCount(Number(e.target.value))}
                  className="w-full h-2 bg-bg rounded-lg appearance-none cursor-pointer accent-accent"
                />
                <p className="text-[10px] text-text-muted">
                  More slices = greater diversification across company sectors!
                </p>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => setSliceCount(prev => Math.min(12, prev + 2))}
                  className="flex-1 py-2 rounded-xl bg-accent-bg text-accent font-extrabold border border-accent/20 hover:bg-accent/20 transition-all text-[11px]"
                >
                  🍕 Add Slice (+2)
                </button>
                <button 
                  onClick={() => setSliceCount(8)}
                  className="py-2 px-3 rounded-xl bg-bg text-text-muted font-bold border border-border hover:text-text-primary transition-all text-[11px]"
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 🏢 REITS SKYSCRAPER TOWER ANIMATION (For REITs) */}
      {assetKey.includes('reit') && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-teal-500/10 border border-teal-500/30 text-teal-400 text-xs font-medium flex items-center gap-2">
            <Building2 size={16} className="shrink-0" />
            <span>
              🏢 REIT Skyscraper Metaphor: Own fractionated floors of prime commercial IT parks without needing ₹50 Crore to buy the entire tower!
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-around gap-6 p-6 bg-bg rounded-3xl border border-border">
            
            {/* Animated Stacking Building Tower */}
            <div className="flex flex-col-reverse gap-1.5 w-44">
              {Array.from({ length: floors }).map((_, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: -20, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  transition={{ duration: 0.3, delay: idx * 0.08 }}
                  className="h-9 rounded-xl bg-teal-600/30 border border-teal-400/50 flex items-center justify-between px-3 text-[10px] font-black text-teal-200 shadow-md"
                >
                  <div className="flex items-center gap-1.5">
                    <Building2 size={12} className="text-teal-400" />
                    <span>Floor #{idx + 1} Rent</span>
                  </div>
                  <span className="font-mono text-gain">₹{(idx + 1) * 1250}</span>
                </motion.div>
              ))}
              <div className="h-3 rounded-t-lg bg-slate-700 text-[8px] font-bold text-center text-slate-300 uppercase">
                Shopping Mall & Tech Park Tower
              </div>
            </div>

            {/* Floor Controls */}
            <div className="space-y-4 text-xs max-w-xs w-full">
              <div className="p-4 rounded-2xl bg-surface border border-border space-y-2">
                <div className="flex justify-between font-extrabold text-text-primary">
                  <span>Commercial Building Floors</span>
                  <span className="font-mono text-teal-400">{floors} Floors</span>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="8" 
                  step="1"
                  value={floors}
                  onChange={e => setFloors(Number(e.target.value))}
                  className="w-full h-2 bg-bg rounded-lg appearance-none cursor-pointer accent-teal-500"
                />
                <p className="text-[10px] text-text-muted">
                  Quarterly tenant rental yield generated: <strong className="text-gain font-mono">₹{(floors * 1250 * 4).toLocaleString('en-IN')}/yr</strong>
                </p>
              </div>

              <button 
                onClick={() => setFloors(prev => (prev >= 8 ? 2 : prev + 1))}
                className="w-full py-2.5 rounded-xl bg-teal-500/20 text-teal-300 border border-teal-500/30 font-extrabold hover:bg-teal-500/30 transition-all text-xs"
              >
                🏢 Build Another REIT Floor (+1)
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 📜 BONDS GOLDEN TREASURY CERTIFICATE & YIELD COINS ANIMATION */}
      {assetKey.includes('bond') && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-medium flex items-center gap-2">
            <Landmark size={16} className="shrink-0" />
            <span>
              📜 Bond IOU Metaphor: Become a lender to governments & AAA corporations! Receive guaranteed periodic interest coupon payments.
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-around gap-6 p-6 bg-bg rounded-3xl border border-border">
            
            {/* Animated Golden Bond Certificate */}
            <motion.div 
              animate={{ y: [0, -6, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
              className="w-64 p-5 rounded-3xl bg-gradient-to-b from-amber-100 to-amber-200 border-4 border-amber-500 text-amber-950 shadow-2xl space-y-3 relative overflow-hidden"
            >
              <div className="flex justify-between items-center pb-2 border-b border-amber-400">
                <span className="text-[10px] font-black uppercase tracking-wider text-amber-800">Govt of India Treasury Bond</span>
                <span className="text-[10px] font-mono font-bold bg-amber-400/50 px-2 py-0.5 rounded">7.5% Coupon</span>
              </div>

              <div className="text-center py-2 space-y-1">
                <p className="text-[10px] text-amber-800 font-bold uppercase">Fixed Income Face Value</p>
                <p className="text-2xl font-black font-mono tracking-tight text-amber-950">₹1,00,000</p>
              </div>

              {/* Dropping Coupon Gold Coins */}
              <div className="flex justify-center gap-2 py-1">
                {Array.from({ length: coinsCount }).map((_, i) => (
                  <motion.div 
                    key={i}
                    animate={{ y: [-15, 0], scale: [0.7, 1] }}
                    transition={{ duration: 0.5, delay: i * 0.15 }}
                    className="w-7 h-7 rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 border-2 border-amber-600 flex items-center justify-center font-black text-amber-950 text-xs shadow-md"
                  >
                    🪙
                  </motion.div>
                ))}
              </div>

              <div className="text-[9px] text-amber-800 text-center font-semibold border-t border-amber-300 pt-2">
                Guaranteed Semi-Annual Coupon Payout
              </div>
            </motion.div>

            {/* Controls */}
            <div className="space-y-4 text-xs max-w-xs w-full">
              <div className="p-4 rounded-2xl bg-surface border border-border space-y-2">
                <div className="flex justify-between font-extrabold text-text-primary">
                  <span>Interest Coupon Coins</span>
                  <span className="font-mono text-amber-500">{coinsCount} Payouts</span>
                </div>
                <input 
                  type="range" 
                  min="2" 
                  max="6" 
                  step="1"
                  value={coinsCount}
                  onChange={e => setCoinsCount(Number(e.target.value))}
                  className="w-full h-2 bg-bg rounded-lg appearance-none cursor-pointer accent-amber-500"
                />
                <p className="text-[10px] text-text-muted">
                  Guaranteed Annual Income: <strong className="text-gain font-mono">₹7,500/yr</strong>
                </p>
              </div>

              <button 
                onClick={() => setCoinsCount(prev => (prev >= 6 ? 2 : prev + 1))}
                className="w-full py-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 font-extrabold hover:bg-amber-500/30 transition-all text-xs"
              >
                🪙 Simulate Interest Coupon Payout
              </button>
            </div>

          </div>
        </div>
      )}

      {/* 🌉 INVIT HIGHWAY & INFRASTRUCTURE TOWER ANIMATION */}
      {assetKey.includes('invit') && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 text-xs font-medium flex items-center gap-2">
            <Landmark size={16} className="shrink-0" />
            <span>
              🌉 InvIT Infrastructure Metaphor: Own a share of national highways, toll plazas & power transmission lines that generate constant toll cashflows!
            </span>
          </div>

          <div className="p-6 bg-bg rounded-3xl border border-border flex flex-col items-center gap-4">
            
            {/* Moving Highway Toll Vehicles Graphic */}
            <div className="relative w-full h-28 bg-slate-900 rounded-2xl border border-slate-700 overflow-hidden flex items-center justify-between px-6">
              
              {/* Toll Plaza Marker */}
              <div className="absolute left-1/2 -translate-x-1/2 h-full w-8 bg-amber-500/20 border-x-2 border-amber-400 flex flex-col items-center justify-center text-[8px] font-black text-amber-300 uppercase">
                TOLL
              </div>

              {/* Moving Car 1 */}
              <motion.div 
                animate={{ x: [-20, 480] }}
                transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                className="text-2xl relative z-10"
              >
                🚗
              </motion.div>

              {/* Moving Truck 2 */}
              <motion.div 
                animate={{ x: [-50, 450] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear', delay: 1.5 }}
                className="text-2xl relative z-10"
              >
                🚛
              </motion.div>

              {/* Center Line */}
              <div className="absolute w-full h-[2px] bg-dashed bg-slate-500 border-t border-dashed border-slate-400"></div>
            </div>

            <div className="text-center space-y-1">
              <span className="text-xs font-black text-purple-300">National Highway Toll Plaza Cashflow</span>
              <p className="text-[11px] text-text-muted">Vehicles passing through toll gates generate quarterly cash payouts directly into your bank account!</p>
            </div>
          </div>
        </div>
      )}

      {/* 🚀 FUTURES & OPTIONS LEVERAGE SHIELD ANIMATION */}
      {assetKey.includes('future') && (
        <div className="space-y-6">
          <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-medium flex items-center gap-2">
            <ShieldAlert size={16} className="shrink-0" />
            <span>
              ⚡ F&O Leverage Metaphor: Make financial contracts on directional price moves. Call Options bet UP ↗; Put Options bet DOWN ↘. High multiplier leverage!
            </span>
          </div>

          <div className="flex flex-col md:flex-row items-center justify-around gap-6 p-6 bg-bg rounded-3xl border border-border">
            
            {/* Animated Call / Put Arrow Graphic */}
            <div className="flex items-center gap-4">
              <motion.button 
                onClick={() => setPositionType('CALL')}
                animate={{ scale: positionType === 'CALL' ? 1.08 : 0.95 }}
                className={`p-5 rounded-3xl border-2 text-center space-y-2 cursor-pointer transition-all ${
                  positionType === 'CALL' ? 'bg-emerald-950/80 border-emerald-500 text-emerald-300 shadow-[0_0_25px_rgba(16,185,129,0.4)]' : 'bg-surface border-border text-text-muted'
                }`}
              >
                <div className="text-3xl font-black">↗ CALL</div>
                <div className="text-[10px] font-bold">Bullish Market View</div>
              </motion.button>

              <motion.button 
                onClick={() => setPositionType('PUT')}
                animate={{ scale: positionType === 'PUT' ? 1.08 : 0.95 }}
                className={`p-5 rounded-3xl border-2 text-center space-y-2 cursor-pointer transition-all ${
                  positionType === 'PUT' ? 'bg-rose-950/80 border-rose-500 text-rose-300 shadow-[0_0_25px_rgba(244,63,94,0.4)]' : 'bg-surface border border-border text-text-muted'
                }`}
              >
                <div className="text-3xl font-black">↘ PUT</div>
                <div className="text-[10px] font-bold">Bearish / Hedging View</div>
              </motion.button>
            </div>

            {/* Leverage Slider */}
            <div className="space-y-3 text-xs max-w-xs w-full">
              <div className="p-4 rounded-2xl bg-surface border border-border space-y-2">
                <div className="flex justify-between font-extrabold text-text-primary">
                  <span>Derivatives Leverage Multiplier</span>
                  <span className="font-mono text-red-400">{leverage}x Leverage</span>
                </div>
                <input 
                  type="range" 
                  min="1" 
                  max="10" 
                  step="1"
                  value={leverage}
                  onChange={e => setLeverage(Number(e.target.value))}
                  className="w-full h-2 bg-bg rounded-lg appearance-none cursor-pointer accent-red-500"
                />
                <p className="text-[10px] font-mono text-text-muted">
                  ₹10,000 Margin Controls <strong className="text-text-primary">₹{(10000 * leverage).toLocaleString('en-IN')}</strong> Market Exposure!
                </p>
              </div>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
