'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';

export default function Onboarding() {
  const [step, setStep] = useState(1);
  const [pan, setPan] = useState('');
  const [otp, setOtp] = useState('');
  const router = useRouter();

  const handleNext = () => setStep(s => s + 1);

  return (
    <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-6 relative overflow-hidden">
      <div className="ambient-glow-violet top-0 left-0"></div>
      <div className="ambient-glow-cyan bottom-0 right-0"></div>
      
      <div className="w-full max-w-lg z-10">
        <div className="mb-8 text-center">
          <h1 className="font-display font-bold text-3xl">VaultIQ<span className="text-accent">.</span></h1>
          <span className="inline-block mt-2 px-3 py-1 rounded-full bg-primary/20 text-primary text-[10px] font-bold tracking-widest uppercase border border-primary/30">
            Simulated Demo
          </span>
        </div>

        <div className="glass-card p-8">
          <AnimatePresence mode="wait">
            {step === 1 && (
              <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-bold mb-2">Enter your PAN</h2>
                <p className="text-sm text-foreground/60 mb-6">Enter your Permanent Account Number to locate connected brokerages.</p>
                <input 
                  type="text" 
                  value={pan}
                  onChange={e => setPan(e.target.value.toUpperCase())}
                  placeholder="ABCDE1234F"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:border-accent text-center tracking-[0.5em] font-mono text-lg"
                  maxLength={10}
                />
                <button onClick={handleNext} disabled={pan.length !== 10} className="btn-primary w-full disabled:opacity-50 disabled:cursor-not-allowed">
                  Verify PAN
                </button>
              </motion.div>
            )}

            {step === 2 && (
              <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-bold mb-2">Verification Code</h2>
                <p className="text-sm text-foreground/60 mb-6">Enter the mock OTP sent to the mobile linked to {pan.substring(0,2)}*****{pan.substring(8)}.</p>
                <input 
                  type="text" 
                  value={otp}
                  onChange={e => setOtp(e.target.value)}
                  placeholder="0 0 0 0 0 0"
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-6 focus:outline-none focus:border-accent text-center tracking-[1em] font-mono text-xl"
                  maxLength={6}
                />
                <button onClick={handleNext} disabled={otp.length !== 6} className="btn-primary w-full disabled:opacity-50">
                  Confirm OTP
                </button>
              </motion.div>
            )}

            {step === 3 && (
              <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-bold mb-2">Aadhaar Consent</h2>
                <p className="text-sm text-foreground/60 mb-6">We require one-time consent to fetch your CKYC profile. <strong className="text-destructive">Aadhaar data is never stored.</strong></p>
                <div className="bg-white/5 border border-white/10 p-4 rounded-xl mb-6 text-xs text-foreground/70">
                  "I hereby grant my explicit consent to VaultIQ to fetch my KYC details from the central registry for the purpose of portfolio aggregation. This is a simulated demo environment."
                </div>
                <button onClick={handleNext} className="btn-primary w-full bg-gradient-to-r from-success to-accent">
                  I Consent (Mock)
                </button>
              </motion.div>
            )}

            {step === 4 && (
              <motion.div key="step4" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 1.05 }}>
                <h2 className="text-xl font-bold mb-2">Accounts Found</h2>
                <p className="text-sm text-foreground/60 mb-6">We located the following active brokerages linked to your identity.</p>
                
                <div className="space-y-3 mb-8">
                  {['Zerodha', 'Groww', 'Upstox', 'CDSL (Depository)'].map(broker => (
                    <div key={broker} className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/10">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded bg-white/10"></div>
                        <span className="font-semibold">{broker}</span>
                      </div>
                      <span className="text-[10px] bg-success/20 text-success px-2 py-1 rounded-full border border-success/30">Found</span>
                    </div>
                  ))}
                </div>

                <button onClick={handleNext} className="btn-primary w-full">
                  Connect All Accounts
                </button>
              </motion.div>
            )}

            {step === 5 && (
              <motion.div key="step5" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
                <h2 className="text-xl font-bold mb-2 text-destructive">Final Authorization</h2>
                <p className="text-sm text-foreground/60 mb-6">Review data sharing permissions before final e-sign.</p>
                
                <div className="space-y-4 mb-8 text-sm">
                  <div className="flex gap-3 text-foreground/80">
                    <svg className="w-5 h-5 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span>Read-only access to historical transactions and current holdings.</span>
                  </div>
                  <div className="flex gap-3 text-foreground/80">
                    <svg className="w-5 h-5 text-success shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                    <span>Fetch real-time LTP (Last Traded Price) via broker APIs.</span>
                  </div>
                  <div className="flex gap-3 text-destructive">
                    <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                    <span>We CANNOT execute trades or modify your portfolio.</span>
                  </div>
                </div>

                <button 
                  onClick={() => {
                    // Mock connection complete
                    setTimeout(() => router.push('/dashboard'), 1500);
                    setStep(6);
                  }} 
                  className="btn-primary w-full"
                >
                  Confirm & Mock E-Sign
                </button>
              </motion.div>
            )}

            {step === 6 && (
              <motion.div key="step6" initial={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-8">
                <div className="w-20 h-20 mx-auto bg-success/20 rounded-full flex items-center justify-center border border-success/50 mb-6">
                  <svg className="w-10 h-10 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
                </div>
                <h2 className="text-2xl font-bold mb-2 text-success">Securely Connected</h2>
                <p className="text-sm text-foreground/60">Redirecting to your unified dashboard...</p>
                <div className="mt-8 text-[10px] text-foreground/40 font-mono">Last Synced: {new Date().toLocaleTimeString()}</div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
