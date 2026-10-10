import { LayoutDashboard, Wallet, BookOpen, TrendingUp, Clock, ShieldAlert, Sparkles, Newspaper } from "lucide-react";
import Link from "next/link";
import AssistantWidget from "./AssistantWidget";
import MarketBackground from "./MarketBackground";

function NavLink({ href, icon, label, badge, colorClass }: { href: string, icon: React.ReactNode, label: string, badge?: string, colorClass: string }) {
  return (
    <Link href={href} className="flex items-center justify-between p-3.5 rounded-2xl hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-all group font-bold">
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
  return (
    <div className="flex min-h-screen relative overflow-hidden bg-bg">
      <MarketBackground />
      
      {/* Sidebar: Pure white, soft shadow instead of hard border */}
      <aside className="w-72 bg-surface flex flex-col relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)] border-r border-border/50">
        <div className="p-6 pb-5 border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-gradient-to-tr from-accent via-purple-600 to-indigo-500 text-white flex items-center justify-center font-black text-2xl shadow-lg shadow-accent/30 shrink-0">
              U
            </div>
            <div>
              <h1 className="text-2xl font-black text-text-primary tracking-tight leading-none">Unify</h1>
              <p className="text-[9px] font-black text-accent uppercase tracking-widest mt-1">PLAN • TRACK • GROW</p>
            </div>
          </div>
        </div>
        
        <nav className="flex-1 px-4 mt-6 space-y-2.5">
          <NavLink href="/dashboard" icon={<LayoutDashboard size={22} strokeWidth={2.5} />} label="Dashboard" colorClass="text-accent" />
          <NavLink href="/risk" icon={<ShieldAlert size={22} strokeWidth={2.5} />} label="Risk Profile" colorClass="text-[var(--asset-bonds)]" />
          <NavLink href="/prediction" icon={<Sparkles size={22} strokeWidth={2.5} />} label="Stock Insights" badge="AI ML" colorClass="text-accent" />
          <NavLink href="/news" icon={<Newspaper size={22} strokeWidth={2.5} />} label="Market News" badge="Live" colorClass="text-accent" />

          <NavLink href="/accounts" icon={<Wallet size={22} strokeWidth={2.5} />} label="Accounts" colorClass="text-[var(--asset-stocks)]" />
          <NavLink href="/learn" icon={<BookOpen size={22} strokeWidth={2.5} />} label="Learn" colorClass="text-[var(--asset-funds)]" />
          <NavLink href="/time-machine" icon={<Clock size={22} strokeWidth={2.5} />} label="Time Machine" colorClass="text-[var(--asset-reits)]" />
        </nav>

        <div className="p-6 border-t border-border">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-bg border border-border shadow-inner">
            <div className="w-10 h-10 rounded-full bg-accent-bg flex items-center justify-center text-accent font-bold shadow-sm">
              U
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate text-text-primary">Simulated User</p>
              <p className="text-[11px] font-medium text-text-muted mt-0.5 truncate flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-[var(--asset-stocks)]"></span> Zerodha
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-20 h-screen overflow-y-auto">
        <header className="sticky top-0 z-40 bg-surface/80 backdrop-blur-xl h-16 flex items-center justify-end px-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)] border-b border-border/50">
          <div className="flex items-center gap-4">
            <div className="text-xs font-bold text-text-primary flex items-center gap-2 px-4 py-2 rounded-full bg-surface border border-border shadow-sm">
              <span className="w-2 h-2 rounded-full bg-gain animate-pulse"></span>
              Live Sync Active
            </div>
          </div>
        </header>
        
        <div className="p-10 pb-24">
          {children}
        </div>
        
        <AssistantWidget />
      </main>
    </div>
  );
}
