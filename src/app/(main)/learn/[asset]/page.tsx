'use client';

import { use, useState } from 'react';
import { notFound } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { LESSON_MAP } from '@/lib/content/lessons';
import Dialogue from '@/components/Dialogue';
import { 
  TrendingUp, TrendingDown, ArrowRight, ArrowLeft, CheckCircle2, XCircle, 
  HelpCircle, PieChart, ShieldCheck, Layers, Award, Sparkles, Sliders, BarChart3, Info 
} from 'lucide-react';
import Link from 'next/link';

export default function AssetLesson({ params }: { params: Promise<{ asset: string }> }) {
  const resolvedParams = use(params);
  const lesson = LESSON_MAP[resolvedParams.asset];

  // Interactive MCQ state
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [submitted, setSubmitted] = useState(false);

  // Return Simulator state
  const [customAmount, setCustomAmount] = useState<number>(lesson ? lesson.returnsExample.initial : 10000);
  const [simScenario, setSimScenario] = useState<'bull' | 'bear'>('bull');

  if (!lesson) {
    notFound();
  }

  const handleOptionSelect = (idx: number) => {
    if (submitted) return;
    setSelectedOption(idx);
  };

  const handleQuizSubmit = () => {
    if (selectedOption === null) return;
    setSubmitted(true);
  };

  // Math calculation for interactive return simulator
  const gainVal = customAmount * (1 + (lesson.returnsExample.gainPct / 100));
  const lossVal = customAmount * (1 + (lesson.returnsExample.lossPct / 100));

  return (
    <div className="max-w-4xl mx-auto p-4 md:p-8 pt-8 pb-24 space-y-12">
      
      {/* Top Breadcrumb & Header */}
      <div>
        <div className="flex items-center gap-3 mb-3">
          <Link href="/learn" className="text-xs font-bold text-text-muted hover:text-accent flex items-center gap-1">
            <ArrowLeft size={14} /> Academy
          </Link>
          <span className="text-text-muted text-xs">•</span>
          <span className="px-3 py-1 bg-accent-bg text-accent rounded-full text-xs font-extrabold uppercase tracking-wider">
            Asset Masterclass
          </span>
        </div>
        
        <h1 className="text-4xl md:text-5xl font-extrabold text-text-primary font-sans tracking-tight mb-3">
          {lesson.title}
        </h1>
        <p className="text-xl text-text-secondary font-medium leading-relaxed">
          {lesson.subtitle}
        </p>
      </div>

      {/* Mentor Dialogue */}
      {lesson.dialogue && lesson.dialogue.length > 0 && (
        <motion.div initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="h-[380px]">
          <Dialogue messages={lesson.dialogue} />
        </motion.div>
      )}

      {/* 1. What is it? */}
      <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <h2 className="text-2xl font-extrabold text-text-primary flex items-center gap-2">
          <Sparkles className="text-accent" size={24} />
          What are {lesson.title.toLowerCase()}?
        </h2>
        <div className="card p-8 bg-surface border border-border space-y-4 rounded-3xl">
          {lesson.whatItIs.map((paragraph, i) => (
            <p key={i} className="text-text-secondary text-base leading-relaxed">
              {paragraph}
            </p>
          ))}
        </div>
      </motion.section>

      {/* Key Categories / Types (if present, e.g., Mutual Funds) */}
      {lesson.keyTypes && lesson.keyTypes.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <h2 className="text-2xl font-extrabold text-text-primary flex items-center gap-2">
            <Layers className="text-accent" size={24} />
            Key Types of {lesson.title}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {lesson.keyTypes.map((kt, i) => (
              <div key={i} className="card p-6 bg-surface border border-border rounded-2xl flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-sm text-text-primary mb-2">{kt.title}</h3>
                  <p className="text-xs text-text-secondary mb-4 leading-relaxed">{kt.desc}</p>
                </div>
                <div className="p-3 rounded-xl bg-bg border border-border text-[11px] font-bold text-accent">
                  🎯 Goal: {kt.goal}
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* 2. How it works */}
      {lesson.howItWorks && lesson.howItWorks.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <h2 className="text-2xl font-extrabold text-text-primary flex items-center gap-2">
            <BarChart3 className="text-accent" size={24} />
            How do they work?
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {lesson.howItWorks.map((step, i) => (
              <div key={i} className="card p-6 bg-surface border border-border rounded-2xl flex gap-4 items-start">
                <div className="w-9 h-9 rounded-2xl bg-accent-bg text-accent flex items-center justify-center font-extrabold text-sm shrink-0 border border-accent/20">
                  {i + 1}
                </div>
                <div>
                  <h3 className="font-bold text-text-primary text-sm mb-1">{step.step}</h3>
                  <p className="text-text-secondary text-xs leading-relaxed">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* 3. Interactive Return Simulator */}
      <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <div className="flex items-center gap-2">
          <Sliders className="text-accent" size={24} />
          <h2 className="text-2xl font-extrabold text-text-primary">How much return can they generate?</h2>
        </div>

        <div className="card p-8 bg-surface border border-border rounded-3xl space-y-6">
          <p className="text-sm text-text-secondary">
            {lesson.title} do not offer guaranteed returns. Your outcome depends on asset performance, market conditions, and entry price. Use the interactive controls below to simulate gains and losses:
          </p>

          {/* Amount Slider */}
          <div className="space-y-2">
            <div className="flex justify-between items-center text-xs font-bold">
              <span className="text-text-muted uppercase">Initial Investment</span>
              <span className="text-text-primary text-base font-mono">₹{customAmount.toLocaleString('en-IN')}</span>
            </div>
            <input 
              type="range"
              min={1000}
              max={100000}
              step={1000}
              value={customAmount}
              onChange={(e) => setCustomAmount(Number(e.target.value))}
              className="w-full h-2 bg-bg rounded-lg appearance-none cursor-pointer accent-accent"
            />
          </div>

          {/* Scenario Toggles & Output */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
            
            {/* Bull Outcome */}
            <div className={`p-6 rounded-2xl border transition-all ${
              simScenario === 'bull' ? 'bg-gain-bg border-gain text-gain shadow-md' : 'bg-bg border-border text-text-muted'
            }`} onClick={() => setSimScenario('bull')}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <TrendingUp size={16} /> Market Rises (+{lesson.returnsExample.gainPct}%)
                </span>
              </div>
              <p className="text-3xl font-extrabold font-mono text-gain">₹{Math.round(gainVal).toLocaleString('en-IN')}</p>
              <p className="text-xs mt-1 font-bold">+₹{Math.round(gainVal - customAmount).toLocaleString('en-IN')} Unrealised Gain</p>
            </div>

            {/* Bear Outcome */}
            <div className={`p-6 rounded-2xl border transition-all ${
              simScenario === 'bear' ? 'bg-loss-bg border-loss text-loss shadow-md' : 'bg-bg border-border text-text-muted'
            }`} onClick={() => setSimScenario('bear')}>
              <div className="flex justify-between items-center mb-2">
                <span className="text-xs font-bold uppercase tracking-wider flex items-center gap-1">
                  <TrendingDown size={16} /> Market Falls ({lesson.returnsExample.lossPct}%)
                </span>
              </div>
              <p className="text-3xl font-extrabold font-mono text-loss">₹{Math.round(lossVal).toLocaleString('en-IN')}</p>
              <p className="text-xs mt-1 font-bold">-₹{Math.round(customAmount - lossVal).toLocaleString('en-IN')} Unrealised Loss</p>
            </div>

          </div>

          {lesson.returnsExample.note && (
            <p className="text-xs text-text-muted italic border-t border-border pt-4">
              {lesson.returnsExample.note}
            </p>
          )}
        </div>
      </motion.section>

      {/* 4. Advantages & Risks */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Advantages */}
        <motion.section initial={{ opacity: 0, x: -15 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <h2 className="text-xl font-extrabold text-gain flex items-center gap-2">
            <TrendingUp size={20} /> Key Advantages
          </h2>
          <div className="space-y-3">
            {lesson.advantages.map((adv, i) => (
              <div key={i} className="card p-4 bg-surface border border-gain/20 rounded-2xl flex gap-3 items-start">
                <CheckCircle2 className="text-gain shrink-0 mt-0.5" size={18} />
                <span className="text-text-secondary text-xs leading-relaxed font-medium">{adv}</span>
              </div>
            ))}
          </div>
        </motion.section>

        {/* Risks */}
        <motion.section initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} className="space-y-4">
          <h2 className="text-xl font-extrabold text-loss flex items-center gap-2">
            <TrendingDown size={20} /> Key Risks
          </h2>
          <div className="space-y-3">
            {lesson.risks.map((risk, i) => (
              <div key={i} className="card p-4 bg-surface border border-loss/20 rounded-2xl flex gap-3 items-start">
                <XCircle className="text-loss shrink-0 mt-0.5" size={18} />
                <span className="text-text-secondary text-xs leading-relaxed font-medium">{risk}</span>
              </div>
            ))}
          </div>
        </motion.section>

      </div>

      {/* 5. India Context Statistics */}
      {lesson.snapshotStats && lesson.snapshotStats.length > 0 && (
        <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
          <h2 className="text-2xl font-extrabold text-text-primary flex items-center gap-2">
            <BarChart3 className="text-accent" size={24} />
            Asset Class Performance & Industry Statistics (India Context)
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {lesson.snapshotStats.map((stat, i) => (
              <div key={i} className="card p-5 bg-surface border border-border rounded-2xl flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider mb-1">{stat.label}</p>
                  <p className="text-2xl font-black text-text-primary">{stat.value}</p>
                </div>
                <p className="text-[11px] text-text-secondary mt-3 pt-2 border-t border-border leading-relaxed">{stat.desc}</p>
              </div>
            ))}
          </div>
        </motion.section>
      )}

      {/* 6. Interactive Challenge / MCQ Quiz */}
      <motion.section initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
        <h2 className="text-2xl font-extrabold text-text-primary flex items-center gap-2">
          <HelpCircle className="text-accent" size={24} />
          Interactive Knowledge Challenge
        </h2>

        <div className="card p-8 bg-surface border border-border rounded-3xl space-y-6">
          <h3 className="font-bold text-base text-text-primary leading-relaxed">
            {lesson.challenge.question}
          </h3>

          <div className="space-y-3">
            {lesson.challenge.options.map((opt, i) => {
              const isSelected = selectedOption === i;
              const isCorrect = i === lesson.challenge.correctIndex;
              
              let btnStyle = "bg-bg border-border text-text-secondary hover:border-accent";
              if (submitted) {
                if (isCorrect) btnStyle = "bg-gain-bg border-gain text-gain font-bold";
                else if (isSelected) btnStyle = "bg-loss-bg border-loss text-loss font-bold";
              } else if (isSelected) {
                btnStyle = "bg-accent-bg border-accent text-accent font-bold";
              }

              return (
                <button
                  key={i}
                  onClick={() => handleOptionSelect(i)}
                  className={`w-full text-left p-4 rounded-2xl border text-xs transition-all flex justify-between items-center ${btnStyle}`}
                >
                  <span>{opt}</span>
                  {submitted && isCorrect && <CheckCircle2 size={18} className="text-gain shrink-0" />}
                  {submitted && isSelected && !isCorrect && <XCircle size={18} className="text-loss shrink-0" />}
                </button>
              );
            })}
          </div>

          {!submitted ? (
            <button
              onClick={handleQuizSubmit}
              disabled={selectedOption === null}
              className="btn-primary w-full py-3 text-xs"
            >
              Submit Answer
            </button>
          ) : (
            <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-accent-bg border border-accent/30 text-accent text-xs space-y-1">
              <p className="font-bold flex items-center gap-1.5">
                <Award size={16} /> Learning Explanation:
              </p>
              <p className="text-text-secondary leading-relaxed">{lesson.challenge.explanation}</p>
            </motion.div>
          )}
        </div>
      </motion.section>

      {/* 7. Key Takeaway Banner */}
      <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="card p-8 bg-gradient-to-r from-accent/10 to-accent-bg border border-accent/30 rounded-3xl text-center space-y-2">
        <span className="text-[10px] font-extrabold uppercase tracking-widest text-accent px-3 py-1 rounded-full bg-surface border border-accent/20">
          Core Masterclass Takeaway
        </span>
        <p className="text-xl font-bold text-text-primary italic leading-relaxed pt-2">
          "{lesson.takeaway}"
        </p>
      </motion.div>

      {/* Navigation Footer */}
      <div className="flex justify-between items-center pt-6 border-t border-border">
        {lesson.prevLesson ? (
          <Link href={`/learn/${lesson.prevLesson}`} className="btn-secondary flex items-center gap-2 text-xs">
            <ArrowLeft size={16} /> Prev: {lesson.prevLesson.replace('-', ' ').toUpperCase()}
          </Link>
        ) : <div></div>}

        {lesson.nextLesson ? (
          <Link href={`/learn/${lesson.nextLesson}`} className="btn-primary flex items-center gap-2 text-xs">
            Next: {lesson.nextLesson.replace('-', ' ').toUpperCase()} <ArrowRight size={16} />
          </Link>
        ) : (
          <Link href="/knowledge-check" className="btn-primary flex items-center gap-2 text-xs">
            Take Full Knowledge Quiz <Award size={16} />
          </Link>
        )}
      </div>

    </div>
  );
}
