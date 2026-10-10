import { LayoutDashboard, Wallet, Compass, FileText } from "lucide-react";
import Link from "next/link";
import AssistantWidget from "./AssistantWidget";
import MarketBackground from "./MarketBackground";

function NavLink({ href, icon, label, badge }: { href: string, icon: React.ReactNode, label: string, badge?: string }) {
  return (
    <Link href={href} className="flex items-center justify-between p-3 rounded-xl hover:bg-accent-bg text-text-secondary hover:text-accent transition-all group font-medium">
      <div className="flex items-center gap-3">
        <div className="text-text-muted group-hover:text-accent transition-colors">
          {icon}
        </div>
        <span className="text-sm">{label}</span>
      </div>
      {badge && (
        <span className="text-[10px] uppercase tracking-wider font-bold px-2 py-0.5 rounded bg-accent/10 text-accent">
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
        <div className="p-8 pb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center">
              <span className="w-3 h-3 bg-white rounded-full"></span>
            </div>
            <h1 className="text-2xl font-extrabold font-sans tracking-tight text-text-primary">VaultIQ</h1>
          </div>
        </div>
        
        <nav className="flex-1 px-4 mt-8 space-y-1">
          <NavLink href="/dashboard" icon={<LayoutDashboard size={20} strokeWidth={2.5} />} label="Dashboard" />
          <NavLink href="/accounts" icon={<Wallet size={20} strokeWidth={2.5} />} label="Accounts" />
          <NavLink href="/learn" icon={<Compass size={20} strokeWidth={2.5} />} label="Explore" />
          <NavLink href="/practice" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2" /></svg>} label="Practice Trading" badge="Virtual" />
          <NavLink href="/knowledge-check" icon={<FileText size={20} strokeWidth={2.5} />} label="Knowledge Check" />
          <NavLink href="/time-machine" icon={<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>} label="Time Machine" />
        </nav>

        <div className="p-6">
          <div className="flex items-center gap-4 p-4 rounded-2xl bg-bg border border-border">
            <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center text-accent font-bold shadow-inner">
              U
            </div>
            <div className="flex-1 overflow-hidden">
              <p className="text-sm font-bold truncate text-text-primary">Simulated User</p>
              <p className="text-[11px] font-medium text-text-muted mt-0.5 truncate">Zerodha · Groww</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative z-20 h-screen overflow-y-auto">
        <header className="sticky top-0 z-40 bg-surface/60 backdrop-blur-xl h-20 flex items-center justify-end px-10 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-4">
            <div className="text-xs font-bold text-text-primary flex items-center gap-2 px-4 py-2 rounded-full bg-white shadow-sm border border-border">
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
