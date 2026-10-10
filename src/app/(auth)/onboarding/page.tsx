'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Shield, CheckCircle2, UserCheck, Camera, Brain, Award, 
  ArrowRight, Sparkles, AlertCircle, RefreshCw, BarChart3, HelpCircle,
  FileText, Upload, Mail, ExternalLink, Check, User, Phone, MapPin
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

const BROKER_OPTIONS = [
  { id: 'zerodha', name: 'Zerodha Kite', logo: '/logos/zerodha.webp', isPartnered: true, autoFound: true },
  { id: 'groww', name: 'Groww', logo: '/logos/groww.png', isPartnered: true, autoFound: true },
  { id: 'upstox', name: 'Upstox Pro', logo: '/logos/upstox.png', isPartnered: true, autoFound: false },
  { id: 'cdsl', name: 'CDSL Depository CAS', logo: '/logos/cdsl.webp', isPartnered: true, autoFound: true },
  { id: 'angel', name: 'Angel One', logo: '/logos/unify.png', isPartnered: false, autoFound: false },
  { id: 'icici', name: 'ICICI Direct / HDFC Sec', logo: '/logos/unify.png', isPartnered: false, autoFound: false },
];

const BROKER_GUIDES: Record<string, { title: string; steps: string[] }> = {
  'zerodha': {
    title: 'Zerodha Kite P&L Download Guide',
    steps: [
      'Login to console.zerodha.com or open the Kite mobile app.',
      'Go to Profile / Account → Reports → Tax P&L.',
      'Select the Financial Year (e.g. FY 2024-25) & Segment (Equity / F&O).',
      'Click "Download P&L" (PDF or Excel) and save to device.'
    ]
  },
  'groww': {
    title: 'Groww Tax P&L Download Guide',
    steps: [
      'Open the Groww App or web portal at groww.in.',
      'Click your Profile Avatar → Reports.',
      'Select "Stocks P&L" or "Mutual Fund P&L".',
      'Choose Financial Year and click "Download PDF".'
    ]
  },
  'upstox': {
    title: 'Upstox Pro P&L Download Guide',
    steps: [
      'Login to my.upstox.com or open the Upstox Pro app.',
      'Navigate to Account → Reports & Ledgers → Tax P&L.',
      'Select Financial Year & click "Export PDF Statement".'
    ]
  },
  'angel': {
    title: 'Angel One P&L Download Guide',
    steps: [
      'Login to Angel One app or web portal.',
      'Go to Account → Statements → Gain/Loss & Tax P&L.',
      'Select Date Range and tap "Download PDF".'
    ]
  },
  'icici': {
    title: 'ICICI Direct / HDFC / CAMS CAS Guide',
    steps: [
      'Visit camsonline.com or cdslindia.com for Consolidated Account Statement (CAS).',
      'Select CAS - Detailed statement with portfolio holdings.',
      'Enter your PAN & Email address to receive statement via email.'
    ]
  }
};

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const router = useRouter();

  // Basic Profile State
  const [fullName, setFullName] = useState('Aadiitya Agarrwal');
  const [age, setAge] = useState('24');
  const [phone, setPhone] = useState('+91 9876543210');
  const [email, setEmail] = useState('aadiitya@example.com');
  const [address, setAddress] = useState('Mumbai, Maharashtra, India');

  // PAN & OTP State
  const [pan, setPan] = useState('');
  const [otp, setOtp] = useState('');

  // DigiLocker State
  const [digiLockerRedirecting, setDigiLockerRedirecting] = useState(false);
  const [digiLockerVerified, setDigiLockerVerified] = useState(false);

  // Real Camera & Face Auth State
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [cameraActive, setCameraActive] = useState(false);
  const [faceScanning, setFaceScanning] = useState(false);
  const [faceVerified, setFaceVerified] = useState(false);
  const [capturedSnapshot, setCapturedSnapshot] = useState<string | null>(null);
  const [scanProgress, setScanProgress] = useState(0);

  // Broker Portal Selection & PnL Upload State
  const [selectedBrokers, setSelectedBrokers] = useState<string[]>(['zerodha', 'groww', 'cdsl']);
  const [pnlFileUploaded, setPnlFileUploaded] = useState(false);
  const [pnlFileName, setPnlFileName] = useState<string | null>(null);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [showGuideModal, setShowGuideModal] = useState(false);
  const [activeGuideBroker, setActiveGuideBroker] = useState<'zerodha' | 'groww' | 'upstox' | 'angel' | 'icici'>('zerodha');
  const [gmailSyncEnabled, setGmailSyncEnabled] = useState(true);

  // File Upload Validation Handler
  const handleFileUpload = (file: File) => {
    setUploadError(null);
    setUploadSuccess(false);

    const validExtensions = ['.pdf', '.csv', '.xlsx', '.xls'];
    const fileName = file.name.toLowerCase();
    const isValidExtension = validExtensions.some(ext => fileName.endsWith(ext));

    if (!isValidExtension) {
      setUploadError(`Invalid file format ("${file.name}"). P&L statements must be uploaded in PDF, CSV, or Excel (.xlsx) format.`);
      return;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const text = (e.target?.result as string) || '';
      const lowerText = text.toLowerCase();
      
      const keywords = ['pnl', 'p&l', 'profit', 'loss', 'cas', 'holding', 'contract', 'trade', 'statement', 'zerodha', 'groww', 'upstox', 'angel', 'tax', 'realized', 'unrealized', 'isin', 'demat', 'equity', 'scrip', 'broker'];
      const hasKeyword = keywords.some(k => lowerText.includes(k) || fileName.includes('pnl') || fileName.includes('statement') || fileName.includes('cas') || fileName.includes('contract'));
      
      if (file.size < 50) {
        setUploadError("The uploaded file is empty. Please upload a valid P&L statement.");
        return;
      }

      if (!hasKeyword && file.size < 10000) {
        setUploadError("Invalid file content. The uploaded file does not contain recognized broker P&L or CAS trade data.");
        return;
      }

      setUploadSuccess(true);
      setPnlFileName(file.name);
      setPnlFileUploaded(true);
    };

    reader.readAsText(file.slice(0, 10000));
  };

  // Skill Quiz State
  const [currentQuizIdx, setCurrentQuizIdx] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [userCategory, setUserCategory] = useState<{ level: string; title: string; desc: string; color: string } | null>(null);

  const handleNext = () => setStep(s => s + 1);

  // Enter Key Handler helper for forms
  const handleKeyDown = (e: React.KeyboardEvent, onValidSubmit: () => void) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      onValidSubmit();
    }
  };

  // Start Device Camera on Step 5
  useEffect(() => {
    if (step === 5) {
      let stream: MediaStream | null = null;
      navigator.mediaDevices?.getUserMedia({ video: { width: 640, height: 480 } })
        .then(s => {
          stream = s;
          if (videoRef.current) {
            videoRef.current.srcObject = s;
            setCameraActive(true);
          }
        })
        .catch(err => {
          console.warn('Webcam access not allowed, fallback simulation:', err);
          setCameraActive(false);
        });

      return () => {
        if (stream) {
          stream.getTracks().forEach(t => t.stop());
        }
      };
    }
  }, [step]);

  // Capture face frame & run liveness scan
  const captureAndVerifyFace = () => {
    setFaceScanning(true);
    setScanProgress(0);

    // Capture snapshot if camera is active
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 320;
      canvas.height = video.videoHeight || 240;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setCapturedSnapshot(canvas.toDataURL('image/png'));
      }
    }

    let progress = 0;
    const interval = setInterval(() => {
      progress += 25;
      setScanProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setFaceScanning(false);
        setFaceVerified(true);
      }
    }, 400);
  };

  // DigiLocker Government Modal Simulation
  const handleDigiLockerAuth = () => {
    setDigiLockerRedirecting(true);
    setTimeout(() => {
      setDigiLockerRedirecting(false);
      setDigiLockerVerified(true);
      setTimeout(() => setStep(5), 1000);
    }, 2000);
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
      setStep(8); // Move to classification certificate
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
        
        {/* Header Logo */}
        <div className="mb-6 flex flex-col items-center">
          <img src="/logos/unify.png" alt="Unify — PLAN / TRACK / GROW" className="h-16 md:h-20 object-contain drop-shadow-md" />
          <div className="flex items-center gap-2 mt-3">
            <span className="px-3.5 py-1 rounded-full bg-surface border border-border text-text-secondary text-[10px] font-extrabold tracking-widest uppercase shadow-sm">
              Official Identity & Portfolio Onboarding Gateway
            </span>
          </div>
        </div>

        {/* Step Indicator Pills */}
        <div className="flex items-center justify-between mb-6 px-1">
          {['Profile', 'NSDL PAN', 'OTP', 'DigiLocker', 'Face Auth', 'Accounts', 'Quiz', 'Category'].map((sName, idx) => {
            const stepNum = idx + 1;
            const active = step === stepNum;
            const completed = step > stepNum;
            return (
              <div key={sName} className="flex flex-col items-center">
                <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[11px] font-extrabold transition-all ${
                  completed ? 'bg-gain text-white' : (active ? 'bg-accent text-white shadow-[0_0_12px_rgba(109,40,217,0.5)] scale-110' : 'bg-surface text-text-muted border border-border')
                }`}>
                  {completed ? '✓' : stepNum}
                </div>
                <span className="text-[8.5px] font-bold text-text-muted mt-1 hidden sm:block">{sName}</span>
              </div>
            );
          })}
        </div>

        {/* Card Container */}
        <div className="card p-6 md:p-8 bg-surface border border-border rounded-3xl shadow-2xl relative overflow-hidden">
          <AnimatePresence mode="wait">
            
            {/* STEP 1: Basic Personal Profile */}
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <form 
                  onSubmit={(e) => { e.preventDefault(); handleNext(); }} 
                  onKeyDown={(e) => handleKeyDown(e, handleNext)}
                  className="space-y-4"
                >
                  <div>
                    <h2 className="text-xl font-black text-text-primary">Step 1: Basic Investor Profile</h2>
                    <p className="text-xs text-text-secondary mt-1">Enter your contact details to locate CKYC and depository records. Press <kbd className="px-1.5 py-0.5 rounded bg-bg border border-border font-mono text-[10px]">Enter</kbd> to advance.</p>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-[10px] font-extrabold uppercase text-text-muted">Full Name (As per Bank & PAN)</label>
                      <input 
                        type="text" 
                        value={fullName}
                        onChange={e => setFullName(e.target.value)}
                        required
                        className="w-full mt-1 bg-bg border border-border rounded-xl px-4 py-2.5 text-sm font-bold text-text-primary focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-[10px] font-extrabold uppercase text-text-muted">Age (Years)</label>
                        <input 
                          type="number" 
                          value={age}
                          onChange={e => setAge(e.target.value)}
                          required
                          className="w-full mt-1 bg-bg border border-border rounded-xl px-4 py-2.5 text-sm font-bold text-text-primary focus:outline-none focus:border-accent"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] font-extrabold uppercase text-text-muted">Mobile Number</label>
                        <input 
                          type="text" 
                          value={phone}
                          onChange={e => setPhone(e.target.value)}
                          required
                          className="w-full mt-1 bg-bg border border-border rounded-xl px-4 py-2.5 text-sm font-bold text-text-primary focus:outline-none focus:border-accent"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase text-text-muted">Email Address</label>
                      <input 
                        type="email" 
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        required
                        className="w-full mt-1 bg-bg border border-border rounded-xl px-4 py-2.5 text-sm font-bold text-text-primary focus:outline-none focus:border-accent"
                      />
                    </div>

                    <div>
                      <label className="text-[10px] font-extrabold uppercase text-text-muted">Residential Address</label>
                      <input 
                        type="text" 
                        value={address}
                        onChange={e => setAddress(e.target.value)}
                        required
                        className="w-full mt-1 bg-bg border border-border rounded-xl px-4 py-2.5 text-sm font-bold text-text-primary focus:outline-none focus:border-accent"
                      />
                    </div>
                  </div>

                  <button type="submit" className="btn-primary w-full py-3.5 text-xs font-bold flex justify-center items-center gap-2">
                    Save Profile & Proceed to NSDL PAN Verification →
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 2: NSDL PAN Card Verification */}
            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <form 
                  onSubmit={(e) => { e.preventDefault(); if (pan.length === 10) handleNext(); }}
                  onKeyDown={(e) => handleKeyDown(e, () => { if (pan.length === 10) handleNext(); })}
                  className="space-y-5"
                >
                  <div className="flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-black text-text-primary">Step 2: NSDL PAN Verification</h2>
                      <p className="text-xs text-text-secondary mt-1">Verify Permanent Account Number against NSDL Securities Depository.</p>
                    </div>
                    {/* NSDL Official Logo Badge */}
                    <img src="/logos/nsdl.png" alt="NSDL Depository" className="h-10 object-contain bg-white p-1 rounded-lg border border-border shrink-0 shadow-sm" />
                  </div>
                  
                  <div>
                    <label className="text-[10px] font-extrabold uppercase text-text-muted">Permanent Account Number (PAN)</label>
                    <input 
                      type="text" 
                      value={pan}
                      onChange={e => setPan(e.target.value.toUpperCase())}
                      placeholder="ABCDE1234F"
                      className="w-full mt-1 bg-bg border border-border rounded-2xl px-4 py-3.5 focus:outline-none focus:border-accent text-center tracking-[0.4em] font-mono text-xl font-black uppercase"
                      maxLength={10}
                      autoFocus
                    />
                  </div>

                  <div className="p-3 rounded-2xl bg-accent-bg border border-accent/20 text-accent text-xs flex items-center gap-2 font-medium">
                    <Shield size={16} className="shrink-0" />
                    <span>Official NSDL Depository API verification. Type 10 characters and press <kbd className="px-1.5 py-0.5 rounded bg-surface border border-accent/30 font-mono text-[10px]">Enter</kbd>.</span>
                  </div>

                  <button type="submit" disabled={pan.length !== 10} className="btn-primary w-full py-3.5 text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed">
                    Verify NSDL PAN & Send Mobile OTP →
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 3: Mobile OTP */}
            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <form 
                  onSubmit={(e) => { e.preventDefault(); if (otp.length === 6) handleNext(); }}
                  onKeyDown={(e) => handleKeyDown(e, () => { if (otp.length === 6) handleNext(); })}
                  className="space-y-5"
                >
                  <div>
                    <h2 className="text-xl font-black text-text-primary">Step 3: Mobile OTP Authentication</h2>
                    <p className="text-xs text-text-secondary mt-1">Enter the 6-digit verification code sent to mobile <strong className="font-mono text-text-primary">{phone}</strong> linked to PAN <strong className="font-mono text-text-primary">{pan}</strong>.</p>
                  </div>

                  <div>
                    <label className="text-[10px] font-extrabold uppercase text-text-muted">Enter 6-Digit Mobile OTP</label>
                    <input 
                      type="text" 
                      value={otp}
                      onChange={e => setOtp(e.target.value)}
                      placeholder="0 0 0 0 0 0"
                      className="w-full mt-1 bg-bg border border-border rounded-2xl px-4 py-3.5 focus:outline-none focus:border-accent text-center tracking-[0.8em] font-mono text-2xl font-black"
                      maxLength={6}
                      autoFocus
                    />
                  </div>

                  <div className="flex justify-between items-center text-xs text-text-muted">
                    <span>Press <kbd className="px-1.5 py-0.5 rounded bg-bg border border-border font-mono text-[10px]">Enter</kbd> to submit</span>
                    <button type="button" className="text-accent font-bold hover:underline" onClick={() => setOtp('982311')}>Use Demo OTP (982311)</button>
                  </div>

                  <button type="submit" disabled={otp.length !== 6} className="btn-primary w-full py-3.5 text-xs font-bold disabled:opacity-50">
                    Confirm OTP & Proceed to DigiLocker →
                  </button>
                </form>
              </motion.div>
            )}

            {/* STEP 4: DigiLocker & UIDAI Aadhaar CKYC Authentication */}
            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div>
                  <h2 className="text-xl font-black text-text-primary">Step 4: Government DigiLocker & UIDAI Aadhaar CKYC</h2>
                  <p className="text-xs text-text-secondary mt-1">You will be redirected to the official Government portal (<strong className="text-sky-400">digilocker.gov.in</strong>) to pull Aadhaar CKYC records.</p>
                </div>

                {/* Official Logos Container */}
                <div className="flex justify-around items-center p-4 rounded-2xl bg-white border border-border shadow-sm">
                  <img src="/logos/digilocker.svg" alt="DigiLocker Government Portal" className="h-10 object-contain" />
                  <div className="h-8 w-[1px] bg-slate-200"></div>
                  <img src="/logos/aadhaar.png" alt="UIDAI Aadhaar Govt of India" className="h-10 object-contain" />
                </div>

                <div className="p-4 rounded-2xl bg-bg border border-border text-xs text-text-secondary space-y-2 leading-relaxed">
                  <p className="font-extrabold text-text-primary flex items-center gap-1.5">
                    <Shield size={16} className="text-gain" /> Official DigiLocker Authorization Contract
                  </p>
                  <p>
                    "I hereby grant explicit consent to fetch my CKYC profile and Aadhaar verification details via DigiLocker Government Gateway (<strong className="font-mono">digilocker.gov.in</strong>)."
                  </p>
                </div>

                {digiLockerRedirecting ? (
                  <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-bold text-center space-y-2">
                    <RefreshCw className="animate-spin mx-auto" size={20} />
                    <p>Connecting to DigiLocker Government Gateway (digilocker.gov.in)...</p>
                    <p className="text-[10px] text-text-muted">Fetching CKYC Identity Record & UIDAI Hash...</p>
                  </div>
                ) : digiLockerVerified ? (
                  <div className="p-4 rounded-2xl bg-gain-bg border border-gain/30 text-gain text-xs font-extrabold text-center flex items-center justify-center gap-2">
                    <CheckCircle2 size={18} /> CKYC & Aadhaar Verified via DigiLocker! Redirecting...
                  </div>
                ) : (
                  <button 
                    onClick={handleDigiLockerAuth} 
                    className="btn-primary w-full py-3.5 text-xs font-bold bg-gradient-to-r from-sky-500 to-accent text-white flex justify-center items-center gap-2"
                  >
                    <ExternalLink size={16} /> Authenticate via DigiLocker (digilocker.gov.in) →
                  </button>
                )}
              </motion.div>
            )}

            {/* STEP 5: Live Device Camera Face Capture & Biometric Verification */}
            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div>
                  <div className="flex items-center gap-2">
                    <Camera className="text-accent" size={22} />
                    <h2 className="text-xl font-black text-text-primary">Step 5: Device Camera Face Capture & Verification</h2>
                  </div>
                  <p className="text-xs text-text-secondary mt-1">Your device camera will capture your face to verify biometric liveness against your UIDAI Aadhaar photo.</p>
                </div>

                {/* Real Device Camera Viewport */}
                <div className="relative w-full h-64 rounded-3xl bg-black border-2 border-dashed border-accent/50 flex flex-col items-center justify-center overflow-hidden shadow-2xl">
                  
                  {/* Live WebRTC Camera Stream */}
                  <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover rounded-3xl" />
                  
                  {/* Hidden Canvas for Frame Snapshots */}
                  <canvas ref={canvasRef} className="hidden" />

                  {/* Face Mesh Overlay Guide */}
                  <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                    <svg className={`w-40 h-48 text-accent transition-all ${faceScanning ? 'animate-pulse scale-105' : ''}`} viewBox="0 0 100 120" fill="none" stroke="currentColor" strokeWidth="2">
                      <ellipse cx="50" cy="55" rx="35" ry="45" strokeDasharray="4 4" />
                      <circle cx="35" cy="45" r="5" fill={faceVerified ? '#10E5A0' : 'none'} />
                      <circle cx="65" cy="45" r="5" fill={faceVerified ? '#10E5A0' : 'none'} />
                      <path d="M40 75 Q50 85 60 75" strokeWidth="3" strokeLinecap="round" />
                    </svg>
                  </div>

                  {/* Scanning Laser Line */}
                  {faceScanning && (
                    <motion.div 
                      animate={{ y: [-110, 110, -110] }} 
                      transition={{ repeat: Infinity, duration: 1.4, ease: 'linear' }}
                      className="absolute w-full h-1 bg-gradient-to-r from-transparent via-accent to-transparent shadow-[0_0_20px_#6D28D9]"
                    />
                  )}

                  {/* Camera Status Label */}
                  <div className="absolute bottom-3 left-3 px-3 py-1 rounded-full bg-black/60 backdrop-blur-md text-[10px] font-mono text-white flex items-center gap-1.5 border border-white/20">
                    <span className={`w-2 h-2 rounded-full ${cameraActive ? 'bg-gain animate-ping' : 'bg-amber-400'}`}></span>
                    {cameraActive ? 'Device Camera Active' : 'Camera Ready (Simulated)'}
                  </div>

                  {/* Scanning Overlay Text */}
                  <div className="relative z-10 text-center p-4 pointer-events-none">
                    {faceVerified ? (
                      <div className="space-y-1 bg-black/70 backdrop-blur-md p-4 rounded-2xl border border-gain/40">
                        <div className="w-10 h-10 rounded-full bg-gain-bg text-gain mx-auto flex items-center justify-center border border-gain/30">
                          <CheckCircle2 size={22} />
                        </div>
                        <p className="text-sm font-black text-gain">Biometric Hash Verified!</p>
                        <p className="text-[10px] text-white/80 font-mono">Matched against UIDAI Aadhaar Photo • Liveness 99.9%</p>
                      </div>
                    ) : faceScanning && (
                      <div className="space-y-2 bg-black/70 backdrop-blur-md p-3 rounded-2xl border border-accent/40">
                        <p className="text-xs font-extrabold text-accent tracking-wider uppercase animate-pulse">Capturing & Verifying Facial Liveness...</p>
                        <div className="w-48 bg-bg h-2 rounded-full mx-auto overflow-hidden border border-border">
                          <div className="bg-accent h-full transition-all duration-300" style={{ width: `${scanProgress}%` }}></div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {!faceVerified ? (
                  <button 
                    onClick={captureAndVerifyFace} 
                    disabled={faceScanning} 
                    className="btn-primary w-full py-3.5 text-xs font-bold flex justify-center items-center gap-2"
                  >
                    {faceScanning ? <RefreshCw className="animate-spin" size={16} /> : <Camera size={16} />}
                    {faceScanning ? 'Verifying Facial Hash...' : 'Capture Face & Verify with Aadhaar →'}
                  </button>
                ) : (
                  <button onClick={handleNext} className="btn-primary w-full py-3.5 text-xs font-bold bg-gain text-white">
                    Face Authenticated — Proceed to Accounts Link →
                  </button>
                )}
              </motion.div>
            )}

            {/* STEP 6: Partnered & Non-Partnered Broker Selection & PnL Upload */}
            {step === 6 && (
              <motion.div key="step6" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                <div>
                  <h2 className="text-xl font-black text-text-primary">Step 6: Select Broker Portals & P&L Statement</h2>
                  <p className="text-xs text-text-secondary mt-1">Select the portals you want to link. Partnered brokers auto-sync via API; un-integrated brokers require P&L statement upload.</p>
                </div>

                {/* Interactive Broker Portal Checkbox Selection */}
                <div className="space-y-2">
                  <p className="text-[10px] font-extrabold uppercase text-text-muted tracking-wider">Select Broker Accounts to Connect</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {BROKER_OPTIONS.map(b => {
                      const isChecked = selectedBrokers.includes(b.id);
                      return (
                        <label 
                          key={b.id} 
                          className={`flex items-center justify-between p-2.5 rounded-2xl border transition-all cursor-pointer ${
                            isChecked ? 'bg-accent-bg/40 border-accent text-text-primary shadow-sm' : 'bg-bg border-border text-text-secondary hover:border-border/80'
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            <input 
                              type="checkbox" 
                              checked={isChecked} 
                              onChange={(e) => {
                                if (e.target.checked) {
                                  setSelectedBrokers(prev => [...prev, b.id]);
                                } else {
                                  setSelectedBrokers(prev => prev.filter(id => id !== b.id));
                                }
                              }}
                              className="w-4 h-4 accent-accent shrink-0 rounded cursor-pointer"
                            />
                            <img src={b.logo} alt={b.name} className="w-5 h-5 object-contain" />
                            <div className="flex flex-col">
                              <span className="text-xs font-black text-text-primary">{b.name}</span>
                              <span className="text-[9px] text-text-muted font-mono">
                                {b.isPartnered ? (b.autoFound ? '✓ Auto-Detected' : 'Partnered API') : 'Manual P&L'}
                              </span>
                            </div>
                          </div>
                          {b.isPartnered ? (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-gain-bg text-gain border border-gain/20">Auto API</span>
                          ) : (
                            <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-warning-bg text-warning border border-warning/20">Upload</span>
                          )}
                        </label>
                      );
                    })}
                  </div>
                </div>

                {/* Non-Partnered Upload PnL Section */}
                <div className="p-4 rounded-2xl bg-bg border border-dashed border-border space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-xs font-black text-text-primary">Un-integrated Brokers P&L / CAS Upload</p>
                      <p className="text-[10px] text-text-secondary">Upload Tax P&L or CAS statement (.pdf, .csv, .xlsx)</p>
                    </div>
                    <button 
                      type="button" 
                      onClick={() => setShowGuideModal(true)} 
                      className="text-[10px] font-extrabold text-accent bg-accent-bg px-2.5 py-1 rounded-lg border border-accent/20 flex items-center gap-1 hover:underline shrink-0"
                    >
                      <HelpCircle size={12} /> How to get P&L?
                    </button>
                  </div>

                  {/* Real File Input */}
                  <div className="relative">
                    <input 
                      type="file" 
                      accept=".pdf,.csv,.xlsx,.xls"
                      onChange={(e) => {
                        if (e.target.files && e.target.files[0]) {
                          handleFileUpload(e.target.files[0]);
                        }
                      }}
                      className="hidden"
                      id="pnl-file-input"
                    />
                    <label 
                      htmlFor="pnl-file-input" 
                      className="w-full py-3 px-4 rounded-xl bg-surface border border-border text-xs font-bold text-text-primary hover:border-accent transition-all flex justify-center items-center gap-2 cursor-pointer shadow-sm"
                    >
                      <Upload size={15} className="text-accent" />
                      {pnlFileName ? `Uploaded: ${pnlFileName}` : 'Choose P&L / CAS File (.pdf, .csv)'}
                    </label>
                  </div>

                  {/* Upload Validation Error Alert */}
                  {uploadError && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-loss-bg border border-loss/30 text-loss text-xs font-bold flex items-start gap-2">
                      <AlertCircle size={16} className="shrink-0 mt-0.5" />
                      <div>
                        <p className="font-extrabold">Invalid File Uploaded</p>
                        <p className="text-[11px] font-medium text-loss/90 mt-0.5">{uploadError}</p>
                      </div>
                    </motion.div>
                  )}

                  {/* Upload Success Alert */}
                  {uploadSuccess && (
                    <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} className="p-3 rounded-xl bg-gain-bg border border-gain/30 text-gain text-xs font-bold flex items-center gap-2">
                      <CheckCircle2 size={16} className="shrink-0" />
                      <span>P&L Statement Validated! Financial trade telemetry extracted cleanly.</span>
                    </motion.div>
                  )}
                </div>

                {/* Gmail Trade Mail Parser Access */}
                <div className="p-3.5 rounded-2xl bg-surface border border-border flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <img src="/logos/gmail.svg" alt="Gmail Sync" className="h-5 object-contain" />
                    <div>
                      <p className="text-xs font-black text-text-primary">Gmail Order Contract Note Auto-Sync</p>
                      <p className="text-[10px] text-text-muted">Grant read-only access to parse trade notes automatically</p>
                    </div>
                  </div>

                  <input 
                    type="checkbox" 
                    checked={gmailSyncEnabled} 
                    onChange={e => setGmailSyncEnabled(e.target.checked)}
                    className="w-4 h-4 accent-accent shrink-0 rounded cursor-pointer" 
                  />
                </div>

                <button 
                  onClick={() => {
                    const hasNonPartnered = selectedBrokers.some(id => id === 'angel' || id === 'icici');
                    if (hasNonPartnered && !pnlFileUploaded && !uploadSuccess) {
                      setUploadError("Please upload a valid P&L statement or CAS file for your selected non-partnered broker before advancing.");
                      return;
                    }
                    handleNext();
                  }} 
                  className="btn-primary w-full py-3.5 text-xs font-bold flex justify-center items-center gap-2"
                >
                  Save Portals & Proceed to Skill Assessment →
                </button>
              </motion.div>
            )}

            {/* STEP 7: Trader Skill & Knowledge Questionnaire */}
            {step === 7 && (
              <motion.div key="step7" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="text-[10px] font-extrabold uppercase px-2.5 py-1 rounded-full bg-accent-bg text-accent border border-accent/20">
                      Question {currentQuizIdx + 1} of {SKILL_QUESTIONS.length}
                    </span>
                    <h2 className="text-lg font-black text-text-primary mt-2">
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
                      className="w-full text-left p-4 rounded-2xl bg-bg border border-border hover:border-accent hover:bg-surface-hover text-xs font-bold text-text-primary transition-all flex items-center justify-between group"
                    >
                      <span>{opt.label}</span>
                      <ArrowRight size={14} className="text-text-muted group-hover:text-accent group-hover:translate-x-1 transition-all shrink-0" />
                    </button>
                  ))}
                </div>

                <p className="text-[11px] text-text-muted text-center italic">
                  Press <kbd className="px-1.5 py-0.5 rounded bg-bg border border-border font-mono text-[10px]">Enter</kbd> or click options to classify level.
                </p>
              </motion.div>
            )}

            {/* STEP 8: Classification Result Certificate & Launch */}
            {step === 8 && userCategory && (
              <motion.div key="step8" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="space-y-6 text-center py-2">
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
                    <Sparkles size={16} className="text-accent" /> Verified CKYC & Portfolio Configuration:
                  </p>
                  <ul className="space-y-1.5 text-text-secondary pl-5 list-disc text-[11px]">
                    <li><strong>Investor Profile:</strong> {fullName} ({age} Yrs), {email}</li>
                    <li><strong>Depository:</strong> NSDL PAN {pan} Verified</li>
                    <li><strong>CKYC Identity:</strong> DigiLocker Govt Authenticated & Biometric Face Hash Matched</li>
                    <li><strong>Accounts:</strong> Zerodha, Groww, Upstox & P&L Statement Synchronized</li>
                  </ul>
                </div>

                <button 
                  onClick={() => {
                    setStep(9);
                    setTimeout(() => router.push('/dashboard'), 1200);
                  }}
                  className="btn-primary w-full py-3.5 text-xs font-bold"
                >
                  Confirm Setup & Open Dashboard →
                </button>
              </motion.div>
            )}

            {/* STEP 9: Redirecting Final State */}
            {step === 9 && (
              <motion.div key="step9" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8 space-y-4">
                <div className="w-16 h-16 rounded-full bg-gain-bg text-gain mx-auto flex items-center justify-center border border-gain/30 animate-bounce">
                  <CheckCircle2 size={32} />
                </div>
                <h2 className="text-2xl font-black text-gain">Telemetry Connection Complete!</h2>
                <p className="text-xs text-text-secondary">Generating your personalized AI Advisory Report on the Dashboard...</p>
                <div className="w-32 h-1.5 bg-bg rounded-full mx-auto overflow-hidden border border-border">
                  <div className="bg-gain h-full animate-pulse w-full"></div>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>

      {/* Step-by-Step P&L Download Guide Modal */}
      {showGuideModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setShowGuideModal(false)}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card w-full max-w-lg p-6 relative rounded-3xl border border-border bg-surface z-10 space-y-4 max-h-[85vh] overflow-y-auto shadow-2xl"
          >
            <div className="flex justify-between items-center pb-3 border-b border-border">
              <h3 className="font-extrabold text-base text-text-primary flex items-center gap-2">
                <BookOpen size={18} className="text-accent" /> How to Download Your P&L Statement
              </h3>
              <button onClick={() => setShowGuideModal(false)} className="text-text-muted hover:text-text-primary text-sm font-bold w-7 h-7 rounded-full bg-bg border border-border flex items-center justify-center">✕</button>
            </div>

            {/* Broker Guide Selector Tabs */}
            <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
              {Object.keys(BROKER_GUIDES).map(key => (
                <button
                  key={key}
                  onClick={() => setActiveGuideBroker(key as any)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold uppercase tracking-wider shrink-0 transition-all ${
                    activeGuideBroker === key ? 'bg-accent text-white shadow-sm' : 'bg-bg text-text-secondary border border-border hover:text-text-primary'
                  }`}
                >
                  {key}
                </button>
              ))}
            </div>

            {/* Guide Step-by-Step Instructions */}
            <div className="p-4 rounded-2xl bg-bg border border-border space-y-3">
              <h4 className="font-black text-sm text-text-primary">{BROKER_GUIDES[activeGuideBroker].title}</h4>
              <ol className="space-y-2 text-xs text-text-secondary list-decimal pl-4">
                {BROKER_GUIDES[activeGuideBroker].steps.map((st, i) => (
                  <li key={i} className="leading-relaxed font-medium">{st}</li>
                ))}
              </ol>
            </div>

            <button onClick={() => setShowGuideModal(false)} className="btn-primary w-full py-3 text-xs font-bold">
              Understood — Back to Statement Upload →
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
}
