import { normalizeHolding, NormalizedHolding } from './index';

export function normalizeZerodhaHoldings(rawHoldings: any[]): NormalizedHolding[] {
  // In a real app, this maps Zerodha's specific Kite API fields (like 'average_price', 'last_price', 'tradingsymbol')
  return rawHoldings.map(h => normalizeHolding(h, 'Zerodha'));
}
