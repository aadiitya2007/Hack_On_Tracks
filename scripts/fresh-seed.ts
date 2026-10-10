import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  console.log("Wiping database...");
  await prisma.holding.deleteMany({});
  await prisma.linkedAccount.deleteMany({});
  await prisma.user.deleteMany({});
  await prisma.priceHistory.deleteMany({});

  console.log("Creating fresh demo user & account...");
  const user = await prisma.user.create({
    data: { pan: 'DEMO12345', name: 'Fresh Demo User' }
  });

  const account = await prisma.linkedAccount.create({
    data: { userId: user.id, broker: 'MockBroker', status: 'CONNECTED' }
  });

  console.log("Creating fresh demo holdings...");
  const holdings = [
    { symbol: 'RELIANCE', assetType: 'EQUITY', quantity: 150, currentPrice: 2500 },
    { symbol: 'TCS', assetType: 'EQUITY', quantity: 80, currentPrice: 3500 },
    { symbol: 'HDFCBANK', assetType: 'EQUITY', quantity: 300, currentPrice: 1600 },
    { symbol: 'GOLD_ETF', assetType: 'ETF', quantity: 500, currentPrice: 50 } // Unmapped intentional
  ];

  for (const h of holdings) {
    await prisma.holding.create({
      data: {
        userId: user.id,
        accountId: account.id,
        symbol: h.symbol,
        isin: `INE${h.symbol}`,
        assetType: h.assetType,
        quantity: h.quantity,
        currentPrice: h.currentPrice
      }
    });
  }

  console.log("Seeding synthetic 2-year PriceHistory to ensure all math features work flawlessly...");
  const symbols = ['RELIANCE', 'TCS', 'HDFCBANK', 'INFY'];
  let batch = [];
  const now = new Date();
  
  for (const sym of symbols) {
    let price = sym === 'TCS' ? 3000 : sym === 'RELIANCE' ? 2000 : 1200;
    for (let i = 504; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      if (d.getDay() === 0 || d.getDay() === 6) continue;
      
      // Add realistic drift and volatility
      const volatility = 0.015;
      const drift = 0.0005; // upward drift
      const shock = Math.random() < 0.05 ? (Math.random() - 0.5) * 0.05 : 0; // occasional shocks
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

  console.log("Fresh seed complete! Added User, Holdings, and ~1000 days of correlated PriceHistory.");
}

main()
  .catch(e => { console.error(e); process.exit(1); })
  .finally(async () => await prisma.$disconnect());
