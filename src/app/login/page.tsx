'use client';

import { motion } from 'framer-motion';
import { FloatingCard } from '@/components/ui/floating-card';
import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

export default function Login() {
  const router = useRouter();
  const [pan, setPan] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [step, setStep] = useState(1);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  const handlePanSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (pan.length === 10) setStep(2);
  };

  const handleOtpChange = (index: number, value: string) => {
    if (value.length > 1) value = value.slice(-1);
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next
    if (value && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
    
    if (newOtp.every(v => v !== '')) {
      setTimeout(() => router.push('/aadhaar'), 400);
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] relative z-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
        className="w-full max-w-md"
      >
        <FloatingCard className="p-8 w-full group">
          <div className="text-center mb-8">
            <h1 className="text-2xl font-bold tracking-tight">Welcome Back</h1>
            <p className="text-muted-foreground mt-2 text-sm">Sign in to your investment dashboard (Simulated demo)</p>
          </div>

          <div className="relative overflow-hidden min-h-[200px]">
            <motion.form 
              onSubmit={handlePanSubmit}
              animate={{ x: step === 1 ? 0 : '-100%', opacity: step === 1 ? 1 : 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="absolute inset-0 flex flex-col justify-center"
              style={{ pointerEvents: step === 1 ? 'auto' : 'none' }}
            >
              <label className="block text-sm font-medium text-foreground/90 mb-2">PAN Number</label>
              <input 
                type="text" 
                value={pan}
                onChange={(e) => setPan(e.target.value.toUpperCase())}
                placeholder="ABCDE1234F"
                maxLength={10}
                className="w-full bg-background border border-border/80 rounded-lg px-4 py-3 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary uppercase tracking-widest transition-all"
                required
              />
              <button 
                type="submit"
                className="mt-6 w-full py-3 rounded-lg bg-primary hover:bg-primary/90 text-white font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)]"
              >
                Continue
              </button>
            </motion.form>

            <motion.div
              animate={{ x: step === 2 ? 0 : '100%', opacity: step === 2 ? 1 : 0 }}
              transition={{ duration: 0.4, ease: 'easeInOut' }}
              className="absolute inset-0 flex flex-col justify-center"
              style={{ pointerEvents: step === 2 ? 'auto' : 'none' }}
            >
              <label className="block text-sm font-medium text-foreground/90 mb-2">Enter OTP</label>
              <p className="text-xs text-foreground0 mb-4">Sent to your registered mobile (Enter any 6 digits)</p>
              
              <div className="flex gap-2 justify-between">
                {otp.map((digit, i) => (
                  <motion.input
                    key={i}
                    ref={(el) => {
                      if (el) otpRefs.current[i] = el;
                    }}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(i, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(i, e)}
                    initial={{ scale: 1 }}
                    whileFocus={{ scale: 1.1, y: -2 }}
                    animate={digit ? { scale: [1, 1.1, 1], borderColor: '#3b82f6' } : {}}
                    transition={{ duration: 0.2 }}
                    className="w-12 h-14 text-center text-xl font-bold bg-background border border-border/80 rounded-lg focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors"
                  />
                ))}
              </div>
              <button 
                onClick={() => setStep(1)}
                className="mt-6 text-sm text-muted-foreground hover:text-white transition-colors"
              >
                Back to PAN
              </button>
            </motion.div>
          </div>
        </FloatingCard>
      </motion.div>
    </div>
  );
}
