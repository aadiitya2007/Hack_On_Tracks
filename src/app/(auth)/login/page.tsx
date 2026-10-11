'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Mail, Lock, Eye, EyeOff, ShieldCheck, ArrowRight, 
  Sparkles, CheckCircle2, AlertCircle, RefreshCw, X, User
} from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();

  // Form State
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);

  // Interaction State
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successToast, setSuccessToast] = useState<{ show: boolean; name: string; email: string } | null>(null);

  // Google Mock SSO Modal State
  const [showGoogleModal, setShowGoogleModal] = useState(false);
  const [googleLoadingAccount, setGoogleLoadingAccount] = useState<string | null>(null);
  const [customGoogleEmail, setCustomGoogleEmail] = useState('');
  const [showCustomEmailInput, setShowCustomEmailInput] = useState(false);

  // Forgot Password Hint State
  const [showForgotHint, setShowForgotHint] = useState(false);

  // Quick 1-Click Demo Credential Filler
  const handleAutofillDemo = () => {
    setEmail('aditya.aggarwal@gmail.com');
    setPassword('Unify@2025');
    setError(null);
  };

  // Execute Login Session
  const executeLoginSuccess = (userName: string, userEmail: string, provider: 'credentials' | 'google') => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('unify_is_logged_in', 'true');
      localStorage.setItem('unify_user_name', userName);
      localStorage.setItem('unify_user_email', userEmail);
      localStorage.setItem('unify_user_pan', 'ABCDE1234F');
      localStorage.setItem('unify_auth_token', 'jwt_mock_' + Math.random().toString(36).substring(2));
      localStorage.setItem('unify_auth_provider', provider);
      localStorage.setItem('unify_login_time', new Date().toISOString());
    }

    setSuccessToast({ show: true, name: userName, email: userEmail });

    // Smooth redirect to dashboard
    setTimeout(() => {
      router.push('/dashboard');
    }, 1200);
  };

  // Standard Email + Password Login Handler
  const handleEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address (e.g., aditya.aggarwal@gmail.com).');
      return;
    }

    if (!password || password.length < 6) {
      setError('Password must be at least 6 characters.');
      return;
    }

    setLoading(true);

    // Simulate authentic authentication verification
    setTimeout(() => {
      setLoading(false);
      // Derive readable user name from email or default to Aditya Aggarwal
      let resolvedName = 'Aditya Aggarwal';
      if (email.toLowerCase().includes('aditya')) {
        resolvedName = 'Aditya Aggarwal';
      } else {
        const usernamePart = email.split('@')[0];
        resolvedName = usernamePart.charAt(0).toUpperCase() + usernamePart.slice(1);
      }

      executeLoginSuccess(resolvedName, email, 'credentials');
    }, 900);
  };

  // Google SSO Mock Selection Handler
  const handleSelectGoogleAccount = (selectedName: string, selectedEmail: string) => {
    setGoogleLoadingAccount(selectedEmail);

    setTimeout(() => {
      setGoogleLoadingAccount(null);
      setShowGoogleModal(false);
      executeLoginSuccess(selectedName, selectedEmail, 'google');
    }, 1100);
  };

  return (
    <div className="min-h-screen bg-bg relative overflow-hidden flex flex-col justify-between text-text-primary selection:bg-accent/20">
      
      {/* Background Gradients & Ambient Glow */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        <div 
          className="absolute -top-[20%] -left-[10%] w-[65%] h-[65%] rounded-full opacity-40 mix-blend-multiply"
          style={{ background: 'radial-gradient(circle, rgba(109, 40, 217, 0.25) 0%, rgba(109, 40, 217, 0) 70%)', filter: 'blur(110px)' }}
        />
        <div 
          className="absolute top-[40%] -right-[15%] w-[60%] h-[75%] rounded-full opacity-35 mix-blend-multiply"
          style={{ background: 'radial-gradient(circle, rgba(109, 40, 217, 0.2) 0%, rgba(109, 40, 217, 0) 70%)', filter: 'blur(120px)' }}
        />
      </div>

      {/* Top Header */}
      <header className="relative z-10 max-w-6xl w-full mx-auto px-6 py-6 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-accent via-purple-600 to-indigo-500 text-white flex items-center justify-center font-black text-xl shadow-lg shadow-accent/25 group-hover:scale-105 transition-transform shrink-0">
            U
          </div>
          <div className="flex flex-col">
            <span className="text-xl font-black text-text-primary tracking-tight leading-none">Unify</span>
            <span className="text-[9px] font-black text-accent uppercase tracking-widest mt-0.5">PLAN • TRACK • GROW</span>
          </div>
        </Link>

        <div className="flex items-center gap-3">
          <span className="text-xs text-text-muted hidden sm:inline">New to Unify?</span>
          <Link 
            href="/onboarding" 
            className="px-4 py-2 rounded-xl bg-surface border border-border text-xs font-bold text-text-primary hover:border-accent hover:text-accent transition-all shadow-sm"
          >
            Create Account / CKYC →
          </Link>
        </div>
      </header>

      {/* Main Login Card Area */}
      <main className="relative z-10 max-w-md w-full mx-auto px-5 py-6">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="card p-7 sm:p-8 bg-surface/90 border border-border/80 backdrop-blur-xl rounded-3xl shadow-2xl relative"
        >
          {/* Logo Badge & Title */}
          <div className="text-center mb-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-accent-bg border border-accent/20 text-accent text-[11px] font-black uppercase tracking-wider mb-3">
              <Sparkles size={12} /> Secure Investor Access
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-text-primary tracking-tight">
              Sign In to Unify
            </h1>
            <p className="text-xs text-text-secondary mt-1 max-w-xs mx-auto">
              Access consolidated multi-broker telemetry, tax-loss harvesting & AI advisory.
            </p>
          </div>

          {/* Quick Demo Autofill Pill */}
          <div className="mb-5 p-3 rounded-2xl bg-accent-bg/60 border border-accent/30 flex items-center justify-between gap-2 shadow-sm">
            <div className="flex items-center gap-2 overflow-hidden">
              <div className="w-2 h-2 rounded-full bg-accent animate-ping shrink-0" />
              <div className="text-[11px] truncate">
                <span className="font-extrabold text-accent">Hackathon Demo:</span>{' '}
                <span className="text-text-primary font-mono font-medium">aditya.aggarwal@gmail.com</span>
              </div>
            </div>
            <button
              type="button"
              onClick={handleAutofillDemo}
              className="px-2.5 py-1 rounded-lg bg-accent text-white font-extrabold text-[10px] hover:bg-accent-hover transition-colors shrink-0 shadow-sm cursor-pointer"
            >
              1-Click Fill
            </button>
          </div>

          {/* Option A: Sign In with Google (Gmail SSO) */}
          <button
            type="button"
            onClick={() => setShowGoogleModal(true)}
            className="w-full py-3 px-4 rounded-2xl bg-bg border border-border hover:border-text-primary/40 hover:bg-surface-hover transition-all flex items-center justify-center gap-3 text-xs font-bold text-text-primary shadow-sm group cursor-pointer"
          >
            {/* Google Multicolored SVG Logo */}
            <svg className="w-4 h-4 shrink-0" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
            </svg>
            <span className="group-hover:text-text-primary">Continue with Google / Gmail</span>
          </button>

          {/* Divider */}
          <div className="relative my-5 text-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border" />
            </div>
            <span className="relative px-3 bg-surface text-[10px] uppercase font-extrabold tracking-wider text-text-muted">
              or sign in with credentials
            </span>
          </div>

          {/* Error Alert */}
          {error && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className="mb-4 p-3 rounded-xl bg-destructive/10 border border-destructive/25 text-xs text-loss flex items-start gap-2"
            >
              <AlertCircle size={15} className="shrink-0 mt-0.5" />
              <span>{error}</span>
            </motion.div>
          )}

          {/* Option B: Email & Password Form */}
          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div>
              <label className="text-[10px] font-extrabold uppercase text-text-muted mb-1 block">
                Email Address (Gmail or Corporate)
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <Mail size={16} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="aditya.aggarwal@gmail.com"
                  required
                  className="w-full bg-bg border border-border rounded-xl pl-10 pr-4 py-2.5 text-xs font-bold text-text-primary focus:outline-none focus:border-accent transition-colors"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-1">
                <label className="text-[10px] font-extrabold uppercase text-text-muted">
                  Password
                </label>
                <button
                  type="button"
                  onClick={() => setShowForgotHint(prev => !prev)}
                  className="text-[10px] font-bold text-accent hover:underline cursor-pointer"
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-text-muted">
                  <Lock size={16} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  className="w-full bg-bg border border-border rounded-xl pl-10 pr-10 py-2.5 text-xs font-bold text-text-primary focus:outline-none focus:border-accent transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3.5 flex items-center text-text-muted hover:text-text-primary cursor-pointer"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>

              {/* Forgot Password Hint Accordion */}
              {showForgotHint && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  className="mt-2 p-2.5 rounded-xl bg-bg border border-border text-[11px] text-text-secondary space-y-1"
                >
                  <p className="font-bold text-text-primary">Demo Password Hint:</p>
                  <p>You can use password <strong className="text-accent font-mono">Unify@2025</strong> or click the 1-click Google Sign-In above.</p>
                </motion.div>
              )}
            </div>

            <div className="flex items-center justify-between text-xs pt-1">
              <label className="flex items-center gap-2 text-text-secondary cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={e => setRememberMe(e.target.checked)}
                  className="rounded border-border accent-accent cursor-pointer"
                />
                <span className="text-[11px] font-medium">Keep me signed in</span>
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full btn-primary py-3 rounded-xl text-xs font-extrabold flex items-center justify-center gap-2 shadow-lg shadow-accent/25 active:scale-95 transition-all cursor-pointer disabled:opacity-60"
            >
              {loading ? (
                <>
                  <RefreshCw size={14} className="animate-spin" />
                  <span>Verifying Credentials...</span>
                </>
              ) : (
                <>
                  <span>Sign In to Dashboard</span>
                  <ArrowRight size={14} />
                </>
              )}
            </button>
          </form>

          {/* Guest / Direct Dashboard Bypass Link */}
          <div className="mt-5 pt-4 border-t border-border flex items-center justify-between text-[11px]">
            <Link 
              href="/dashboard"
              className="font-bold text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1"
            >
              <span>Explore as Guest</span> →
            </Link>
            <Link 
              href="/onboarding"
              className="font-bold text-accent hover:underline"
            >
              Start CKYC Onboarding
            </Link>
          </div>
        </motion.div>

        {/* Security & Regulatory Footnote */}
        <div className="mt-6 flex items-center justify-center gap-2 text-[10px] text-text-muted">
          <ShieldCheck size={13} className="text-gain shrink-0" />
          <span>256-bit Bank-Grade Encryption • Read-Only Multi-Broker Telemetry</span>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto px-6 py-5 text-center text-xs text-text-muted border-t border-border/40">
        <p>© 2026 Unify Technologies Inc. All rights reserved. SEBI RIA Registration compliant sandbox.</p>
      </footer>

      {/* GOOGLE MOCK SSO ACCOUNT CHOOSER MODAL */}
      <AnimatePresence>
        {showGoogleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setShowGoogleModal(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm" 
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              className="w-full max-w-md bg-surface border border-border rounded-3xl p-6 relative z-10 shadow-2xl space-y-5"
            >
              {/* Google Modal Header */}
              <div className="flex items-center justify-between border-b border-border pb-4">
                <div className="flex items-center gap-2.5">
                  <svg className="w-5 h-5 shrink-0" viewBox="0 0 24 24">
                    <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                    <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                    <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                    <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
                  </svg>
                  <span className="text-sm font-black text-text-primary">Sign in with Google</span>
                </div>
                <button
                  onClick={() => setShowGoogleModal(false)}
                  className="p-1 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              <div>
                <h3 className="text-base font-extrabold text-text-primary">Choose an account</h3>
                <p className="text-xs text-text-secondary mt-0.5">
                  to continue to <strong className="text-text-primary">Unify Investment Platform</strong>
                </p>
              </div>

              {/* Accounts List */}
              <div className="divide-y divide-border border border-border rounded-2xl overflow-hidden bg-bg">
                {/* Account 1: Aditya Aggarwal (Primary Seed) */}
                <button
                  type="button"
                  onClick={() => handleSelectGoogleAccount('Aditya Aggarwal', 'aditya.aggarwal@gmail.com')}
                  disabled={!!googleLoadingAccount}
                  className="w-full p-3.5 flex items-center justify-between hover:bg-surface transition-colors text-left cursor-pointer disabled:opacity-60"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-accent via-purple-600 to-indigo-500 text-white font-black text-xs flex items-center justify-center shrink-0">
                      AA
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="text-xs font-black text-text-primary">Aditya Aggarwal</p>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-gain-bg text-gain border border-gain/20">Verified</span>
                      </div>
                      <p className="text-[11px] text-text-muted font-mono">aditya.aggarwal@gmail.com</p>
                    </div>
                  </div>
                  {googleLoadingAccount === 'aditya.aggarwal@gmail.com' ? (
                    <RefreshCw size={14} className="animate-spin text-accent" />
                  ) : (
                    <span className="text-xs text-text-muted">→</span>
                  )}
                </button>

                {/* Account 2: Demo Retail Investor */}
                <button
                  type="button"
                  onClick={() => handleSelectGoogleAccount('Demo Investor', 'investor.demo@gmail.com')}
                  disabled={!!googleLoadingAccount}
                  className="w-full p-3.5 flex items-center justify-between hover:bg-surface transition-colors text-left cursor-pointer disabled:opacity-60"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-tr from-cyan-500 to-blue-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                      DI
                    </div>
                    <div>
                      <p className="text-xs font-black text-text-primary">Demo Investor</p>
                      <p className="text-[11px] text-text-muted font-mono">investor.demo@gmail.com</p>
                    </div>
                  </div>
                  {googleLoadingAccount === 'investor.demo@gmail.com' ? (
                    <RefreshCw size={14} className="animate-spin text-accent" />
                  ) : (
                    <span className="text-xs text-text-muted">→</span>
                  )}
                </button>

                {/* Use another account option */}
                {!showCustomEmailInput ? (
                  <button
                    type="button"
                    onClick={() => setShowCustomEmailInput(true)}
                    className="w-full p-3.5 flex items-center gap-3 hover:bg-surface transition-colors text-left cursor-pointer"
                  >
                    <div className="w-9 h-9 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted shrink-0">
                      <User size={16} />
                    </div>
                    <span className="text-xs font-bold text-text-primary">Use another account</span>
                  </button>
                ) : (
                  <div className="p-3.5 space-y-2 bg-surface">
                    <label className="text-[10px] font-bold uppercase text-text-muted">Enter any Gmail Address</label>
                    <div className="flex gap-2">
                      <input
                        type="email"
                        placeholder="yourname@gmail.com"
                        value={customGoogleEmail}
                        onChange={e => setCustomGoogleEmail(e.target.value)}
                        className="flex-1 bg-bg border border-border rounded-xl px-3 py-2 text-xs font-bold text-text-primary focus:outline-none focus:border-accent"
                      />
                      <button
                        type="button"
                        onClick={() => {
                          if (customGoogleEmail && customGoogleEmail.includes('@')) {
                            const name = customGoogleEmail.split('@')[0];
                            handleSelectGoogleAccount(name.charAt(0).toUpperCase() + name.slice(1), customGoogleEmail);
                          }
                        }}
                        className="px-3 py-2 bg-accent text-white font-bold text-xs rounded-xl hover:bg-accent-hover cursor-pointer"
                      >
                        Sign In
                      </button>
                    </div>
                  </div>
                )}
              </div>

              <div className="text-[10px] text-text-muted leading-relaxed">
                To continue, Google will share your name, email address, and profile picture with Unify. See Unify's Privacy Policy and Terms of Service.
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Floating Celebratory Success Toast */}
      <AnimatePresence>
        {successToast && successToast.show && (
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-6 right-6 z-50 max-w-sm p-4 rounded-2xl shadow-2xl border border-success/40 bg-surface/95 backdrop-blur-md flex items-start gap-3"
          >
            <div className="p-2 rounded-xl bg-success/15 text-gain shrink-0">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <h4 className="text-xs font-black text-text-primary">Authentication Successful!</h4>
              <p className="text-[11px] text-text-secondary mt-0.5">
                Welcome back, <strong className="text-text-primary">{successToast.name}</strong>. Loading your multi-broker telemetry...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
