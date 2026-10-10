window.AppData = {
  user: {
    name: "Aaditya A.",
    panMasked: "ABCDE****F",
    lastSynced: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' })
  },
  portfolio: {
    totalValue: 1234567.89,
    totalInvested: 980000.00,
    todayChange: 14500.25,
    todayChangePct: 1.18,
    overallChange: 254567.89,
    overallChangePct: 25.97,
  },
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
  riskProfile: {
    score: 58,
    category: "Moderate",
    volatility: 0.145,
    maxDrawdown: 0.18,
    hhi: 2150,
    var1d: 14500,
    var1m: 65000
  },
  brokers: [
    { name: "Groww", id: "groww", color: "#00d09c", connected: true },
    { name: "Zerodha", id: "zerodha", color: "#387ed1", connected: true },
    { name: "Upstox", id: "upstox", color: "#542a8b", connected: true },
    { name: "Angel One", id: "angel", color: "#ff5722", connected: false },
    { name: "NSDL", id: "nsdl", color: "#00478e", connected: true }
  ]
};
