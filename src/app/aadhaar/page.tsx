'use client';

import { motion } from 'framer-motion';
import { FloatingCard } from '@/components/ui/floating-card';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function AadhaarConsent() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleAgree = () => {
    setLoading(true);
    setTimeout(() => {
      router.push('/accounts');
    }, 1500);
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[80vh] relative z-10">
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, type: 'spring', bounce: 0.4 }}
        className="w-full max-w-lg"
      >
        <FloatingCard className="p-8 w-full">
          {/* Progress Bar Animation */}
          <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-8">
            <motion.div 
              initial={{ width: "33%" }}
              animate={{ width: loading ? "100%" : "66%" }}
              transition={{ duration: 1, ease: "easeInOut" }}
              className="bg-blue-500 h-full"
            />
          </div>

          <div className="text-center mb-6">
            <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-blue-400"><rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Account Aggregator Consent</h1>
          </div>

          <div className="bg-slate-950/50 rounded-xl p-5 border border-slate-800 text-sm text-slate-300 space-y-4 mb-8">
            <p>
              We use the official Account Aggregator framework to fetch your portfolio. 
              Please review the permissions before proceeding.
            </p>
            <ul className="space-y-2 list-disc list-inside text-slate-400">
              <li>Read-only access to your holdings and trades</li>
              <li>Data is synced securely and never sold</li>
              <li><strong className="text-emerald-400 font-medium">Privacy Guaranteed:</strong> Your Aadhaar number and full PAN are never stored on our servers.</li>
            </ul>
          </div>

          <div className="flex gap-4">
            <button 
              onClick={() => router.push('/login')}
              disabled={loading}
              className="flex-1 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button 
              onClick={handleAgree}
              disabled={loading}
              className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all shadow-[0_0_15px_rgba(37,99,235,0.2)] hover:shadow-[0_0_25px_rgba(37,99,235,0.4)] disabled:opacity-80 relative overflow-hidden"
            >
              {loading ? (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex items-center justify-center gap-2"
                >
                  <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                  <span>Verifying...</span>
                </motion.div>
              ) : (
                'Agree & Continue'
              )}
            </button>
          </div>
        </FloatingCard>
      </motion.div>
    </div>
  );
}
