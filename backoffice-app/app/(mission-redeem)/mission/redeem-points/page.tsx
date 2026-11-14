import type { Metadata } from "next";
import { getRedeemConditions, getRedeemHistory, getRedeemMakers } from "@/lib/api/mission-reports";
import { RedeemPointsPage } from "./_components/redeem-points-page";

// Document title not captured; the page heading is used
export const metadata: Metadata = { title: "แต้มแลกรางวัล" };

// Original URL: /mission/redeem-points — แต้มแลกรางวัล
export default async function MissionRedeemPointsPage() {
  const [makers, conditions, firstPage] = await Promise.all([
    getRedeemMakers(),
    getRedeemConditions(),
    getRedeemHistory({ search: "", dates: null, maker: null, offset: 0, limit: 10 }),
  ]);
  return <RedeemPointsPage makers={makers} conditions={conditions} initialData={firstPage} />;
}
