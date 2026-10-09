import { normalizeHolding, NormalizedHolding } from './index';

export function normalizeUpstoxHoldings(rawHoldings: any[]): NormalizedHolding[] {
  // Maps Upstox specific API fields
  return rawHoldings.map(h => normalizeHolding(h, 'Upstox'));
}
