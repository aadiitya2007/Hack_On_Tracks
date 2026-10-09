import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Investment Dashboard',
  description: 'A unified investment dashboard for Indian retail investors.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} bg-background text-foreground min-h-screen flex`}>
        {/* Persistent Left Sidebar */}
        <aside className="w-64 border-r border-border bg-background/50 backdrop-blur-xl hidden md:flex flex-col">
          <div className="p-6 border-b border-border">
            <h1 className="text-xl font-bold bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">InvestDash</h1>
          </div>
          <nav className="flex-1 p-4 space-y-2">
            <a href="/dashboard" className="block px-4 py-2 rounded-lg bg-primary/10 text-primary font-medium">Dashboard</a>
            <a href="/accounts" className="block px-4 py-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-slate-200 transition-colors">Accounts</a>
            <a href="/explore" className="block px-4 py-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-slate-200 transition-colors">Explore</a>
            <a href="/time-machine" className="block px-4 py-2 rounded-lg hover:bg-secondary/50 text-muted-foreground hover:text-slate-200 transition-colors">Time Machine</a>
          </nav>
        </aside>

        <div className="flex-1 flex flex-col min-h-screen relative">
          {/* Top Bar */}
          <header className="h-16 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-10 flex items-center justify-between px-6">
            <div className="flex items-center gap-4">
              <input 
                type="search" 
                placeholder="Search assets..." 
                className="bg-card border border-border rounded-full px-4 py-1.5 text-sm focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-all w-64 hidden sm:block"
              />
            </div>
            <div className="flex items-center gap-4">
              <span className="text-xs text-muted-foreground hidden sm:inline-block">Last synced: Just now</span>
              <button className="p-2 rounded-full hover:bg-secondary transition-colors text-muted-foreground">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/></svg>
              </button>
              <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-blue-500 to-emerald-500 cursor-pointer"></div>
            </div>
          </header>
          
          <main className="flex-1 p-6 md:p-8 max-w-[1280px] w-full mx-auto">
            {children}
          </main>
        </div>
      </body>
    </html>
  );
}
