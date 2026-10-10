export const instant = false;

import { connection } from "next/server";

import { getDashboardData } from "@/lib/actions";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  await connection();
  const data = await getDashboardData();

  return <DashboardClient initialData={data} />;
}
