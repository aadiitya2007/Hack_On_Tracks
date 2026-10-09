import { cn } from "@/lib/utils";
import Link from "next/link";
import { LayoutDashboard, WalletCards, Compass, History, Settings, Search, Bell } from "lucide-react";

export default function MainLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen">
      {/* Ambient Glows */}
      <div className="ambient-glow-violet -top-40 -left-20"></div>
      <div className="ambient-glow-cyan top-40 right-0"></div>

      {/* Sidebar */}
      <aside className="w-[260px] border-r border-white/5 bg-[#070B14]/80 backdrop-blur-xl flex flex-col fixed inset-y-0 left-0 z-50">
        <div className="p-6 flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center border border-primary/50 shadow-[0_0_12px_rgba(124,58,237,0.3)]">
            <div className="w-3 h-3 rounded-full bg-accent animate-pulse"></div>
          </div>
          <span className="font-display font-bold text-xl tracking-tight">VaultIQ<span className="text-accent">.</span></span>
        </div>

        <nav className="flex-1 px-4 py-4 flex flex-col gap-2">
          <NavLink href="/dashboard" icon={<LayoutDashboard size={18} />} label="Dashboard" active />
          <NavLink href="/accounts" icon={<WalletCards size={18} />} label="Linked Accounts" badge="4 Live" />
          <NavLink href="/explore" icon={<Compass size={18} />} label="Explore" />
          <NavLink href="/time-machine" icon={<History size={18} />} label="Time Machine" />
          
          <div className="mt-auto">
            <NavLink href="/settings" icon={<Settings size={18} />} label="Settings" />
          </div>
        </nav>
        
        <div className="p-4 border-t border-white/5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-success shadow-[0_0_8px_rgba(16,229,160,0.6)] animate-pulse"></div>
              <span className="text-xs font-semibold text-foreground/80">4 Brokers Live</span>
            </div>
            <span className="text-[10px] text-success font-medium">240ms</span>
          </div>
          <p className="text-[10px] text-foreground/40 mt-1 truncate">Zerodha · Groww · Angel · Upstox</p>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 pl-[260px] flex flex-col min-h-screen relative z-10">
        {/* Topbar */}
        <header className="h-[72px] border-b border-white/5 bg-[#070B14]/60 backdrop-blur-md flex items-center justify-between px-8 sticky top-0 z-40">
          <div className="flex items-center gap-8">
            <div className="relative group">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 group-focus-within:text-accent transition-colors" />
              <input type="text" placeholder="Search..." className="bg-white/5 border border-white/10 rounded-full pl-9 pr-4 py-1.5 text-sm w-64 focus:outline-none focus:border-accent/50 focus:ring-1 focus:ring-accent/50 transition-all placeholder:text-foreground/30" />
            </div>

            <div className="hidden md:flex items-center gap-4 text-xs font-medium border-l border-white/10 pl-6">
              <div className="flex gap-2">
                <span className="text-foreground/50">NIFTY 50</span>
                <span className="text-success tabular-nums">24,834.15 (+0.62%)</span>
              </div>
              <div className="flex gap-2">
                <span className="text-foreground/50">SENSEX</span>
                <span className="text-success tabular-nums">81,392.40 (+0.54%)</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2 text-xs text-foreground/60">
              <div className="w-1.5 h-1.5 rounded-full bg-accent"></div>
              Last synced: Today, 3:24 PM IST
            </div>
            
            <button className="flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors text-sm font-medium">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-accent"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21v-5h5"/></svg>
              Sync All
            </button>

            <button className="relative text-foreground/60 hover:text-foreground transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-destructive border-2 border-background"></span>
            </button>
            
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-primary to-secondary p-[1px]">
              <div className="w-full h-full rounded-full bg-background overflow-hidden">
                <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="Avatar" className="w-full h-full object-cover" />
              </div>
            </div>
          </div>
        </header>

        <div className="p-8 relative">
          {children}
        </div>
      </main>
    </div>
  );
}

function NavLink({ href, icon, label, active, badge }: { href: string, icon: React.ReactNode, label: string, active?: boolean, badge?: string }) {
  return (
    <Link href={href} className={cn("flex items-center justify-between px-3 py-2.5 rounded-xl transition-all group", active ? "bg-white/5 border border-white/10 text-foreground shadow-[0_0_20px_rgba(124,58,237,0.1)]" : "text-foreground/60 hover:bg-white/5 hover:text-foreground")}>
      <div className="flex items-center gap-3">
        <div className={cn("transition-colors", active ? "text-primary" : "group-hover:text-primary")}>
          {icon}
        </div>
        <span className="text-sm font-medium">{label}</span>
      </div>
      {badge && (
        <span className="px-2 py-0.5 rounded-full bg-success/10 text-success text-[10px] font-bold border border-success/20">{badge}</span>
      )}
    </Link>
  )
}
