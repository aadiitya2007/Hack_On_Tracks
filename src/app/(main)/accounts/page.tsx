import { prisma } from "@/lib/db";
import AccountsClient from "./AccountsClient";
import { connection } from "next/server";

export const instant = false;

export default async function AccountsPage() {
  await connection();
  let accounts: any[] = [];

  try {
    const user = await prisma.user.findUnique({ where: { pan: 'ABCDE1234F' } });
    if (user) {
      const rawAccounts = await prisma.linkedAccount.findMany({
        where: { userId: user.id },
        include: { holdings: true }
      });
      accounts = JSON.parse(JSON.stringify(rawAccounts));
    }
  } catch (e) {
    console.error("Accounts DB read error, using demo client fallback:", e);
  }

  return <AccountsClient initialAccounts={accounts} />;
}
