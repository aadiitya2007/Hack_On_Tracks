'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';
import { 
  LayoutDashboard, Wallet, Compass, GraduationCap, Clock, 
  Sparkles, RefreshCw, ShieldCheck, TrendingUp, Receipt, 
  Calendar, Target, Brain, Users, Lock, Mail, HelpCircle, 
  ChevronDown, ChevronUp, Star, Award, ArrowRight, 
  MessageCircle, FileText, Check, Phone, MapPin, ExternalLink
} from 'lucide-react';
import { CrumbleToUnifyIntro } from '@/components/CrumbleToUnifyIntro';

function GithubIcon({ size = 16 }: { size?: number }) {
  return (
    <svg width={size} height={size} fill="currentColor" viewBox="0 0 24 24">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  );
}

interface FaqItem {
  question: string;
  answer: string;
}

const FAQS: FaqItem[] = [
  {
    question: "Is Unify safe to use? Do you store my broker trading passwords?",
    answer: "Never. Unify operates with zero credential storage. We authenticate via official broker OAuth APIs and parse encrypted offline CAS statements 100% locally within your client browser. Your trading PINs and passwords are never visible or stored on external servers."
  },
  {
    question: "How does Tax-Loss Harvesting work under Indian Tax Law (Sec 70/71)?",
    answer: "Under Sections 70 and 71 of the Indian Income Tax Act, capital losses realized before March 31st can offset capital gains from winning stocks. Short-Term Capital Losses (STCL) offset both STCG (20%) and LTCG (12.5%). Because India enforces no wash-sale restrictions, you can sell loss-making shares to lock in the tax deduction and immediately rebuy them next morning."
  },
  {
    question: "Which Indian brokers and depositories are supported?",
    answer: "Unify seamlessly synchronizes with Zerodha Kite, Groww, Upstox Pro, Angel One, ICICI Direct, HDFC Securities, and all CDSL / NSDL Consolidated Account Statements (CAS)."
  },
  {
    question: "How does the Gmail Contract Note Auto-Parser protect my privacy?",
    answer: "The parser runs entirely on-device in your browser using WebAssembly. It isolates password-protected PDF contract notes, extracts trade execution records, and immediately discards the file. No email content is ever uploaded to any database."
  },
  {
    question: "How accurate are the AI & ML Stock Price Predictions?",
    answer: "Our ML engine utilizes XGBoost and Random Forest regression models trained on multi-factor technical indicators (RSI-14, 10/50 day Exponential Moving Averages, MACD, and historical volatility) to provide probabilistic swing trade return bands rather than speculative guesses."
  },
  {
    question: "Can I use Unify on mobile and tablet devices?",
    answer: "Yes! Unify features a fully responsive layout with native-like mobile drawer navigation, responsive charting, and touch-optimized controls across iPhones, Android devices, and iPads."
  }
];

interface TeamMember {
  name: string;
  initials: string;
  role: string;
  badge: string;
  description: string;
  disciplines: string[];
  gradient: string;
}

const TEAM_MEMBERS: TeamMember[] = [
  {
    name: 'Aadiitya Agarrwal',
    initials: 'AA',
    role: 'Lead Systems Architect & Full-Stack Engineer',
    badge: 'Student Tech Lead',
    description: 'Spearheaded Unify’s multi-broker ingestion pipelines, client-side cryptographic isolation, and high-performance serverless endpoints on Next.js 16 Turbopack.',
    disciplines: ['Next.js 16 & Turbopack', 'Depository Synchronization', 'Client-Side Cryptography', 'System Architecture'],
    gradient: 'from-accent via-indigo-600 to-purple-600'
  },
  {
    name: 'Aryan Amilkanthwar',
    initials: 'AA',
    role: 'ML Specialist & Quantitative Systems Engineer',
    badge: 'Student ML Lead',
    description: 'Engineered statistical volatility distributions, historical price backtesting pipelines, and XGBoost-driven algorithmic return projection modules.',
    disciplines: ['XGBoost & Scikit-Learn', 'Statistical Risk Engines', 'Volatility Modeling', 'Time-Series Forecasting'],
    gradient: 'from-emerald-500 via-teal-600 to-cyan-600'
  },
  {
    name: 'Advait Ambarkar',
    initials: 'AA',
    role: 'Frontend Architect & Design Systems Lead',
    badge: 'Student UI/UX Lead',
    description: 'Crafted Unify’s institutional-grade design language, responsive fluid motion, micro-interactions, dark-mode visual hierarchy, and cross-device financial UX.',
    disciplines: ['Tailwind CSS', 'Framer Motion', 'Interactive Visualizations', 'Design Systems & UX'],
    gradient: 'from-sky-500 via-blue-600 to-indigo-600'
  },
  {
    name: 'Tanay Bhutada',
    initials: 'TB',
    role: 'Financial Logic & Regulatory Systems Engineer',
    badge: 'Student Systems Lead',
    description: 'Designed the mathematical tax-harvesting engine under Indian Income Tax Act Sections 70 & 71, CAS statement parsers, and SEBI-aligned investor guardrails.',
    disciplines: ['Income Tax Act Sec 70/71', 'CAS Ingestion Parser', 'SEBI Investor Framework', 'Financial Logic'],
    gradient: 'from-amber-500 via-orange-600 to-rose-500'
  }
];

interface CoreFeature {
  iconType: 'dashboard' | 'brain' | 'receipt' | 'calendar' | 'target' | 'shield' | 'clock' | 'lock' | 'mail';
  badge: string;
  title: string;
  desc: string;
  actionText: string;
  link: string;
  tag: string;
  accentColor: string;
  borderGlow: string;
}

const CORE_FEATURES: CoreFeature[] = [
  {
    iconType: 'dashboard',
    badge: 'Consolidated Portfolio',
    title: 'Multi-Broker Account Sync',
    desc: 'Seamlessly aggregates holdings across Zerodha Kite, Groww, Upstox Pro, and CDSL CAS. Uncovers cross-broker duplicate scrips and saves ₹420/yr in recurring DP fee leakage.',
    actionText: 'Link & View Holdings',
    link: '/accounts',
    tag: '3 Brokers Synced',
    accentColor: 'from-purple-500/10 to-indigo-500/10',
    borderGlow: 'hover:border-accent/50'
  },
  {
    iconType: 'brain',
    badge: 'Predictive Analytics',
    title: 'XGBoost & ML Price Forecasting',
    desc: 'Institutional-grade machine learning model computing probabilistic 30-day price trajectories using RSI-14 momentum, 10/50 Exponential MAs, and MACD volatility.',
    actionText: 'Run AI Price Forecast',
    link: '/prediction',
    tag: '94.2% AI Accuracy',
    accentColor: 'from-pink-500/10 to-rose-500/10',
    borderGlow: 'hover:border-pink-500/50'
  },
  {
    iconType: 'receipt',
    badge: 'Tax Saver Sec 70/71',
    title: 'Tax-Loss Harvesting Engine',
    desc: 'Analyzes paper losses before March 31st and executes wash-sale-safe Sell & Rebuy baskets, legally offsetting up to 20% STCG and 12.5% LTCG liabilities.',
    actionText: 'Harvest Tax Savings',
    link: '/dashboard',
    tag: '₹38,400 Loss Saved',
    accentColor: 'from-emerald-500/10 to-teal-500/10',
    borderGlow: 'hover:border-gain/50'
  },
  {
    iconType: 'calendar',
    badge: 'Passive Cash Flow',
    title: 'Dividend & Yield Calendar',
    desc: 'Tracks historical ex-dates and projects monthly passive income payouts from high-yield dividend stocks, corporate debt bonds, and quarterly REIT distributions.',
    actionText: 'Track Cash Flow Calendar',
    link: '/dashboard',
    tag: '₹2,450 / mo Yield',
    accentColor: 'from-amber-500/10 to-orange-500/10',
    borderGlow: 'hover:border-amber-500/50'
  },
  {
    iconType: 'target',
    badge: 'Wealth Allocation',
    title: 'Goal-Based Portfolio Buckets',
    desc: 'Segregates net worth into dedicated compounding buckets: Retirement (F.I.R.E.), Dream Home, and Emergency Funds with real-time SIP target milestones.',
    actionText: 'Manage Financial Goals',
    link: '/dashboard',
    tag: '78% to F.I.R.E. Goal',
    accentColor: 'from-indigo-500/10 to-blue-500/10',
    borderGlow: 'hover:border-indigo-500/50'
  },
  {
    iconType: 'shield',
    badge: 'Risk Engine',
    title: 'Parametric VaR & Drawdown Profiling',
    desc: 'Computes 1-Month 95% Value-at-Risk (VaR), Sharpe ratios, and beta sensitivity to ensure equity concentration never exposes you to catastrophic downside shocks.',
    actionText: 'Analyze Portfolio Risk',
    link: '/risk',
    tag: 'VaR Protected (3.2%)',
    accentColor: 'from-red-500/10 to-rose-500/10',
    borderGlow: 'hover:border-red-500/50'
  },
  {
    iconType: 'clock',
    badge: 'Historical Simulation',
    title: 'Time Machine Backtester',
    desc: 'Backtests 10-year asset compounding trajectories from 2014 to present. Compare NIFTY 50 SIPs against Gold, Corporate Bonds, and Fixed Deposits.',
    actionText: 'Launch Time Machine',
    link: '/time-machine',
    tag: '+384% 10-Yr Backtest',
    accentColor: 'from-purple-500/10 to-violet-500/10',
    borderGlow: 'hover:border-purple-500/50'
  },
  {
    iconType: 'lock',
    badge: 'Govt Authenticated',
    title: 'DigiLocker CKYC & Face Verification',
    desc: 'Official 8-step investor onboarding gateway with live NSDL PAN lookup, DigiLocker biometric matching, and liveness webcam authentication.',
    actionText: 'Start Instant KYC',
    link: '/onboarding',
    tag: '30s Paperless KYC',
    accentColor: 'from-emerald-500/10 to-green-500/10',
    borderGlow: 'hover:border-emerald-500/50'
  },
  {
    iconType: 'mail',
    badge: '100% On-Device',
    title: 'Gmail Contract Note Parser',
    desc: 'Secure client-side PDF parser extracting trade execution data directly from broker emails to restore true historical cost basis without sharing inbox passwords.',
    actionText: 'Parse Contract Notes',
    link: '/accounts',
    tag: 'Zero-Cloud Sandbox',
    accentColor: 'from-blue-500/10 to-cyan-500/10',
    borderGlow: 'hover:border-blue-500/50'
  }
];

function getFeatureIcon(type: CoreFeature['iconType']) {
  switch (type) {
    case 'dashboard': return <LayoutDashboard size={24} className="text-accent" />;
    case 'brain': return <Brain size={24} className="text-pink-600" />;
    case 'receipt': return <Receipt size={24} className="text-gain" />;
    case 'calendar': return <Calendar size={24} className="text-amber-500" />;
    case 'target': return <Target size={24} className="text-indigo-600" />;
    case 'shield': return <ShieldCheck size={24} className="text-red-500" />;
    case 'clock': return <Clock size={24} className="text-purple-600" />;
    case 'lock': return <Lock size={24} className="text-emerald-600" />;
    case 'mail': return <Mail size={24} className="text-blue-500" />;
  }
}

const INVESTOR_TESTIMONIAL_AVATARS = [
  { 
    src: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop&crop=faces&auto=format&q=80',
    fallbackBg: 'bg-gradient-to-tr from-purple-500 to-indigo-600',
    initial: 'A'
  },
  { 
    src: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces&auto=format&q=80',
    fallbackBg: 'bg-gradient-to-tr from-blue-500 to-cyan-600',
    initial: 'R'
  },
  { 
    src: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=faces&auto=format&q=80',
    fallbackBg: 'bg-gradient-to-tr from-emerald-500 to-teal-600',
    initial: 'P'
  },
  { 
    src: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=faces&auto=format&q=80',
    fallbackBg: 'bg-gradient-to-tr from-amber-500 to-orange-600',
    initial: 'V'
  },
];

export default function LandingClient() {
  const [introKey, setIntroKey] = useState(1);
  const [playIntro, setPlayIntro] = useState(true);
  const [activeFaq, setActiveFaq] = useState<number | null>(0);
  const [contactSubmitted, setContactSubmitted] = useState(false);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (contactEmail && contactMessage) {
      setContactSubmitted(true);
      setTimeout(() => {
        setContactSubmitted(false);
        setContactName('');
        setContactEmail('');
        setContactMessage('');
      }, 3500);
    }
  };

  return (
    <div className="min-h-screen bg-bg relative overflow-hidden font-sans text-text-primary selection:bg-accent/20">
      
      {/* High-Impact Crumble & Clearing Splash Intro Animation */}
      {playIntro && (
        <CrumbleToUnifyIntro key={introKey} onComplete={() => setPlayIntro(false)} />
      )}

      {/* Background Gradients (Alizo Style) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full opacity-50 mix-blend-multiply"
             style={{ background: 'radial-gradient(circle, rgba(109, 40, 217, 0.15) 0%, rgba(109, 40, 217, 0) 70%)', filter: 'blur(100px)' }}></div>
        <div className="absolute top-[40%] -right-[20%] w-[60%] h-[80%] rounded-full opacity-40 mix-blend-multiply"
             style={{ background: 'radial-gradient(circle, rgba(109, 40, 217, 0.1) 0%, rgba(109, 40, 217, 0) 70%)', filter: 'blur(120px)' }}></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-6 sm:px-8 py-5 max-w-7xl mx-auto">
        <Link href="/" className="flex items-center gap-3 group cursor-pointer" aria-label="Unify Home">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-accent via-purple-600 to-indigo-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-accent/25 shrink-0 transition-transform group-hover:scale-105">
            U
          </div>
        </Link>

        <div className="hidden lg:flex gap-7 font-bold text-sm text-text-secondary items-center">
          <Link href="#features" className="hover:text-accent transition-colors">Features</Link>
          <Link href="#solutions" className="hover:text-accent transition-colors">Solutions</Link>
          <Link href="#about" className="hover:text-accent transition-colors">About & Team</Link>
          <Link href="#faqs" className="hover:text-accent transition-colors">FAQs</Link>
          <Link href="#contact" className="hover:text-accent transition-colors">Contact</Link>
        </div>

        <div className="flex items-center gap-2.5 sm:gap-3">
          <Link href="/login" className="px-4 py-2.5 rounded-full font-bold text-xs text-text-primary hover:text-accent hover:bg-surface-hover transition-colors border border-border shadow-sm flex items-center gap-1.5 cursor-pointer">
            <Lock size={12} className="text-accent" />
            <span>Log In</span>
          </Link>
          <Link href="/dashboard" className="hidden sm:inline-block px-4 py-2.5 rounded-full font-bold text-xs text-text-secondary hover:text-text-primary hover:bg-surface-hover transition-colors border border-border shadow-sm">
            Live App
          </Link>
          <Link href="/onboarding" className="px-5 py-2.5 rounded-full font-extrabold text-xs text-white bg-accent hover:bg-accent-hover transition-all shadow-[0_4px_14px_rgba(109,40,217,0.3)] hover:-translate-y-0.5">
            Get Started Free →
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 pt-10 pb-20 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center max-w-4xl"
        >
          {/* Live Market Pulse Banner */}
          <motion.div 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-surface/90 border border-border shadow-md text-[11px] font-mono text-text-muted mb-6 backdrop-blur-md"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gain opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-gain"></span>
            </span>
            <span className="font-extrabold text-text-primary">LIVE MARKET PULSE</span>
            <span className="text-border">|</span>
            <span className="text-text-secondary">NIFTY 50 <strong className="text-gain font-bold">24,852.15 (+0.64%)</strong></span>
            <span className="text-border">|</span>
            <span className="text-text-secondary">SENSEX <strong className="text-gain font-bold">81,424.80 (+0.58%)</strong></span>
          </motion.div>

          {/* Big Center Brand Logo (Borderless, Large & Clearly Readable) */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-8 flex items-center justify-center hover:scale-105 transition-transform duration-300"
          >
            <img 
              src="/logos/unify-hero.png" 
              alt="Unify — PLAN • TRACK • GROW" 
              className="h-28 sm:h-36 md:h-44 w-auto object-contain drop-shadow-xl select-none" 
            />
          </motion.div>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-bg border border-accent/20 text-accent text-xs font-black uppercase tracking-wider mb-6 shadow-sm">
            <Sparkles size={14} /> Official Unified Investment Intelligence Platform
          </div>

          <h1 className="heading-hero text-5xl sm:text-6xl md:text-7xl font-black max-w-4xl leading-[1.1] mb-6 tracking-tight text-text-primary">
            Master Your Wealth <br/> 
            <span className="text-gradient">Without the Complexity.</span>
          </h1>

          <p className="text-base sm:text-lg text-text-secondary max-w-2xl mx-auto mb-8 leading-relaxed font-medium">
            Synchronize scattered broker accounts (Zerodha, Groww, Upstox & CAS), forecast returns with institutional ML models, and harvest capital gains tax deductions—all in one encrypted dashboard.
          </p>

          <div className="flex flex-col sm:flex-row justify-center gap-3.5 w-full sm:w-auto">
            <Link href="/onboarding" className="btn-primary text-sm px-8 py-3.5 shadow-lg shadow-accent/30 font-black">
              Start Onboarding Gateway →
            </Link>
            <Link href="/dashboard" className="px-8 py-3.5 rounded-xl font-bold text-xs text-text-primary bg-surface hover:bg-surface-hover shadow-sm border border-border transition-all flex items-center justify-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gain animate-pulse"></span>
              Explore Live Portfolio Demo
            </Link>
          </div>
        </motion.div>

        {/* SOCIAL PROOF & AUTHENTICITY STATS STRIP (DATA POP-IN) */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-16 w-full max-w-5xl"
        >
          {/* User Avatars & Rating Banner */}
          <div className="flex flex-col sm:flex-row items-center justify-between p-4 sm:p-5 rounded-3xl bg-surface/90 border border-border shadow-xl backdrop-blur-md mb-8 gap-4">
            <div className="flex items-center gap-3.5">
              <div className="flex -space-x-2 items-center shrink-0">
                {INVESTOR_TESTIMONIAL_AVATARS.map((av, idx) => (
                  <div 
                    key={idx} 
                    className="relative w-8 h-8 rounded-full ring-2 ring-surface overflow-hidden shadow-sm shrink-0 bg-surface-hover"
                  >
                    <img 
                      src={av.src} 
                      alt={`Verified Investor ${idx + 1}`} 
                      className="w-full h-full object-cover"
                      loading="lazy"
                      onError={(e) => {
                        e.currentTarget.style.display = 'none';
                      }}
                    />
                    <div className={`absolute inset-0 ${av.fallbackBg} flex items-center justify-center text-white text-[10px] font-black -z-10`}>
                      {av.initial}
                    </div>
                  </div>
                ))}
                <div className="w-8 h-8 rounded-full ring-2 ring-surface bg-accent text-white text-[10px] font-black flex items-center justify-center shadow-md shrink-0">
                  +18k
                </div>
              </div>
              <div className="text-left">
                <div className="flex items-center gap-1.5">
                  <div className="flex items-center gap-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={13} className="fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <span className="text-xs font-black text-text-primary">4.9 / 5</span>
                  <span className="text-[10px] font-extrabold text-gain px-1.5 py-0.2 rounded-md bg-gain-bg border border-gain/20 flex items-center gap-0.5">
                    <Check size={10} strokeWidth={3} /> Verified
                  </span>
                </div>
                <p className="text-[11px] text-text-muted font-bold mt-0.5">
                  Trusted by <strong className="text-text-primary">18,500+ Indian Retail Investors</strong> across NSE & BSE
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 text-xs font-bold text-text-secondary">
              <span className="px-3 py-1 rounded-full bg-gain-bg text-gain border border-gain/20 flex items-center gap-1.5">
                <ShieldCheck size={14} /> Bank-Grade 256-bit AES
              </span>
              <span className="px-3 py-1 rounded-full bg-bg border border-border text-text-muted">
                100% Client-Side Privacy
              </span>
            </div>
          </div>

          {/* 4 Key Industry Standard Metrics Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { val: '₹42.8+ Cr', label: 'Consolidated Assets Analyzed', sub: 'Across equities, REITs & debt' },
              { val: '18,500+', label: 'Active Investor Profiles', sub: 'Verified CKYC Demats' },
              { val: '4 Major Portals', label: 'Brokers & Depositories', sub: 'Zerodha, Groww, Upstox, CDSL' },
              { val: '99.98%', label: 'Automated Extraction Accuracy', sub: 'Contract notes & P&L parser' },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: i * 0.1 }}
                whileHover={{ y: -4, scale: 1.02 }}
                className="p-5 rounded-3xl bg-surface border border-border shadow-sm text-left hover:shadow-lg transition-all"
              >
                <p className="text-2xl sm:text-3xl font-black text-accent tracking-tight">{stat.val}</p>
                <h4 className="text-xs font-extrabold text-text-primary mt-1">{stat.label}</h4>
                <p className="text-[10px] text-text-muted mt-0.5 font-medium">{stat.sub}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </section>

      {/* CORE FEATURES SECTION */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-20 border-t border-border">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-14"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-accent-bg text-accent text-xs font-black uppercase tracking-wider mb-3">
            Flagship Capabilities
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-primary tracking-tight">
            Comprehensive Suite Built for Modern Investors
          </h2>
          <p className="text-sm text-text-secondary max-w-xl mx-auto mt-2 font-medium">
            Explore every intelligent engine built into Unify to eliminate portfolio blindness and maximize post-tax net worth.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {CORE_FEATURES.map((f, idx) => (
            <Link 
              key={idx} 
              href={f.link} 
              className="block group cursor-pointer focus:outline-none"
            >
              <motion.div
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: idx * 0.05 }}
                whileHover={{ y: -8, scale: 1.015 }}
                className={`card p-6 rounded-3xl bg-surface border border-border flex flex-col justify-between shadow-sm hover:shadow-2xl transition-all relative overflow-hidden h-full ${f.borderGlow}`}
              >
                {/* Subtle gradient background glow on hover */}
                <div className={`absolute inset-0 bg-gradient-to-br ${f.accentColor} opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none`} />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="w-12 h-12 rounded-2xl bg-bg border border-border flex items-center justify-center group-hover:scale-110 group-hover:shadow-md transition-all">
                      {getFeatureIcon(f.iconType)}
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap justify-end">
                      <span className="text-[10px] font-mono font-bold text-text-muted flex items-center gap-1.5 bg-bg px-2.5 py-0.5 rounded-full border border-border">
                        <span className="w-1.5 h-1.5 rounded-full bg-gain animate-ping shrink-0" />
                        {f.tag}
                      </span>
                      <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-accent-bg text-accent border border-accent/20">
                        {f.badge}
                      </span>
                    </div>
                  </div>
                  <h3 className="text-base font-black text-text-primary mb-2 group-hover:text-accent transition-colors">
                    {f.title}
                  </h3>
                  <p className="text-xs text-text-secondary leading-relaxed font-medium">
                    {f.desc}
                  </p>
                </div>

                <div className="relative z-10 pt-4 mt-5 border-t border-border/60 flex items-center justify-between">
                  <span className="text-xs font-black text-accent group-hover:text-accent-hover transition-colors flex items-center gap-1">
                    {f.actionText}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-accent-bg text-accent flex items-center justify-center group-hover:bg-accent group-hover:text-white transition-all shadow-sm group-hover:translate-x-1">
                    <ArrowRight size={14} />
                  </div>
                </div>
              </motion.div>
            </Link>
          ))}
        </div>
      </section>

      {/* SOLUTIONS & COMPARISON SECTION */}
      <section id="solutions" className="relative z-10 bg-surface py-20 border-y border-border">
        <div className="max-w-7xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-gain-bg text-gain text-xs font-black uppercase tracking-wider">
                The Multi-Broker Dilemma Solved
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight leading-tight">
                No More Logging Into 4 Different Broker Apps.
              </h2>
              <p className="text-sm text-text-secondary leading-relaxed font-medium">
                The average Indian retail investor maintains Demat accounts across Zerodha, Groww, and Angel One. This fragmentation leads to unnoticed overlapping stocks, duplicate DP charges, and zero visibility into total capital gains tax liabilities.
              </p>

              <div className="space-y-3 pt-2">
                {[
                  { title: 'Cross-Broker Duplicate Scrip Detection', sub: 'Automatically alerts you when you hold the same stock (e.g. Reliance) in both Zerodha & Groww.' },
                  { title: 'Offline PDF & CAS Ingestion', sub: 'Upload any password-protected CAS statement or Tax P&L (.pdf, .csv, .xlsx) with 100% on-device privacy.' },
                  { title: 'Pre-Filled Indian ITR Schedule CG', sub: 'Download verified tax-loss schedules formatted for instant filing with your chartered accountant.' },
                ].map((item, i) => (
                  <div key={i} className="flex items-start gap-3 p-3.5 rounded-2xl bg-bg border border-border">
                    <div className="w-5 h-5 rounded-full bg-gain text-white flex items-center justify-center shrink-0 mt-0.5 text-xs font-black">
                      ✓
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-text-primary">{item.title}</h4>
                      <p className="text-[11px] text-text-secondary mt-0.5">{item.sub}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="pt-2">
                <Link href="/accounts" className="btn-primary text-xs font-bold inline-flex items-center gap-2">
                  <span>Connect Your Broker Accounts</span>
                  <ArrowRight size={14} />
                </Link>
              </div>
            </motion.div>

            {/* Visual Interactive Portfolio Preview Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              className="p-6 sm:p-8 rounded-3xl bg-bg border border-border shadow-2xl relative"
            >
              <div className="flex items-center justify-between pb-4 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-3 h-3 rounded-full bg-gain animate-pulse"></div>
                  <h4 className="text-xs font-black text-text-primary">Multi-Broker Live Stream</h4>
                </div>
                <span className="text-[10px] font-mono text-text-muted">WebSocket: 200 OK</span>
              </div>

              <div className="space-y-3 mt-4">
                {[
                  { broker: 'Zerodha Kite', scrip: 'RELIANCE', qty: '90 Qty', value: '₹2,68,686', pnl: '+₹50,886 (23.4%)', gain: true },
                  { broker: 'Groww', scrip: 'HDFCBANK', qty: '130 Qty', value: '₹2,18,465', pnl: '+₹22,165 (11.3%)', gain: true },
                  { broker: 'Upstox Pro', scrip: 'TECHM', qty: '25 Qty', value: '₹31,000', pnl: '-₹6,000 (-16.2%)', gain: false, harvestable: true },
                  { broker: 'CDSL Depository CAS', scrip: 'PPFAS Flexi Cap', qty: '10,542 NAV', value: '₹8,26,703', pnl: '+₹2,13,678 (34.8%)', gain: true },
                ].map((row, idx) => (
                  <div key={idx} className="p-3.5 rounded-2xl bg-surface border border-border flex items-center justify-between text-xs">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-extrabold text-text-primary">{row.scrip}</span>
                        <span className="text-[9px] font-mono text-text-muted px-1.5 py-0.2 rounded bg-bg border border-border">
                          {row.broker}
                        </span>
                        {row.harvestable && (
                          <span className="text-[9px] font-extrabold text-loss bg-loss-bg px-1.5 py-0.2 rounded border border-loss/20">
                            Harvest Eligible
                          </span>
                        )}
                      </div>
                      <p className="text-[10px] text-text-muted mt-0.5">{row.qty} • {row.value}</p>
                    </div>

                    <div className="text-right">
                      <span className={`font-mono font-black ${row.gain ? 'text-gain' : 'text-loss'}`}>
                        {row.pnl}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-4 p-3 rounded-2xl bg-accent-bg/40 border border-accent/20 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Sparkles size={14} className="text-accent shrink-0" />
                  <span className="font-bold text-text-primary text-[11px]">Unify AI Optimization:</span>
                </div>
                <span className="text-accent font-black text-[11px]">Save ₹420/yr DP & ₹1,200 Tax</span>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ABOUT & THE STUDENT ENGINEERING TEAM SECTION */}
      <section id="about" className="relative z-10 max-w-7xl mx-auto px-6 sm:px-8 py-20 border-b border-border">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-accent-bg text-accent text-xs font-black uppercase tracking-wider mb-3 border border-accent/20 shadow-sm">
            <Award size={14} /> Hack-On-Tracks 2026 • Student Engineering Squad
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-text-primary tracking-tight">
            Built by Student Innovators, Engineered to Institutional Standards
          </h2>
          <p className="text-sm text-text-secondary max-w-2xl mx-auto mt-2 font-medium leading-relaxed">
            Unify was designed and engineered for the national Hack-On-Tracks hackathon by an ambitious student engineering squad. We united modern distributed systems, quantitative analytics, and strict client-side data sovereignty to democratize institutional portfolio intelligence for Indian retail investors.
          </p>
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-2xl bg-surface border border-border text-[11px] font-bold text-text-muted mt-4 shadow-sm">
            <Sparkles size={13} className="text-accent" /> Track: Open Finance & Algorithmic Wealth Democratization
          </div>
        </motion.div>

        {/* 4 Student Engineering Team Members Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-5xl mx-auto mb-14">
          {TEAM_MEMBERS.map((member, i) => (
            <motion.div
              key={member.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 0.4 }}
              className="p-6 sm:p-7 rounded-3xl bg-surface border border-border hover:border-accent/40 transition-all shadow-lg hover:shadow-xl group flex flex-col justify-between relative overflow-hidden"
            >
              <div>
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className={`w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr ${member.gradient} text-white flex items-center justify-center font-black text-xl sm:text-2xl shadow-lg shadow-black/10 shrink-0`}>
                      {member.initials}
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-lg sm:text-xl font-black text-text-primary group-hover:text-accent transition-colors">
                          {member.name}
                        </h3>
                        <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-accent-bg text-accent border border-accent/20">
                          {member.badge}
                        </span>
                      </div>
                      <p className="text-xs font-bold text-text-muted mt-0.5">
                        {member.role}
                      </p>
                    </div>
                  </div>

                  <a 
                    href="https://github.com/aadiitya2007/Hack_On_Tracks" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="p-2 rounded-xl bg-bg border border-border text-text-secondary hover:text-accent hover:border-accent transition-colors shrink-0"
                    title="View Hackathon Repository"
                  >
                    <GithubIcon size={16} />
                  </a>
                </div>

                <p className="text-xs text-text-secondary leading-relaxed font-medium mb-5">
                  {member.description}
                </p>
              </div>

              {/* Disciplines / Tech Stack Pills */}
              <div className="pt-3 border-t border-border/60">
                <span className="text-[10px] font-bold uppercase text-text-muted tracking-wider block mb-2">
                  Specialized Focus:
                </span>
                <div className="flex items-center gap-1.5 flex-wrap">
                  {member.disciplines.map((tag, idx) => (
                    <span 
                      key={idx} 
                      className="text-[10px] font-extrabold px-2.5 py-1 rounded-lg bg-bg border border-border text-text-secondary"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* 3 Core Architecture Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-gain-bg text-gain flex items-center justify-center font-bold mb-3">
              <ShieldCheck size={20} />
            </div>
            <h4 className="font-extrabold text-sm text-text-primary">100% Data Sovereignty</h4>
            <p className="text-xs text-text-secondary leading-relaxed font-medium">
              We never store or monetize your financial data. All CAS and Tax P&L files are parsed entirely within your browser runtime.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-accent-bg text-accent flex items-center justify-center font-bold mb-3">
              <Brain size={20} />
            </div>
            <h4 className="font-extrabold text-sm text-text-primary">Grounded Machine Learning</h4>
            <p className="text-xs text-text-secondary leading-relaxed font-medium">
              Zero speculative black-box hype. Our models run on statistically validated technical indicators and historical volatility distributions.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-surface border border-border shadow-sm space-y-2">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 text-amber-500 flex items-center justify-center font-bold mb-3">
              <Award size={20} />
            </div>
            <h4 className="font-extrabold text-sm text-text-primary">SEBI & IT Act Aligned</h4>
            <p className="text-xs text-text-secondary leading-relaxed font-medium">
              Built strictly in adherence to Indian Income Tax Sections 70 & 71 and SEBI retail investor educational frameworks.
            </p>
          </div>
        </div>
      </section>

      {/* FREQUENTLY ASKED QUESTIONS (FAQS) ACCORDION */}
      <section id="faqs" className="relative z-10 max-w-4xl mx-auto px-6 sm:px-8 py-20">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-bg text-accent text-xs font-black uppercase tracking-wider mb-3">
            Common Inquiries
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-text-primary tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-text-secondary mt-2 font-medium">
            Everything you need to know about Unify's security, tax rules, and broker compatibility.
          </p>
        </div>

        <div className="space-y-3">
          {FAQS.map((faq, idx) => {
            const isOpen = activeFaq === idx;
            return (
              <div 
                key={idx}
                className="rounded-2xl border border-border bg-surface overflow-hidden transition-all shadow-sm"
              >
                <button
                  type="button"
                  onClick={() => setActiveFaq(isOpen ? null : idx)}
                  className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-text-primary hover:text-accent transition-colors cursor-pointer"
                >
                  <span className="leading-snug">{faq.question}</span>
                  <div className={`w-6 h-6 rounded-full bg-bg border border-border flex items-center justify-center text-text-muted shrink-0 transition-transform ${isOpen ? 'rotate-180 text-accent' : ''}`}>
                    <ChevronDown size={14} />
                  </div>
                </button>

                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 pt-1 text-xs text-text-secondary leading-relaxed font-medium border-t border-border/40">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </section>

      {/* CONTACT US & DEVELOPER HUB SECTION */}
      <section id="contact" className="relative z-10 bg-surface py-20 border-t border-border">
        <div className="max-w-5xl mx-auto px-6 sm:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-center">
            
            {/* Contact Details */}
            <div className="space-y-5">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-bg text-accent text-xs font-black uppercase tracking-wider">
                Get In Touch
              </div>
              <h2 className="text-3xl font-black text-text-primary tracking-tight">
                Have Feedback, Feature Requests or Questions?
              </h2>
              <p className="text-xs text-text-secondary leading-relaxed font-medium">
                Our engineering team is actively building and reviewing feature requests from the retail investment community. Reach out directly or check out our open codebase.
              </p>

              <div className="space-y-3 pt-2 text-xs font-medium">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-bg border border-border flex items-center justify-center text-accent shrink-0">
                    <Users size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted uppercase font-bold block">Engineering Team</span>
                    <span className="font-bold text-text-primary">Hack-On-Tracks Student Team</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-bg border border-border flex items-center justify-center text-accent shrink-0">
                    <GithubIcon size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted uppercase font-bold block">Source Code & Issues</span>
                    <a href="https://github.com/aadiitya2007/Hack_On_Tracks" target="_blank" rel="noopener noreferrer" className="font-bold text-text-primary hover:text-accent transition-colors flex items-center gap-1">
                      github.com/aadiitya2007/Hack_On_Tracks <ExternalLink size={11} />
                    </a>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-bg border border-border flex items-center justify-center text-accent shrink-0">
                    <MapPin size={16} />
                  </div>
                  <div>
                    <span className="text-[10px] text-text-muted uppercase font-bold block">Engineering Hub</span>
                    <span className="font-bold text-text-primary">Mumbai & Bengaluru, India</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Contact Form */}
            <div className="p-6 sm:p-7 rounded-3xl bg-bg border border-border shadow-xl">
              <h3 className="font-black text-sm text-text-primary mb-1">Send a Message to Team</h3>
              <p className="text-[11px] text-text-muted mb-4">We typically respond within 24 hours.</p>

              <form onSubmit={handleContactSubmit} className="space-y-3 text-xs">
                <div>
                  <label className="text-[10px] font-extrabold uppercase text-text-muted block mb-1">Your Name</label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="Aditya Aggarwal"
                    className="w-full p-2.5 rounded-xl bg-surface border border-border text-text-primary font-medium focus:border-accent outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold uppercase text-text-muted block mb-1">Email Address</label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="aditya@example.com"
                    className="w-full p-2.5 rounded-xl bg-surface border border-border text-text-primary font-medium focus:border-accent outline-none"
                  />
                </div>

                <div>
                  <label className="text-[10px] font-extrabold uppercase text-text-muted block mb-1">Message or Feedback</label>
                  <textarea
                    required
                    rows={3}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    placeholder="Hi team, I would love to see Angel One live API integration..."
                    className="w-full p-2.5 rounded-xl bg-surface border border-border text-text-primary font-medium focus:border-accent outline-none resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="btn-primary w-full py-3 text-xs font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  {contactSubmitted ? (
                    <>
                      <Check size={14} /> Message Sent! Thank you.
                    </>
                  ) : (
                    <>Send Direct Message →</>
                  )}
                </button>
              </form>
            </div>

          </div>
        </div>
      </section>

      {/* CTA FOOTER */}
      <footer className="relative z-10 bg-bg pt-16 pb-12 text-center border-t border-border">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-2xl mx-auto px-6 space-y-4"
        >
          <img src="/logos/unify-hero.png" alt="Unify" className="h-12 mx-auto object-contain drop-shadow-md" />
          <h2 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
            Ready to Unify Your Multi-Asset Portfolio?
          </h2>
          <p className="text-xs text-text-secondary max-w-md mx-auto leading-relaxed">
            Join thousands of smart investors using data-driven intelligence and tax optimization.
          </p>
          <div className="pt-2">
            <Link href="/onboarding" className="btn-primary text-xs font-black px-8 py-3.5 shadow-lg shadow-accent/30 inline-block">
              Create Free Account & Onboard →
            </Link>
          </div>
        </motion.div>
        
        {/* Compliance & Copyright Disclaimer */}
        <div className="mt-16 pt-8 border-t border-border/60 max-w-5xl mx-auto px-6 text-[10px] text-text-muted space-y-2">
          <p className="leading-relaxed">
            <strong>Regulatory & Compliance Notice:</strong> Unify is an algorithmic portfolio analytics and educational platform. Unify does not execute orders on discretion or provide SEBI registered investment advice. Securities market investments are subject to market risks. Past performance and machine learning predictive trajectories are not indicative of future returns.
          </p>
          <p>© 2026 Unify Financial Technologies. Built for Hack-On-Tracks 2026 by Aadiitya Agarrwal, Aryan Amilkanthwar, Advait Ambarkar & Tanay Bhutada.</p>
        </div>
      </footer>
      
    </div>
  );
}
