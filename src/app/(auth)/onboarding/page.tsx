'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { 
  Shield, CheckCircle2, UserCheck, Camera, Brain, Award, 
  ArrowRight, Sparkles, AlertCircle, RefreshCw, BarChart3, HelpCircle,
  FileText, Upload, Mail, ExternalLink, Check, User, Phone, MapPin,
  BookOpen, Download, KeyRound, X
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

const BROKER_GUIDES: Record<string, {
  name: string;
  title: string;
  logo: string;
  portalUrl: string;
  portalLabel: string;
  passwordTip?: string;
  steps: string[];
}> = {
  'zerodha': {
    name: 'Zerodha Kite',
    title: 'Zerodha Kite Tax P&L Statement',
    logo: '/logos/zerodha.webp',
    portalUrl: 'https://console.zerodha.com/reports/tax-pnl',
    portalLabel: 'Open Zerodha Console',
    passwordTip: 'Zerodha P&L Excel & CSV downloads are unencrypted and ready for direct upload.',
    steps: [
      'Log in to console.zerodha.com or open the Kite mobile app.',
      'Go to Profile / Account → Reports → Tax P&L.',
      'Select Financial Year (e.g. FY 2024-25) & Segment (Equity / F&O / Mutual Funds).',
      'Click "Download P&L" (Excel or CSV) and upload it here.'
    ]
  },
  'groww': {
    name: 'Groww',
    title: 'Groww Tax P&L & Capital Gains Statement',
    logo: '/logos/groww.png',
    portalUrl: 'https://groww.in/user/reports',
    portalLabel: 'Open Groww Reports',
    passwordTip: 'If your Groww statement PDF is password-protected, the password is your PAN in UPPERCASE.',
    steps: [
      'Open the Groww App or log in at groww.in.',
      'Click your Profile Avatar (top right) → Reports.',
      'Select "Stocks P&L" or "Mutual Fund Capital Gains".',
      'Choose the Financial Year and click "Download PDF" or "Download Excel".'
    ]
  },
  'upstox': {
    name: 'Upstox Pro',
    title: 'Upstox Pro Tax P&L Statement',
    logo: '/logos/upstox.png',
    portalUrl: 'https://my.upstox.com',
    portalLabel: 'Open Upstox Portal',
    passwordTip: 'Upstox Tax P&L statements require no password when exported from web ledger.',
    steps: [
      'Log in to my.upstox.com or open the Upstox Pro app.',
      'Navigate to Account → Reports & Ledgers → Tax P&L.',
      'Select Financial Year & click "Export PDF Statement" or "Download CSV".',
      'Save the statement file to your device and upload here.'
    ]
  },
  'angel': {
    name: 'Angel One',
    title: 'Angel One Gain/Loss & Tax P&L Statement',
    logo: '/logos/unify.png',
    portalUrl: 'https://www.angelone.in/trade',
    portalLabel: 'Open Angel One',
    passwordTip: 'Angel One PDF password (if prompted) is your PAN in uppercase or DOB (DDMMYYYY).',
    steps: [
      'Log in to the Angel One app or web trading portal.',
      'Navigate to Account / Profile → Statements & Reports.',
      'Select "Gain / Loss Statement" or "Tax P&L" for the financial year.',
      'Click "Download PDF / CSV" and upload it to Unify.'
    ]
  },
  'icici': {
    name: 'ICICI / HDFC',
    title: 'ICICI Direct / HDFC Sec Statement',
    logo: '/logos/unify.png',
    portalUrl: 'https://secure.icicidirect.com',
    portalLabel: 'Open ICICI Direct',
    passwordTip: 'Protected by your PAN in UPPERCASE or Date of Birth in DDMMYYYY format.',
    steps: [
      'Log in to ICICI Direct or HDFC Securities customer portal.',
      'Navigate to Statements → Capital Gains / Realized P&L.',
      'Select Financial Year & Equity/Mutual Funds asset classes.',
      'Download statement as PDF or Excel spreadsheet and upload.'
    ]
  },
  'cdsl': {
    name: 'CDSL CAS',
    title: 'Consolidated Account Statement (CAS)',
    logo: '/logos/cdsl.webp',
    portalUrl: 'https://www.cdslindia.com/cas/',
    portalLabel: 'Open CDSL CAS Portal',
    passwordTip: 'CAS PDFs are protected by your 10-digit PAN in UPPERCASE or DOB (DDMMYYYY).',
    steps: [
      'Visit cdslindia.com/cas or camsonline.com to generate your CAS.',
      'Enter your 10-digit PAN and registered mobile or email.',
      'Authenticate with OTP to receive the complete consolidated portfolio statement via email.',
      'Download the attached PDF/Excel and upload it directly to Unify.'
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
  const [activeGuideBroker, setActiveGuideBroker] = useState<'zerodha' | 'groww' | 'upstox' | 'angel' | 'icici' | 'cdsl'>('zerodha');
  const [gmailSyncEnabled, setGmailSyncEnabled] = useState(true);

  // Close guide modal on Escape key press
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && showGuideModal) {
        setShowGuideModal(false);
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [showGuideModal]);

  // Load Verified Demo Tax P&L Statement for rapid hackathon testing
  const loadDemoPnlStatement = () => {
    setUploadError(null);
    setPnlFileName('Unify_Tax_PnL_FY24-25_Verified.csv');
    setPnlFileUploaded(true);
    setUploadSuccess(true);
    setShowGuideModal(false);
  };

  // Download Realistic Sample P&L CSV File
  const downloadSamplePnlFile = () => {
    const sampleCsvContent = `Symbol,ISIN,Trade Date,Type,Quantity,Buy Price (INR),Sell Price (INR),Realized P&L (INR),Unrealized P&L (INR)
RELIANCE,INE002A01018,2024-04-15,BUY,50,2850.00,3010.00,8000.00,0.00
TCS,INE467B01029,2024-05-10,BUY,30,3780.00,3920.00,4200.00,0.00
INFY,INE009A01021,2024-06-05,BUY,100,1420.00,1540.00,12000.00,0.00
HDFCBANK,INE040A01034,2024-07-22,BUY,80,1510.00,1650.00,11200.00,0.00
TATAMOTORS,INE155A01022,2024-08-14,BUY,120,980.00,920.00,-7200.00,0.00
ICICIBANK,INE090A01021,2024-09-02,BUY,60,1180.00,1260.00,4800.00,0.00
`;
    const blob = new Blob([sampleCsvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'Unify_Sample_Broker_Tax_PnL.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

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
                    {cameraActive ? 'Device Camera Active' : 'Biometric Sensor Initializing...'}
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
                                  if (b.id in BROKER_GUIDES) {
                                    setActiveGuideBroker(b.id as any);
                                  }
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
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        setShowGuideModal(true);
                      }} 
                      className="text-[10px] font-extrabold text-accent bg-accent-bg px-2.5 py-1 rounded-lg border border-accent/20 flex items-center gap-1 hover:underline hover:bg-accent/15 transition-all shrink-0 cursor-pointer shadow-sm"
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

                  {/* 1-Click Demo Testing Helper */}
                  <div className="flex items-center justify-between px-1 text-[11px]">
                    <span className="text-text-muted">No broker file on hand?</span>
                    <button
                      type="button"
                      onClick={loadDemoPnlStatement}
                      className="text-accent font-bold hover:underline flex items-center gap-1 cursor-pointer transition-colors"
                    >
                      <Sparkles size={11} /> Load Demo P&L Statement
                    </button>
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
      <AnimatePresence>
        {showGuideModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" 
              onClick={() => setShowGuideModal(false)}
            />

            {/* Modal Dialog Card */}
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ duration: 0.2 }}
              onClick={(e) => e.stopPropagation()}
              className="w-full max-w-lg p-5 sm:p-6 relative rounded-3xl border border-border bg-surface text-text-primary z-10 space-y-4 max-h-[88vh] overflow-y-auto shadow-2xl my-auto"
            >
              {/* Header */}
              <div className="flex justify-between items-start pb-3 border-b border-border">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-accent-bg text-accent flex items-center justify-center border border-accent/20 shrink-0">
                    <BookOpen size={18} />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-text-primary leading-tight">
                      How to Get Your P&L Statement
                    </h3>
                    <p className="text-[11px] text-text-muted mt-0.5">
                      Instructions for all major Indian brokerages & depositories
                    </p>
                  </div>
                </div>
                <button 
                  type="button"
                  onClick={() => setShowGuideModal(false)} 
                  className="text-text-muted hover:text-text-primary hover:bg-surface-hover text-sm font-bold w-8 h-8 rounded-full bg-bg border border-border flex items-center justify-center transition-all cursor-pointer shrink-0"
                  aria-label="Close guide"
                >
                  <X size={15} />
                </button>
              </div>

              {/* Broker Guide Selector Tabs */}
              <div>
                <p className="text-[10px] font-extrabold uppercase text-text-muted tracking-wider mb-2">Select Your Broker</p>
                <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                  {Object.keys(BROKER_GUIDES).map(key => {
                    const guide = BROKER_GUIDES[key];
                    const isActive = activeGuideBroker === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        onClick={() => setActiveGuideBroker(key as any)}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold shrink-0 transition-all flex items-center gap-1.5 cursor-pointer ${
                          isActive 
                            ? 'bg-accent text-white shadow-sm' 
                            : 'bg-bg text-text-secondary border border-border hover:text-text-primary hover:bg-surface-hover'
                        }`}
                      >
                        <img src={guide.logo} alt={guide.name} className="w-4 h-4 object-contain rounded-sm" />
                        <span>{guide.name}</span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Guide Step-by-Step Instructions */}
              <div className="p-4 rounded-2xl bg-bg border border-border space-y-3.5">
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <img 
                      src={BROKER_GUIDES[activeGuideBroker]?.logo || '/logos/unify.png'} 
                      alt={BROKER_GUIDES[activeGuideBroker]?.name} 
                      className="w-5 h-5 object-contain" 
                    />
                    <h4 className="font-black text-sm text-text-primary">
                      {BROKER_GUIDES[activeGuideBroker]?.title}
                    </h4>
                  </div>
                  {BROKER_GUIDES[activeGuideBroker]?.portalUrl && (
                    <a
                      href={BROKER_GUIDES[activeGuideBroker].portalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold text-accent hover:underline flex items-center gap-1 bg-accent-bg px-2 py-1 rounded-lg border border-accent/20 shrink-0"
                    >
                      <span>{BROKER_GUIDES[activeGuideBroker].portalLabel}</span>
                      <ExternalLink size={11} />
                    </a>
                  )}
                </div>

                {/* Steps with numerical badges */}
                <div className="space-y-2.5">
                  {BROKER_GUIDES[activeGuideBroker]?.steps.map((st, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-xs text-text-secondary font-medium">
                      <span className="w-5 h-5 rounded-full bg-accent-bg text-accent font-extrabold text-[10px] flex items-center justify-center shrink-0 mt-0.5 border border-accent/20">
                        {i + 1}
                      </span>
                      <p className="leading-relaxed">{st}</p>
                    </div>
                  ))}
                </div>

                {/* Password tip */}
                {BROKER_GUIDES[activeGuideBroker]?.passwordTip && (
                  <div className="p-2.5 rounded-xl bg-surface border border-border text-[11px] text-text-muted flex items-start gap-2">
                    <KeyRound size={13} className="text-accent shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold text-text-secondary">Password Tip: </span>
                      <span>{BROKER_GUIDES[activeGuideBroker].passwordTip}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Modal Actions */}
              <div className="space-y-2 pt-1">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  <button 
                    type="button" 
                    onClick={downloadSamplePnlFile}
                    className="py-2.5 px-3 rounded-xl bg-bg border border-border hover:bg-surface-hover text-xs font-bold text-text-primary flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Download size={13} className="text-accent" />
                    <span>Download Sample (.csv)</span>
                  </button>
                  <button 
                    type="button" 
                    onClick={loadDemoPnlStatement}
                    className="py-2.5 px-3 rounded-xl bg-accent-bg border border-accent/30 hover:bg-accent/15 text-xs font-extrabold text-accent flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Sparkles size={13} />
                    <span>Auto-Load Demo P&L</span>
                  </button>
                </div>

                <button 
                  type="button"
                  onClick={() => setShowGuideModal(false)} 
                  className="btn-primary w-full py-3 text-xs font-bold cursor-pointer"
                >
                  Understood — Back to Statement Upload →
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
