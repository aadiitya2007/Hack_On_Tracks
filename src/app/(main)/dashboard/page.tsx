export const instant = false;

import { connection } from "next/server";


import { getDashboardData } from "@/lib/actions";
import DashboardClient from "./DashboardClient";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  await connection();
  const data = await getDashboardData();
  
  if (!data) {
    redirect("/onboarding");
  }

  return <DashboardClient initialData={data} />;
}
