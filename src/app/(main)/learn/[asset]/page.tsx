'use client';

import { useState, use } from 'react';
import { notFound } from 'next/navigation';
import { motion } from 'framer-motion';
import { LESSON_MAP, LessonData } from '@/lib/content/lessons';
import Dialogue from '@/components/Dialogue';
import { Aarav, Meera } from '@/components/Characters';
import { simulateStocks } from '@/lib/simulations/stocks';
import { Play, Pause, RotateCcw, TrendingUp, TrendingDown, ArrowRight, CheckCircle2, XCircle } from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, Tooltip as RechartsTooltip, CartesianGrid, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

// Use React.use() to unwrap params in Next.js 15
export default function AssetLesson({ params }: { params: Promise<{ asset: string }> }) {
  const unwrappedParams = use(params);
  const lessonKey = unwrappedParams.asset;
  const lesson = LESSON_MAP[lessonKey];

  if (!lesson) {
    notFound();
  }

  const [simStep, setSimStep] = useState(0);
  const [simRunning, setSimRunning] = useState(false);
  const [simData, setSimData] = useState(() => simulateStocks(500, 0.15, 12));
  
  const [calcSlider, setCalcSlider] = useState(500);
  const [challengeAns, setChallengeAns] = useState<number | null>(null);

  const INTRO_DIALOGUE = [
    { id: '1', speaker: 'aarav' as const, text: `I keep hearing about ${lesson.title.toLowerCase()}, but I don't really get it.`, expression: 'thinking' as const },
    { id: '2', speaker: 'meera' as const, text: `It's simpler than it sounds! Think of it like this: ${lesson.sections.whatIsIt.analogy}.`, expression: 'happy' as const },
    { id: '3', speaker: 'aarav' as const, text: 'Okay, that makes sense. So how does it actually work?', expression: 'surprised' as const }
  ];

  const runSimulation = () => {
    setSimRunning(true);
    let step = 0;
    const interval = setInterval(() => {
      step++;
      setSimStep(step);
      if (step >= 12) {
        clearInterval(interval);
        setSimRunning(false);
      }
    }, 500);
  };

  const resetSimulation = () => {
    setSimStep(0);
    setSimData(simulateStocks(500, 0.15, 12));
  };

  const calcValue = (calcSlider / 500) * lesson.sections.returns.example.initial;
  const calcGain = calcValue - lesson.sections.returns.example.initial;
  const calcPct = (calcGain / lesson.sections.returns.example.initial) * 100;

  return (
    <div className="max-w-4xl mx-auto space-y-16 pb-24">
      {/* Header */}
      <div className="text-center space-y-4">
        <Link href="/learn" className="text-sm font-bold text-text-muted hover:text-text-primary transition-colors flex items-center justify-center gap-2 mb-8">
          ← Back to Modules
        </Link>
        <div className="inline-block px-3 py-1 rounded-full bg-accent-bg text-accent text-[10px] font-bold uppercase tracking-widest">
          Module {lesson.colorType}
        </div>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight">{lesson.title}</h1>
      </div>

      {/* 1. Meet the Characters */}
      <section>
        <Dialogue messages={INTRO_DIALOGUE} />
      </section>

      {/* 2. What is it? */}
      <section className="card p-8 md:p-12 bg-surface text-center">
        <h2 className="text-2xl font-bold mb-6">What is it?</h2>
        <p className="text-lg text-text-secondary leading-relaxed max-w-2xl mx-auto whitespace-pre-wrap">
          {lesson.sections.whatIsIt.text}
        </p>
      </section>

      {/* 3. How it works (Stepper) */}
      <section>
        <h2 className="text-2xl font-bold mb-8 text-center">How it works</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {lesson.sections.howItWorks.steps.map((step, idx) => (
            <motion.div key={idx} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="card p-6 flex gap-4">
              <div className="w-10 h-10 rounded-full bg-surface-hover border border-border flex items-center justify-center font-bold text-accent shrink-0">
                {idx + 1}
              </div>
              <div>
                <h3 className="font-bold text-lg mb-2">{step.title}</h3>
                <p className="text-sm text-text-secondary leading-relaxed">{step.text}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* 4. Calculator */}
      <section className="card p-8 bg-surface">
        <h2 className="text-2xl font-bold mb-4 text-center">How much can it return?</h2>
        <p className="text-center text-text-secondary mb-8">{lesson.sections.returns.intro}</p>
        
        <div className="max-w-xl mx-auto space-y-8">
          <div className="text-center p-4 bg-bg rounded-xl border border-border">
            <p className="font-medium">{lesson.sections.returns.example.setup}</p>
          </div>

          <div>
            <div className="flex justify-between mb-2 text-sm font-bold text-text-muted">
              <span>Price Drops</span>
              <span>Price Rises</span>
            </div>
            <input 
              type="range" 
              min="300" 
              max="800" 
              value={calcSlider} 
              onChange={(e) => setCalcSlider(Number(e.target.value))}
              className="w-full accent-accent"
            />
          </div>

          <div className={`p-6 rounded-2xl text-center border transition-colors ${calcGain >= 0 ? 'bg-gain-bg border-gain/20' : 'bg-loss-bg border-loss/20'}`}>
            <p className="text-sm font-bold text-text-muted mb-2">Current Value</p>
            <p className={`text-4xl font-extrabold mb-2 tabular-nums ${calcGain >= 0 ? 'text-gain' : 'text-loss'}`}>
              ₹{calcValue.toLocaleString('en-IN', {maximumFractionDigits: 0})}
            </p>
            <p className={`font-bold tabular-nums ${calcGain >= 0 ? 'text-gain' : 'text-loss'}`}>
              {calcGain >= 0 ? '▲' : '▼'} ₹{Math.abs(calcGain).toLocaleString('en-IN', {maximumFractionDigits: 0})} ({calcPct > 0 ? '+' : ''}{calcPct.toFixed(1)}%)
            </p>
          </div>
          
          <p className="text-[10px] text-center text-text-muted">{lesson.sections.returns.example.disclaimer}</p>
        </div>
      </section>

      {/* 5. Simulation */}
      {lessonKey === 'stocks' && (
        <section className="card p-8 bg-surface overflow-hidden">
          <h2 className="text-2xl font-bold mb-4">The Rollercoaster Simulator</h2>
          <p className="text-text-secondary mb-8">Watch a 1-year mathematical random-walk simulation with simulated news events affecting the price.</p>
          
          <div className="flex flex-col md:flex-row gap-6 mb-8 items-center justify-between">
            <div className="flex gap-4 items-center">
              <div className="text-3xl font-extrabold tabular-nums">
                ₹{simData[simStep].price.toFixed(2)}
              </div>
              <div className={`px-3 py-1 rounded-full text-sm font-bold ${simData[simStep].price >= simData[0].price ? 'bg-gain-bg text-gain' : 'bg-loss-bg text-loss'}`}>
                {(((simData[simStep].price - simData[0].price) / simData[0].price) * 100).toFixed(2)}%
              </div>
            </div>
            
            <div className="flex gap-2">
              {!simRunning && simStep < 12 ? (
                <button onClick={runSimulation} className="btn-primary flex items-center gap-2"><Play size={16}/> Start 1-Year Sim</button>
              ) : (
                <button onClick={resetSimulation} className="px-4 py-2 border border-border hover:bg-surface-hover rounded-lg font-bold text-sm transition-colors flex items-center gap-2"><RotateCcw size={16}/> Reset</button>
              )}
            </div>
          </div>
          
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={simData.slice(0, simStep + 1)} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorPrice" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border)" opacity={0.5} />
                <XAxis dataKey="month" hide />
                <YAxis domain={['auto', 'auto']} hide />
                <RechartsTooltip contentStyle={{ backgroundColor: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', color: 'var(--text-primary)' }} itemStyle={{ color: 'var(--accent)', fontWeight: 'bold' }} />
                <Area type="monotone" dataKey="price" stroke="var(--accent)" strokeWidth={3} fillOpacity={1} fill="url(#colorPrice)" isAnimationActive={false} />
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
          <p className="text-[10px] text-text-muted mt-4 text-center">Simulated for learning. Not a prediction and not investment advice.</p>
        </section>
      )}

      {/* 6. Challenge */}
      <section className="card p-8 bg-surface">
        <h2 className="text-2xl font-bold mb-6 text-center">Interactive Challenge</h2>
        <div className="max-w-2xl mx-auto">
          <p className="font-medium text-lg mb-6">{lesson.sections.challenge.text}</p>
          <div className="space-y-3 mb-8">
            {lesson.sections.challenge.options.map((opt, i) => (
              <button 
                key={i}
                onClick={() => setChallengeAns(i)}
                className={`w-full text-left p-4 rounded-xl border transition-all font-medium ${
                  challengeAns === null 
                    ? 'border-border bg-bg hover:border-accent hover:shadow-sm' 
                    : i === lesson.sections.challenge.correctIndex
                      ? 'border-gain bg-gain-bg text-gain'
                      : challengeAns === i
                        ? 'border-loss bg-loss-bg text-loss'
                        : 'border-border bg-bg opacity-50'
                }`}
                disabled={challengeAns !== null}
              >
                <div className="flex justify-between items-center">
                  <span>{opt}</span>
                  {challengeAns !== null && i === lesson.sections.challenge.correctIndex && <CheckCircle2 size={20} className="text-gain" />}
                  {challengeAns === i && i !== lesson.sections.challenge.correctIndex && <XCircle size={20} className="text-loss" />}
                </div>
              </button>
            ))}
          </div>

          {challengeAns !== null && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex gap-4 items-start bg-bg p-6 rounded-2xl border border-border">
              <Meera expression={challengeAns === lesson.sections.challenge.correctIndex ? 'happy' : 'thinking'} className="w-16 h-16 shrink-0" />
              <div>
                <p className={`font-bold mb-1 ${challengeAns === lesson.sections.challenge.correctIndex ? 'text-gain' : 'text-loss'}`}>
                  {challengeAns === lesson.sections.challenge.correctIndex ? 'Spot on, Aarav!' : 'Not quite!'}
                </p>
                <p className="text-sm text-text-secondary leading-relaxed">{lesson.sections.takeaway}</p>
              </div>
            </motion.div>
          )}
        </div>
      </section>

      {/* Footer Navigation */}
      <div className="flex justify-end pt-8 border-t border-border">
        <Link href="/learn" className="btn-primary flex items-center gap-2">
          Complete Lesson <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
