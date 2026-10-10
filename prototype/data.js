window.AppData = {
  user: {
    name: "Aaditya A.",
    panMasked: "ABCDE****F",
    lastSynced: "7:45:46 PM"
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
  holdings: [
    { id: 1, symbol: "RELIANCE", assetClass: "Stocks", broker: "Zerodha", quantity: 50, avgPrice: 2420.00, ltp: 2985.40, source: "Live API" },
    { id: 2, symbol: "HDFCBANK", assetClass: "Stocks", broker: "Zerodha", quantity: 120, avgPrice: 1510.00, ltp: 1680.50, source: "Live API" },
    { id: 3, symbol: "TCS", assetClass: "Stocks", broker: "Upstox", quantity: 20, avgPrice: 3410.00, ltp: 4120.00, source: "Live API" },
    { id: 4, symbol: "RELIANCE", assetClass: "Stocks", broker: "Groww", quantity: 25, avgPrice: 2310.00, ltp: 2985.40, source: "Statement" },
    { id: 5, symbol: "PARAGPPF", assetClass: "Mutual Funds", broker: "Angel One", quantity: 1500.45, avgPrice: 50.12, ltp: 68.40, source: "Live API" },
    { id: 6, symbol: "SGBAUG28", assetClass: "Bonds", broker: "NSDL", quantity: 20, avgPrice: 5120.00, ltp: 6250.00, source: "Mail Sync" }
  ],
  riskProfile: {
    score: 58,
    category: "Moderate",
    volatility: 0.145,
    maxDrawdown: 0.18,
    hhi: 2150,
    var1d: 14500,
    var1m: 65000
  }
};
