'use client';

import { motion } from 'framer-motion';
import { useState } from 'react';
import confetti from 'canvas-confetti';
import { FloatingCard } from '@/components/ui/floating-card';
import { useRouter } from 'next/navigation';

const brokers = [
  { id: 'zerodha', name: 'Zerodha', type: 'BROKER', logo: 'Z' },
  { id: 'upstox', name: 'Upstox', type: 'BROKER', logo: 'U' },
  { id: 'groww', name: 'Groww', type: 'BROKER', logo: 'G' },
  { id: 'cdsl', name: 'CDSL', type: 'DEPOSITORY', logo: 'C' },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.08 }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 300, damping: 24 } }
};

export default function Accounts() {
  const router = useRouter();
  const [selectedBroker, setSelectedBroker] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const [connected, setConnected] = useState<Record<string, boolean>>({});

  const handleConnect = (id: string) => {
    setSelectedBroker(id);
  };

  const confirmConnect = () => {
    if (!selectedBroker) return;
    setConnecting(true);
    
    // Simulate mock e-sign and API call
    setTimeout(() => {
      setConnecting(false);
      setConnected(prev => ({ ...prev, [selectedBroker]: true }));
      setSelectedBroker(null);
      
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#3b82f6', '#10b981', '#8b5cf6']
      });

      // Check if at least one is connected, enable proceed to dashboard
    }, 1500);
  };

  return (
    <div className="py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Link Accounts</h1>
        <p className="text-muted-foreground mt-2">Connect your brokers or upload statements to sync your portfolio.</p>
      </div>

      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {brokers.map((broker) => (
          <motion.div key={broker.id} variants={item}>
            <FloatingCard className="p-6 h-full flex flex-col group">
              <div className="w-12 h-12 rounded-xl bg-secondary flex items-center justify-center text-xl font-bold mb-4 group-hover:scale-110 transition-transform">
                {broker.logo}
              </div>
              <h3 className="text-lg font-semibold mb-1">{broker.name}</h3>
              <p className="text-sm text-muted-foreground mb-6 flex-1">{broker.type}</p>
              
              {connected[broker.id] ? (
                <div className="py-2 px-4 rounded-lg bg-[var(--chart-2)]/10 text-[var(--chart-2)] text-sm font-medium text-center border border-emerald-500/20">
                  Connected
                </div>
              ) : (
                <div className="flex gap-2">
                  <button 
                    onClick={() => handleConnect(broker.id)}
                    className="flex-1 py-2 rounded-lg bg-primary hover:bg-primary/90 text-white text-sm font-medium transition-colors"
                  >
                    Connect
                  </button>
                  <button className="flex-1 py-2 rounded-lg bg-secondary hover:bg-secondary text-white text-sm font-medium transition-colors">
                    Upload
                  </button>
                </div>
              )}
            </FloatingCard>
          </motion.div>
        ))}
      </motion.div>

      {Object.values(connected).some(Boolean) && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-12 text-center"
        >
          <button 
            onClick={() => router.push('/dashboard')}
            className="px-8 py-3 rounded-lg bg-gradient-to-r from-blue-600 to-emerald-600 hover:from-blue-500 hover:to-emerald-500 text-white font-bold transition-all shadow-[0_0_20px_rgba(16,185,129,0.3)] hover:shadow-[0_0_30px_rgba(16,185,129,0.5)]"
          >
            Go to Dashboard
          </button>
        </motion.div>
      )}

      {/* Mock E-sign Modal */}
      {selectedBroker && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-background/80 backdrop-blur-sm"
            onClick={() => !connecting && setSelectedBroker(null)}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="relative bg-card border border-border/80 rounded-2xl p-6 w-full max-w-md shadow-2xl"
          >
            <h3 className="text-xl font-bold mb-4">Authorize {brokers.find(b => b.id === selectedBroker)?.name}</h3>
            <p className="text-sm text-foreground/90 mb-6">
              You are about to electronically sign a consent form granting read-only access to your holdings for this session.
            </p>
            
            <div className="flex gap-3 justify-end">
              <button 
                onClick={() => setSelectedBroker(null)}
                disabled={connecting}
                className="px-4 py-2 rounded-lg bg-secondary text-foreground/90 hover:bg-secondary disabled:opacity-50"
              >
                Cancel
              </button>
              <button 
                onClick={confirmConnect}
                disabled={connecting}
                className="px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 flex items-center gap-2 disabled:opacity-80"
              >
                {connecting && <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>}
                E-Sign & Connect
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
}
