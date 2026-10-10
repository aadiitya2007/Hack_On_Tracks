export type PricePoint = {
  date: Date;
  price: number;
};

// Calculate Compound Annual Growth Rate
export function calculateCAGR(startValue: number, endValue: number, years: number): number {
  if (years <= 0 || startValue <= 0) return 0;
  return Math.pow(endValue / startValue, 1 / years) - 1;
}

// Calculate Annualised Volatility
export function calculateVolatility(prices: PricePoint[]): number {
  if (prices.length < 2) return 0;
  const returns: number[] = [];
  for (let i = 1; i < prices.length; i++) {
    const prev = prices[i - 1].price;
    const curr = prices[i].price;
    if (prev > 0) {
      returns.push((curr - prev) / prev);
    }
  }
  
  const mean = returns.reduce((a, b) => a + b, 0) / returns.length;
  const variance = returns.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / (returns.length - 1);
  const dailyVol = Math.sqrt(variance);
  
  // Annualize (252 trading days)
  return dailyVol * Math.sqrt(252);
}

// Calculate Maximum Drawdown
export function calculateDrawdown(prices: PricePoint[]): { maxDrawdown: number, peakDate: Date | null, troughDate: Date | null } {
  if (prices.length === 0) return { maxDrawdown: 0, peakDate: null, troughDate: null };
  
  let maxDrawdown = 0;
  const peak = prices[0].price;
  let peakDate = prices[0].date;
  
  let currentPeak = peak;
  let currentPeakDate = peakDate;
  let troughDate = prices[0].date;

  for (let i = 1; i < prices.length; i++) {
    const currentPrice = prices[i].price;
    if (currentPrice > currentPeak) {
      currentPeak = currentPrice;
      currentPeakDate = prices[i].date;
    }
    
    const drawdown = (currentPeak - currentPrice) / currentPeak;
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
      peakDate = currentPeakDate;
      troughDate = prices[i].date;
    }
  }
  
  return { maxDrawdown, peakDate, troughDate };
}

// Calculate Calendar Year Returns
export function calculateCalendarReturns(prices: PricePoint[]): { year: string, returnPct: number }[] {
  if (prices.length === 0) return [];
  
  const byYear: Record<number, PricePoint[]> = {};
  for (const p of prices) {
    const y = p.date.getFullYear();
    if (!byYear[y]) byYear[y] = [];
    byYear[y].push(p);
  }
  
  const results = [];
  for (const y of Object.keys(byYear).map(Number).sort()) {
    const yearPrices = byYear[y].sort((a, b) => a.date.getTime() - b.date.getTime());
    if (yearPrices.length > 0) {
      const start = yearPrices[0].price;
      const end = yearPrices[yearPrices.length - 1].price;
      results.push({
        year: y.toString(),
        returnPct: (end - start) / start
      });
    }
  }
  return results;
}

// Basic XIRR implementation (Newton-Raphson)
export function calculateXIRR(cashflows: { amount: number, date: Date }[]): number {
  if (cashflows.length < 2) return 0;
  
  // Sort by date
  const sorted = [...cashflows].sort((a, b) => a.date.getTime() - b.date.getTime());
  const t0 = sorted[0].date.getTime();
  
  // Function to calculate NPV given rate
  const npv = (rate: number) => {
    return sorted.reduce((sum, cf) => {
      const days = (cf.date.getTime() - t0) / (1000 * 60 * 60 * 24);
      const years = days / 365;
      return sum + cf.amount / Math.pow(1 + rate, years);
    }, 0);
  };

  // Derivative of NPV
  const dNpv = (rate: number) => {
    return sorted.reduce((sum, cf) => {
      const days = (cf.date.getTime() - t0) / (1000 * 60 * 60 * 24);
      const years = days / 365;
      return sum - (years * cf.amount) / Math.pow(1 + rate, years + 1);
    }, 0);
  };

  // Newton-Raphson iteration
  let rate = 0.1; // 10% guess
  for (let i = 0; i < 100; i++) {
    const currentNpv = npv(rate);
    if (Math.abs(currentNpv) < 0.0001) return rate;
    
    const currentDNpv = dNpv(rate);
    if (currentDNpv === 0) break;
    
    const newRate = rate - currentNpv / currentDNpv;
    if (Math.abs(newRate - rate) < 0.000001) return newRate;
    rate = newRate;
  }
  
  return rate; // Return approximation if didn't strictly converge
}
