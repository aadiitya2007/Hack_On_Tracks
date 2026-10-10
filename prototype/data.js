
window.AppData = {
  user: { name: "Aaditya A.", panMasked: "ABCDE****F", lastSynced: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }) },
  portfolio: { totalValue: 1234567.89, totalInvested: 980000.00, todayChange: 14500.25, todayChangePct: 1.18, overallChange: 254567.89, overallChangePct: 25.97 },
  assetAllocation: [
    { name: "Stocks", value: 650000, color: "var(--color-stocks)" },
    { name: "Mutual Funds", value: 300000, color: "var(--color-mf)" },
    { name: "Bonds", value: 150000, color: "var(--color-bonds)" },
    { name: "REITs", value: 80000, color: "var(--color-reits)" },
    { name: "ETFs", value: 54567.89, color: "var(--color-etfs)" }
  ],
  chartSeries: {
    "1M": [1180000, 1195000, 1182000, 1205000, 1215000, 1220000, 1234567.89],
    "6M": [950000, 980000, 1020000, 1100000, 1080000, 1180000, 1234567.89],
    "1Y": [850000, 890000, 920000, 900000, 980000, 1050000, 1120000, 1100000, 1150000, 1190000, 1220000, 1234567.89],
    "ALL": [500000, 550000, 600000, 580000, 700000, 800000, 850000, 1000000, 1100000, 1234567.89]
  },
  holdings: [
    { id: 1, symbol: "RELIANCE", name: "Reliance Industries", assetClass: "Stocks", broker: "Zerodha", quantity: 50, avgPrice: 2420.00, ltp: 2985.40, source: "Live API" },
    { id: 2, symbol: "HDFCBANK", name: "HDFC Bank Ltd", assetClass: "Stocks", broker: "Zerodha", quantity: 120, avgPrice: 1510.00, ltp: 1680.50, source: "Live API" },
    { id: 3, symbol: "TCS", name: "Tata Consultancy", assetClass: "Stocks", broker: "Upstox", quantity: 20, avgPrice: 3410.00, ltp: 4120.00, source: "Live API" },
    { id: 4, symbol: "RELIANCE", name: "Reliance Industries", assetClass: "Stocks", broker: "Groww", quantity: 25, avgPrice: 2310.00, ltp: 2985.40, source: "Statement" },
    { id: 5, symbol: "PARAGPPF", name: "PPFAS Flexi Cap", assetClass: "Mutual Funds", broker: "Angel One", quantity: 1500.45, avgPrice: 50.12, ltp: 68.40, source: "Live API" },
    { id: 6, symbol: "SGBAUG28", name: "SGB Aug 2028", assetClass: "Bonds", broker: "NSDL", quantity: 20, avgPrice: 5120.00, ltp: 6250.00, source: "Mail Sync" }
  ],
  riskProfile: { score: 58, category: "Moderate", volatility: 0.145, maxDrawdown: 0.18, hhi: 2150, var1d: 14500, var1m: 65000 },
  brokers: [
    { name: "Groww", id: "groww", color: "#00d09c", connected: true },
    { name: "Zerodha", id: "zerodha", color: "#387ed1", connected: true },
    { name: "Upstox", id: "upstox", color: "#542a8b", connected: true },
    { name: "Angel One", id: "angel", color: "#ff5722", connected: false },
    { name: "NSDL", id: "nsdl", color: "#00478e", connected: true }
  ],
  predictionData: [
    { symbol: "RELIANCE", prob: 54, accuracy: 52, f1: 53, ltp: 2985.40 },
    { symbol: "HDFCBANK", prob: 48, accuracy: 51, f1: 50, ltp: 1680.50 },
    { symbol: "TCS", prob: 56, accuracy: 54, f1: 55, ltp: 4120.00 },
    { symbol: "INFY", prob: 51, accuracy: 50, f1: 49, ltp: 1450.00 }
  ],
  timeMachineAssets: [
    { id: 'reliance', name: 'Reliance (Large Cap)', series: [100, 110, 105, 125, 140, 135, 160, 180, 210, 250], startYear: 2014 },
    { id: 'nifty', name: 'Nifty 50 ETF', series: [100, 112, 115, 122, 130, 135, 145, 155, 165, 180], startYear: 2014 },
    { id: 'bond', name: 'Govt Bond (10Y)', series: [100, 107, 114.5, 122.5, 131, 140, 150, 160.5, 171.7, 183.7], startYear: 2014 },
    { id: 'reit', name: 'Embassy REIT', series: [100, 105, 95, 110, 115, 120, 125, 135], startYear: 2018 }
  ],
  lessons: [
    { id: 'stocks', title: 'STOCKS', subtitle: 'Own a Piece of a Company', icon: '📈', content: [
      { type: 'text', val: 'Imagine a company is a huge pizza. Each share is a slice.' },
      { type: 'dialogue', val: [
        { sender: 'Meera', text: 'Ready to learn about stocks?' },
        { sender: 'Aarav', text: 'Yes, but aren\'t they risky?' },
        { sender: 'Meera', text: 'They carry higher risk than bonds, but historically offer higher long-term rewards.' }
      ]},
      { type: 'takeaway', val: 'High risk, high potential reward.' }
    ]},
    { id: 'mutual-funds', title: 'MUTUAL FUNDS', subtitle: 'Invest Through a Basket', icon: '🧺', content: [
      { type: 'text', val: 'Pools money from many investors to buy a diversified basket.' },
      { type: 'dialogue', val: [
        { sender: 'Meera', text: 'Mutual funds give you instant diversification.' },
        { sender: 'Aarav', text: 'So I don\'t have to pick individual stocks?' },
        { sender: 'Meera', text: 'Exactly. A fund manager does it for you.' }
      ]}
    ]}
  ],
  quiz: [
    { q: "What represents ownership in a company?", options: ["Bond", "Stock", "REIT", "FD"], ans: 1 },
    { q: "Which offers instant diversification managed by professionals?", options: ["Mutual Fund", "Single Stock", "Gold", "Savings Account"], ans: 0 },
    { q: "When interest rates rise, existing bond prices usually:", options: ["Rise", "Fall", "Stay exactly same", "Double"], ans: 1 }
  ],
  tourSteps: [
    { target: '#sidebar', title: 'Navigation', text: 'Access all your financial tools from this unified sidebar.' },
    { target: '#tot-val', title: 'Dashboard', text: 'Real-time aggregation of your net worth across all linked brokers.' },
    { target: '#holdings-table', title: 'Smart Ledger', text: 'We parse emails, APIs, and statements into one single ledger.' },
    { target: '#theme-toggle', title: 'Visuals', text: 'Everything is carefully designed. Toggle dark mode here.' }
  ]
};
