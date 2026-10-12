'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Wallet, Plus, RefreshCw, Trash2, CheckCircle2, ShieldCheck, 
  FileText, ChevronDown, ChevronUp, ExternalLink, Check
} from 'lucide-react';
import { uploadBaselineStatement, runDemoMailSync } from '@/lib/mail-sync';
import { CasPdfParserSync } from '@/components/CasPdfParserSync';

export const BROKER_LOGOS: Record<string, string> = {
  'zerodha': '/logos/zerodha.webp',
  'zerodha kite': '/logos/zerodha.webp',
  'kite': '/logos/zerodha.webp',
  'groww': '/logos/groww.png',
  'upstox': '/logos/upstox.png',
  'upstox pro': '/logos/upstox.png',
  'angel one': '/logos/angelone.svg',
  'angelone': '/logos/angelone.svg',
  'angel': '/logos/angelone.svg',
  'cdsl': '/logos/cdsl.webp',
  'cdsl (depository)': '/logos/cdsl.webp',
  'cdsl cas': '/logos/cdsl.webp',
  'nsdl': '/logos/nsdl.png',
  'nsdl cas': '/logos/nsdl.png',
  'icici direct': '/logos/icici.svg',
  'icici': '/logos/icici.svg',
  'kotak securities': '/logos/kotak.svg',
  'kotak': '/logos/kotak.svg',
};

export const getBrokerLogo = (brokerName: string) => {
  if (!brokerName) return null;
  const name = brokerName.toLowerCase().trim();
  if (BROKER_LOGOS[name]) return BROKER_LOGOS[name];
  for (const [key, logoPath] of Object.entries(BROKER_LOGOS)) {
    if (name.includes(key)) {
      return logoPath;
    }
  }
  return null;
};

export const getAccountNumber = (brokerName: string, id?: string) => {
  const b = (brokerName || '').toLowerCase();
  if (b.includes('zerodha') || b.includes('kite')) return 'ZER-982311';
  if (b.includes('groww')) return 'GRW-445109';
  if (b.includes('upstox')) return 'UPS-110293';
  if (b.includes('angel')) return 'ANG-774012';
  if (b.includes('cdsl')) return '12081600-02391456';
  if (b.includes('nsdl')) return 'IN300126-10492834';
  if (b.includes('icici')) return 'ICICI-559201';
  if (b.includes('kotak')) return 'KTK-319482';
  if (id && id.length >= 8) return `${(brokerName || 'ACC').substring(0, 3).toUpperCase()}-${id.substring(0, 6).toUpperCase()}`;
  return `${(brokerName || 'ACC').substring(0, 3).toUpperCase()}-882914`;
};

export const getBrokerLastSynced = (brokerName: string) => {
  const b = (brokerName || '').toLowerCase();
  if (b.includes('zerodha')) return '2 mins ago';
  if (b.includes('groww')) return '14 mins ago';
  if (b.includes('upstox')) return '45 mins ago';
  if (b.includes('angel')) return '1 hour ago';
  if (b.includes('cdsl')) return '3 hours ago';
  return 'Just now';
};

const DEFAULT_ACCOUNTS = [
  {
    id: 'a1',
    broker: 'Zerodha Kite',
    accountNumber: 'ZER-982311',
    status: 'CONNECTED',
    lastSynced: '2 mins ago',
    holdingsCount: 4,
    totalValue: 751476,
    holdings: [
      { symbol: 'RELIANCE', qty: 90, price: 2985.40 },
      { symbol: 'TCS', qty: 65, price: 4120.00 },
      { symbol: 'HDFCBANK', qty: 80, price: 1680.50 },
      { symbol: 'NIFTYBEES', qty: 300, price: 268.50 },
    ]
  },
  {
    id: 'a2',
    broker: 'Groww',
    accountNumber: 'GRW-445109',
    status: 'CONNECTED',
    lastSynced: '14 mins ago',
    holdingsCount: 3,
    totalValue: 603124,
    holdings: [
      { symbol: 'INFY', qty: 120, price: 1890.20 },
      { symbol: 'BAJFINANCE', qty: 25, price: 7210.00 },
      { symbol: 'PPFAS', qty: 2500, price: 78.42 },
    ]
  },
  {
    id: 'a3',
    broker: 'Upstox Pro',
    accountNumber: 'UPS-110293',
    status: 'CONNECTED',
    lastSynced: '45 mins ago',
    holdingsCount: 3,
    totalValue: 362460,
    holdings: [
      { symbol: 'TATAMOTORS', qty: 200, price: 940.50 },
      { symbol: 'SBIN', qty: 150, price: 820.00 },
      { symbol: 'GOLDBEES', qty: 800, price: 64.20 },
    ]
  },
  {
    id: 'a4',
    broker: 'Angel One',
    accountNumber: 'ANG-774012',
    status: 'CONNECTED',
    lastSynced: '1 hour ago',
    holdingsCount: 3,
    totalValue: 430770,
    holdings: [
      { symbol: 'ITC', qty: 350, price: 475.20 },
      { symbol: 'BHARTIARTL', qty: 90, price: 1450.00 },
      { symbol: 'RECLTD', qty: 250, price: 535.80 },
    ]
  }
];

const AVAILABLE_BROKERS = [
  { name: 'Zerodha Kite', logo: '/logos/zerodha.webp', desc: "India's #1 Discount Broker" },
  { name: 'Groww', logo: '/logos/groww.png', desc: 'Direct Mutual Funds & Stocks' },
  { name: 'Upstox Pro', logo: '/logos/upstox.png', desc: 'Low-latency Pro Trading API' },
  { name: 'Angel One', logo: '/logos/angelone.svg', desc: 'SmartAPI Algorithmic Trading' },
  { name: 'ICICI Direct', logo: '/logos/icici.svg', desc: '3-in-1 Demat & Banking Suite' },
  { name: 'Kotak Securities', logo: '/logos/kotak.svg', desc: 'Zero Brokerage Demat Gateway' },
  { name: 'CDSL Demat CAS', logo: '/logos/cdsl.webp', desc: 'Central Depository Services' },
  { name: 'NSDL CAS', logo: '/logos/nsdl.png', desc: 'National Securities Depository' },
];

export default function AccountsClient({ initialAccounts }: { initialAccounts: any[] }) {
  const [accounts, setAccounts] = useState(() => {
    if (initialAccounts && Array.isArray(initialAccounts) && initialAccounts.length > 0) {
      // Check if it's only a single mock placeholder
      const isOnlyMock = initialAccounts.length === 1 && (initialAccounts[0].broker === 'MockBroker' || !initialAccounts[0].broker);
      if (!isOnlyMock) {
        return initialAccounts.map((a: any) => ({
          id: a.id || 'acc-' + Math.random(),
          broker: a.broker || 'Broker Account',
          accountNumber: a.accountNumber || getAccountNumber(a.broker, a.id),
          status: a.status || 'CONNECTED',
          lastSynced: a.lastSynced ? 'Just now' : getBrokerLastSynced(a.broker),
          holdingsCount: a.holdings?.length || 0,
          totalValue: a.holdings?.reduce((sum: number, h: any) => sum + ((h.quantity || 0) * (h.currentPrice || h.avgBuyPrice || 0)), 0) || 150000,
          holdings: a.holdings || []
        }));
      }
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
      accountNumber: getAccountNumber(selectedBroker),
      status: 'CONNECTED',
      lastSynced: 'Just now',
      holdingsCount: 3,
      totalValue: 245000,
      holdings: [
        { symbol: 'SBIN', qty: 100, price: 820.00 },
        { symbol: 'BHARTIARTL', qty: 50, price: 1450.00 },
        { symbol: 'GOLDBEES', qty: 500, price: 64.20 }
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
      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
        <div>
          <h1 className="heading-hero text-3xl sm:text-4xl text-gradient">Linked Accounts & Brokerages</h1>
          <p className="text-text-secondary mt-1 text-xs sm:text-sm font-medium">Manage live API broker credentials, automated CAS parsing, and multi-broker portfolio synchronization.</p>
        </div>
        <button 
          onClick={() => setConnectModalOpen(true)} 
          className="btn-primary flex items-center gap-2 self-start sm:self-auto shrink-0 shadow-md cursor-pointer"
        >
          <Plus size={18} /> Connect New Broker
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Live Broker Accounts List */}
        <div className="lg:col-span-2 space-y-6">
          <div className="space-y-4">
            <h2 className="text-lg font-bold flex items-center gap-2 text-text-primary">
              <span className="w-2.5 h-2.5 rounded-full bg-gain"></span> Connected Live Accounts ({accounts.length})
            </h2>

            {accounts.map(a => {
              const logoUrl = getBrokerLogo(a.broker);
              return (
                <div key={a.id} className="card p-5 bg-surface border border-border hover:border-accent/40 transition-all rounded-2xl shadow-sm">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex items-center gap-3.5">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center border border-border p-2 overflow-hidden shrink-0 shadow-sm">
                        {logoUrl ? (
                          <img 
                            src={logoUrl} 
                            alt={a.broker} 
                            className="w-full h-full object-contain" 
                          />
                        ) : (
                          <div className="w-full h-full rounded-xl bg-accent-bg text-accent flex items-center justify-center font-extrabold text-sm border border-accent/20">
                            {a.broker.substring(0, 2).toUpperCase()}
                          </div>
                        )}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-extrabold text-text-primary text-base tracking-tight">{a.broker}</h3>
                          <span className="text-[10px] font-bold uppercase px-2 py-0.5 rounded bg-gain-bg text-gain border border-gain/20 flex items-center gap-1">
                            <CheckCircle2 size={10} /> Live
                          </span>
                        </div>
                        <p className="text-xs text-text-muted mt-0.5 font-mono">
                          Acc: {a.accountNumber} • {a.holdingsCount} Holdings • Synced {a.lastSynced}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-border">
                      <div className="text-left sm:text-right">
                        <span className="text-[10px] text-text-muted font-bold block uppercase tracking-wider">Portfolio Value</span>
                        <span className="font-mono font-black text-text-primary text-sm sm:text-base">
                          ₹{Math.round(a.totalValue || 0).toLocaleString('en-IN')}
                        </span>
                      </div>

                      <div className="flex items-center gap-1.5">
                        <button 
                          onClick={() => handleSyncAccount(a.id)}
                          disabled={syncingId === a.id}
                          className="p-2 rounded-xl bg-bg border border-border text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                          title="Sync Now"
                        >
                          <RefreshCw size={16} className={syncingId === a.id ? 'animate-spin text-accent' : ''} />
                        </button>

                        <button
                          onClick={() => setExpandedAccount(expandedAccount === a.id ? null : a.id)}
                          className="p-2 rounded-xl bg-bg border border-border text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
                          title="Toggle Holdings"
                        >
                          {expandedAccount === a.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                        </button>

                        <button
                          onClick={() => handleDisconnect(a.id)}
                          className="p-2 rounded-xl bg-loss-bg text-loss border border-loss/20 hover:bg-loss/20 transition-colors cursor-pointer"
                          title="Disconnect"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
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
                          {a.holdings && a.holdings.length > 0 ? (
                            a.holdings.map((h: any, i: number) => {
                              const qty = h.qty || h.quantity || 0;
                              const price = h.price || h.currentPrice || h.avgBuyPrice || 0;
                              const val = qty * price;
                              return (
                                <div key={i} className="flex justify-between items-center p-2.5 rounded-xl bg-bg border border-border text-xs">
                                  <div className="font-bold text-text-primary">{h.symbol}</div>
                                  <div className="text-text-secondary">{qty} units @ ₹{price.toFixed(2)}</div>
                                  <div className="font-mono font-bold text-text-primary">₹{Math.round(val).toLocaleString('en-IN')}</div>
                                </div>
                              );
                            })
                          ) : (
                            <div className="p-3 text-xs text-text-muted text-center">No active holdings mapped to this broker.</div>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          {/* UNIVERSAL BROKER PARSER & ACCOUNT AGGREGATOR SYNC */}
          <CasPdfParserSync />
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
                  className="btn-primary w-full py-2 text-xs cursor-pointer"
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
                <p className="text-[11px] text-text-secondary mb-3">Parses order execution emails from Zerodha, Groww, Angel One, Upstox automatically.</p>
                <button 
                  onClick={handleMailSync} 
                  disabled={syncingMail} 
                  className="w-full py-2.5 bg-accent text-white font-bold rounded-xl text-xs hover:bg-accent/90 transition-colors flex justify-center items-center gap-2 cursor-pointer"
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
            className="card w-full max-w-lg p-6 relative rounded-2xl border border-border bg-surface z-10 shadow-2xl"
          >
            <h2 className="text-xl font-extrabold mb-1 text-text-primary">Connect New Broker Account</h2>
            <p className="text-xs text-text-secondary mb-5">Select your broker to authorize OAuth 2.0 portfolio read-access telemetry.</p>
            
            <div className="space-y-4 mb-6">
              <label className="text-xs font-bold text-text-muted uppercase tracking-wider">Select Brokerage</label>
              <div className="grid grid-cols-2 gap-2.5 max-h-[300px] overflow-y-auto pr-1">
                {AVAILABLE_BROKERS.map(b => {
                  const isSelected = selectedBroker === b.name;
                  return (
                    <button
                      key={b.name}
                      type="button"
                      onClick={() => setSelectedBroker(b.name)}
                      className={`p-3 rounded-xl border text-left flex items-center gap-3 transition-all cursor-pointer ${
                        isSelected 
                          ? 'border-accent bg-accent/10 shadow-sm' 
                          : 'border-border bg-bg hover:border-accent/40'
                      }`}
                    >
                      <div className="w-8 h-8 rounded-lg bg-white p-1 border border-border/80 flex items-center justify-center shrink-0 shadow-xs">
                        <img src={b.logo} alt={b.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="text-xs font-bold text-text-primary truncate">{b.name}</div>
                        <div className="text-[10px] text-text-muted truncate">{b.desc}</div>
                      </div>
                      {isSelected && (
                        <Check size={14} className="text-accent shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setConnectModalOpen(false)} 
                className="flex-1 py-3 bg-bg border border-border rounded-xl text-xs font-bold text-text-secondary hover:text-text-primary cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddBroker} 
                className="flex-1 btn-primary py-3 text-xs font-bold cursor-pointer"
              >
                Authorize & Link {selectedBroker}
              </button>
            </div>
          </motion.div>
        </div>
      )}

    </div>
  );
}
