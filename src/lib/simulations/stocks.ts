export type StockSimEvent = {
  month: number;
  price: number;
  news?: string;
  isPositive?: boolean;
};

// Pure function for reproducibility and testing
export function simulateStocks(initialPrice: number, volatility: number, months: number = 12): StockSimEvent[] {
  const events: StockSimEvent[] = [];
  let currentPrice = initialPrice;
  
  // Deterministic "randomness" for tests (simple LCG)
  let seed = 12345;
  const random = () => {
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280;
  };

  events.push({ month: 0, price: currentPrice, news: 'Investment started' });

  for (let i = 1; i <= months; i++) {
    // Random walk with drift
    const drift = 1.005; // slight upward drift
    const shock = (random() - 0.5) * volatility; 
    currentPrice = currentPrice * drift * (1 + shock);
    
    let news: string | undefined;
    let isPositive: boolean | undefined;

    if (i === 3 && shock > 0.05) {
      news = 'New product launch successful!';
      isPositive = true;
    } else if (i === 6 && shock < -0.05) {
      news = 'Supply chain issues reported. Profits dip.';
      isPositive = false;
    } else if (i === 9) {
      news = 'Company declares ₹15 dividend per share.';
      isPositive = true;
    }

    events.push({ month: i, price: Math.round(currentPrice * 100) / 100, news, isPositive });
  }

  return events;
}
