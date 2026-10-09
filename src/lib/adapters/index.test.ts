import { normalizeHolding } from './index';

describe('Adapter Utils', () => {
  it('should correctly normalize a holding and calculate PnL', () => {
    const raw = {
      id: 'test-1',
      symbol: 'RELIANCE',
      isin: 'INE1',
      assetType: 'STOCK',
      quantity: 10,
      avgBuyPrice: 2500,
      currentPrice: 2950
    };

    const normalized = normalizeHolding(raw, 'Zerodha');

    expect(normalized.symbol).toBe('RELIANCE');
    expect(normalized.broker).toBe('Zerodha');
    expect(normalized.invested).toBe(25000); // 10 * 2500
    expect(normalized.value).toBe(29500); // 10 * 2950
    expect(normalized.pnl).toBe(4500); // 29500 - 25000
    expect(normalized.pnlPercent).toBe(18); // (4500 / 25000) * 100
  });

  it('should handle null avgBuyPrice', () => {
    const raw = {
      id: 'test-2',
      symbol: 'HDFCBANK',
      isin: 'INE2',
      assetType: 'STOCK',
      quantity: 50,
      avgBuyPrice: null,
      currentPrice: 1500
    };

    const normalized = normalizeHolding(raw, 'Upstox');

    expect(normalized.invested).toBeNull();
    expect(normalized.value).toBe(75000); // 50 * 1500
    expect(normalized.pnl).toBeNull();
    expect(normalized.pnlPercent).toBeNull();
  });
});
