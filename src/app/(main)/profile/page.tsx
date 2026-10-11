'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, ShieldCheck, Globe, Settings, Wallet, Check, 
  ExternalLink, RefreshCw, Mail, Phone, MapPin, Building,
  CreditCard, Sparkles, CheckCircle2, ChevronRight, Lock
} from 'lucide-react';
import Link from 'next/link';

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

export default function ProfilePage() {
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
  }, []);

  const handleSave = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('unify_user_name', userName);
      localStorage.setItem('unify_language', selectedLanguage);
      localStorage.setItem('unify_currency_format', currencyFormat);
    }
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 pb-20 max-w-5xl mx-auto">
      {/* Page Header Banner */}
      <div className="card p-6 sm:p-8 bg-surface border border-border rounded-3xl relative overflow-hidden shadow-xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
          <div className="flex items-center gap-5">
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-3xl bg-gradient-to-tr from-accent via-purple-600 to-indigo-500 text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-xl shadow-accent/25 shrink-0">
              {userName.split(' ').map(n => n[0]).join('').slice(0, 2) || 'AA'}
            </div>
            <div>
              <div className="flex items-center gap-2.5 flex-wrap">
                <h1 className="text-2xl sm:text-3xl font-black text-text-primary leading-tight">{userName}</h1>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-gain-bg text-gain border border-gain/20 flex items-center gap-1 shadow-sm">
                  <ShieldCheck size={12} /> CKYC Verified
                </span>
                <span className="text-[10px] font-extrabold uppercase px-2.5 py-0.5 rounded-full bg-accent-bg text-accent border border-accent/20">
                  {userTier}
                </span>
              </div>
              <p className="text-xs text-text-secondary mt-1 font-medium flex items-center gap-3 flex-wrap">
                <span>PAN: <strong className="text-text-primary font-mono">{userPan}</strong></span>
                <span>•</span>
                <span>CKYC KIN: <strong className="text-text-primary font-mono">KIN-2024-9841029</strong></span>
                <span>•</span>
                <span className="text-gain font-bold">4 Linked Accounts Live</span>
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={handleSave}
            className="btn-primary py-2.5 px-6 text-xs font-bold flex items-center gap-2 shrink-0 cursor-pointer shadow-md"
          >
            {saveSuccess ? (
              <>
                <CheckCircle2 size={16} /> Saved!
              </>
            ) : (
              <>Save Changes →</>
            )}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 Cols): CKYC & Identity, Settings */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* CKYC Details Card */}
          <div className="card p-6 bg-surface border border-border rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-accent-bg text-accent flex items-center justify-center font-bold">
                  <User size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-text-primary">CKYC Registry Identity Information</h3>
                  <p className="text-[11px] text-text-muted">Government Verified Demat & Depository Profile</p>
                </div>
              </div>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-md bg-gain-bg text-gain border border-gain/20">
                DigiLocker Match
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 rounded-2xl bg-bg border border-border">
                <span className="text-text-muted text-[10px] uppercase font-bold block">Legal Tax Name</span>
                <span className="font-extrabold text-text-primary text-sm mt-0.5 block">{userName}</span>
              </div>

              <div className="p-3 rounded-2xl bg-bg border border-border">
                <span className="text-text-muted text-[10px] uppercase font-bold block">PAN (Income Tax Dept)</span>
                <span className="font-extrabold text-text-primary text-sm font-mono mt-0.5 block">{userPan}</span>
              </div>

              <div className="p-3 rounded-2xl bg-bg border border-border">
                <span className="text-text-muted text-[10px] uppercase font-bold block">Central KYC KIN</span>
                <span className="font-bold text-text-primary font-mono mt-0.5 block">KIN-2024-9841029</span>
              </div>

              <div className="p-3 rounded-2xl bg-bg border border-border">
                <span className="text-text-muted text-[10px] uppercase font-bold block">CDSL Depository CAS BOID</span>
                <span className="font-bold text-text-primary font-mono mt-0.5 block">1208160012345678</span>
              </div>

              <div className="p-3 rounded-2xl bg-bg border border-border">
                <span className="text-text-muted text-[10px] uppercase font-bold block">Verified Email</span>
                <span className="font-medium text-text-primary flex items-center gap-1.5 mt-1">
                  <Mail size={12} className="text-accent" /> {userEmail}
                </span>
              </div>

              <div className="p-3 rounded-2xl bg-bg border border-border">
                <span className="text-text-muted text-[10px] uppercase font-bold block">Aadhaar Linked Mobile</span>
                <span className="font-medium text-text-primary flex items-center gap-1.5 mt-1">
                  <Phone size={12} className="text-accent" /> {userPhone}
                </span>
              </div>
            </div>
          </div>

          {/* Languages Card */}
          <div className="card p-6 bg-surface border border-border rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border">
              <div className="w-8 h-8 rounded-xl bg-accent-bg text-accent flex items-center justify-center font-bold">
                <Globe size={16} />
              </div>
              <div>
                <h3 className="text-sm font-black text-text-primary">Regional Language & Localization</h3>
                <p className="text-[11px] text-text-muted">Choose your preferred Indian language for advisory & telemetry</p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
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
          </div>

          {/* Preferences Card */}
          <div className="card p-6 bg-surface border border-border rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center gap-2.5 pb-3 border-b border-border">
              <div className="w-8 h-8 rounded-xl bg-accent-bg text-accent flex items-center justify-center font-bold">
                <Settings size={16} />
              </div>
              <div>
                <h3 className="text-sm font-black text-text-primary">App Settings & Risk Guardrails</h3>
                <p className="text-[11px] text-text-muted">Display formats, sync intervals and alerts</p>
              </div>
            </div>

            <div className="space-y-3">
              {/* Currency */}
              <div className="p-3.5 rounded-2xl bg-bg border border-border flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-text-primary">Currency Representation</h4>
                  <p className="text-[11px] text-text-secondary">Display figures in Indian Lakhs/Crores</p>
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

              {/* Sync Interval */}
              <div className="p-3.5 rounded-2xl bg-bg border border-border flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-text-primary">Price Telemetry Refresh Rate</h4>
                  <p className="text-[11px] text-text-secondary">Real-time WebSocket polling frequency</p>
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

              {/* Contract note */}
              <div className="p-3.5 rounded-2xl bg-bg border border-border flex items-center justify-between">
                <div>
                  <h4 className="text-xs font-black text-text-primary">Gmail Order Contract Note Auto-Parser</h4>
                  <p className="text-[11px] text-text-secondary">Automatically ingest broker contract note PDFs from email</p>
                </div>
                <input 
                  type="checkbox" 
                  checked={mailSync} 
                  onChange={(e) => setMailSync(e.target.checked)}
                  className="w-4 h-4 accent-accent rounded cursor-pointer" 
                />
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Linked Brokers & Actions */}
        <div className="space-y-6">
          <div className="card p-6 bg-surface border border-border rounded-3xl space-y-4 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-border">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-xl bg-accent-bg text-accent flex items-center justify-center font-bold">
                  <Wallet size={16} />
                </div>
                <div>
                  <h3 className="text-sm font-black text-text-primary">Linked Accounts</h3>
                  <p className="text-[11px] text-text-muted">4 Brokerages connected</p>
                </div>
              </div>

              <Link href="/accounts" className="text-xs font-bold text-accent hover:underline flex items-center gap-1">
                Manage <ChevronRight size={14} />
              </Link>
            </div>

            <div className="space-y-3">
              {LINKED_BROKERS.map(b => (
                <div key={b.id} className="p-3.5 rounded-2xl bg-bg border border-border space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2.5">
                      <img src={b.logo} alt={b.name} className="w-7 h-7 rounded-lg object-contain bg-surface p-0.5 border border-border" />
                      <div>
                        <h4 className="font-black text-xs text-text-primary leading-tight">{b.name}</h4>
                        <span className="text-[9px] font-mono text-text-muted">{b.accId}</span>
                      </div>
                    </div>
                    <span className="text-xs font-extrabold text-text-primary">{b.value}</span>
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-text-muted pt-1 border-t border-border/50">
                    <span className="text-gain font-bold flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-gain"></span> {b.status}
                    </span>
                    <span>{b.scrips} Scrips</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6 bg-surface border border-border rounded-3xl space-y-3 shadow-sm">
            <h4 className="text-xs font-black uppercase tracking-wider text-text-muted">Profile Actions</h4>

            <Link
              href="/onboarding"
              className="w-full py-3 px-4 rounded-2xl bg-bg border border-border hover:border-accent hover:bg-surface-hover text-xs font-bold text-text-primary flex items-center justify-between transition-all group"
            >
              <span className="flex items-center gap-2">
                <RefreshCw size={14} className="text-accent" /> Re-take Investor Skill Quiz
              </span>
              <ChevronRight size={14} className="text-text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/accounts"
              className="w-full py-3 px-4 rounded-2xl bg-bg border border-border hover:border-accent hover:bg-surface-hover text-xs font-bold text-text-primary flex items-center justify-between transition-all group"
            >
              <span className="flex items-center gap-2">
                <Wallet size={14} className="text-accent" /> Connect Additional Broker / Upload P&L
              </span>
              <ChevronRight size={14} className="text-text-muted group-hover:text-accent group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
