'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function KnowledgeClient({ questions }: { questions: any[] }) {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [selectedOpt, setSelectedOpt] = useState<number | null>(null);
  const [finished, setFinished] = useState(false);

  const q = questions[currentIdx];
  const opts = q ? JSON.parse(q.options) : [];

  const handleSelect = (idx: number) => {
    if (showExplanation) return;
    setSelectedOpt(idx);
    setShowExplanation(true);
    if (idx === q.correctIndex) {
      setScore(s => s + 1);
    }
  };

  const handleNext = () => {
    if (currentIdx < questions.length - 1) {
      setCurrentIdx(i => i + 1);
      setShowExplanation(false);
      setSelectedOpt(null);
    } else {
      setFinished(true);
    }
  };

  if (finished) {
    const pct = Math.round((score / questions.length) * 100);
    let level = 'Beginner';
    if (pct >= 80) level = 'Confident';
    else if (pct >= 50) level = 'Intermediate';

    return (
      <div className="max-w-2xl mx-auto pt-10">
        <div className="glass-card p-10 text-center">
          <div className="w-24 h-24 mx-auto rounded-full bg-primary/20 flex items-center justify-center mb-6 border border-primary/50 text-4xl">
            {pct >= 80 ? '🏆' : pct >= 50 ? '📈' : '🌱'}
          </div>
          <h2 className="text-3xl font-display font-bold mb-2">Quiz Complete!</h2>
          <p className="text-xl mb-6 text-foreground/80">You scored {score} out of {questions.length} ({pct}%)</p>
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-6 mb-8 text-left">
            <h3 className="font-bold text-sm text-foreground/50 uppercase tracking-wider mb-2">Assigned Level</h3>
            <p className="text-2xl font-bold text-accent">{level} Investor</p>
            <p className="text-sm mt-2 text-foreground/70">
              {level === 'Beginner' && 'You are just starting out. We recommend reading more on our Explore page.'}
              {level === 'Intermediate' && 'You have a good grasp of the basics. Time to refine your diversification strategy.'}
              {level === 'Confident' && 'Excellent knowledge! You understand the nuances of the Indian market.'}
            </p>
          </div>
          
          <button onClick={() => window.location.href='/explore'} className="btn-primary w-full">
            Back to Explore
          </button>
        </div>
      </div>
    );
  }

  if (!q) return <div>No questions available.</div>;

  return (
    <div className="max-w-3xl mx-auto pt-10 relative z-10">
      <div className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-display font-bold">Knowledge Check</h1>
          <p className="text-sm text-foreground/60">Test your financial literacy</p>
        </div>
        <div className="text-right">
          <p className="text-xs font-bold text-foreground/50 uppercase">Question {currentIdx + 1} / {questions.length}</p>
          <div className="flex gap-1 mt-1">
            {questions.map((_, i) => (
              <div key={i} className={`h-1.5 w-4 rounded-full ${i === currentIdx ? 'bg-primary' : i < currentIdx ? 'bg-success' : 'bg-white/10'}`}></div>
            ))}
          </div>
        </div>
      </div>

      <AnimatePresence mode="wait">
        <motion.div 
          key={q.id}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className="glass-card p-8"
        >
          <div className="flex items-center gap-3 mb-6">
            <span className={`px-2 py-1 text-[10px] font-bold rounded uppercase tracking-wider ${
              q.difficulty === 'EASY' ? 'bg-success/20 text-success' : 
              q.difficulty === 'MEDIUM' ? 'bg-yellow-500/20 text-yellow-500' : 
              'bg-destructive/20 text-destructive'
            }`}>
              {q.difficulty}
            </span>
            <span className="text-[10px] font-bold text-foreground/50 uppercase tracking-wider bg-white/5 px-2 py-1 rounded">
              {q.topic}
            </span>
          </div>

          <h2 className="text-xl font-medium mb-8 leading-relaxed">{q.text}</h2>

          <div className="space-y-3">
            {opts.map((opt: string, i: number) => {
              const isSelected = selectedOpt === i;
              const isCorrect = i === q.correctIndex;
              
              let btnClass = "w-full text-left p-4 rounded-xl border transition-all ";
              if (!showExplanation) {
                btnClass += "bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20";
              } else {
                if (isCorrect) btnClass += "bg-success/20 border-success text-success shadow-[0_0_15px_rgba(16,229,160,0.2)]";
                else if (isSelected && !isCorrect) btnClass += "bg-destructive/20 border-destructive text-destructive opacity-70";
                else btnClass += "bg-white/5 border-white/10 opacity-40";
              }

              return (
                <button 
                  key={i} 
                  onClick={() => handleSelect(i)}
                  disabled={showExplanation}
                  className={btnClass}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full border flex items-center justify-center text-xs ${showExplanation && isCorrect ? 'border-success bg-success/20' : 'border-white/20'}`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span>{opt}</span>
                  </div>
                </button>
              )
            })}
          </div>

          {showExplanation && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="mt-8 pt-6 border-t border-white/10">
              <h3 className={`font-bold mb-2 flex items-center gap-2 ${selectedOpt === q.correctIndex ? 'text-success' : 'text-destructive'}`}>
                {selectedOpt === q.correctIndex ? '✅ Correct!' : '❌ Incorrect.'}
              </h3>
              <p className="text-sm text-foreground/80 leading-relaxed bg-white/5 p-4 rounded-lg border border-white/5">
                {q.explanation}
              </p>
              
              <button onClick={handleNext} className="btn-primary mt-6 w-full flex justify-center items-center gap-2">
                {currentIdx < questions.length - 1 ? 'Next Question ➔' : 'View Results'}
              </button>
            </motion.div>
          )}

        </motion.div>
      </AnimatePresence>
    </div>
  );
}
