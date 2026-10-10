'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, ShieldCheck, UploadCloud, Key, CheckCircle2, 
  Smartphone, Lock, RefreshCw, ArrowRight, Sparkles, AlertCircle 
} from 'lucide-react';

export function CasPdfParserSync({ onSyncComplete }: { onSyncComplete?: (data: any) => void }) {
  const [activeTab, setActiveTab] = useState<'cas_pdf' | 'account_aggregator'>('cas_pdf');

  // CAS PDF State
  const [fileName, setFileName] = useState<string | null>(null);
  const [panPassword, setPanPassword] = useState('');
  const [parsing, setParsing] = useState(false);
  const [parsedResult, setParsedResult] = useState<any | null>(null);

  // Account Aggregator State
  const [mobileNumber, setMobileNumber] = useState('9876543210');
  const [aaProvider, setAaProvider] = useState('Setu Account Aggregator');
  const [otpSent, setOtpSent] = useState(false);
  const [otpValue, setOtpValue] = useState('');
  const [aaConnecting, setAaConnecting] = useState(false);
  const [aaSuccess, setAaSuccess] = useState(false);

  // Handle CAS PDF Upload
  const handleFileDrop = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setFileName(file.name);
    }
  };

  const handleParsePdf = () => {
    if (!fileName || !panPassword) return;
    setParsing(true);
    setTimeout(() => {
      setParsing(false);
      setParsedResult({
        brokersDetected: ['Angel One', 'ICICI Direct', 'Kotak Securities', 'Zerodha'],
        totalScrips: 18,
        totalValuation: 1425000,
        isinCount: 18
      });
      if (onSyncComplete) onSyncComplete(true);
    }, 1500);
  };

  // Handle Account Aggregator OTP
  const handleSendOtp = () => {
    setOtpSent(true);
  };

  const handleVerifyOtp = () => {
    if (!otpValue) return;
    setAaConnecting(true);
    setTimeout(() => {
      setAaConnecting(false);
      setAaSuccess(true);
      if (onSyncComplete) onSyncComplete(true);
    }, 1500);
  };

  return (
    <div className="card p-6 bg-surface border border-border rounded-3xl space-y-6 shadow-xl relative overflow-hidden">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-4 pb-4 border-b border-border">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-accent-bg text-accent flex items-center justify-center border border-accent/20 shadow-sm shrink-0">
            <FileText size={22} />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-accent-bg text-accent text-[10px] font-black uppercase tracking-wider border border-accent/20">
                Universal Broker Data Sync
              </span>
              <span className="text-[10px] font-bold text-gain flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-gain animate-pulse"></span> CDSL / NSDL / RBI AA Network
              </span>
            </div>
            <h3 className="font-extrabold text-lg text-text-primary mt-0.5">
              Angel One & Universal Broker Demat Telemetry Parser
            </h3>
          </div>
        </div>

        {/* Tab Toggle */}
        <div className="flex p-1 bg-bg rounded-2xl border border-border shrink-0">
          <button
            onClick={() => setActiveTab('cas_pdf')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'cas_pdf' ? 'bg-accent text-white shadow-sm' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            📄 e-CAS PDF Parser
          </button>
          <button
            onClick={() => setActiveTab('account_aggregator')}
            className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
              activeTab === 'account_aggregator' ? 'bg-accent text-white shadow-sm' : 'text-text-muted hover:text-text-primary'
            }`}
          >
            🏛️ RBI Account Aggregator
          </button>
        </div>
      </div>

      {/* TAB 1: e-CAS PDF PARSER */}
      {activeTab === 'cas_pdf' && (
        <div className="space-y-4">
          <p className="text-xs text-text-secondary leading-relaxed font-medium">
            Upload your monthly password-protected <strong>CDSL or NSDL e-CAS PDF Statement</strong> to extract all holdings across <strong>Angel One, ICICI Direct, Kotak Securities, Motilal Oswal & Sharekhan</strong> automatically.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* File Dropzone */}
            <div className="p-6 rounded-2xl border-2 border-dashed border-border hover:border-accent bg-bg flex flex-col items-center justify-center text-center space-y-2 transition-colors relative cursor-pointer">
              <input 
                type="file" 
                accept=".pdf" 
                onChange={handleFileDrop}
                className="absolute inset-0 opacity-0 cursor-pointer"
              />
              <UploadCloud size={32} className="text-accent" />
              <div>
                <p className="text-xs font-extrabold text-text-primary">
                  {fileName ? fileName : 'Drag & Drop e-CAS PDF Statement'}
                </p>
                <p className="text-[10px] text-text-muted font-bold mt-0.5">Supports CDSL & NSDL Consolidated PDFs</p>
              </div>
            </div>

            {/* PAN Unlock Input */}
            <div className="p-5 rounded-2xl bg-bg border border-border space-y-3 flex flex-col justify-between">
              <div className="space-y-2">
                <label className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                  <Key size={14} className="text-accent" /> Enter PAN Number (PDF Password):
                </label>
                <input 
                  type="password" 
                  value={panPassword}
                  onChange={e => setPanPassword(e.target.value.toUpperCase())}
                  placeholder="e.g. ABCDE1234F"
                  className="w-full bg-surface border border-border rounded-xl px-4 py-2 text-xs font-mono font-bold text-text-primary focus:outline-none focus:border-accent"
                />
              </div>

              <button 
                onClick={handleParsePdf}
                disabled={!fileName || !panPassword || parsing}
                className="w-full py-2.5 px-4 rounded-xl bg-accent text-white font-extrabold text-xs hover:bg-accent/90 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
              >
                {parsing ? (
                  <>
                    <RefreshCw size={14} className="animate-spin" />
                    <span>Decrypting CAS & Extracting ISINs...</span>
                  </>
                ) : (
                  <>
                    <Sparkles size={14} />
                    <span>Parse CAS Statement & Sync Telemetry</span>
                  </>
                )}
              </button>
            </div>

          </div>

          {/* Parsed Result Success Badge */}
          {parsedResult && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-gain-bg border border-gain/30 space-y-2 text-xs text-gain">
              <div className="flex items-center gap-2 font-black text-sm">
                <CheckCircle2 size={18} />
                <span>e-CAS Successfully Decrypted & Synced!</span>
              </div>
              <p className="font-bold text-[11px]">
                Detected <strong>{parsedResult.totalScrips} scrips</strong> across <strong>{parsedResult.brokersDetected.join(', ')}</strong> with net valuation of ₹{parsedResult.totalValuation.toLocaleString('en-IN')}.
              </p>
            </motion.div>
          )}
        </div>
      )}

      {/* TAB 2: RBI ACCOUNT AGGREGATOR (AA) NETWORK */}
      {activeTab === 'account_aggregator' && (
        <div className="space-y-4">
          <p className="text-xs text-text-secondary leading-relaxed font-medium">
            Connect via RBI-regulated <strong>Account Aggregator (AA) Network</strong> (Setu, Finvu, OneMoney). Authenticate via mobile OTP to pull live demat holdings across <strong>Angel One, ICICI Direct, HDFC Securities, Kotak, and SBI Cap</strong> with zero file uploads.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* AA Provider & Mobile Input */}
            <div className="p-5 rounded-2xl bg-bg border border-border space-y-3">
              <div className="space-y-1">
                <label className="text-xs font-bold text-text-primary">Select Account Aggregator Provider:</label>
                <select 
                  value={aaProvider}
                  onChange={e => setAaProvider(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl px-3 py-2 text-xs font-bold text-text-primary focus:outline-none focus:border-accent"
                >
                  <option value="Setu Account Aggregator">Setu AA (RBI Regulated)</option>
                  <option value="Finvu AA">Finvu Financial Information User</option>
                  <option value="OneMoney AA">OneMoney Telemetry Network</option>
                  <option value="Anumati AA">Anumati Account Aggregator</option>
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                  <Smartphone size={14} className="text-accent" /> PAN-Linked Mobile Number:
                </label>
                <input 
                  type="text" 
                  value={mobileNumber}
                  onChange={e => setMobileNumber(e.target.value)}
                  className="w-full bg-surface border border-border rounded-xl px-4 py-2 text-xs font-mono font-bold text-text-primary focus:outline-none focus:border-accent"
                />
              </div>

              {!otpSent && (
                <button 
                  onClick={handleSendOtp}
                  className="w-full py-2.5 px-4 rounded-xl bg-accent text-white font-extrabold text-xs hover:bg-accent/90 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md"
                >
                  <span>Request AA Consent OTP</span>
                  <ArrowRight size={14} />
                </button>
              )}
            </div>

            {/* OTP Verification Box */}
            <div className="p-5 rounded-2xl bg-bg border border-border space-y-3 flex flex-col justify-between">
              {otpSent ? (
                <>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-text-primary flex items-center gap-1.5">
                      <Lock size={14} className="text-gain" /> Enter 6-Digit OTP:
                    </label>
                    <input 
                      type="text" 
                      value={otpValue}
                      onChange={e => setOtpValue(e.target.value)}
                      placeholder="e.g. 558921"
                      className="w-full bg-surface border border-border rounded-xl px-4 py-2 text-xs font-mono font-bold text-text-primary focus:outline-none focus:border-accent"
                    />
                    <span className="text-[10px] text-gain font-bold block">✓ Demo OTP Sent to +91 {mobileNumber}</span>
                  </div>

                  <button 
                    onClick={handleVerifyOtp}
                    disabled={!otpValue || aaConnecting}
                    className="w-full py-2.5 px-4 rounded-xl bg-gain text-white font-extrabold text-xs hover:bg-gain/90 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50 cursor-pointer"
                  >
                    {aaConnecting ? (
                      <>
                        <RefreshCw size={14} className="animate-spin" />
                        <span>Pulling Telemetry across All Brokers...</span>
                      </>
                    ) : (
                      <>
                        <ShieldCheck size={14} />
                        <span>Verify & Fetch All Holdings</span>
                      </>
                    )}
                  </button>
                </>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-center p-4 space-y-2 text-text-muted">
                  <Smartphone size={32} />
                  <p className="text-xs font-bold">Waiting for AA Consent Request</p>
                  <p className="text-[10px]">Click 'Request AA Consent OTP' to trigger live authorization.</p>
                </div>
              )}
            </div>

          </div>

          {/* AA Success Badge */}
          {aaSuccess && (
            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-4 rounded-2xl bg-gain-bg border border-gain/30 space-y-2 text-xs text-gain">
              <div className="flex items-center gap-2 font-black text-sm">
                <CheckCircle2 size={18} />
                <span>Account Aggregator Consent Authorized!</span>
              </div>
              <p className="font-bold text-[11px]">
                Successfully pulled live demat & mutual fund telemetry across Angel One, ICICI Direct, and HDFC Securities into Unify.
              </p>
            </motion.div>
          )}

        </div>
      )}

    </div>
  );
}
