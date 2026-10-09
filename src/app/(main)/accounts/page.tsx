import { prisma } from "@/lib/db";
import AccountsClient from "./AccountsClient";
import { connection } from "next/server";

export const instant = false;

export default async function AccountsPage() {
  await connection();
  const user = await prisma.user.findUnique({ where: { pan: 'ABCDE1234F' } });
  
  const accounts = user ? await prisma.linkedAccount.findMany({
    where: { userId: user.id },
    include: { holdings: true, _count: { select: { trades: true } } }
  }) : [];
  
  return <AccountsClient initialAccounts={accounts} />;
}
