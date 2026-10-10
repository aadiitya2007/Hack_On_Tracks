'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Shield, CheckCircle2, UserCheck, Camera, Brain, Award, 
  ArrowRight, Sparkles, AlertCircle, RefreshCw, BarChart3, HelpCircle 
} from 'lucide-react';

const SKILL_QUESTIONS = [
  {
    id: 1,
    question: "How long have you been actively investing or trading in financial markets?",
    options: [
      { label: "Less than 6 months (Brand New)", score: 1 },
      { label: "6 months – 2 years (Early stage)", score: 2 },
      { label: "2 – 5 years (Experienced)", score: 3 },
      { label: "5+ years (Market Veteran)", score: 4 }
    ]
  },
  {
    id: 2,
    question: "Which financial instruments do you currently manage or trade?",
    options: [
      { label: "Bank Fixed Deposits & Savings only", score: 1 },
      { label: "Direct Stocks, Mutual Funds & Index ETFs", score: 2 },
      { label: "Stocks, Corporate Bonds, REITs & InvITs", score: 3 },
      { label: "Futures, Options (F&O), Commodities & Leverage", score: 4 }
    ]
  },
  {
    id: 3,
    question: "How do you analyze stocks or assets before placing an order?",
    options: [
      { label: "Social media tips or recommendations from friends", score: 1 },
      { label: "Company news, P/E ratios & quarterly profit reports", score: 2 },
      { label: "Technical chart patterns, RSI & moving averages", score: 3 },
      { label: "Quantitative ML models, Options Greeks & volatility hedging", score: 4 }
    ]
  },
  {
    id: 4,
    question: "How do you react if your portfolio drops 15% during a market crash?",
    options: [
      { label: "Panic & sell everything immediately to prevent losses", score: 1 },
      { label: "Feel anxious, but hold passive index funds and wait", score: 2 },
      { label: "Rebalance portfolio and buy quality scrips on the dip", score: 3 },
      { label: "Hedge downside risk using Put options or Futures contracts", score: 4 }
    ]
  }
];

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [pan, setPan] = useState('');
  const [otp, setOtp] = useState('');
  const router = useRouter();

  // Face Authentication State
  const [faceScanning, setFaceScanning] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);

  // Quiz State
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [userCategory, setUserCategory] = useState<{ level: string; title: string; desc: string; color: string } | null>(null);

  const handleNext = () => setStep(s => s + 1);

  // Face authentication simulation
  const startFaceScan = () => {
    setFaceScanning(true);
    setScanProgress(0);
    let progress = 0;
    const interval = setInterval(() => {
      progress += 20;
      setScanProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setFaceScanning(false);
        setFaceVerified(true);
      }
    }, 400);
  };

  // Handle Quiz Selection
  const handleAnswerSelect = (score: number) => {
    const nextAnswers = [...answers, score];
    setAnswers(nextAnswers);

    if (currentQuizIdx < SKILL_QUESTIONS.length - 1) {
      setCurrentQuizIdx(prev => prev + 1);
    } else {
      // Calculate total score and categorize user
      const totalScore = nextAnswers.reduce((a, b) => a + b, 0);
      let category = {
        level: 'Fresher',
        title: 'Fresher Investor (Neophyte)',
        desc: 'New to financial markets. Focus on low-cost index funds, basic asset allocation, and fundamental financial concepts.',
        color: 'text-accent border-accent bg-accent/10'
      };

      if (totalScore >= 14) {
        category = {
          level: 'Pro',
          title: 'Pro Trader & Quant Specialist',
          desc: 'High expertise in financial derivatives, options hedging, delta neutrality, and algorithmic trading models.',
          color: 'text-purple-400 border-purple-500 bg-purple-500/10'
        };
      } else if (totalScore >= 11) {
        category = {
          level: 'Advanced',
          title: 'Advanced Multi-Asset Investor',
          desc: 'Solid experience across equities, REITs, bonds, and technical indicators. Active portfolio rebalancer.',
          color: 'text-gain border-gain bg-gain/10'
        };
      } else if (totalScore >= 8) {
        category = {
          level: 'Intermediate',
          title: 'Intermediate Investor & Swing Trader',
          desc: 'Familiar with direct stocks, chart analysis, and quarterly earnings. Working on risk diversification.',
          color: 'text-yellow-400 border-yellow-500 bg-yellow-500/10'
        };
      } else if (totalScore >= 5) {
        category = {
          level: 'Beginner',
          title: 'Beginner Investor',
          desc: 'Building an initial direct equity & mutual fund portfolio. Needs guidance on asset allocation and cost leakage.',
          color: 'text-blue-400 border-blue-500 bg-blue-500/10'
        };
      }

      setUserCategory(category);
      if (typeof window !== 'undefined') {
        localStorage.setItem('unify_trader_level', category.level);
        localStorage.setItem('unify_trader_title', category.title);
        localStorage.setItem('unify_trader_desc', category.desc);
      }
      setStep(6); // Move to classification result
    }
  };

  return (
    <div className="min-h-screen bg-bg text-text-primary flex items-center justify-center p-4 md:p-6 relative overflow-hidden font-sans">
      
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[20%] w-[500px] h-[500px] rounded-full bg-accent/10 blur-[120px]"></div>
        <div className="absolute bottom-[10%] right-[20%] w-[500px] h-[500px] rounded-full bg-gain/10 blur-[120px]"></div>
      </div>
      
      <div className="w-full max-w-xl z-10 relative">
        
        {/* Header */}
        <div className="mb-6 flex flex-col items-center">
          <img src="/logos/unify.png" alt="Unify" className="h-12 object-contain" />
          <div className="flex items-center gap-2 mt-2">
            <span className="px-3 py-1 rounded-full bg-surface border border-border text-text-secondary text-[10px] font-bold tracking-widest uppercase">
              Identity & Skill Assessment Onboarding
            </span>
          </div>
        </div>

        {/* Step Indicator Pills */}
        <div className="flex items-center justify-between mb-6 px-2">
          {['PAN', 'OTP', 'Aadhaar', 'Face Auth', 'Skill Quiz', 'Category'].map((sName, idx) => {
            const stepNum = idx + 1;
            const active = step === stepNum;
            const completed = step > stepNum;
            return (
              <div key={sName} className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
                  completed ? 'bg-gain text-white' : (active ? 'bg-accent text-white shadow-[0_0_12px_rgba(109,40,217,0.5)] scale-110' : 'bg-surface text-text-muted border border-border')
                }`}>
                  {completed ? '✓' : stepNum}
                </div>
                <span className="text-[9px] font-semibold text-text-muted mt-1 hidden sm:block">{sName}</span>
              </div>
            );
          })}
        </div>

        {/* Card Container */}
        <div className="card p-6 md:p-8 bg-surface border border-border rounded-3xl shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: PAN Entry */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div>
                  <h2 className="text-xl font-extrabold text-text-primary">Step 1: Enter your PAN Number</h2>
                  <p className="text-xs text-text-secondary mt-1">Enter your Permanent Account Number to locate connected brokerages and CKYC records.</p>
                </div>
                
                <div>
                  <label className="text-xs font-bold uppercase text-text-muted">Permanent Account Number (PAN)</label>
                  <input 
                    type="text" 
                    value={pan}
                    onChange={e => setPan(e.target.value.toUpperCase())}
                    placeholder="ABCDE1234F"
                    className="w-full mt-1 bg-bg border border-border rounded-2xl px-4 py-3.5 focus:outline-none focus:border-accent text-center tracking-[0.4em] font-mono text-xl font-bold uppercase"
                    maxLength={10}
                  />
                </div>

                <div className="p-3 rounded-xl bg-accent-bg border border-accent/20 text-accent text-xs flex items-center gap-2 font-medium">
                  <Shield size={16} className="shrink-0" />
                  <span>256-bit encrypted CKYC lookup. Your identity is verified against official NSDL/CDSL depositories.</span>
                </div>

                <button onClick={handleNext} disabled={pan.length !== 10} className="btn-primary w-full py-3.5 text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed">
                  Verify PAN & Find Accounts →
                </button>
              </motion.div>
            )}

            {/* STEP 2: Mobile OTP */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div>
                  <h2 className="text-xl font-extrabold text-text-primary">Step 2: Mobile OTP Authentication</h2>
                  <p className="text-xs text-text-secondary mt-1">Enter the 6-digit verification code sent to the mobile linked to PAN <strong className="font-mono text-text-primary">{pan.substring(0,2)}*****{pan.substring(8)}</strong>.</p>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase text-text-muted">Enter 6-Digit OTP</label>
                  <input 
                    type="text" 
                    value={otp}
                    onChange={e => setOtp(e.target.value)}
                    placeholder="0 0 0 0 0 0"
                    className="w-full mt-1 bg-bg border border-border rounded-2xl px-4 py-3.5 focus:outline-none focus:border-accent text-center tracking-[0.8em] font-mono text-2xl font-bold"
                    maxLength={6}
                  />
                </div>

                <div className="flex justify-between items-center text-xs text-text-muted">
                  <span>Didn't receive code?</span>
                  <button className="text-accent font-bold hover:underline" onClick={() => setOtp('982311')}>Use Demo OTP (982311)</button>
                </div>

                <button onClick={handleNext} disabled={otp.length !== 6} className="btn-primary w-full py-3.5 text-xs font-bold disabled:opacity-50">
                  Confirm OTP & Proceed →
                </button>
              </motion.div>
            )}

            {/* STEP 3: Aadhaar CKYC Consent */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div>
                  <h2 className="text-xl font-extrabold text-text-primary">Step 3: Aadhaar CKYC Consent</h2>
                  <p className="text-xs text-text-secondary mt-1">Provide one-time explicit authorization to aggregate holdings across Zerodha, Groww, Upstox & CDSL.</p>
                </div>

                <div className="p-4 rounded-2xl bg-bg border border-border text-xs text-text-secondary space-y-3 leading-relaxed">
                  <p className="font-bold text-text-primary flex items-center gap-1.5">
                    <Shield size={16} className="text-gain" /> Regulatory Read-Only Data Guarantee
                  </p>
                  <p>
                    "I hereby grant explicit consent to Unify to fetch my CKYC profile details and aggregate read-only portfolio telemetry across linked Indian depository accounts."
                  </p>
                  <p className="text-[11px] text-text-muted">
                    Note: Unify operates strictly read-only telemetry. We cannot place orders, debit funds, or execute transactions.
                  </p>
                </div>

                <button onClick={handleNext} className="btn-primary w-full py-3.5 text-xs font-bold bg-gradient-to-r from-accent to-gain">
                  I Consent & Continue →
                </button>
              </motion.div>
            )}

            {/* STEP 4: Face Authentication (Biometric AI Scan) */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div>
                  <div className="flex items-center gap-2">
                    <Camera className="text-accent" size={22} />
                    <h2 className="text-xl font-extrabold text-text-primary">Step 4: AI Face Authentication</h2>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">Biometric liveness verification to match facial hash against CKYC photo database.</p>
                </div>

                {/* Face Camera Scan Box */}
                <div className="relative w-full h-56 rounded-3xl bg-black/80 border-2 border-dashed border-accent/40 flex flex-col items-center justify-center overflow-hidden">
                  
                  {/* Face Mesh SVG Guide Overlay */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg className={`w-36 h-44 text-accent transition-all ${faceScanning ? 'animate-pulse scale-105' : ''}`} viewBox="0 0 100 120" fill="none" stroke="currentColor" strokeWidth="2">
                      <ellipse cx="50" cy="55" rx="35" ry="45" strokeDasharray="4 4" />
                      <circle cx="35" cy="45" r="5" fill={faceVerified ? '#10E5A0' : 'none'} />
                      <circle cx="65" cy="45" r="5" fill={faceVerified ? '#10E5A0' : 'none'} />
                      <path d="M40 75 Q50 85 60 75" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </div>

                  {/* Scanning Animation Laser Line */}
                  {faceScanning && (
                    <motion.div 
                      animate={{ y: [-100, 100, -100] }} 
                      transition={{ repeat: Infinity, duration: 1.5, ease: 'linear' }}
                      className="absolute w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_15px_#6D28D9]"
                    />
                  )}

                  {/* Status Overlay Text */}
                  <div className="relative z-10 text-center p-4">
                    {faceVerified ? (
                      <div className="space-y-2">
                        <div className="w-12 h-12 rounded-full bg-gain-bg text-gain mx-auto flex items-center justify-center border border-gain/30">
                          <CheckCircle2 size={24} />
                        </div>
                        <p className="text-sm font-extrabold text-gain">Biometric Hash Matched!</p>
                        <p className="text-[11px] text-text-muted font-mono">Liveness Score: 99.8% • CKYC Face Verified</p>
                      </div>
                    ) : faceScanning ? (
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-accent tracking-wider uppercase animate-pulse">Scanning Facial Features...</p>
                        <div className="w-48 bg-bg h-2 rounded-full mx-auto overflow-hidden border border-border">
                          <div className="bg-accent h-full transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        <UserCheck className="mx-auto text-text-muted" size={32} />
                        <p className="text-xs text-text-secondary font-medium max-w-xs">Position your face inside the frame and ensure good lighting.</p>
                      </div>
                    )}
                  </div>
                </div>

                {!faceVerified ? (
                  <button 
                    onClick={startFaceScan} 
                    disabled={faceScanning} 
                    className="btn-primary w-full py-3.5 text-xs font-bold flex justify-center items-center gap-2"
                  >
                    {faceScanning ? <RefreshCw className="animate-spin" size={16} /> : <Camera size={16} />}
                    {faceScanning ? 'Verifying Liveness...' : 'Start Biometric Face Scan'}
                  </button>
                ) : (
                  <button onClick={handleNext} className="btn-primary w-full py-3.5 text-xs font-bold bg-gain text-white">
                    Face Authenticated — Proceed to Skill Assessment →
                  </button>
                )}
              </motion.div>
            )}

            {/* STEP 5: Trader Skill & Knowledge Questionnaire */}
            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-accent-bg text-accent border border-accent/20">
                      Question {currentQuizIdx + 1} of {SKILL_QUESTIONS.length}
                    </span>
                    <h2 className="text-lg font-extrabold text-text-primary mt-2">
                      {SKILL_QUESTIONS[currentQuizIdx].question}
                    </h2>
                  </div>
                  <Brain size={24} className="text-accent shrink-0" />
                </div>

                <div className="space-y-3">
                  {SKILL_QUESTIONS[currentQuizIdx].options.map((opt, i) => (
                    <button
                      key={i}
                      onClick={() => handleAnswerSelect(opt.score)}
                      className="w-full text-left p-4 rounded-2xl bg-bg border border-border hover:border-accent hover:bg-surface-hover text-xs font-medium text-text-primary transition-all flex items-center justify-between group"
                    >
                      <span>{opt.label}</span>
                      <ArrowRight size={14} className="text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0" />
                    </button>
                  ))}
                </div>

                <p className="text-[11px] text-text-muted text-center italic">
                  This classification customizes your dashboard AI advisory & learning recommendations.
                </p>
              </motion.div>
            )}

            {/* STEP 6: Classification Result Certificate */}
            {step === 6 && userCategory && (
              <motion.div key="step6" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center py-2">
                <div className="w-16 h-16 rounded-3xl bg-accent-bg text-accent mx-auto flex items-center justify-center border border-accent/30 shadow-[0_0_20px_rgba(109,40,217,0.3)]">
                  <Award size={32} />
                </div>

                <div>
                  <span className="text-[10px] font-extrabold uppercase tracking-widest text-text-muted">Investor Level Classification</span>
                  <h2 className="text-2xl font-black text-text-primary mt-1">{userCategory.title}</h2>
                  <div className={`mt-3 p-4 rounded-2xl border text-xs font-semibold leading-relaxed max-w-md mx-auto ${userCategory.color}`}>
                    "{userCategory.desc}"
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-bg border border-border text-left space-y-2 text-xs">
                  <p className="font-bold text-text-primary flex items-center gap-2">
                    <Sparkles size={16} className="text-accent" /> What this means for your dashboard:
                  </p>
                  <ul className="space-y-1.5 text-text-secondary pl-5 list-disc">
                    <li>Customized AI portfolio diversification recommendations on dashboard</li>
                    <li>Tailored risk threshold alerts for your skill tier</li>
                    <li>Pre-configured ML stock return prediction widgets</li>
                  </ul>
                </div>

                <button 
                  onClick={() => {
                    setStep(7);
                    setTimeout(() => router.push('/dashboard'), 1200);
                  }}
                  className="btn-primary w-full py-3.5 text-xs font-bold"
                >
                  Confirm & Launch My Dashboard →
                </button>
              </motion.div>
            )}

            {/* STEP 7: Redirecting Final State */}
            {step === 7 && (
              <motion.div key="step7" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-gain-bg text-gain mx-auto flex items-center justify-center border border-gain/30 animate-bounce">
                  <CheckCircle2 size={32} />
                </div>
                <h2 className="text-2xl font-extrabold text-gain">Setup Complete!</h2>
                <p className="text-xs text-text-secondary">Linking broker telemetry and generating personalized AI strategy report...</p>
                <div className="w-32 h-1.5 bg-bg rounded-full mx-auto overflow-hidden border border-border">
                  <div className="bg-gain h-full animate-pulse w-full"></div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
