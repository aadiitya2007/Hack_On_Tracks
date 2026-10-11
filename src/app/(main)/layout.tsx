'use client';

import { useState, useEffect } from "react";
import { 
  LayoutDashboard, Wallet, BookOpen, Clock, 
  ShieldAlert, Sparkles, Newspaper, Users, Menu, X, ChevronDown, User, Globe, Settings
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import AssistantWidget from "./AssistantWidget";
import MarketBackground from "./MarketBackground";
import { UserProfileModal } from "@/components/UserProfileModal";
import { useLanguage } from "@/context/LanguageContext";

function NavLink({ href, icon, label, badge, colorClass, onClick }: { href: string, icon: React.ReactNode, label: string, badge?: string, colorClass: string, onClick?: () => void }) {
  return (
    <Link 
      href={href} 
      onClick={onClick}
      className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-all group font-bold"
    >
      <div className="flex items-center gap-3.5">
        <div className={`transition-all ${colorClass} bg-surface-hover p-2.5 rounded-xl group-hover:scale-105 shadow-sm shrink-0`}>
          {icon}
        </div>
        <span className="text-base font-extrabold text-text-primary group-hover:text-accent transition-colors">{label}</span>
      </div>
      {badge && (
        <span className="text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-1 rounded-md bg-accent-bg text-accent border border-accent/20">
          {badge}
        </span>
      )}
    </Link>
  );
}

export default function MainLayout({ children }: { children: React.ReactNode }) {
  const { t } = useLanguage();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [profileModalOpen, setProfileModalOpen] = useState(false);
  const [profileDefaultTab, setProfileDefaultTab] = useState<'profile' | 'languages' | 'settings' | 'brokers'>('profile');

  const [userName, setUserName] = useState('Aditya Aggarwal');
  const [userPan, setUserPan] = useState('ABCDE1234F');
  const [userTier, setUserTier] = useState('Fresher Investor');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedName = localStorage.getItem('unify_user_name');
      const storedPan = localStorage.getItem('unify_user_pan');
      const storedTitle = localStorage.getItem('unify_trader_title');
      if (storedName) setUserName(storedName);
      if (storedPan) setUserPan(storedPan);
      if (storedTitle) setUserTier(storedTitle);
    }
  }, []);

  const userInitials = userName.split(' ').map(n => n[0]).join('').slice(0, 2) || 'AA';

  return (
    <div className="flex flex-col lg:flex-row min-h-screen relative overflow-hidden bg-bg">
      <MarketBackground />

      {/* MOBILE / TABLET HEADER */}
      <header className="lg:hidden sticky top-0 z-50 bg-surface/90 backdrop-blur-xl h-16 flex items-center justify-between px-4 border-b border-border/50 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-accent via-purple-600 to-indigo-500 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
            U
          </div>
          <div>
            <h1 className="text-lg font-black text-text-primary tracking-tight leading-none">Unify</h1>
            <p className="text-[8px] font-black text-accent uppercase tracking-widest mt-0.5">PLAN • TRACK • GROW</p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <div className="text-[10px] font-bold text-text-primary flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-surface border border-border shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-gain animate-pulse"></span>
            Live
          </div>

          {/* Top-Right Clickable Profile Button (Mobile) */}
          <button 
            type="button"
            onClick={() => {
              setProfileDefaultTab('profile');
              setProfileModalOpen(true);
            }}
            className="w-8 h-8 rounded-xl bg-gradient-to-tr from-accent via-purple-600 to-indigo-500 text-white font-black text-xs flex items-center justify-center shadow-sm border border-border cursor-pointer shrink-0"
            aria-label="Open profile and settings"
          >
            {userInitials}
          </button>
          
          <button 
            onClick={() => setMobileMenuOpen(prev => !prev)}
            className="w-9 h-9 rounded-xl bg-bg border border-border flex items-center justify-center text-text-primary hover:bg-surface-hover transition-colors cursor-pointer"
            aria-label="Toggle navigation menu"
          >
            {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </header>

      {/* MOBILE / TABLET SLIDE-OUT DRAWER OVERLAY */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <div className="lg:hidden fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMobileMenuOpen(false)}
              className="absolute inset-0 bg-black/60 backdrop-blur-sm"
            />

            {/* Slide-out Menu */}
            <motion.aside 
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="w-4/5 max-w-xs bg-surface h-full relative z-10 flex flex-col shadow-2xl border-r border-border overflow-y-auto"
            >
              <div className="p-5 border-b border-border flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-accent via-purple-600 to-indigo-500 text-white flex items-center justify-center font-black text-xl shadow-md shrink-0">
                    U
                  </div>
                  <div>
                    <h1 className="text-xl font-black text-text-primary tracking-tight leading-none">Unify Navigation</h1>
                    <p className="text-[9px] font-black text-accent uppercase tracking-widest mt-0.5">MOBILE & TABLET MENU</p>
                  </div>
                </div>
                <button onClick={() => setMobileMenuOpen(false)} className="text-text-muted hover:text-text-primary p-1">
                  <X size={20} />
                </button>
              </div>

              <nav className="flex-1 px-4 py-4 space-y-1.5">
                <NavLink onClick={() => setMobileMenuOpen(false)} href="/dashboard" icon={<LayoutDashboard size={20} strokeWidth={2.5} />} label={t('nav_dashboard', 'Dashboard')} colorClass="text-accent" />
                <NavLink onClick={() => setMobileMenuOpen(false)} href="/risk" icon={<ShieldAlert size={20} strokeWidth={2.5} />} label={t('nav_risk', 'Risk Profile')} colorClass="text-[var(--asset-bonds)]" />
                <NavLink onClick={() => setMobileMenuOpen(false)} href="/prediction" icon={<Sparkles size={20} strokeWidth={2.5} />} label={t('nav_prediction', 'Stock Insights')} badge="AI ML" colorClass="text-accent" />
                <NavLink onClick={() => setMobileMenuOpen(false)} href="/news" icon={<Newspaper size={20} strokeWidth={2.5} />} label={t('nav_news', 'Market News')} badge="Live" colorClass="text-accent" />
                <NavLink onClick={() => setMobileMenuOpen(false)} href="/community" icon={<Users size={20} strokeWidth={2.5} />} label={t('nav_community', 'Community Forum')} badge="Network" colorClass="text-accent" />
                <NavLink onClick={() => setMobileMenuOpen(false)} href="/accounts" icon={<Wallet size={20} strokeWidth={2.5} />} label={t('nav_accounts', 'Accounts')} colorClass="text-[var(--asset-stocks)]" />
                <NavLink onClick={() => setMobileMenuOpen(false)} href="/learn" icon={<BookOpen size={20} strokeWidth={2.5} />} label={t('nav_learn', 'Learn')} colorClass="text-[var(--asset-funds)]" />
                <NavLink onClick={() => setMobileMenuOpen(false)} href="/time-machine" icon={<Clock size={20} strokeWidth={2.5} />} label={t('nav_time_machine', 'Time Machine')} colorClass="text-[var(--asset-reits)]" />
              </nav>

              <div className="p-4 border-t border-border space-y-2">
                <div className="flex items-center justify-between text-[11px] text-text-muted px-1">
                  <span className="font-mono">PAN: <strong className="text-text-primary">{userPan}</strong></span>
                  <Link 
                    href="/login" 
                    onClick={() => {
                      if (typeof window !== 'undefined') {
                        localStorage.removeItem('unify_is_logged_in');
                      }
                    }}
                    className="text-text-muted hover:text-loss transition-colors font-bold cursor-pointer"
                  >
                    {t('nav_sign_out', 'Sign Out')}
                  </Link>
                </div>
              </div>
            </motion.aside>
          </div>
        )}
      </AnimatePresence>
      
      {/* DESKTOP SIDEBAR */}
      <aside className="hidden lg:flex lg:w-72 bg-surface flex-col relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-r border-border/50 shrink-0">
        <div className="p-6 pb-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-accent via-purple-600 to-indigo-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-accent/30 shrink-0">
              U
            </div>
            <div>
              <h1 className="text-2xl font-black text-text-primary tracking-tight leading-none">Unify</h1>
              <p className="text-[9px] font-black text-accent uppercase tracking-widest mt-1">{t('plan_track_grow', 'PLAN • TRACK • GROW')}</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 mt-6 space-y-2.5">
          <NavLink href="/dashboard" icon={<LayoutDashboard size={22} strokeWidth={2.5} />} label={t('nav_dashboard', 'Dashboard')} colorClass="text-accent" />
          <NavLink href="/risk" icon={<ShieldAlert size={22} strokeWidth={2.5} />} label={t('nav_risk', 'Risk Profile')} colorClass="text-[var(--asset-bonds)]" />
          <NavLink href="/prediction" icon={<Sparkles size={22} strokeWidth={2.5} />} label={t('nav_prediction', 'Stock Insights')} badge="AI ML" colorClass="text-accent" />
          <NavLink href="/news" icon={<Newspaper size={22} strokeWidth={2.5} />} label={t('nav_news', 'Market News')} badge="Live" colorClass="text-accent" />
          <NavLink href="/community" icon={<Users size={22} strokeWidth={2.5} />} label={t('nav_community', 'Community Forum')} badge="Network" colorClass="text-accent" />

          <NavLink href="/accounts" icon={<Wallet size={22} strokeWidth={2.5} />} label={t('nav_accounts', 'Accounts')} colorClass="text-[var(--asset-stocks)]" />
          <NavLink href="/learn" icon={<BookOpen size={22} strokeWidth={2.5} />} label={t('nav_learn', 'Learn')} colorClass="text-[var(--asset-funds)]" />
          <NavLink href="/time-machine" icon={<Clock size={22} strokeWidth={2.5} />} label={t('nav_time_machine', 'Time Machine')} colorClass="text-[var(--asset-reits)]" />
        </nav>

        {/* Desktop Sidebar Bottom Institutional & Security Footer */}
        <div className="p-4 border-t border-border space-y-2.5">
          <div className="p-3 rounded-2xl bg-bg/80 border border-border flex items-center justify-between text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-gain animate-pulse"></span>
              <span className="text-[11px] font-extrabold text-text-primary">SEBI & AMFI Gateway</span>
            </div>
            <span className="text-[9px] font-mono font-bold text-text-muted px-1.5 py-0.5 rounded bg-surface border border-border">v2.4.0</span>
          </div>

          <div className="flex items-center justify-between px-2 text-[10px] text-text-muted">
            <span className="flex items-center gap-1.5 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-accent"></span> 256-bit SSL Secure
            </span>
            <Link 
              href="/login" 
              onClick={() => {
                if (typeof window !== 'undefined') {
                  localStorage.removeItem('unify_is_logged_in');
                }
              }}
              className="text-text-muted hover:text-loss transition-colors font-bold cursor-pointer"
            >
              {t('nav_sign_out', 'Sign Out')}
            </Link>
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className="flex-1 flex flex-col relative z-20 min-h-screen lg:h-screen lg:overflow-y-auto">
        <header className="hidden lg:flex sticky top-0 z-40 bg-surface/80 backdrop-blur-xl h-16 items-center justify-end px-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border-b border-border/50">
          <div className="flex items-center gap-3">
            <div className="text-xs font-bold text-text-primary flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-surface border border-border shadow-sm">
              <span className="w-2 h-2 rounded-full bg-gain animate-pulse"></span>
              {t('live_sync_active', 'Live Sync Active')}
            </div>

            {/* Top-Right Clickable Profile & Settings Pill Button (Desktop) */}
            <button 
              type="button"
              onClick={() => {
                setProfileDefaultTab('profile');
                setProfileModalOpen(true);
              }}
              className="flex items-center gap-3 px-3.5 py-1.5 rounded-2xl bg-surface border border-border hover:border-accent hover:bg-surface-hover shadow-sm transition-all cursor-pointer group"
            >
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-accent via-purple-600 to-indigo-500 text-white font-extrabold text-xs flex items-center justify-center shadow-sm shrink-0">
                {userInitials}
              </div>
              <div className="text-left">
                <p className="text-xs font-black text-text-primary group-hover:text-accent transition-colors leading-tight">
                  {userName}
                </p>
                <p className="text-[10px] text-text-muted leading-tight font-medium flex items-center gap-1 mt-0.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-gain"></span> {userPan} • {t('nav_profile', 'Profile & Settings')}
                </p>
              </div>
              <ChevronDown size={14} className="text-text-muted group-hover:text-accent transition-colors ml-0.5" />
            </button>
          </div>
        </header>
        
        <div className="p-4 sm:p-6 lg:p-10 pb-24 flex-1">
          {children}
        </div>
        
        <AssistantWidget />

        {/* Global User Profile, Languages & Settings Modal */}
        <UserProfileModal 
          isOpen={profileModalOpen} 
          onClose={() => setProfileModalOpen(false)} 
          defaultTab={profileDefaultTab} 
        />
      </main>
    </div>
  );
}
