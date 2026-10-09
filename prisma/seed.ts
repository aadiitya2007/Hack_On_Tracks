import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Clean existing data for safe re-run
  await prisma.trade.deleteMany()
  await prisma.holding.deleteMany()
  await prisma.consentLog.deleteMany()
  await prisma.priceHistory.deleteMany()
  await prisma.linkedAccount.deleteMany()
  await prisma.broker.deleteMany()
  await prisma.user.deleteMany()

  // 1. Create a demo user
  const user = await prisma.user.create({
    data: {
      maskedPan: 'XXXXX1234X',
      name: 'Demo Investor',
    },
  })

  // 2. Create Brokers
  const zerodha = await prisma.broker.create({
    data: { name: 'Zerodha', type: 'BROKER' },
  })
  const upstox = await prisma.broker.create({
    data: { name: 'Upstox', type: 'BROKER' },
  })
  const groww = await prisma.broker.create({
    data: { name: 'Groww', type: 'BROKER' },
  })
  const cdsl = await prisma.broker.create({
    data: { name: 'CDSL', type: 'DEPOSITORY' },
  })

  // 3. Create Linked Accounts
  const acc1 = await prisma.linkedAccount.create({
    data: {
      userId: user.id,
      brokerId: zerodha.id,
      status: 'ACTIVE',
      source: 'MOCK_API',
    },
  })
  const acc2 = await prisma.linkedAccount.create({
    data: {
      userId: user.id,
      brokerId: upstox.id,
      status: 'ACTIVE',
      source: 'MOCK_API',
    },
  })
  const acc3 = await prisma.linkedAccount.create({
    data: {
      userId: user.id,
      brokerId: groww.id,
      status: 'ACTIVE',
      source: 'STATEMENT_UPLOAD',
    },
  })
  const accCDSL = await prisma.linkedAccount.create({
    data: {
      userId: user.id,
      brokerId: cdsl.id,
      status: 'ACTIVE',
      source: 'MOCK_API',
    },
  })

  // 4. Create Holdings
  // Duplicated stocks across brokers
  await prisma.holding.createMany({
    data: [
      {
        linkedAccountId: acc1.id,
        symbol: 'RELIANCE',
        isin: 'INE002A01018',
        assetType: 'STOCK',
        quantity: 50,
        avgBuyPrice: 2400.5,
        currentPrice: 2950.0,
      },
      {
        linkedAccountId: acc2.id,
        symbol: 'RELIANCE',
        isin: 'INE002A01018',
        assetType: 'STOCK',
        quantity: 25,
        avgBuyPrice: 2500.0,
        currentPrice: 2950.0,
      },
      {
        linkedAccountId: acc1.id,
        symbol: 'HDFCBANK',
        isin: 'INE040A01034',
        assetType: 'STOCK',
        quantity: 100,
        avgBuyPrice: 1550.0,
        currentPrice: 1450.0,
      },
      {
        linkedAccountId: acc3.id,
        symbol: 'HDFCBANK',
        isin: 'INE040A01034',
        assetType: 'STOCK',
        quantity: 150,
        avgBuyPrice: 1600.0,
        currentPrice: 1450.0,
      },
      {
        linkedAccountId: acc1.id,
        symbol: 'EMBASSY',
        isin: 'INE041025011',
        assetType: 'REIT',
        quantity: 200,
        avgBuyPrice: 310.0,
        currentPrice: 375.0,
      },
      {
        linkedAccountId: acc2.id,
        symbol: 'NHAI',
        isin: 'INE906B07738',
        assetType: 'BOND',
        quantity: 10,
        avgBuyPrice: 1000.0,
        currentPrice: 1050.0,
      },
    ],
  })

  // 5. Create Price History (Time Machine)
  const today = new Date()
  const history = []
  const symbols = ['RELIANCE', 'HDFCBANK', 'EMBASSY', 'NHAI']
  const basePrices: Record<string, number> = {
    RELIANCE: 2950,
    HDFCBANK: 1450,
    EMBASSY: 375,
    NHAI: 1050,
  }

  for (const symbol of symbols) {
    let current = basePrices[symbol]
    for (let i = 365 * 5; i >= 0; i -= 30) {
      const date = new Date(today)
      date.setDate(date.getDate() - i)
      history.push({
        symbol,
        date,
        close: current,
      })
      // Random walk backwards
      current = current * (1 - (Math.random() * 0.1 - 0.05))
    }
  }

  await prisma.priceHistory.createMany({
    data: history,
  })

  console.log('Database seeded successfully.')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
