'use server';

import { prisma } from './db';
import { revalidatePath } from 'next/cache';

export async function getDashboardData() {
  const user = await prisma.user.findUnique({ where: { pan: 'ABCDE1234F' } });
  if (!user) return null;

  const accounts = await prisma.linkedAccount.findMany({
    where: { userId: user.id },
    include: { holdings: true }
  });

  const holdings = accounts.flatMap(a => a.holdings.map(h => ({ ...h, broker: a.broker })));
  
  return {
    user,
    accounts,
    holdings
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
