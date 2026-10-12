import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("Wiping database...");
  await prisma.holding.deleteMany({});
  await prisma.linkedAccount.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.priceHistory.deleteMany({});

  console.log("Creating fresh demo user & multi-broker accounts...");
  const user = await prisma.user.create({
    data: { pan: 'ABCDE1234F', name: 'Aditya Aggarwal' }
  });

  const brokerData = [
    {
      broker: 'Zerodha Kite',
      holdings: [
        { symbol: 'RELIANCE', isin: 'INE002A01018', assetType: 'EQUITY', quantity: 90, avgBuyPrice: 2420, currentPrice: 2985.40 },
        { symbol: 'TCS', isin: 'INE467B01029', assetType: 'EQUITY', quantity: 65, avgBuyPrice: 3410, currentPrice: 4120.00 },
        { symbol: 'HDFCBANK', isin: 'INE040A01034', assetType: 'EQUITY', quantity: 80, avgBuyPrice: 1510, currentPrice: 1680.50 },
        { symbol: 'NIFTYBEES', isin: 'INF732E01015', assetType: 'ETF', quantity: 300, avgBuyPrice: 235, currentPrice: 268.50 },
      ]
    },
    {
      broker: 'Groww',
      holdings: [
        { symbol: 'INFY', isin: 'INE009A01021', assetType: 'EQUITY', quantity: 120, avgBuyPrice: 1580, currentPrice: 1890.20 },
        { symbol: 'BAJFINANCE', isin: 'INE296A01024', assetType: 'EQUITY', quantity: 25, avgBuyPrice: 6600, currentPrice: 7210.00 },
        { symbol: 'PPFAS', isin: 'INF846K01164', assetType: 'MUTUAL_FUND', quantity: 2500, avgBuyPrice: 58.15, currentPrice: 78.42 },
      ]
    },
    {
      broker: 'Upstox Pro',
      holdings: [
        { symbol: 'TATAMOTORS', isin: 'INE155A01022', assetType: 'EQUITY', quantity: 200, avgBuyPrice: 820, currentPrice: 940.50 },
        { symbol: 'SBIN', isin: 'INE062A01020', assetType: 'EQUITY', quantity: 150, avgBuyPrice: 740, currentPrice: 820.00 },
        { symbol: 'GOLDBEES', isin: 'INF732E01031', assetType: 'ETF', quantity: 800, avgBuyPrice: 54, currentPrice: 64.20 },
      ]
    },
    {
      broker: 'Angel One',
      holdings: [
        { symbol: 'ITC', isin: 'INE154A01025', assetType: 'EQUITY', quantity: 350, avgBuyPrice: 415, currentPrice: 475.20 },
        { symbol: 'BHARTIARTL', isin: 'INE397D01024', assetType: 'EQUITY', quantity: 90, avgBuyPrice: 1280, currentPrice: 1450.00 },
        { symbol: 'RECLTD', isin: 'INE020B01018', assetType: 'EQUITY', quantity: 250, avgBuyPrice: 480, currentPrice: 535.80 },
      ]
    }
  ];

  for (const b of brokerData) {
    const acc = await prisma.linkedAccount.create({
      data: {
        userId: user.id,
        broker: b.broker,
        status: 'CONNECTED',
        syncSource: 'API'
      }
    });

    for (const h of b.holdings) {
      await prisma.holding.create({
        data: {
          userId: user.id,
          accountId: acc.id,
          symbol: h.symbol,
          isin: h.isin,
          assetType: h.assetType,
          quantity: h.quantity,
          avgBuyPrice: h.avgBuyPrice,
          currentPrice: h.currentPrice,
          source: 'API'
        }
      });
    }
  }

  console.log("Seeding synthetic 2-year PriceHistory for all symbols...");
  const symbols = [
    'RELIANCE', 'TCS', 'HDFCBANK', 'INFY', 'BAJFINANCE', 
    'TATAMOTORS', 'SBIN', 'ITC', 'BHARTIARTL', 'PPFAS', 
    'NIFTYBEES', 'GOLDBEES', 'RECLTD'
  ];
  
  let batch = [];
  const now = new Date();
  
  for (const sym of symbols) {
    let price = sym === 'TCS' ? 3000 : sym === 'RELIANCE' ? 2400 : sym === 'BAJFINANCE' ? 6200 : 1000;
    for (let i = 504; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      if (d.getDay() === 0 || d.getDay() === 6) continue;
      
      const volatility = 0.015;
      const drift = 0.0005;
      const shock = Math.random() < 0.05 ? (Math.random() - 0.5) * 0.05 : 0;
      price = price * (1 + drift + (Math.random() - 0.5) * volatility + shock);
      
      batch.push({ symbol: sym, date: d, close: price, assetClass: 'EQUITY' });

      if (batch.length >= 1000) {
        await prisma.priceHistory.createMany({ data: batch });
        batch = [];
      }
    }
  }
  if (batch.length > 0) {
    await prisma.priceHistory.createMany({ data: batch });
  }

  console.log("Multi-broker seed complete! Added 4 brokers (Zerodha, Groww, Upstox, Angel One), realistic holdings, and price history.");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => await prisma.$disconnect());
