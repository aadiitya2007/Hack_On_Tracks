import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
async function main() {
  console.log("Users:", await prisma.user.count());
  console.log("Holdings:", await prisma.holding.count());
  console.log("PriceHistory:", await prisma.priceHistory.count());
}
main().finally(() => prisma.$disconnect());
