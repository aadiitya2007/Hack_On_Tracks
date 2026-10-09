import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  console.log("Seeding database...")

  // Create mock user
  const user = await prisma.user.upsert({
    where: { pan: 'ABCDE1234F' },
    update: {},
    create: {
      pan: 'ABCDE1234F',
      name: 'Aditya Aggarwal',
    },
  })

  // Create linked accounts
  const brokers = ['Zerodha', 'Groww', 'Upstox', 'CDSL (Depository)']
  for (const broker of brokers) {
    await prisma.linkedAccount.upsert({
      where: { userId_broker: { userId: user.id, broker } },
      update: { status: 'CONNECTED' },
      create: {
        userId: user.id,
        broker,
        status: 'CONNECTED',
      },
    })
  }

  // Fetch created accounts
  const accounts = await prisma.linkedAccount.findMany({ where: { userId: user.id } })
  const zerodha = accounts.find(a => a.broker === 'Zerodha')!
  const groww = accounts.find(a => a.broker === 'Groww')!
  const upstox = accounts.find(a => a.broker === 'Upstox')!
  const cdsl = accounts.find(a => a.broker === 'CDSL (Depository)')!

  // Create holdings with overlapping symbols
  const holdings = [
    { accountId: zerodha.id, symbol: 'RELIANCE', isin: 'INE002A01018', assetType: 'EQUITY', quantity: 90, avgBuyPrice: 2420, currentPrice: 2985.40 },
    { accountId: zerodha.id, symbol: 'TCS', isin: 'INE467B01029', assetType: 'EQUITY', quantity: 65, avgBuyPrice: 3410, currentPrice: 4120.00 },
    { accountId: zerodha.id, symbol: 'HDFCBANK', isin: 'INE040A01034', assetType: 'EQUITY', quantity: 80, avgBuyPrice: 1510, currentPrice: 1680.50 },
    
    { accountId: groww.id, symbol: 'HDFCBANK', isin: 'INE040A01034', assetType: 'EQUITY', quantity: 130, avgBuyPrice: 1510, currentPrice: 1680.50 },
    { accountId: groww.id, symbol: 'PPFAS', isin: 'INF846K01164', assetType: 'MUTUAL_FUND', quantity: 10542, avgBuyPrice: 58.15, currentPrice: 78.42 },
    
    { accountId: upstox.id, symbol: 'INFY', isin: 'INE009A01021', assetType: 'EQUITY', quantity: 120, avgBuyPrice: 1580, currentPrice: 1520.10 },
    { accountId: upstox.id, symbol: 'RELIANCE', isin: 'INE002A01018', assetType: 'EQUITY', quantity: 50, avgBuyPrice: 2420, currentPrice: 2985.40 }, // Same symbol as Zerodha to trigger duplicate alert
  ]

  for (const h of holdings) {
    await prisma.holding.upsert({
      where: { accountId_symbol: { accountId: h.accountId, symbol: h.symbol } },
      update: { currentPrice: h.currentPrice, quantity: h.quantity },
      create: {
        userId: user.id,
        accountId: h.accountId,
        symbol: h.symbol,
        isin: h.isin,
        assetType: h.assetType,
        quantity: h.quantity,
        avgBuyPrice: h.avgBuyPrice,
        currentPrice: h.currentPrice,
      },
    })
  }

  // Create basic MCQ Questions (converted options to JSON string for SQLite)
  const questions = [
    {
      topic: 'Equities',
      difficulty: 'EASY',
      text: 'What does NIFTY 50 represent?',
      options: JSON.stringify(['Top 50 companies on NSE', 'Top 50 global tech stocks', '50 mutual funds', '50 highest dividend stocks']),
      correctIndex: 0,
      explanation: 'NIFTY 50 is a benchmark index representing the weighted average of 50 of the largest Indian companies listed on the National Stock Exchange.'
    },
    {
      topic: 'Bonds',
      difficulty: 'MEDIUM',
      text: 'When interest rates in the economy rise, what happens to existing bond prices?',
      options: JSON.stringify(['They fall', 'They rise', 'They remain unaffected', 'They convert to equity']),
      correctIndex: 0,
      explanation: 'Bond prices and interest rates have an inverse relationship. New bonds will offer higher yields, making existing lower-yielding bonds less attractive.'
    }
  ]

  for (const q of questions) {
    await prisma.question.create({ data: q })
  }

  console.log("Database seeded successfully.")
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
