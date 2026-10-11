'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  User, ShieldCheck, Globe, Settings, Wallet, Check, 
  ExternalLink, X, RefreshCw, Bell, AlertTriangle, KeyRound,
  Mail, Phone, MapPin, Building, CreditCard, Sparkles, CheckCircle2
} from 'lucide-react';
import Link from 'next/link';

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTab?: 'profile' | 'languages' | 'settings' | 'brokers';
}

const LANGUAGES = [
  { id: 'en', name: 'English (India)', native: 'English', region: 'Default • National' },
  { id: 'hi', name: 'Hindi', native: 'हिन्दी', region: 'उत्तर एवं मध्य भारत' },
  { id: 'mr', name: 'Marathi', native: 'मराठी', region: 'महाराष्ट्र' },
  { id: 'gu', name: 'Gujarati', native: 'ગુજરાતી', region: 'ગુજરાત' },
  { id: 'ta', name: 'Tamil', native: 'தமிழ்', region: 'தமிழ்நாடு' },
  { id: 'bn', name: 'Bengali', native: 'বাংলা', region: 'পশ্চিমবঙ্গ' },
];

const LINKED_BROKERS = [
  { id: 'zerodha', name: 'Zerodha Kite', accId: 'ZER-982311', logo: '/logos/zerodha.webp', value: '₹5,40,000', scrips: 8, status: 'Active • Live Sync' },
  { id: 'groww', name: 'Groww', accId: 'GRW-445109', logo: '/logos/groww.png', value: '₹3,20,000', scrips: 5, status: 'Active • Live Sync' },
  { id: 'upstox', name: 'Upstox Pro', accId: 'UPS-110293', logo: '/logos/upstox.png', value: '₹1,80,000', scrips: 3, status: 'Active • Live Sync' },
  { id: 'cdsl', name: 'CDSL Depository CAS', accId: '1208160012345678', logo: '/logos/cdsl.webp', value: '₹6,10,596', scrips: 16, status: 'Consolidated CAS Verified' },
];

export function UserProfileModal({ isOpen, onClose, defaultTab = 'profile' }: UserProfileModalProps) {
  const [activeTab, setActiveTab] = useState<'profile' | 'languages' | 'settings' | 'brokers'>(defaultTab);

  // Profile data from storage or seed defaults
  const [userName, setUserName] = useState('Aditya Aggarwal');
  const [userPan, setUserPan] = useState('ABCDE1234F');
  const [userEmail, setUserEmail] = useState('aditya.aggarwal@example.com');
  const [userPhone, setUserPhone] = useState('+91 98765 43210');
  const [userTier, setUserTier] = useState('Fresher Investor (Neophyte)');
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [currencyFormat, setCurrencyFormat] = useState<'lakh' | 'million'>('lakh');
  const [syncFreq, setSyncFreq] = useState('5s');
  const [mailSync, setMailSync] = useState(true);
  const [drawdownAlert, setDrawdownAlert] = useState('-5%');
  const [saveSuccess, setSaveSuccess] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('unify_user_name');
      const storedPan = localStorage.getItem('unify_user_pan');
      const storedEmail = localStorage.getItem('unify_user_email');
      const storedPhone = localStorage.getItem('unify_user_phone');
      const storedTitle = localStorage.getItem('unify_trader_title');
      const storedLang = localStorage.getItem('unify_language');
      const storedCurr = localStorage.getItem('unify_currency_format');

      if (storedName) setUserName(storedName);
      if (storedPan) setUserPan(storedPan);
      if (storedEmail) setUserEmail(storedEmail);
      if (storedPhone) setUserPhone(storedPhone);
      if (storedTitle) setUserTier(storedTitle);
      if (storedLang) setSelectedLanguage(storedLang);
      if (storedCurr === 'million' || storedCurr === 'lakh') setCurrencyFormat(storedCurr);
    }
  }, [isOpen]);

  useEffect(() => {
    setActiveTab(defaultTab);
  }, [defaultTab]);

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) onClose();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  const handleSaveSettings = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('unify_user_name', userName);
      localStorage.setItem('unify_language', selectedLanguage);
      localStorage.setItem('unify_currency_format', currencyFormat);
    }
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 1000);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          {/* Backdrop */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm cursor-pointer" 
            onClick={onClose}
          />

          {/* Modal Container */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-2xl bg-surface border border-border text-text-primary rounded-3xl shadow-2xl relative z-10 overflow-hidden flex flex-col max-h-[90vh] my-auto"
          >
            {/* Top User Banner */}
            <div className="p-5 sm:p-6 bg-gradient-to-r from-accent/10 via-purple-500/5 to-transparent border-b border-border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3.5">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-accent via-purple-600 to-indigo-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-accent/25 shrink-0">
                  {userName.split(' ').map(n => n[0]).join('').slice(0, 2) || 'AA'}
                </div>
                <div>
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-xl font-black text-text-primary leading-tight">{userName}</h2>
                    <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-full bg-gain-bg text-gain border border-gain/20 flex items-center gap-1">
                      <ShieldCheck size={11} /> CKYC Verified
                    </span>
                  </div>
                  <p className="text-xs text-text-secondary mt-0.5 font-medium flex items-center gap-2 flex-wrap">
                    <span>PAN: <strong className="text-text-primary font-mono">{userPan}</strong></span>
                    <span>•</span>
                    <span className="text-accent font-bold">{userTier}</span>
                  </p>
                </div>
              </div>

              <button 
                type="button" 
                onClick={onClose}
                className="w-8 h-8 rounded-full bg-bg border border-border flex items-center justify-center text-text-muted hover:text-text-primary hover:bg-surface-hover transition-colors shrink-0 self-start sm:self-center cursor-pointer"
                aria-label="Close profile modal"
              >
                <X size={16} />
              </button>
            </div>

            {/* Navigation Tabs */}
            <div className="flex items-center gap-1 px-5 pt-3 border-b border-border bg-bg/50 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveTab('profile')}
                className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 shrink-0 border-b-2 cursor-pointer ${
                  activeTab === 'profile'
                    ? 'border-accent text-accent bg-surface shadow-sm'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                }`}
              >
                <User size={14} /> Profile & CKYC
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('languages')}
                className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 shrink-0 border-b-2 cursor-pointer ${
                  activeTab === 'languages'
                    ? 'border-accent text-accent bg-surface shadow-sm'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                }`}
              >
                <Globe size={14} /> Languages
                <span className="text-[9px] font-extrabold px-1.5 py-0.2 rounded-full bg-accent-bg text-accent">
                  {LANGUAGES.find(l => l.id === selectedLanguage)?.name.split(' ')[0]}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('settings')}
                className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 shrink-0 border-b-2 cursor-pointer ${
                  activeTab === 'settings'
                    ? 'border-accent text-accent bg-surface shadow-sm'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                }`}
              >
                <Settings size={14} /> Settings
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('brokers')}
                className={`px-3.5 py-2.5 text-xs font-bold rounded-t-xl transition-all flex items-center gap-2 shrink-0 border-b-2 cursor-pointer ${
                  activeTab === 'brokers'
                    ? 'border-accent text-accent bg-surface shadow-sm'
                    : 'border-transparent text-text-secondary hover:text-text-primary hover:bg-surface-hover'
                }`}
              >
                <Wallet size={14} /> Linked Brokers (4)
              </button>
            </div>

            {/* Modal Body Content */}
            <div className="p-5 sm:p-6 flex-1 overflow-y-auto space-y-5">
              
              {/* TAB 1: PROFILE & CKYC DETAILS */}
              {activeTab === 'profile' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  <div className="p-4 rounded-2xl bg-bg border border-border space-y-3">
                    <div className="flex items-center justify-between pb-2 border-b border-border">
                      <span className="text-[10px] font-extrabold uppercase tracking-wider text-text-muted">
                        Central KYC Registry & Government Identity
                      </span>
                      <span className="text-[10px] font-bold text-gain flex items-center gap-1 bg-gain-bg px-2 py-0.5 rounded-full border border-gain/20">
                        <CheckCircle2 size={11} /> NSDL & DigiLocker Authenticated
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 text-xs">
                      <div>
                        <span className="text-text-muted text-[10px] uppercase font-bold block">Legal Name</span>
                        <span className="font-extrabold text-text-primary text-sm">{userName}</span>
                      </div>

                      <div>
                        <span className="text-text-muted text-[10px] uppercase font-bold block">Permanent Account Number (PAN)</span>
                        <span className="font-extrabold text-text-primary text-sm font-mono">{userPan}</span>
                      </div>

                      <div>
                        <span className="text-text-muted text-[10px] uppercase font-bold block">CKYC Identification (KIN)</span>
                        <span className="font-bold text-text-primary font-mono">KIN-2024-9841029</span>
                      </div>

                      <div>
                        <span className="text-text-muted text-[10px] uppercase font-bold block">Depository & BOID</span>
                        <span className="font-bold text-text-primary font-mono">CDSL (1208160012345678)</span>
                      </div>

                      <div>
                        <span className="text-text-muted text-[10px] uppercase font-bold block">Registered Email</span>
                        <span className="font-medium text-text-primary flex items-center gap-1.5 mt-0.5">
                          <Mail size={12} className="text-text-muted" /> {userEmail}
                        </span>
                      </div>

                      <div>
                        <span className="text-text-muted text-[10px] uppercase font-bold block">Mobile (Aadhaar Linked)</span>
                        <span className="font-medium text-text-primary flex items-center gap-1.5 mt-0.5">
                          <Phone size={12} className="text-text-muted" /> {userPhone}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Investor Classification Card */}
                  <div className="p-4 rounded-2xl bg-surface border border-accent/30 shadow-sm flex items-center justify-between gap-4">
                    <div className="space-y-1">
                      <span className="text-[10px] font-extrabold uppercase text-accent tracking-wider">
                        AI Evaluated Investor Classification
                      </span>
                      <h4 className="font-black text-sm text-text-primary">{userTier}</h4>
                      <p className="text-[11px] text-text-secondary leading-snug">
                        Live portfolio telemetry is customized with tailored multi-asset advisory & risk control.
                      </p>
                    </div>

                    <Link
                      href="/onboarding"
                      onClick={onClose}
                      className="px-3.5 py-2 rounded-xl bg-accent-bg border border-accent/20 text-accent hover:bg-accent/15 text-xs font-extrabold flex items-center gap-1.5 shrink-0 transition-colors"
                    >
                      <RefreshCw size={13} /> Re-take Quiz
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* TAB 2: LANGUAGES */}
              {activeTab === 'languages' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3.5">
                  <div>
                    <h3 className="font-black text-sm text-text-primary">Regional Language & Localization</h3>
                    <p className="text-xs text-text-secondary mt-0.5">
                      Select your preferred language for portfolio insights, ML predictions, and market summaries.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                    {LANGUAGES.map(lang => {
                      const isSelected = selectedLanguage === lang.id;
                      return (
                        <button
                          key={lang.id}
                          type="button"
                          onClick={() => setSelectedLanguage(lang.id)}
                          className={`p-3.5 rounded-2xl border text-left transition-all flex items-center justify-between cursor-pointer ${
                            isSelected
                              ? 'bg-accent-bg/40 border-accent shadow-sm'
                              : 'bg-bg border-border hover:border-accent/40 hover:bg-surface-hover'
                          }`}
                        >
                          <div>
                            <p className="font-extrabold text-sm text-text-primary">{lang.native}</p>
                            <p className="text-[11px] text-text-secondary font-medium">{lang.name}</p>
                            <span className="text-[9px] text-text-muted mt-0.5 block">{lang.region}</span>
                          </div>

                          {isSelected && (
                            <div className="w-6 h-6 rounded-full bg-accent text-white flex items-center justify-center shrink-0 shadow-sm">
                              <Check size={13} strokeWidth={3} />
                            </div>
                          )}
                        </button>
                      );
                    })}
                  </div>
                </motion.div>
              )}

              {/* TAB 3: SETTINGS & PREFERENCES */}
              {activeTab === 'settings' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                  {/* Currency Format */}
                  <div className="p-4 rounded-2xl bg-bg border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-text-primary">Indian Currency Number System</h4>
                        <p className="text-[11px] text-text-secondary">Display figures in Indian Lakhs/Crores or Millions</p>
                      </div>
                      <div className="flex bg-surface p-1 rounded-xl border border-border">
                        <button
                          type="button"
                          onClick={() => setCurrencyFormat('lakh')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            currencyFormat === 'lakh' ? 'bg-accent text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          ₹ Lakh / Cr
                        </button>
                        <button
                          type="button"
                          onClick={() => setCurrencyFormat('million')}
                          className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                            currencyFormat === 'million' ? 'bg-accent text-white shadow-sm' : 'text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          ₹ Million
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sync Frequency */}
                  <div className="p-4 rounded-2xl bg-bg border border-border space-y-2">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="text-xs font-black text-text-primary">Live Market Telemetry Refresh</h4>
                        <p className="text-[11px] text-text-secondary">Auto-sync interval across Zerodha, Groww & Upstox</p>
                      </div>
                      <select 
                        value={syncFreq} 
                        onChange={(e) => setSyncFreq(e.target.value)}
                        className="bg-surface border border-border text-xs font-bold text-text-primary px-3 py-1.5 rounded-xl cursor-pointer"
                      >
                        <option value="5s">Every 5 Seconds (Real-time)</option>
                        <option value="15s">Every 15 Seconds</option>
                        <option value="60s">Every 1 Minute</option>
                        <option value="manual">Manual Only</option>
                      </select>
                    </div>
                  </div>

                  {/* Email Contract Note Parser */}
                  <div className="p-4 rounded-2xl bg-bg border border-border flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-text-primary">Gmail Order Contract Note Auto-Parser</h4>
                      <p className="text-[11px] text-text-secondary">Extract execution trades and DP charges from email notes</p>
                    </div>
                    <input 
                      type="checkbox" 
                      checked={mailSync} 
                      onChange={(e) => setMailSync(e.target.checked)}
                      className="w-4 h-4 accent-accent rounded cursor-pointer" 
                    />
                  </div>

                  {/* Risk Alert */}
                  <div className="p-4 rounded-2xl bg-bg border border-border flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-text-primary">Drawdown Guardrail Notification</h4>
                      <p className="text-[11px] text-text-secondary">Send instant advisory banner if daily portfolio falls beyond</p>
                    </div>
                    <select 
                      value={drawdownAlert} 
                      onChange={(e) => setDrawdownAlert(e.target.value)}
                      className="bg-surface border border-border text-xs font-bold text-text-primary px-3 py-1.5 rounded-xl cursor-pointer"
                    >
                      <option value="-3%">-3% Daily Drop</option>
                      <option value="-5%">-5% Daily Drop</option>
                      <option value="-8%">-8% Daily Drop</option>
                    </select>
                  </div>

                  {/* Account Session & Sign Out */}
                  <div className="p-4 rounded-2xl bg-destructive/5 border border-destructive/20 flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-black text-text-primary">Session Management</h4>
                      <p className="text-[11px] text-text-secondary">Log out of this device or switch investor profile</p>
                    </div>
                    <Link
                      href="/login"
                      onClick={() => {
                        if (typeof window !== 'undefined') {
                          localStorage.removeItem('unify_is_logged_in');
                        }
                        onClose();
                      }}
                      className="px-3.5 py-1.5 rounded-xl bg-destructive/15 text-loss border border-destructive/30 hover:bg-destructive/25 text-xs font-extrabold transition-all"
                    >
                      Sign Out / Switch →
                    </Link>
                  </div>
                </motion.div>
              )}

              {/* TAB 4: LINKED BROKERS */}
              {activeTab === 'brokers' && (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-3.5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-black text-sm text-text-primary">Connected Portals & Depositories</h3>
                      <p className="text-xs text-text-secondary mt-0.5">
                        Consolidated telemetry across 4 integrated trading accounts
                      </p>
                    </div>

                    <Link 
                      href="/accounts" 
                      onClick={onClose}
                      className="text-xs font-extrabold text-accent hover:underline flex items-center gap-1"
                    >
                      Manage Accounts <ExternalLink size={12} />
                    </Link>
                  </div>

                  <div className="space-y-2.5">
                    {LINKED_BROKERS.map(b => (
                      <div key={b.id} className="p-3.5 rounded-2xl bg-bg border border-border flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <img src={b.logo} alt={b.name} className="w-8 h-8 rounded-xl object-contain bg-surface p-1 border border-border" />
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-black text-xs text-text-primary">{b.name}</h4>
                              <span className="text-[9px] font-mono text-text-muted">({b.accId})</span>
                            </div>
                            <span className="text-[10px] text-gain font-bold flex items-center gap-1 mt-0.5">
                              <span className="w-1.5 h-1.5 rounded-full bg-gain"></span> {b.status}
                            </span>
                          </div>
                        </div>

                        <div className="text-right">
                          <p className="font-black text-xs text-text-primary">{b.value}</p>
                          <p className="text-[10px] text-text-muted">{b.scrips} Holdings</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}

            </div>

            {/* Modal Footer */}
            <div className="p-4 sm:p-5 bg-bg/80 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="text-[11px] text-text-muted flex items-center gap-1.5">
                <ShieldCheck size={14} className="text-accent" />
                <span>Encrypted 256-bit bank-grade telemetry</span>
              </div>

              <div className="flex items-center gap-2.5 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2.5 rounded-xl bg-surface border border-border hover:bg-surface-hover text-xs font-bold text-text-secondary transition-all w-full sm:w-auto cursor-pointer"
                >
                  Cancel
                </button>

                <button
                  type="button"
                  onClick={handleSaveSettings}
                  className="btn-primary py-2.5 px-5 text-xs font-bold flex items-center justify-center gap-2 w-full sm:w-auto cursor-pointer"
                >
                  {saveSuccess ? (
                    <>
                      <CheckCircle2 size={14} /> Saved Successfully!
                    </>
                  ) : (
                    <>Save Preferences →</>
                  )}
                </button>
              </div>
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
