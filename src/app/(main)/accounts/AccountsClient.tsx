'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { uploadBaselineStatement, runDemoMailSync } from '@/lib/mail-sync';

export default function AccountsClient({ initialAccounts }: { initialAccounts: any[] }) {
  const [accounts, setAccounts] = useState(initialAccounts);
  const [uploading, setUploading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<number | null>(null);

  const apiAccounts = accounts.filter(a => a.broker !== 'Mail Sync' && a.broker !== 'Practice');
  const mailAccount = accounts.find(a => a.broker === 'Mail Sync');
  
  const handleUpload = async () => {
    setUploading(true);
    await new Promise(r => setTimeout(r, 1500)); // Simulate file parse
    await uploadBaselineStatement();
    window.location.reload(); // Quick refresh to get new server state
  };

  const handleMailSync = async () => {
    setSyncing(true);
    await new Promise(r => setTimeout(r, 2000)); // Simulate IMAP connect
    const count = await runDemoMailSync();
    setSyncResult(count);
    setSyncing(false);
    setTimeout(() => window.location.reload(), 2000);
  };

  return (
    <div className="max-w-6xl mx-auto pb-20 relative z-10">
      <div className="mb-8">
        <h1 className="heading-hero text-4xl text-gradient">Linked Accounts</h1>
        <p className="text-foreground/60 mt-2">Manage your connected brokers and manual statement syncs.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Live API Connections */}
        <div>
          <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-success"></span> Live API Brokers
          </h2>
          <div className="space-y-4">
            {apiAccounts.map(a => (
              <div key={a.id} className="glass-card p-5 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded bg-white/10 flex items-center justify-center font-bold text-xs">{a.broker.substring(0, 2).toUpperCase()}</div>
                  <div>
                    <h3 className="font-bold text-foreground">{a.broker}</h3>
                    <p className="text-xs text-foreground/50">{a.holdings.length} Holdings • Last synced: {new Date(a.lastSynced).toLocaleTimeString()}</p>
                  </div>
                </div>
                <span className="px-2 py-1 rounded bg-success/10 text-success text-[10px] font-bold border border-success/20">CONNECTED</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mail Sync Module */}
        <div>
          <h2 className="text-xl font-display font-bold mb-4 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-accent"></span> Mail Sync <span className="text-xs font-sans px-2 py-0.5 rounded bg-white/10 text-white/70 ml-2">Beta</span>
          </h2>
          <div className="glass-card p-6 border-accent/20 bg-gradient-to-br from-accent/5 to-transparent">
            <p className="text-sm text-foreground/70 mb-6">For brokers without API support, upload a baseline statement and connect Gmail to automatically parse future contract notes.</p>
            
            {!mailAccount ? (
              <div className="space-y-4">
                <div className="p-4 rounded-xl border border-dashed border-white/20 bg-white/5 text-center">
                  <p className="text-sm font-medium mb-2">Step 1: Baseline Upload</p>
                  <p className="text-xs text-foreground/50 mb-4">Upload your latest CAS/Holdings statement (CSV/PDF) to establish the starting point.</p>
                  <button onClick={handleUpload} disabled={uploading} className="btn-primary py-2 px-6">
                    {uploading ? 'Processing File...' : 'Upload Statement'}
                  </button>
                </div>
                <div className="p-4 rounded-xl border border-white/5 bg-black/20 opacity-50 cursor-not-allowed">
                  <p className="text-sm font-medium">Step 2: Connect Gmail</p>
                  <p className="text-xs text-foreground/50">Requires baseline upload first.</p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                <div className="flex items-center justify-between p-4 bg-white/5 rounded-xl border border-white/10">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-accent/20 flex items-center justify-center text-accent">📄</div>
                    <div>
                      <p className="text-sm font-bold">Baseline Established</p>
                      <p className="text-xs text-foreground/50">{mailAccount.holdings.length} initial holdings mapped</p>
                    </div>
                  </div>
                  <span className="text-success text-lg">✓</span>
                </div>

                <div className="p-5 rounded-xl border border-accent/30 bg-accent/10 relative overflow-hidden">
                  <div className="absolute top-0 right-0 px-2 py-1 bg-destructive/80 text-[10px] font-bold text-white rounded-bl-lg z-10">DEMO MAILBOX MODE</div>
                  <p className="text-sm font-medium mb-2 text-accent">Gmail Connection Active (Read-Only)</p>
                  <p className="text-xs text-foreground/60 mb-4">Listening for contract notes from verified broker domains.</p>
                  
                  <button onClick={handleMailSync} disabled={syncing} className="w-full py-3 bg-accent text-black font-bold rounded-lg hover:bg-accent/80 transition-colors flex justify-center items-center gap-2">
                    {syncing ? <span className="animate-spin">↻</span> : 'Scan Inbox & Process Emails'}
                  </button>
                  
                  {syncResult !== null && (
                    <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="mt-4 p-3 bg-success/20 border border-success/30 rounded-lg text-sm text-success font-medium">
                      ✓ Successfully parsed {syncResult} contract notes and updated holdings.
                    </motion.div>
                  )}
                </div>

                <div className="text-xs text-foreground/40 text-center">
                  <p>All data is processed strictly on-device/in-memory where possible.</p>
                  <p>Tokens are encrypted. We never store email bodies.</p>
                </div>
              </div>
            )}
            
          </div>
        </div>

      </div>
    </div>
  );
}
