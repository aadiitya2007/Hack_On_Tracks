import { LayoutDashboard, Wallet, BookOpen, TrendingUp, Clock, ShieldAlert } from "lucide-react";
import Link from "next/link";
import AssistantWidget from "./AssistantWidget";
import MarketBackground from "./MarketBackground";

function NavLink({ href, icon, label, badge, colorClass }: { href: string, icon: React.ReactNode, label: string, badge?: string, colorClass: string }) {
  return (
    <Link href={href} className="flex items-center justify-between p-3 rounded-xl hover:bg-surface-hover text-text-secondary hover:text-text-primary transition-all group font-medium">
      <div className="flex items-center gap-3">
        <div className={`transition-colors ${colorClass} opacity-70 group-hover:opacity-100 bg-surface-hover p-2 rounded-lg`}>
          {icon}
        </div>
        <span className="text-sm font-bold group-hover:text-text-primary">{label}</span>
      </div>
      {badge && (
        <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-accent-bg text-accent">
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
      <aside className="w-64 bg-surface flex flex-col relative z-20 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
        <div className="p-8 pb-4 border-b border-border">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-[0_4px_10px_rgba(109,40,217,0.3)]">
              <span className="w-3 h-3 bg-white rounded-full"></span>
            </div>
            <h1 className="text-2xl font-extrabold font-sans tracking-tight text-text-primary">VaultIQ</h1>
          </div>
        </div>
        
        <nav className="flex-1 px-4 mt-6 space-y-2">
          <NavLink href="/dashboard" icon={<LayoutDashboard size={18} strokeWidth={2.5} />} label="Dashboard" colorClass="text-accent" />
          <NavLink href="/risk" icon={<ShieldAlert size={18} strokeWidth={2.5} />} label="Risk Profile" colorClass="text-[var(--asset-bonds)]" />

          <NavLink href="/accounts" icon={<Wallet size={18} strokeWidth={2.5} />} label="Accounts" colorClass="text-[var(--asset-stocks)]" />
          <NavLink href="/learn" icon={<BookOpen size={18} strokeWidth={2.5} />} label="Learn" colorClass="text-[var(--asset-funds)]" />
          <NavLink href="/practice" icon={<TrendingUp size={18} strokeWidth={2.5} />} label="Practice Trading" badge="Virtual" colorClass="text-[var(--asset-cash)]" />
          <NavLink href="/time-machine" icon={<Clock size={18} strokeWidth={2.5} />} label="Time Machine" colorClass="text-[var(--asset-reits)]" />
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
