"use client";

import { useT } from "@/lib/i18n";
import { cx } from "./cx";

type TableLoadingProps = {
  show: boolean;
  // i18n keys differ per page (reportPromotionMinigame.waitingText, missionReportPage.findingDataText …);
  // leave them out for the pages whose markup has plain Thai text
  titleKey?: string;
  textKey?: string;
  textClassName?: string; // e.g. "mission-page"
};

// .table-loading inside a .system-table: table.js toggles it with display none / "".
export function TableLoading({ show, titleKey, textKey, textClassName }: TableLoadingProps) {
  const t = useT();
  const title = "กำลังค้นหาข้อมูล";
  const text = "เรากำลังทำงานอย่างหนัก เพื่อค้นหาข้อมูลให้คุณได้เร็วที่สุด";

  return (
    <div className="table-loading" style={show ? undefined : { display: "none" }}>
      <lord-icon className="loading-icon" src="https://cdn.lordicon.com/msoeawqm.json" trigger="loop"></lord-icon>
      <h5 className={cx("mt-2", textClassName)}>{titleKey ? t(titleKey, title) : title}</h5>
      <p className={cx("text-muted mb-0", textClassName)}>{textKey ? t(textKey, text) : text}</p>
    </div>
  );
}

type EmptyStateProps = {
  titleKey?: string; // default missionReportPage.notFoundInfo
  textKey?: string; // default missionReportPage.notFoundInfoText
  textClassName?: string; // default "mission-page" (as captured); pass "" to drop it
};

// .table-jumbotron "ไม่พบข้อมูลที่ค้นหา" — the only empty state captured (deposit check).
export function EmptyState({
  titleKey = "missionReportPage.notFoundInfo",
  textKey = "missionReportPage.notFoundInfoText",
  textClassName = "mission-page",
}: EmptyStateProps) {
  const t = useT();
  return (
    <div className="table-jumbotron">
      <lord-icon src="https://cdn.lordicon.com/nmgjlgnk.json" trigger="hover"></lord-icon>
      <h5 className={cx("mt-2", textClassName)}>{t(titleKey, "ไม่พบข้อมูลที่ค้นหา")}</h5>
      <p className={cx("text-muted mb-0", textClassName)}>{t(textKey, "ลองเปลี่ยนเงื่อนไขการค้นหานะคะ")}</p>
    </div>
  );
}
