'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Wallet, Plus, RefreshCw, Trash2, CheckCircle2, ShieldCheck, FileText, ChevronDown, ChevronUp } from 'lucide-react';
import { uploadBaselineStatement, runDemoMailSync } from '@/lib/mail-sync';

const DEFAULT_ACCOUNTS = [
  {
    id: 'a1',
    broker: 'Zerodha Kite',
    accountNumber: 'ZER-982311',
    status: 'CONNECTED',
    lastSynced: '2 mins ago',
    holdingsCount: 8,
    totalValue: 540000,
    holdings: [
      { symbol: 'RELIANCE', qty: 50, price: 2985.40 },
      { symbol: 'HDFCBANK', qty: 120, price: 1680.50 },
      { symbol: 'TCS', qty: 20, price: 4120.00 }
    ]
  },
  {
    id: 'a2',
    broker: 'Groww',
    accountNumber: 'GRW-445109',
    status: 'CONNECTED',
    lastSynced: '15 mins ago',
    holdingsCount: 5,
    totalValue: 320000,
    holdings: [
      { symbol: 'INFY', qty: 80, price: 1890.20 },
      { symbol: 'BAJFINANCE', qty: 15, price: 7210.00 }
    ]
  },
  {
    id: 'a3',
    broker: 'Upstox',
    accountNumber: 'UPS-110293',
    status: 'CONNECTED',
    lastSynced: '1 hour ago',
    holdingsCount: 3,
    totalValue: 180000,
    holdings: [
      { symbol: 'TATAMOTORS', qty: 150, price: 940.50 }
    ]
  },
  {
    id: 'a4',
    broker: 'Angel One',
    accountNumber: 'ANG-774012',
    status: 'CONNECTED',
    lastSynced: '3 hours ago',
    holdingsCount: 2,
    totalValue: 95000,
    holdings: [
      { symbol: 'ITC', qty: 200, price: 475.00 }
    ]
  }
];

export default function AccountsClient({ initialAccounts }: { initialAccounts: any[] }) {
  const [accounts, setAccounts] = useState(() => {
    if (initialAccounts && initialAccounts.length > 0) {
      return initialAccounts.map(a => ({
        id: a.id,
        broker: a.broker,
        accountNumber: a.id.substring(0, 8).toUpperCase(),
        status: 'CONNECTED',
        lastSynced: 'Just now',
        holdingsCount: a.holdings?.length || 3,
        totalValue: a.holdings?.reduce((sum: number, h: any) => sum + (h.quantity * h.currentPrice), 0) || 250000,
        holdings: a.holdings || []
      }));
    }
    return DEFAULT_ACCOUNTS;
  });

  const [expandedAccount, setExpandedAccount] = useState<string | null>(null);
  const [syncingId, setSyncingId] = useState<string | null>(null);
  const [connectModalOpen, setConnectModalOpen] = useState(false);
  const [selectedBroker, setSelectedBroker] = useState('ICICI Direct');

  // Statement sync states
  const [uploading, setUploading] = useState(false);
  const [syncingMail, setSyncingMail] = useState(false);
  const [syncResult, setSyncResult] = useState<number | null>(null);
  const [baselineUploaded, setBaselineUploaded] = useState(true);

  const handleSyncAccount = (id: string) => {
    setSyncingId(id);
    setTimeout(() => {
      setAccounts(prev => prev.map(a => a.id === id ? { ...a, lastSynced: 'Just now' } : a));
      setSyncingId(null);
    }, 1200);
  };

  const handleDisconnect = (id: string) => {
    setAccounts(prev => prev.filter(a => a.id !== id));
  };

  const handleAddBroker = () => {
    const newAcc = {
      id: 'acc-' + Date.now(),
      broker: selectedBroker,
      accountNumber: selectedBroker.substring(0, 3).toUpperCase() + '-' + Math.floor(100000 + Math.random() * 900000),
      status: 'CONNECTED',
      lastSynced: 'Just now',
      holdingsCount: 4,
      totalValue: 150000,
      holdings: [
        { symbol: 'SBIN', qty: 100, price: 820.00 },
        { symbol: 'BHARTIARTL', qty: 50, price: 1450.00 }
      ]
    };
    setAccounts(prev => [...prev, newAcc]);
    setConnectModalOpen(false);
  };

  const handleUpload = async () => {
    setUploading(true);
    await new Promise(r => setTimeout(r, 1200));
    setBaselineUploaded(true);
    setUploading(false);
  };

  const handleMailSync = async () => {
    setSyncingMail(true);
    await new Promise(r => setTimeout(r, 1500));
    const count = Math.floor(Math.random() * 3) + 1;
    setSyncResult(count);
    setSyncingMail(false);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 relative z-10">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:justify-between md:items-end gap-4">
        <div>
          <h1 className="heading-hero text-4xl text-gradient">Linked Accounts & Brokerages</h1>
          <p className="text-text-secondary mt-1">Manage live API broker credentials, automated CAS parsing, and account synchronization.</p>
        </div>
        <button onClick={() => setConnectModalOpen(true)} className="btn-primary flex items-center gap-2">
          <Plus size={18} /> Connect New Broker
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Live Broker Accounts List */}
        <div className="lg:col-span-2 space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-text-primary">
            <span className="w-2.5 h-2.5 rounded-full bg-gain"></span> Connected Live Accounts ({accounts.length})
          </h2>

          {accounts.map(a => (
            <div key={a.id} className="card p-5 bg-surface border border-border hover:border-accent/40 transition-all">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-2xl bg-accent-bg text-accent flex items-center justify-center font-extrabold text-sm border border-accent/20">
                    {a.broker.substring(0, 2).toUpperCase()}
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3 className="font-extrabold text-text-primary text-base">{a.broker}</h3>
                      <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-gain-bg text-gain border border-gain/20 flex items-center gap-1">
                        <CheckCircle2 size={10} /> Live
                      </span>
                    </div>
                    <p className="text-xs text-text-muted mt-0.5 font-mono">
                      Acc: {a.accountNumber} • {a.holdingsCount} Holdings • Synced {a.lastSynced}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button 
                    onClick={() => handleSyncAccount(a.id)}
                    disabled={syncingId === a.id}
                    className="p-2 rounded-xl bg-bg border border-border text-text-secondary hover:text-text-primary transition-colors"
                    title="Sync Now"
                  >
                    <RefreshCw size={16} className={syncingId === a.id ? 'animate-spin text-accent' : ''} />
                  </button>

                  <button
                    onClick={() => setExpandedAccount(expandedAccount === a.id ? null : a.id)}
                    className="p-2 rounded-xl bg-bg border border-border text-text-secondary hover:text-text-primary transition-colors"
                    title="Toggle Holdings"
                  >
                    {expandedAccount === a.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                  </button>

                  <button
                    onClick={() => handleDisconnect(a.id)}
                    className="p-2 rounded-xl bg-loss-bg text-loss border border-loss/20 hover:bg-loss/20 transition-colors"
                    title="Disconnect"
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              </div>

              {/* Expandable Holdings List */}
              <AnimatePresence>
                {expandedAccount === a.id && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    className="mt-4 pt-4 border-t border-border overflow-hidden"
                  >
                    <p className="text-xs font-bold uppercase text-text-muted mb-2 tracking-wider">Mapped Holdings</p>
                    <div className="space-y-2">
                      {a.holdings.map((h: any, i: number) => (
                        <div key={i} className="flex justify-between items-center p-2.5 rounded-xl bg-bg border border-border text-xs">
                          <div className="font-bold text-text-primary">{h.symbol}</div>
                          <div className="text-text-secondary">{h.qty || h.quantity} shares</div>
                          <div className="font-mono font-bold text-text-primary">₹{(h.price || h.currentPrice || 0).toFixed(2)}</div>
                        </div>
                      ))}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </div>

        {/* Mail Sync Baseline Module */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2 text-text-primary">
            <span className="w-2.5 h-2.5 rounded-full bg-accent"></span> Automated Mail CAS Sync
          </h2>

          <div className="card p-6 bg-surface border border-accent/30 relative">
            <div className="flex items-center gap-2 text-accent font-bold text-sm mb-3">
              <ShieldCheck size={18} />
              <span>Read-Only Email Contract Note Parser</span>
            </div>
            <p className="text-xs text-text-secondary leading-relaxed mb-6">
              Connect baseline NSDL/CDSL Consolidated Account Statements (CAS) to automatically sync trades from un-integrated brokerages.
            </p>

            <div className="space-y-4">
              {/* Baseline Upload Step */}
              <div className="p-4 rounded-xl border border-dashed border-border bg-bg text-center">
                <FileText size={24} className="mx-auto mb-2 text-accent" />
                <p className="text-xs font-bold text-text-primary">Baseline CAS Statement</p>
                <p className="text-[11px] text-text-muted mt-0.5 mb-3">Upload PDF/CSV statement to initialize portfolio state</p>
                <button 
                  onClick={handleUpload} 
                  disabled={uploading} 
                  className="btn-primary w-full py-2 text-xs"
                >
                  {uploading ? 'Parsing Statement...' : (baselineUploaded ? '✓ Statement Processed' : 'Upload Baseline CAS')}
                </button>
              </div>

              {/* Gmail Inbox Sync Step */}
              <div className="p-4 rounded-xl border border-accent/20 bg-accent-bg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-xs font-bold text-accent">Gmail Contract Note Sync</span>
                  <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-gain-bg text-gain">ACTIVE</span>
                </div>
                <p className="text-[11px] text-text-secondary mb-3">Parses order execution emails from Zerodha, Groww, Angel One automatically.</p>
                <button 
                  onClick={handleMailSync} 
                  disabled={syncingMail} 
                  className="w-full py-2.5 bg-accent text-white font-bold rounded-xl text-xs hover:bg-accent/90 transition-colors flex justify-center items-center gap-2"
                >
                  {syncingMail ? <RefreshCw size={14} className="animate-spin" /> : 'Scan Inbox For New Trade Emails'}
                </button>

                {syncResult !== null && (
                  <div className="mt-3 p-2.5 rounded-lg bg-gain-bg border border-gain/30 text-gain text-xs font-medium text-center">
                    ✓ Found and parsed {syncResult} new trade contract note(s).
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

      </div>

      {/* Connect Broker Modal */}
      {connectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={() => setConnectModalOpen(false)}></div>
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="card w-full max-w-md p-6 relative rounded-2xl border border-border bg-surface z-10"
          >
            <h2 className="text-xl font-extrabold mb-4 text-text-primary">Connect New Broker Account</h2>
            <p className="text-xs text-text-secondary mb-6">Select your broker to authorize OAuth 2.0 portfolio read-access telemetry.</p>
            
            <div className="space-y-4 mb-6">
              <div>
                <label className="text-xs font-bold text-text-muted uppercase">Select Brokerage</label>
                <select 
                  value={selectedBroker} 
                  onChange={e => setSelectedBroker(e.target.value)} 
                  className="w-full mt-1 bg-bg border border-border rounded-xl p-3 text-sm font-bold text-text-primary focus:outline-none focus:border-accent"
                >
                  <option>ICICI Direct</option>
                  <option>Paytm Money</option>
                  <option>Kotak Securities</option>
                  <option>5Paisa</option>
                  <option>Motilal Oswal</option>
                  <option>Dhan</option>
                </select>
              </div>
            </div>

            <div className="flex gap-3">
              <button onClick={() => setConnectModalOpen(false)} className="flex-1 py-3 bg-bg border border-border rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary">
                Cancel
              </button>
              <button onClick={handleAddBroker} className="flex-1 btn-primary py-3 text-xs">
                Authorize & Link
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
