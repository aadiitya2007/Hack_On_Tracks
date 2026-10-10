'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, Layers, ShieldCheck, Zap, X } from 'lucide-react';

const MESSY_ITEMS = [
  { id: 1, text: '⚠️ Duplicate DP Fee Leak -₹420', color: 'bg-red-900/60 border-red-500/80 text-red-300', x: -280, y: -180, r: -18 },
  { id: 2, text: '📄 Scattered Zerodha Statement.pdf', color: 'bg-slate-800 border-slate-600 text-slate-300', x: 260, y: -220, r: 24 },
  { id: 3, text: '❌ Fragmented Groww Holdings', color: 'bg-amber-900/60 border-amber-500/80 text-amber-300', x: -320, y: 120, r: -12 },
  { id: 4, text: '💸 Hidden Mutual Fund Expense Ratios', color: 'bg-red-950 border-red-700 text-red-400', x: 280, y: 160, r: 15 },
  { id: 5, text: '📑 Missing CDSL CAS Contract Note', color: 'bg-slate-900 border-slate-700 text-slate-400', x: -150, y: -260, r: 8 },
  { id: 6, text: '❓ Uncalculated Portfolio Risk & VaR', color: 'bg-purple-950 border-purple-700 text-purple-300', x: 200, y: -120, r: -22 },
  { id: 7, text: '📊 RELIANCE 50 Qty (Zerodha)', color: 'bg-slate-800 border-slate-600 text-slate-200', x: -260, y: -50, r: 14 },
  { id: 8, text: '📊 RELIANCE 30 Qty (Groww Overlap)', color: 'bg-red-900/80 border-red-500 text-red-200', x: 340, y: -40, r: -16 },
  { id: 9, text: '🧾 Upstox Offline Trade Notes', color: 'bg-slate-900 border-slate-700 text-slate-300', x: -180, y: 220, r: -28 },
  { id: 10, text: '📉 Speculative Stock Tips & Hype', color: 'bg-orange-950 border-orange-700 text-orange-300', x: 150, y: 240, r: 20 },
];

export function CrumbleToUnifyIntro({ onComplete }: { onComplete?: () => void }) {
  const [phase, setPhase] = useState<'mess' | 'implode' | 'unveil' | 'done'>('mess');

  useEffect(() => {
    // Phase 1 -> Implode (1.8s)
    const timer1 = setTimeout(() => setPhase('implode'), 1800);
    // Phase 2 -> Unveil (3.4s)
    const timer2 = setTimeout(() => setPhase('unveil'), 3400);
    // Phase 3 -> Done (4.2s)
    const timer3 = setTimeout(() => {
      setPhase('done');
      if (onComplete) onComplete();
    }, 4200);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
    };
  }, [onComplete]);

  if (phase === 'done') return null;

  return (
    <AnimatePresence>
      <motion.div 
        key="splash-overlay"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === 'unveil' ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 z-[100] bg-black text-white flex flex-col items-center justify-center overflow-hidden font-sans select-none"
      >
        {/* Background Grid Lines */}
        <div className="absolute inset-0 bg-[radial-gradient(#6D28D9_1px,transparent_1px)] [background-size:32px_32px] opacity-20 pointer-events-none"></div>

        {/* Top Right Skip Button */}
        <button 
          onClick={() => {
            setPhase('done');
            if (onComplete) onComplete();
          }}
          className="absolute top-6 right-6 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-extrabold text-white backdrop-blur-md transition-all flex items-center gap-1.5 z-50"
        >
          <span>Skip Animation</span>
          <X size={14} />
        </button>

        {/* CENTRAL QUANTUM ENGINE CORE */}
        <div className="relative z-20 flex flex-col items-center text-center">
          
          {/* Pulsing Emblem Ring */}
          <motion.div 
            animate={{ 
              scale: phase === 'implode' ? [1, 1.3, 0.9, 1.5] : [0.9, 1.05, 0.9],
              rotate: phase === 'implode' ? 360 : 0
            }}
            transition={{ duration: phase === 'implode' ? 1.4 : 3, repeat: phase === 'mess' ? Infinity : 0 }}
            className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-accent via-purple-600 to-indigo-500 flex items-center justify-center shadow-[0_0_80px_rgba(109,40,217,0.8)] border-2 border-white/30 relative"
          >
            <span className="font-black text-6xl text-white drop-shadow-lg">U</span>
            
            {/* Shockwave Rings during implode */}
            {phase === 'implode' && (
              <motion.div 
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 3.5, opacity: 0 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="absolute inset-0 rounded-3xl border-4 border-accent"
              />
            )}
          </motion.div>

          {/* Central Animated Text Banner */}
          <motion.div className="mt-8 space-y-2">
            {phase === 'mess' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <span className="px-3 py-1 rounded-full bg-red-500/20 text-red-400 border border-red-500/30 text-[10px] font-black uppercase tracking-widest">
                  ⚠️ Fragmented Financial Chaos
                </span>
                <h1 className="text-3xl md:text-4xl font-black text-slate-200 mt-2 tracking-tight">
                  Scattered Brokers & Fee Leakage...
                </h1>
              </motion.div>
            )}

            {phase === 'implode' && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                <span className="px-3.5 py-1 rounded-full bg-accent-bg text-accent border border-accent/40 text-[10px] font-black uppercase tracking-widest animate-pulse">
                  ✨ Vacuum Synthesis Active
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-accent via-cyan-400 to-white mt-2 tracking-tight">
                  UNIFYING ALL YOUR WEALTH...
                </h1>
              </motion.div>
            )}

            {phase === 'unveil' && (
              <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }}>
                <span className="px-3.5 py-1 rounded-full bg-gain-bg text-gain border border-gain/40 text-[10px] font-black uppercase tracking-widest">
                  ✓ Portfolio Consolidated
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-white mt-2 tracking-tight">
                  WELCOME TO UNIFY
                </h1>
              </motion.div>
            )}
          </motion.div>

        </div>

        {/* CHAOTIC SCATTERED MESS ITEMS (Crumble & Implode Inward) */}
        {MESSY_ITEMS.map((item) => {
          // In 'mess' phase: items float chaotically at offset (x, y)
          // In 'implode' phase: items crumble, shrink, rotate, and pull into (0, 0)
          const targetX = phase === 'implode' || phase === 'unveil' ? 0 : item.x;
          const targetY = phase === 'implode' || phase === 'unveil' ? 0 : item.y;
          const targetScale = phase === 'implode' || phase === 'unveil' ? 0 : 1;
          const targetOpacity = phase === 'implode' || phase === 'unveil' ? 0 : 0.9;

          return (
            <motion.div
              key={item.id}
              initial={{ x: item.x, y: item.y, rotate: item.r, opacity: 0 }}
              animate={{ 
                x: targetX, 
                y: targetY, 
                rotate: phase === 'implode' ? item.r * 5 : item.r,
                scale: targetScale,
                opacity: targetOpacity
              }}
              transition={{ 
                duration: phase === 'implode' ? 1.2 : 0.8,
                ease: phase === 'implode' ? [0.6, -0.05, 0.01, 0.99] : 'easeOut'
              }}
              className={`absolute px-4 py-2.5 rounded-2xl border text-xs font-black shadow-2xl backdrop-blur-md pointer-events-none ${item.color}`}
            >
              {item.text}
            </motion.div>
          );
        })}

        {/* Bottom Ambient Glow */}
        <div className="absolute bottom-10 text-[10px] text-slate-500 font-mono tracking-widest uppercase">
          Unify Financial Telemetry Engine • Hack On Track 2026
        </div>

      </motion.div>
    </AnimatePresence>
  );
}
