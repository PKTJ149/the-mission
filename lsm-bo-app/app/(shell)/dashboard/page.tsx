import type { Metadata } from "next";
import { getDashboard } from "@/lib/api/dashboard";
import { DashboardPage } from "./_components/dashboard-page";

export const metadata: Metadata = { title: "LSM-SYSTEM:" };

// Original URL: /dashboard ("กระดานแดชบอร์ด")
export default async function Dashboard() {
  const data = await getDashboard();
  return <DashboardPage initialData={data} />;
}
