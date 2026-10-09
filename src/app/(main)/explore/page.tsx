'use client';
import { motion } from 'framer-motion';
import Link from 'next/link';

const ASSETS = [
  {
    title: 'REITs (Real Estate)',
    color: 'var(--color-asset-reit)',
    risk: 'Medium',
    returns: '8-10% (Yield + Capital)',
    minInv: '₹300 - ₹500 (1 unit)',
    suits: 'Investors seeking regular income with moderate capital appreciation.',
    desc: 'Real Estate Investment Trusts pool money to invest in rent-generating commercial properties like tech parks.'
  },
  {
    title: 'InvITs (Infrastructure)',
    color: 'var(--color-asset-invit)',
    risk: 'Medium to Low',
    returns: '9-12% (Yield)',
    minInv: '₹10,000+',
    suits: 'Those wanting steady cash flows backed by operational toll roads, power grids, etc.',
    desc: 'Infrastructure Investment Trusts operate completed infrastructure assets and pass the revenue to unit holders.'
  },
  {
    title: 'Corporate Bonds',
    color: 'var(--color-asset-bond)',
    risk: 'Low to Medium',
    returns: '7-11% (Fixed)',
    minInv: '₹1,000 - ₹10,000',
    suits: 'Conservative investors wanting better returns than FDs without equity market volatility.',
    desc: 'Loans you give to large companies in exchange for fixed, regular interest payments (coupons).'
  },
  {
    title: 'Mutual Funds / SIPs',
    color: 'var(--color-asset-equity)',
    risk: 'Variable (Depends on fund)',
    returns: '10-15% (Long term)',
    minInv: '₹100 / month',
    suits: 'Everyone. The best way to build long-term wealth through automated, diversified investing.',
    desc: 'A pool of money managed by experts. SIPs (Systematic Investment Plans) automate your monthly investments, buying more units when markets are low.'
  }
];

export default function ExplorePage() {
  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-20 relative z-10">
      
      <div className="flex justify-between items-end">
        <div>
          <h1 className="heading-hero text-4xl text-gradient">Explore & Learn</h1>
          <p className="text-foreground/60 mt-2">Understand different asset classes to optimize your diversification.</p>
        </div>
        <Link href="/knowledge-check" className="btn-primary flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          Take Knowledge Check
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {ASSETS.map((asset, i) => (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            key={asset.title} 
            className="glass-card p-6 flex flex-col group relative overflow-hidden"
          >
            <div className="absolute top-0 right-0 w-32 h-32 opacity-20 filter blur-3xl rounded-full transition-transform group-hover:scale-150" style={{ backgroundColor: asset.color }}></div>
            
            <h2 className="text-2xl font-display font-bold mb-3 flex items-center gap-2">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: asset.color }}></span>
              {asset.title}
            </h2>
            
            <p className="text-sm text-foreground/70 mb-6 flex-1">{asset.desc}</p>
            
            <div className="grid grid-cols-2 gap-4 text-sm bg-white/5 border border-white/5 p-4 rounded-xl">
              <div>
                <p className="text-[10px] text-foreground/50 font-bold uppercase">Risk Meter</p>
                <p className="font-semibold">{asset.risk}</p>
              </div>
              <div>
                <p className="text-[10px] text-foreground/50 font-bold uppercase">Typical Returns</p>
                <p className="font-semibold text-success">{asset.returns}</p>
              </div>
              <div>
                <p className="text-[10px] text-foreground/50 font-bold uppercase">Min Investment</p>
                <p className="font-semibold">{asset.minInv}</p>
              </div>
              <div className="col-span-2 mt-2 pt-2 border-t border-white/10">
                <p className="text-[10px] text-foreground/50 font-bold uppercase">Who it suits</p>
                <p className="text-foreground/80 mt-1">{asset.suits}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Diversification Mix */}
      <div className="glass-card p-8 mt-8">
        <h2 className="text-xl font-display font-bold mb-2">Portfolio Diversification Mix</h2>
        <p className="text-sm text-foreground/60 mb-6">Compare typical Indian retail portfolios vs recommended diversified models.</p>
        
        <div className="space-y-6">
          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>Typical Unoptimized Mix (High Risk / Concentration)</span>
              <span className="text-destructive font-bold">100% Equity / FDs</span>
            </div>
            <div className="h-4 rounded-full bg-white/5 flex overflow-hidden">
              <div className="h-full bg-blue-500 w-[60%]" title="Direct Stocks: 60%"></div>
              <div className="h-full bg-slate-500 w-[40%]" title="Fixed Deposits: 40%"></div>
            </div>
          </div>

          <div>
            <div className="flex justify-between text-sm mb-2">
              <span>VaultIQ Recommended Balanced Mix</span>
              <span className="text-success font-bold">Multi-Asset Strategy</span>
            </div>
            <div className="h-4 rounded-full bg-white/5 flex overflow-hidden">
              <div className="h-full bg-blue-500 w-[40%]" title="Equity/MFs: 40%"></div>
              <div className="h-full bg-yellow-500 w-[20%]" title="Bonds: 20%"></div>
              <div className="h-full bg-pink-500 w-[20%]" title="REITs/InvITs: 20%"></div>
              <div className="h-full bg-orange-500 w-[10%]" title="Gold: 10%"></div>
              <div className="h-full bg-slate-500 w-[10%]" title="Cash: 10%"></div>
            </div>
          </div>
          
          <div className="flex gap-4 text-xs text-foreground/60 mt-4 flex-wrap">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-blue-500"></span> Equity (40%)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-yellow-500"></span> Bonds (20%)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-pink-500"></span> Yield (REITs/InvITs) (20%)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-orange-500"></span> Gold (10%)</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-slate-500"></span> Cash (10%)</span>
          </div>
        </div>
      </div>
      
    </div>
  );
}
