'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { STOCKS_LESSON } from '@/lib/content/lessons';
import Dialogue from '@/components/Dialogue';
import { Aarav, Meera } from '@/components/Characters';
import { simulateStocks } from '@/lib/simulations/stocks';
import { Play, Pause, RotateCcw, TrendingUp, TrendingDown, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

const INTRO_DIALOGUE = [
  { id: '1', speaker: 'aarav' as const, text: 'I keep hearing about people making money in the stock market, but it sounds like gambling. What actually is a stock?', expression: 'thinking' as const },
  { id: '2', speaker: 'meera' as const, text: 'It is definitely not gambling if done right! When you buy a stock, you are literally buying a small piece of a real business.', expression: 'happy' as const },
  { id: '3', speaker: 'aarav' as const, text: 'So if I buy shares in a shoe company, I own part of their factories and sales?', expression: 'surprised' as const },
  { id: '4', speaker: 'meera' as const, text: 'Exactly. Let\'s look at a simple analogy to see how it works.' }
];

export default function StocksLesson() {
  const lesson = STOCKS_LESSON;
  
  // Simulation State
  const [simRunning, setSimRunning] = useState(false);
  const [simStep, setSimStep] = useState(0);
  const [simData, setSimData] = useState(() => simulateStocks(500, 0.15));

  // Calculator State
  const [calcPrice, setCalcPrice] = useState(500);
  const [calcQty, setCalcQty] = useState(10);
  const calcInvested = 5000;
  const calcCurrent = calcPrice * calcQty;
  const calcPnl = calcCurrent - calcInvested;
  const calcPct = (calcPnl / calcInvested) * 100;

  // Challenge State
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);

  const runSimulation = () => {
    if (simStep >= 12) return;
    setSimRunning(true);
    const interval = setInterval(() => {
      setSimStep(prev => {
        if (prev >= 11) {
          clearInterval(interval);
          setSimRunning(false);
          return 12;
        }
        return prev + 1;
      });
    }, 800);
  };

  const resetSimulation = () => {
    setSimRunning(false);
    setSimStep(0);
    setSimData(simulateStocks(500, 0.15));
  };

  return (
    <div className="max-w-4xl mx-auto pb-32 space-y-24">
      {/* Header */}
      <div className="text-center space-y-4 pt-10">
        <div className="sub-heading justify-center">Asset Class 01</div>
        <h1 className="heading-hero text-5xl">{lesson.title}</h1>
        <p className="text-text-secondary text-sm">Educational content, not investment advice.</p>
      </div>

      {/* 1. Meet the characters */}
      <section>
        <Dialogue messages={INTRO_DIALOGUE} />
      </section>

      {/* 2. What is it? (Pizza Analogy) */}
      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} className="card p-10 bg-accent/5 border-accent/20 flex flex-col md:flex-row items-center gap-10">
        <div className="flex-1 space-y-4">
          <h2 className="text-2xl font-bold">What are stocks?</h2>
          <p className="text-text-secondary leading-relaxed whitespace-pre-wrap">{lesson.sections.whatIsIt.text}</p>
        </div>
        <div className="w-64 h-64 shrink-0 relative">
          <svg viewBox="0 0 100 100" className="w-full h-full animate-[spin_60s_linear_infinite]">
            <circle cx="50" cy="50" r="45" fill="#FCD34D" stroke="#D97706" strokeWidth="2" />
            <path d="M50 5 L50 50 L95 50" fill="none" stroke="#D97706" strokeWidth="2" />
            <path d="M95 50 L50 50 L50 95" fill="none" stroke="#D97706" strokeWidth="2" />
            <path d="M50 95 L50 50 L5 50" fill="none" stroke="#D97706" strokeWidth="2" />
            <path d="M5 50 L50 50 L50 5" fill="none" stroke="#D97706" strokeWidth="2" />
            <circle cx="30" cy="30" r="4" fill="#DC2626" />
            <circle cx="70" cy="30" r="4" fill="#DC2626" />
            <circle cx="30" cy="70" r="4" fill="#DC2626" />
            <circle cx="70" cy="70" r="4" fill="#DC2626" />
            <circle cx="50" cy="50" r="45" fill="var(--color-accent)" opacity="0.2" className="animate-pulse" />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center font-bold text-accent bg-white/80 rounded-full m-8 text-center text-sm shadow-sm backdrop-blur-sm">
            {lesson.sections.whatIsIt.analogy}
          </div>
        </div>
      </motion.section>

      {/* 3. How it works (Stepper) */}
      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}>
        <h2 className="text-2xl font-bold mb-8">How do stocks work?</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {lesson.sections.howItWorks.steps.map((step, i) => (
            <div key={i} className="card p-6 relative overflow-hidden group">
              <div className="text-6xl font-black text-bg absolute -top-4 -right-2 z-0 group-hover:scale-110 transition-transform">
                {i + 1}
              </div>
              <div className="relative z-10">
                <h3 className="font-bold mb-2">Step {i+1}:<br/>{step.title}</h3>
                <p className="text-sm text-text-secondary">{step.text}</p>
              </div>
            </div>
          ))}
        </div>
      </motion.section>

      {/* 4. Calculator */}
      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} className="card p-10">
        <h2 className="text-2xl font-bold mb-4">How much return can stocks generate?</h2>
        <p className="text-text-secondary mb-8">{lesson.sections.returns.intro}</p>
        
        <div className="bg-bg rounded-xl p-6 border border-border">
          <p className="font-semibold mb-6">{lesson.sections.returns.example.setup}</p>
          <div className="flex flex-col md:flex-row gap-8 items-center">
            <div className="flex-1 w-full space-y-4">
              <label className="text-sm font-bold text-text-secondary flex justify-between">
                Current Share Price: <span className="text-accent text-lg">₹{calcPrice}</span>
              </label>
              <input 
                type="range" min="300" max="800" step="10" 
                value={calcPrice} onChange={(e) => setCalcPrice(Number(e.target.value))}
                className="w-full accent-accent"
              />
              <div className="flex justify-between text-xs text-text-muted">
                <span>Crash (₹300)</span>
                <span>Initial (₹500)</span>
                <span>Boom (₹800)</span>
              </div>
            </div>
            
            <div className={`card p-6 w-full md:w-64 text-center border-2 ${calcPnl > 0 ? 'border-gain' : calcPnl < 0 ? 'border-loss' : 'border-border'}`}>
              <p className="text-sm text-text-secondary mb-1">Current Value</p>
              <p className="text-3xl font-bold tabular-nums mb-2">₹{calcCurrent.toLocaleString('en-IN')}</p>
              <span className={calcPnl >= 0 ? 'pill-gain' : 'pill-loss'}>
                {calcPnl >= 0 ? '+' : ''}{calcPnl} ({calcPct >= 0 ? '+' : ''}{calcPct.toFixed(1)}%)
              </span>
            </div>
          </div>
          <p className="text-xs text-text-muted mt-6 text-center">{lesson.sections.returns.example.disclaimer}</p>
        </div>
      </motion.section>

      {/* 5. Pros / Cons */}
      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} className="grid md:grid-cols-2 gap-8">
        <div className="card p-8 border-t-4 border-t-gain">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><TrendingUp className="text-gain"/> Advantages</h3>
          <ul className="space-y-3">
            {lesson.sections.prosCons.advantages.map((adv, i) => (
              <li key={i} className="flex gap-3 text-sm text-text-secondary">
                <CheckCircle2 size={18} className="text-gain shrink-0" /> {adv}
              </li>
            ))}
          </ul>
        </div>
        <div className="card p-8 border-t-4 border-t-loss">
          <h3 className="text-xl font-bold mb-6 flex items-center gap-2"><TrendingDown className="text-loss"/> Risks</h3>
          <ul className="space-y-3">
            {lesson.sections.prosCons.risks.map((risk, i) => (
              <li key={i} className="flex gap-3 text-sm text-text-secondary">
                <XCircle size={18} className="text-loss shrink-0" /> {risk}
              </li>
            ))}
          </ul>
        </div>
      </motion.section>

      {/* 6. Try it (Simulation) */}
      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }}>
        <h2 className="text-2xl font-bold mb-2">Try it: The Rollercoaster</h2>
        <p className="text-text-secondary mb-6 text-sm">Simulated for learning. Not a prediction and not investment advice.</p>
        
        <div className="card p-6">
          <div className="flex justify-between items-end mb-6 border-b border-border pb-4">
            <div>
              <p className="text-sm font-bold text-text-secondary">Fictional Tech Corp</p>
              <div className="text-3xl font-bold tabular-nums">₹{simData[simStep].price.toFixed(2)}</div>
            </div>
            <div className="flex gap-2">
              {!simRunning && simStep < 12 ? (
                <button onClick={runSimulation} className="btn-primary flex items-center gap-2"><Play size={16}/> Start 1-Year Sim</button>
              ) : (
                <button onClick={resetSimulation} className="btn-secondary flex items-center gap-2"><RotateCcw size={16}/> Reset</button>
              )}
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={simData.slice(0, simStep + 1)} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--color-border)" opacity={0.5} />
                <XAxis dataKey="month" hide />
                <YAxis domain={['auto', 'auto']} hide />
                <RechartsTooltip contentStyle={{ backgroundColor: 'var(--color-surface)', border: '1px solid var(--color-border)', borderRadius: '12px', color: 'var(--color-text-primary)', boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.05)' }} itemStyle={{ color: 'var(--color-accent)', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="price" stroke="var(--color-accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" isAnimationActive={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          <div className="mt-6 h-12 flex items-center justify-center">
            {simData[simStep].news && (
              <div className={`px-4 py-2 rounded-lg text-sm font-bold animate-pulse ${simData[simStep].isPositive ? 'bg-gain-bg text-gain' : 'bg-loss-bg text-loss'}`}>
                Month {simStep}: {simData[simStep].news}
              </div>
            )}
          </div>
        </div>
      </motion.section>

      {/* 7. Challenge */}
      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} className="card p-10 bg-surface-hover">
        <h2 className="text-xl font-bold mb-6">Interactive Challenge</h2>
        <div className="flex gap-6 mb-6">
          <Aarav className="w-16 h-16 shrink-0" />
          <div className="bg-surface p-4 rounded-2xl rounded-tl-sm border border-border flex-1">
            <p className="font-semibold">{lesson.sections.challenge.text}</p>
          </div>
        </div>
        <div className="space-y-3">
          {lesson.sections.challenge.options.map((opt, i) => {
            const isSelected = selectedAnswer === i;
            const isCorrect = i === lesson.sections.challenge.correctIndex;
            let btnClass = "w-full text-left p-4 rounded-xl border transition-colors font-medium text-sm ";
            if (isSelected) {
              btnClass += isCorrect ? "bg-gain-bg border-gain text-gain" : "bg-loss-bg border-loss text-loss";
            } else {
              btnClass += "bg-surface border-border hover:border-accent";
            }

            return (
              <button key={i} onClick={() => setSelectedAnswer(i)} className={btnClass} disabled={selectedAnswer !== null}>
                {String.fromCharCode(65 + i)}. {opt}
              </button>
            );
          })}
        </div>
        {selectedAnswer !== null && (
          <div className="mt-6 flex gap-6">
            <Meera expression={selectedAnswer === lesson.sections.challenge.correctIndex ? 'happy' : 'neutral'} className="w-16 h-16 shrink-0" />
            <div className={`p-4 rounded-2xl rounded-tl-sm flex-1 ${selectedAnswer === lesson.sections.challenge.correctIndex ? 'bg-gain text-white' : 'bg-accent/10 text-text-primary'}`}>
              {selectedAnswer === lesson.sections.challenge.correctIndex 
                ? "Correct! You must investigate the business fundamentals, not just the revenue."
                : "Not quite. Remember our takeaway: revenue growth alone doesn't guarantee profitability. You must investigate expenses and debt!"}
            </div>
          </div>
        )}
      </motion.section>

      {/* 8. Stats */}
      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} className="border border-border rounded-xl overflow-hidden">
        <div className="bg-accent text-white p-4 font-bold">{lesson.sections.stats.title}</div>
        <div className="p-6 bg-surface space-y-4">
          {lesson.sections.stats.points.map((pt, i) => (
            <div key={i}>
              <span className="font-bold">{pt.label}:</span> <span className="text-text-secondary">{pt.value}</span>
            </div>
          ))}
          <p className="text-xs text-text-muted mt-4 italic">{lesson.sections.stats.disclaimer}</p>
        </div>
      </motion.section>

      {/* 9. Takeaway & Next */}
      <motion.section initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, margin: "-50px" }} className="flex flex-col items-center text-center space-y-8 pt-10 border-t border-border">
        <div>
          <div className="sub-heading mb-2">Learning Takeaway</div>
          <h2 className="text-2xl font-extrabold text-accent">{lesson.sections.takeaway}</h2>
        </div>
        <div className="flex gap-4">
          <Link href="/practice" className="btn-secondary">Practice Trading</Link>
          <Link href="/learn/mutual-funds" className="btn-primary flex items-center gap-2">Next Lesson: Mutual Funds <ArrowRight size={16}/></Link>
        </div>
      </motion.section>

    </div>
  );
}
