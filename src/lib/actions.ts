'use server';

import { PrismaClient } from '@prisma/client';
import { normalizeZerodhaHoldings } from './adapters/zerodha';
import { normalizeUpstoxHoldings } from './adapters/upstox';
import { normalizeGrowwHoldings } from './adapters/groww';
import { normalizeHolding } from './adapters/index';

const prisma = new PrismaClient();

export async function getDashboardData() {
  try {
    const user = await prisma.user.findFirst({
      include: {
        linkedAccounts: {
          include: {
            broker: true,
            holdings: true,
          }
        }
      }
    });

    if (!user) return { error: 'No user found' };

    let allHoldings: any[] = [];
    
    user.linkedAccounts.forEach((acc: any) => {
      const brokerName = acc.broker.name.toLowerCase();
      
      let normalized;
      if (brokerName === 'zerodha') {
        normalized = normalizeZerodhaHoldings(acc.holdings);
      } else if (brokerName === 'upstox') {
        normalized = normalizeUpstoxHoldings(acc.holdings);
      } else if (brokerName === 'groww') {
        normalized = normalizeGrowwHoldings(acc.holdings);
      } else {
        normalized = acc.holdings.map((h: any) => normalizeHolding(h, acc.broker.name));
      }
      
      allHoldings = [...allHoldings, ...normalized];
    });

    return { holdings: allHoldings };
  } catch (error) {
    console.error('Error fetching dashboard data:', error);
    return { error: 'Failed to fetch dashboard data' };
  }
}

export async function simulateTrade(symbol: string, brokerName: string, side: 'BUY' | 'SELL', qty: number, price: number) {
  try {
    const broker = await prisma.broker.findFirst({ where: { name: brokerName } });
    if (!broker) return { error: 'Broker not found' };

    const account = await prisma.linkedAccount.findFirst({ where: { brokerId: broker.id } });
    if (!account) return { error: 'Linked account not found' };

    await prisma.trade.create({
      data: {
        linkedAccountId: account.id,
        symbol,
        side,
        quantity: qty,
        price,
      }
    });

    const existingHolding = await prisma.holding.findFirst({
      where: { linkedAccountId: account.id, symbol }
    });

    if (existingHolding) {
      if (side === 'BUY') {
        const newQty = existingHolding.quantity + qty;
        const totalCost = (existingHolding.quantity * (existingHolding.avgBuyPrice || existingHolding.currentPrice)) + (qty * price);
        const newAvg = totalCost / newQty;

        await prisma.holding.update({
          where: { id: existingHolding.id },
          data: {
            quantity: newQty,
            avgBuyPrice: newAvg
          }
        });
      } else {
        const newQty = existingHolding.quantity - qty;
        if (newQty <= 0) {
          await prisma.holding.delete({ where: { id: existingHolding.id } });
        } else {
          await prisma.holding.update({
            where: { id: existingHolding.id },
            data: { quantity: newQty }
          });
        }
      }
    } else if (side === 'BUY') {
      await prisma.holding.create({
        data: {
          linkedAccountId: account.id,
          symbol,
          isin: 'MOCK-ISIN',
          assetType: 'STOCK',
          quantity: qty,
          avgBuyPrice: price,
          currentPrice: price,
        }
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error simulating trade:', error);
    return { error: 'Failed to simulate trade' };
  }
}
