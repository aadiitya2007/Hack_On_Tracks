/* eslint-disable @typescript-eslint/no-explicit-any */
'use server';
import { prisma } from './db';

export async function getPracticeState() {
  const user = await prisma.user.findUnique({ where: { pan: 'ABCDE1234F' } });
  if (!user) return null;
  
  let account = await prisma.linkedAccount.findFirst({
    where: { userId: user.id, broker: 'Practice' },
    include: { holdings: true, trades: true }
  });
  
  if (!account) {
    account = await prisma.linkedAccount.create({
      data: {
        userId: user.id,
        broker: 'Practice',
        status: 'CONNECTED',
        syncSource: 'PRACTICE'
      },
      include: { holdings: true, trades: true }
    });
  }
  return account;
}

export async function savePracticeState(balance: number, holdings: any[]) {
  const user = await prisma.user.findUnique({ where: { pan: 'ABCDE1234F' } });
  if (!user) return;
  const account = await prisma.linkedAccount.findFirst({ where: { userId: user.id, broker: 'Practice' } });
  if (!account) return;

  // For the hackathon demo, we just clear and rewrite practice holdings to avoid complex syncing
  await prisma.holding.deleteMany({ where: { accountId: account.id } });
  
  for (const h of holdings) {
    await prisma.holding.create({
      data: {
        userId: user.id,
        accountId: account.id,
        symbol: h.symbol,
        isin: 'PRAC' + Date.now(),
        assetType: h.assetType,
        quantity: h.quantity,
        avgBuyPrice: h.avgBuyPrice,
        currentPrice: h.currentPrice,
        source: 'Practice'
      }
    });
  }
}
