import { normalizeHolding, NormalizedHolding } from './index';

export function normalizeGrowwHoldings(rawHoldings: any[]): NormalizedHolding[] {
  // Maps Groww specific API fields
  return rawHoldings.map(h => normalizeHolding(h, 'Groww'));
}
