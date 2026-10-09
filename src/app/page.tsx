export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center h-full text-center space-y-6 mt-20">
      <h1 className="text-4xl md:text-6xl font-bold tracking-tight">
        Welcome to <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-emerald-400">InvestDash</span>
      </h1>
      <p className="text-slate-400 text-lg md:text-xl max-w-2xl">
        The unified investment dashboard for Indian retail investors. 
        Track your stocks, mutual funds, bonds, and more in one place.
      </p>
      
      <div className="flex gap-4 mt-8">
        <a 
          href="/login" 
          className="px-6 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)]"
        >
          Login to Demo
        </a>
        <a 
          href="/accounts" 
          className="px-6 py-3 rounded-lg bg-slate-800 hover:bg-slate-700 text-white font-medium transition-all"
        >
          Simulated View
        </a>
      </div>

      <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl text-left w-full">
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full bg-blue-500/20 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-blue-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Unified Tracking</h3>
          <p className="text-slate-400 text-sm">See all your investments across Zerodha, Upstox, Groww, and CDSL in a single view.</p>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full bg-emerald-500/20 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Time Machine</h3>
          <p className="text-slate-400 text-sm">Simulate past investments and see how they would have performed today.</p>
        </div>
        <div className="p-6 rounded-2xl bg-slate-900/50 border border-slate-800 backdrop-blur-sm">
          <div className="w-12 h-12 rounded-full bg-purple-500/20 flex items-center justify-center mb-4">
            <svg className="w-6 h-6 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
          </div>
          <h3 className="text-xl font-semibold mb-2">Secure & Private</h3>
          <p className="text-slate-400 text-sm">No Aadhaar or full PAN stored. Read-only access through Account Aggregator.</p>
        </div>
      </div>
    </div>
  );
}
