export interface NormalizedHolding {
  id: string;
  symbol: string;
  isin: string;
  assetType: 'STOCK' | 'BOND' | 'REIT' | 'INVIT' | 'ETF';
  quantity: number;
  avgBuyPrice: number | null;
  currentPrice: number;
  broker: string;
  invested: number | null;
  value: number;
  pnl: number | null;
  pnlPercent: number | null;
}

export function normalizeHolding(raw: any, brokerName: string): NormalizedHolding {
  const quantity = Number(raw.quantity);
  const currentPrice = Number(raw.currentPrice);
  const avgBuyPrice = raw.avgBuyPrice ? Number(raw.avgBuyPrice) : null;
  
  const value = quantity * currentPrice;
  const invested = avgBuyPrice !== null ? quantity * avgBuyPrice : null;
  const pnl = invested !== null ? value - invested : null;
  const pnlPercent = invested !== null && invested > 0 ? (pnl! / invested) * 100 : null;

  return {
    id: raw.id,
    symbol: raw.symbol,
    isin: raw.isin,
    assetType: raw.assetType,
    quantity,
    avgBuyPrice,
    currentPrice,
    broker: brokerName,
    invested,
    value,
    pnl,
    pnlPercent
  };
}
