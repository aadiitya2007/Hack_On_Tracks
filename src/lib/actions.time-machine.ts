/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';

import { prisma } from './db';

export async function getAvailableSymbols() {
  const symbols = await prisma.priceHistory.findMany({
    select: { symbol: true },
    distinct: ['symbol'],
    orderBy: { symbol: 'asc' }
  });
  return symbols.map(s => s.symbol);
}

export async function getPriceHistory(symbol: string, startDate?: string, endDate?: string) {
  const where: any = { symbol };
  
  if (startDate || endDate) {
    where.date = {};
    if (startDate) where.date.gte = new Date(startDate);
    if (endDate) where.date.lte = new Date(endDate);
  }

  const prices = await prisma.priceHistory.findMany({
    where,
    select: { date: true, close: true },
    orderBy: { date: 'asc' }
  });

  return prices.map(p => ({
    date: p.date.toISOString(),
    price: p.close
  }));
}
