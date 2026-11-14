import type { Metadata } from "next";
import { getMemberDetailReport, getMissionFilterOptions, getReportMemberIds } from "@/lib/api/mission-reports";
import { MemberDetailReport } from "./_components/member-detail-report";

export const metadata: Metadata = { title: "สรุปรายงานรายสมาชิก" };

export async function generateStaticParams() {
  return (await getReportMemberIds()).map((memberId) => ({ memberId }));
}

// Original URL: /mission/report-mission-member-detail/<memberId> (member link on /mission/report)
export default async function MemberDetailPage({ params }: { params: Promise<{ memberId: string }> }) {
  const { memberId } = await params;
  const [missions, firstData] = await Promise.all([
    getMissionFilterOptions(),
    getMemberDetailReport(memberId, { search: "", dates: null, missionId: null, category: null, maker: null }),
  ]);
  return (
    <>
      <MemberDetailReport memberId={memberId} missions={missions} initialData={firstData} />
      {/* .main-content also holds the member id for the page script */}
      <input type="hidden" id="hiddenMemberId" defaultValue={memberId} />
    </>
  );
}
