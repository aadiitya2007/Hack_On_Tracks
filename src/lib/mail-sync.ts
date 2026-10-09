'use server';
import { prisma } from './db';
import { revalidatePath } from 'next/cache';

// Mock DEMO Inbox Data
const DEMO_INBOX = [
  {
    id: 'msg_1',
    date: new Date(Date.now() - 5 * 86400000), // 5 days ago
    sender: 'contract-notes@zerodha.com',
    subject: 'Contract Note - ZERODHA - EQ - 04/11/2023',
    body: 'Dear Investor, Attached is your contract note. Trade details: BUY 20 INFY @ 1500.00. STT: 3.00, Brokerage: 20.00.'
  },
  {
    id: 'msg_2',
    date: new Date(Date.now() - 2 * 86400000), // 2 days ago
    sender: 'contract-notes@groww.in',
    subject: 'Groww: Contract Note for 07/11/2023',
    body: 'Trade confirmed: SELL 10 TCS @ 4000.00. Net amount credited to ledger.'
  },
  {
    id: 'msg_3',
    date: new Date(Date.now() - 1 * 86400000), // 1 day ago
    sender: 'alerts@upstox.com',
    subject: 'Upstox Contract Note - Action Required (Password Protected)',
    body: 'BUY 50 RELIANCE @ 2800.00. This is a password protected document.'
  }
];

export async function getMailSyncStatus() {
  const user = await prisma.user.findUnique({ where: { pan: 'ABCDE1234F' } });
  if (!user) return null;

  const mailAccount = await prisma.linkedAccount.findFirst({
    where: { userId: user.id, broker: 'Mail Sync' }
  });

  return {
    isConfigured: !!mailAccount,
    lastSynced: mailAccount?.lastSynced || null,
    account: mailAccount
  };
}

export async function runDemoMailSync() {
  const user = await prisma.user.findUnique({ where: { pan: 'ABCDE1234F' } });
  if (!user) throw new Error('User not found');

  let account = await prisma.linkedAccount.findFirst({
    where: { userId: user.id, broker: 'Mail Sync' }
  });

  if (!account) {
    account = await prisma.linkedAccount.create({
      data: { userId: user.id, broker: 'Mail Sync', status: 'CONNECTED', syncSource: 'MAIL' }
    });
  }

  let processedCount = 0;

  // Process the DEMO_INBOX
  for (const msg of DEMO_INBOX) {
    // Very simple heuristic parser for the hackathon demo
    const buyMatch = msg.body.match(/BUY\s+(\d+)\s+([A-Z]+)\s+@\s+([\d.]+)/);
    const sellMatch = msg.body.match(/SELL\s+(\d+)\s+([A-Z]+)\s+@\s+([\d.]+)/);

    let type = '';
    let qty = 0;
    let symbol = '';
    let price = 0;

    if (buyMatch) {
      type = 'BUY';
      qty = parseInt(buyMatch[1]);
      symbol = buyMatch[2];
      price = parseFloat(buyMatch[3]);
    } else if (sellMatch) {
      type = 'SELL';
      qty = parseInt(sellMatch[1]);
      symbol = sellMatch[2];
      price = parseFloat(sellMatch[3]);
    }

    if (type && symbol && qty && price) {
      // 1. Record Trade
      await prisma.trade.create({
        data: {
          userId: user.id,
          accountId: account.id,
          symbol,
          type,
          quantity: qty,
          price,
          source: 'Mail Sync',
          date: msg.date
        }
      });

      // 2. Update/Create Holding
      const existing = await prisma.holding.findUnique({
        where: { accountId_symbol: { accountId: account.id, symbol } }
      });

      if (existing) {
        let newQty = existing.quantity;
        let newAvg = existing.avgBuyPrice || price;

        if (type === 'BUY') {
          const oldVal = newQty * newAvg;
          newQty += qty;
          newAvg = (oldVal + (qty * price)) / newQty;
        } else {
          newQty -= qty;
          if (newQty < 0) newQty = 0;
        }

        await prisma.holding.update({
          where: { id: existing.id },
          data: { quantity: newQty, avgBuyPrice: newAvg, currentPrice: price } // Set current to last traded
        });
      } else if (type === 'BUY') {
        await prisma.holding.create({
          data: {
            userId: user.id,
            accountId: account.id,
            symbol,
            isin: 'MAIL' + Date.now(),
            assetType: 'EQUITY',
            quantity: qty,
            avgBuyPrice: price,
            currentPrice: price,
            source: 'Mail Sync'
          }
        });
      }
      processedCount++;
    }
  }

  await prisma.linkedAccount.update({
    where: { id: account.id },
    data: { lastSynced: new Date() }
  });

  revalidatePath('/accounts');
  revalidatePath('/dashboard');
  
  return processedCount;
}

export async function uploadBaselineStatement() {
  const user = await prisma.user.findUnique({ where: { pan: 'ABCDE1234F' } });
  if (!user) throw new Error('User not found');

  let account = await prisma.linkedAccount.findFirst({
    where: { userId: user.id, broker: 'Mail Sync' }
  });

  if (!account) {
    account = await prisma.linkedAccount.create({
      data: { userId: user.id, broker: 'Mail Sync', status: 'PENDING', syncSource: 'STATEMENT' }
    });
  }

  // Mock parsing a statement and adding a baseline holding
  await prisma.holding.create({
    data: {
      userId: user.id,
      accountId: account.id,
      symbol: 'HDFCBANK',
      isin: 'INE040A01034',
      assetType: 'EQUITY',
      quantity: 100,
      avgBuyPrice: 1400,
      currentPrice: 1680.50,
      source: 'Statement'
    }
  });

  revalidatePath('/accounts');
  return true;
}
