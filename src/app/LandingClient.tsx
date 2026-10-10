'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { LayoutDashboard, Wallet, Compass, GraduationCap, Clock } from 'lucide-react';

export default function LandingClient() {
  return (
    <div className="min-h-screen bg-bg relative overflow-hidden font-sans">
      
      {/* Background Gradients (Alizo Style) */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div className="absolute -top-[20%] -left-[10%] w-[70%] h-[70%] rounded-full opacity-50 mix-blend-multiply"
             style={{ background: 'radial-gradient(circle, rgba(109, 40, 217, 0.15) 0%, rgba(109, 40, 217, 0) 70%)', filter: 'blur(100px)' }}></div>
        <div className="absolute top-[40%] -right-[20%] w-[60%] h-[80%] rounded-full opacity-40 mix-blend-multiply"
             style={{ background: 'radial-gradient(circle, rgba(109, 40, 217, 0.1) 0%, rgba(109, 40, 217, 0) 70%)', filter: 'blur(120px)' }}></div>
      </div>

      {/* Navbar */}
      <nav className="relative z-50 flex items-center justify-between px-8 py-6 max-w-7xl mx-auto">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-accent text-white flex items-center justify-center font-black text-xl shadow-md shadow-accent/20">
            U
          </div>
          <img src="/logos/unify.png" alt="Unify" className="h-10 object-contain" />
        </div>
        <div className="hidden md:flex gap-8 font-medium text-sm text-text-secondary">
          <Link href="#features" className="hover:text-[var(--asset-stocks)] transition-colors">Features</Link>
          <Link href="#solutions" className="hover:text-[var(--asset-stocks)] transition-colors">Solutions</Link>
          <Link href="#about" className="hover:text-[var(--asset-stocks)] transition-colors">About</Link>
        </div>
        <div className="flex gap-4">
          <Link href="/dashboard" className="px-6 py-2.5 rounded-full font-bold text-sm text-text-primary hover:bg-surface-hover transition-colors border border-border">Login</Link>
          <Link href="/onboarding" className="px-6 py-2.5 rounded-full font-bold text-sm text-white bg-accent hover:bg-accent-hover transition-colors shadow-[0_4px_14px_rgba(109,40,217,0.3)] hover:-translate-y-0.5">Sign Up</Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 max-w-7xl mx-auto px-8 pt-12 pb-32 flex flex-col items-center text-center">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="flex flex-col items-center"
        >
          {/* Big Center Logo Image */}
          <div className="mb-6 p-4 rounded-3xl bg-surface/80 border border-border/80 shadow-2xl backdrop-blur-md">
            <img src="/logos/unify.png" alt="Unify — PLAN / TRACK / GROW" className="h-20 md:h-28 object-contain drop-shadow-md" />
          </div>

          <div className="sub-heading mb-6 justify-center">Unify Financial Engine</div>
          <h1 className="heading-hero text-6xl md:text-7xl max-w-4xl leading-tight mb-8">
            Master Your Wealth <br/> <span className="text-[var(--asset-stocks)]">Without the Complexity.</span>
          </h1>
          <p className="text-lg text-text-secondary max-w-2xl mx-auto mb-10 leading-relaxed">
            Unify your scattered broker accounts, test strategies in our virtual simulator, and parse offline contract notes—all in one intelligent platform.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link href="/onboarding" className="btn-primary text-lg px-8 py-4">Start For Free</Link>
            <Link href="/dashboard" className="px-8 py-4 rounded-xl font-bold text-[var(--asset-stocks)] hover:bg-surface shadow-sm border border-border transition-colors">View Live Demo →</Link>
          </div>
        </motion.div>
        
        {/* Mock App Interface Graphic */}
        <motion.div 
          initial={{ opacity: 0, y: 80 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="mt-20 w-full max-w-5xl h-[500px] bg-white rounded-3xl border border-border shadow-[0_30px_60px_-15px_rgba(109,40,217,0.15)] overflow-hidden relative"
        >
          <div className="absolute top-0 w-full h-12 bg-surface-hover border-b border-border flex items-center px-4 gap-2">
            <div className="w-3 h-3 rounded-full bg-red-400"></div>
            <div className="w-3 h-3 rounded-full bg-amber-400"></div>
            <div className="w-3 h-3 rounded-full bg-green-400"></div>
          </div>
          <div className="p-10 mt-12 grid grid-cols-3 gap-6">
            <div className="col-span-2 space-y-6">
              <div className="h-40 bg-surface shadow-sm border border-border rounded-2xl border border-accent/10 flex items-center justify-center p-8">
                <div className="w-full h-full border-b-2 border-l-2 border-accent/20 relative">
                  <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none"><path d="M0 100 Q 50 20 100 50 T 200 40 T 300 10" fill="none" stroke="var(--color-accent)" strokeWidth="4" strokeLinecap="round"/></svg>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="h-24 flex-1 bg-surface-hover rounded-xl border border-border"></div>
                <div className="h-24 flex-1 bg-surface-hover rounded-xl border border-border"></div>
              </div>
            </div>
            <div className="space-y-4">
              <div className="h-16 bg-surface-hover rounded-xl border border-border"></div>
              <div className="h-16 bg-surface-hover rounded-xl border border-border"></div>
              <div className="h-16 bg-surface-hover rounded-xl border border-border"></div>
              <div className="h-16 bg-surface-hover rounded-xl border border-border"></div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Scroll-Revealed Features Section */}
      <section id="features" className="relative z-10 max-w-7xl mx-auto px-8 py-24">
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <div className="sub-heading justify-center mb-4">Core Capabilities</div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-text-primary">Everything You Need To Grow</h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {[
            { icon: <LayoutDashboard size={24} className="text-[var(--asset-stocks)]" />, title: 'Unified Telemetry', desc: 'Connect all your Indian brokers instantly. See overlapping holdings, exact allocations, and true P&L.' },
            { icon: <Clock size={24} className="text-[var(--asset-stocks)]" />, title: 'Time Machine', desc: 'Simulate historical asset trajectories. See exactly how a 10-year SIP in NIFTY 50 compares to Gold.' },
            { icon: <Wallet size={24} className="text-[var(--asset-stocks)]" />, title: 'Practice Trading', desc: 'Risk-free ₹10L virtual sandbox. Trigger market crashes and rate hikes to see how your portfolio reacts.' },
            { icon: <Compass size={24} className="text-[var(--asset-stocks)]" />, title: 'Asset Explorer', desc: 'Understand REITs, InvITs, Bonds, and Equities with plain-language, jargon-free explanations.' },
            { icon: <GraduationCap size={24} className="text-[var(--asset-stocks)]" />, title: 'Knowledge Check', desc: 'Dynamic financial literacy quizzes that assign you a level (Beginner to Confident) and adapt to you.' },
            { icon: <LayoutDashboard size={24} className="text-[var(--asset-stocks)]" />, title: 'Mail Sync Engine', desc: 'No broker API? No problem. We securely parse your PDF contract notes from Gmail automatically.' },
          ].map((feature, idx) => (
            <motion.div 
              key={idx}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: idx * 0.1 }}
              className="card p-8 flex flex-col items-start hover:-translate-y-1 hover:shadow-[0_15px_40px_-10px_rgba(109,40,217,0.1)] cursor-default"
            >
              <div className="w-12 h-12 rounded-2xl bg-surface shadow-sm border border-border flex items-center justify-center mb-6">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3">{feature.title}</h3>
              <p className="text-text-secondary leading-relaxed">{feature.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Split Section / Solutions */}
      <section id="solutions" className="relative z-10 bg-white py-24 border-y border-border">
        <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          <motion.div 
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="sub-heading mb-4">Mail Sync Innovation</div>
            <h2 className="text-4xl font-extrabold mb-6">Missing historical buy prices? We fix that.</h2>
            <p className="text-lg text-text-secondary mb-8 leading-relaxed">
              Many legacy brokers don't provide proper APIs. Our Mail Sync engine safely parses your password-protected PDF contract notes, extracting trades to build a perfect historical record of your true average buy price.
            </p>
            <ul className="space-y-4 mb-8">
              <li className="flex items-center gap-3 font-semibold"><span className="w-6 h-6 rounded-full bg-gain-bg text-gain flex items-center justify-center">✓</span> 100% On-Device Parsing</li>
              <li className="flex items-center gap-3 font-semibold"><span className="w-6 h-6 rounded-full bg-gain-bg text-gain flex items-center justify-center">✓</span> Zero Email Storage</li>
              <li className="flex items-center gap-3 font-semibold"><span className="w-6 h-6 rounded-full bg-gain-bg text-gain flex items-center justify-center">✓</span> Instant P&L Correction</li>
            </ul>
            <Link href="/accounts" className="btn-primary inline-block">Try Demo Mailbox</Link>
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative"
          >
            <div className="absolute -inset-4 bg-surface shadow-sm border border-border rounded-[3rem] blur-xl"></div>
            <div className="relative bg-surface border border-border rounded-3xl p-8 shadow-[0_20px_50px_-10px_rgba(109,40,217,0.1)]">
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-surface shadow-sm border border-border rounded-xl border border-accent/10">
                  <div>
                    <p className="font-bold text-[var(--asset-stocks)]">BUY 50 RELIANCE</p>
                    <p className="text-xs text-text-secondary mt-1">Found in ContractNote_Zerodha.pdf</p>
                  </div>
                  <span className="pill-gain">Mapped</span>
                </div>
                <div className="flex items-center justify-between p-4 bg-bg rounded-xl border border-border">
                  <div>
                    <p className="font-bold">SELL 10 INFY</p>
                    <p className="text-xs text-text-muted mt-1">Found in Groww_Statement.pdf</p>
                  </div>
                  <span className="pill-gain">Mapped</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="relative z-10 bg-bg pt-24 pb-12 text-center">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl font-extrabold mb-6">Ready to take control?</h2>
          <p className="text-text-secondary mb-8">Join the simulated demo environment and test the platform.</p>
          <Link href="/onboarding" className="btn-primary text-lg px-10 py-4 shadow-[0_10px_30px_rgba(109,40,217,0.3)] hover:-translate-y-1 transition-all inline-block">
            Create Free Account
          </Link>
        </motion.div>
        
        <div className="mt-24 text-sm text-text-muted">
          <p>© 2026 Unify Hackathon Prototype. Educational purposes only.</p>
        </div>
      </footer>
      
    </div>
  );
}
