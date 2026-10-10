'use server';

import { prisma } from './db';
import { revalidatePath } from 'next/cache';

export async function getDashboardData() {
  try {
    const user = await prisma.user.findUnique({ where: { pan: 'ABCDE1234F' } });
    if (user) {
      const accounts = await prisma.linkedAccount.findMany({
        where: { userId: user.id },
        include: { holdings: true }
      });
      const holdings = accounts.flatMap(a => a.holdings.map(h => ({ ...h, broker: a.broker })));
      return { user, accounts, holdings };
    }
  } catch (e) {
    console.error('DB read failed, using demo fallback:', e);
  }

  // Fallback demo data so the dashboard always loads
  return {
    user: { id: 'demo', pan: 'ABCDE1234F', name: 'Demo User', createdAt: new Date(), updatedAt: new Date() },
    accounts: [
      { id: 'a1', userId: 'demo', broker: 'Zerodha', status: 'CONNECTED', createdAt: new Date(), updatedAt: new Date(), holdings: [] },
      { id: 'a2', userId: 'demo', broker: 'Groww', status: 'CONNECTED', createdAt: new Date(), updatedAt: new Date(), holdings: [] },
    ],
    holdings: [
      { id: 'h1', userId: 'demo', accountId: 'a1', symbol: 'RELIANCE', isin: 'INE002A01018', assetType: 'EQUITY', quantity: 50, avgBuyPrice: 2420, currentPrice: 2985.40, createdAt: new Date(), updatedAt: new Date(), broker: 'Zerodha' },
      { id: 'h2', userId: 'demo', accountId: 'a1', symbol: 'HDFCBANK', isin: 'INE040A01034', assetType: 'EQUITY', quantity: 120, avgBuyPrice: 1510, currentPrice: 1680.50, createdAt: new Date(), updatedAt: new Date(), broker: 'Zerodha' },
      { id: 'h3', userId: 'demo', accountId: 'a1', symbol: 'TCS', isin: 'INE467B01029', assetType: 'EQUITY', quantity: 20, avgBuyPrice: 3410, currentPrice: 4120, createdAt: new Date(), updatedAt: new Date(), broker: 'Zerodha' },
      { id: 'h4', userId: 'demo', accountId: 'a2', symbol: 'RELIANCE', isin: 'INE002A01018', assetType: 'EQUITY', quantity: 25, avgBuyPrice: 2310, currentPrice: 2985.40, createdAt: new Date(), updatedAt: new Date(), broker: 'Groww' },
      { id: 'h5', userId: 'demo', accountId: 'a2', symbol: 'PPFAS', isin: 'INF179KC1DP4', assetType: 'MUTUAL_FUND', quantity: 1500.45, avgBuyPrice: 50.12, currentPrice: 68.40, createdAt: new Date(), updatedAt: new Date(), broker: 'Groww' },
    ]
  };
}

export async function simulateTradeAction(symbol: string, broker: string, action: 'BUY' | 'SELL', quantity: number, price: number) {
  const user = await prisma.user.findUnique({ where: { pan: 'ABCDE1234F' } });
  if (!user) throw new Error('User not found');

  const account = await prisma.linkedAccount.findFirst({ where: { userId: user.id, broker } });
  if (!account) throw new Error('Broker not found');

  // Create trade
  await prisma.trade.create({
    data: {
      userId: user.id,
      accountId: account.id,
      symbol,
      type: action,
      quantity,
      price,
      source: 'Practice'
    }
  });

  // Update holding
  const existing = await prisma.holding.findUnique({
    where: { accountId_symbol: { accountId: account.id, symbol } }
  });

  if (existing) {
    let newQty = existing.quantity;
    let newAvg = existing.avgBuyPrice || price;

    if (action === 'BUY') {
      const oldVal = newQty * newAvg;
      const newVal = quantity * price;
      newQty += quantity;
      newAvg = (oldVal + newVal) / newQty;
    } else {
      newQty -= quantity;
      // if qty <= 0 we could delete, but let's just set to 0 for tracking
      if (newQty < 0) newQty = 0;
    }

    await prisma.holding.update({
      where: { id: existing.id },
      data: { quantity: newQty, avgBuyPrice: newAvg }
    });
  } else if (action === 'BUY') {
    await prisma.holding.create({
      data: {
        userId: user.id,
        accountId: account.id,
        symbol,
        isin: 'MOCK' + Date.now(), // Fake ISIN
        assetType: 'EQUITY',
        quantity,
        avgBuyPrice: price,
        currentPrice: price
      }
    });
  }

  revalidatePath('/dashboard');
}
