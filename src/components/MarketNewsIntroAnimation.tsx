'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bell, Newspaper, Radio, Zap, TrendingUp, Sparkles, X, ShieldAlert, Globe } from 'lucide-react';

const ALERT_ITEMS = [
  { id: 1, text: '🔔 LIVE: RBI Monetary Policy Update', source: 'Economic Times', sentiment: 'BULLISH', color: 'bg-emerald-950/80 border-emerald-500/80 text-emerald-300', x: -280, y: -160, r: -12 },
  { id: 2, text: '⚡ BREAKING: NIFTY 50 Hits All-Time High', source: 'Reuters', sentiment: 'BULLISH', color: 'bg-blue-950/80 border-blue-500/80 text-blue-300', x: 260, y: -200, r: 15 },
  { id: 3, text: '📢 Q3 Earnings Report Beat Estimates', source: 'Times of India', sentiment: 'BULLISH', color: 'bg-purple-950/80 border-purple-500/80 text-purple-300', x: -320, y: 110, r: -8 },
  { id: 4, text: '🚨 SEBI Guidelines on F&O Leverage', source: 'Moneycontrol', sentiment: 'BEARISH', color: 'bg-red-950/80 border-red-500/80 text-red-300', x: 280, y: 150, r: 10 },
  { id: 5, text: '🔔 US Fed Rate Decision Announcement', source: 'Financial Express', sentiment: 'NEUTRAL', color: 'bg-amber-950/80 border-amber-500/80 text-amber-300', x: -160, y: -250, r: 6 },
  { id: 6, text: '📡 FII & DII Inflow Telemetry Signal', source: 'Unify Intelligence', sentiment: 'BULLISH', color: 'bg-cyan-950/80 border-cyan-500/80 text-cyan-300', x: 220, y: -100, r: -18 },
  { id: 7, text: '🔔 Inflation Figures Drop to 3-Year Low', source: 'Economic Times', sentiment: 'BULLISH', color: 'bg-emerald-950/80 border-emerald-500/80 text-emerald-200', x: -250, y: -30, r: 12 },
  { id: 8, text: '⚡ Crude Oil Price Adjustment Signals', source: 'Reuters', sentiment: 'NEUTRAL', color: 'bg-slate-900/90 border-slate-600 text-slate-300', x: 320, y: -20, r: -14 },
];

export function MarketNewsIntroAnimation({ onComplete }: { onComplete?: () => void }) {
  const [phase, setPhase] = useState<'broadcasting' | 'synthesizing' | 'unveil' | 'done'>('broadcasting');

  useEffect(() => {
    // Phase 1 -> Synthesizing (1.8s)
    const timer1 = setTimeout(() => setPhase('synthesizing'), 1800);
    // Phase 2 -> Unveil (3.2s)
    const timer2 = setTimeout(() => setPhase('unveil'), 3200);
    // Phase 3 -> Done (4.0s)
    const timer3 = setTimeout(() => {
      setPhase('done');
      if (onComplete) onComplete();
    }, 4000);

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
        key="news-intro-overlay"
        initial={{ opacity: 1 }}
        animate={{ opacity: phase === 'unveil' ? 0 : 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.8 }}
        className="fixed inset-0 z-[100] bg-slate-950 text-white flex flex-col items-center justify-center overflow-hidden font-sans select-none"
      >
        {/* Background Radial Signal Grid */}
        <div className="absolute inset-0 bg-[radial-gradient(#7C3AED_1.5px,transparent_1.5px)] [background-size:36px_36px] opacity-20 pointer-events-none"></div>

        {/* Pulsing Radar Rings in Background */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <motion.div 
            animate={{ scale: [0.8, 2.2, 0.8], opacity: [0.3, 0.05, 0.3] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="w-[450px] h-[450px] rounded-full border border-purple-500/30"
          />
          <motion.div 
            animate={{ scale: [1, 3, 1], opacity: [0.2, 0.02, 0.2] }}
            transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="w-[600px] h-[600px] rounded-full border border-cyan-500/20"
          />
        </div>

        {/* Skip Animation Button */}
        <button 
          onClick={() => {
            setPhase('done');
            if (onComplete) onComplete();
          }}
          className="absolute top-6 right-6 px-4 py-2 rounded-full bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-extrabold text-white backdrop-blur-md transition-all flex items-center gap-1.5 z-50 shadow-lg cursor-pointer"
        >
          <span>Skip Animation</span>
          <X size={14} />
        </button>

        {/* CENTRAL NEWS & ALERT INTELLIGENCE BEACON */}
        <div className="relative z-20 flex flex-col items-center text-center px-4">
          
          {/* Animated Ringing Bell & Newspaper Emblem */}
          <div className="relative">
            <motion.div 
              animate={{ 
                scale: phase === 'synthesizing' ? [1, 1.25, 0.95, 1.35] : [0.95, 1.05, 0.95],
                rotate: phase === 'broadcasting' ? [-8, 8, -8] : (phase === 'synthesizing' ? [0, 180, 360] : 0)
              }}
              transition={{ 
                duration: phase === 'broadcasting' ? 0.6 : (phase === 'synthesizing' ? 1.4 : 2),
                repeat: phase === 'broadcasting' ? Infinity : 0,
                repeatType: 'reverse'
              }}
              className="w-28 h-28 rounded-3xl bg-gradient-to-tr from-amber-500 via-purple-600 to-cyan-500 flex items-center justify-center shadow-[0_0_90px_rgba(245,158,11,0.6)] border-2 border-white/40 relative"
            >
              {phase === 'broadcasting' ? (
                <Bell className="w-14 h-14 text-white drop-shadow-md animate-pulse" />
              ) : (
                <Newspaper className="w-14 h-14 text-white drop-shadow-md" />
              )}
            </motion.div>

            {/* Pulsing Broadcast Soundwaves */}
            {phase === 'broadcasting' && (
              <>
                <motion.div 
                  animate={{ scale: [1, 1.8], opacity: [0.8, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut' }}
                  className="absolute -inset-2 rounded-3xl border-2 border-amber-400 pointer-events-none"
                />
                <motion.div 
                  animate={{ scale: [1, 2.4], opacity: [0.6, 0] }}
                  transition={{ duration: 1.2, repeat: Infinity, ease: 'easeOut', delay: 0.3 }}
                  className="absolute -inset-4 rounded-3xl border-2 border-purple-400 pointer-events-none"
                />
              </>
            )}

            {/* Shockwave Burst during Synthesizing */}
            {phase === 'synthesizing' && (
              <motion.div 
                initial={{ scale: 0.5, opacity: 1 }}
                animate={{ scale: 3.8, opacity: 0 }}
                transition={{ duration: 1.2, ease: 'easeOut' }}
                className="absolute inset-0 rounded-3xl border-4 border-cyan-400 pointer-events-none"
              />
            )}
          </div>

          {/* Central Animated Text & Status Banner */}
          <motion.div className="mt-8 space-y-2">
            {phase === 'broadcasting' && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}>
                <span className="px-3.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 mx-auto w-fit">
                  <Radio size={12} className="animate-pulse text-amber-400" />
                  📡 LIVE DISPATCH SIGNALS DETECTED
                </span>
                <h1 className="text-3xl md:text-5xl font-black text-white mt-2 tracking-tight">
                  INCOMING MARKET ALERTS...
                </h1>
              </motion.div>
            )}

            {phase === 'synthesizing' && (
              <motion.div initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }}>
                <span className="px-3.5 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 mx-auto w-fit animate-pulse">
                  <Sparkles size={12} className="text-cyan-400" />
                  SYNTHESIZING VERIFIED COVERAGE
                </span>
                <h1 className="text-4xl md:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-purple-300 to-cyan-300 mt-2 tracking-tight">
                  TIMES OF INDIA • ET • REUTERS • MONEYCONTROL
                </h1>
              </motion.div>
            )}

            {phase === 'unveil' && (
              <motion.div initial={{ opacity: 0, scale: 1.1 }} animate={{ opacity: 1, scale: 1 }}>
                <span className="px-3.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 mx-auto w-fit">
                  ✓ FINANCIAL INTELLIGENCE READY
                </span>
                <h1 className="text-4xl md:text-6xl font-black text-white mt-2 tracking-tight">
                  MARKET NEWS FEED
                </h1>
              </motion.div>
            )}
          </motion.div>

        </div>

        {/* FLOATING NEWS ALERTS & BELL CAPSULES (Converge inward on synthesizing) */}
        {ALERT_ITEMS.map((item) => {
          const targetX = phase === 'synthesizing' || phase === 'unveil' ? 0 : item.x;
          const targetY = phase === 'synthesizing' || phase === 'unveil' ? 0 : item.y;
          const targetScale = phase === 'synthesizing' || phase === 'unveil' ? 0 : 1;
          const targetOpacity = phase === 'synthesizing' || phase === 'unveil' ? 0 : 0.95;

          return (
            <motion.div
              key={item.id}
              initial={{ x: item.x, y: item.y, rotate: item.r, opacity: 0 }}
              animate={{ 
                x: targetX, 
                y: targetY, 
                rotate: phase === 'synthesizing' ? item.r * 4 : item.r,
                scale: targetScale,
                opacity: targetOpacity
              }}
              transition={{ 
                duration: phase === 'synthesizing' ? 1.1 : 0.8,
                ease: phase === 'synthesizing' ? [0.6, -0.05, 0.01, 0.99] : 'easeOut'
              }}
              className={`absolute px-4 py-2.5 rounded-2xl border text-xs font-black shadow-2xl backdrop-blur-md pointer-events-none flex items-center gap-2 ${item.color}`}
            >
              <span>{item.text}</span>
              <span className="text-[9px] opacity-75 font-mono">({item.source})</span>
            </motion.div>
          );
        })}

        {/* Footer Attribution */}
        <div className="absolute bottom-8 text-[10px] text-slate-400 font-mono tracking-widest uppercase flex items-center gap-2">
          <Globe size={12} className="text-amber-400" />
          Unify Financial Market News Stream • Real-Time Media Intelligence
        </div>

      </motion.div>
    </AnimatePresence>
  );
}
