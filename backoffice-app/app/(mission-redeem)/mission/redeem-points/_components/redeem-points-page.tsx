"use client";
/* eslint-disable @next/next/no-img-element -- original markup: plain <img> */

import {
  DateRangeFilter,
  Pagination,
  TableLoading,
  useCustomPopupAlert,
  useOffcanvas,
  useSystemPopup,
} from "@/components/ui";
import { useT } from "@/lib/i18n";
import { getRedeemHistory, type RedeemConditions, type RedeemFilters, type RedeemHistoryRow } from "@/lib/api/mission-reports";
// Shared with the mission report pages (same filter row and table behaviour)
import { FilterGradientDefs } from "@/app/(mission-reports)/mission/_components/report-cells";
import { SearchColumn } from "@/app/(mission-reports)/mission/_components/report-filters";
import { ReportCalendarIcon } from "@/app/(mission-reports)/mission/_components/report-icons";
import { useReportTable } from "@/app/(mission-reports)/mission/_components/use-report-table";
import { MakerFilter } from "./maker-filter";
import { RedeemConditionsOffcanvas } from "./redeem-conditions-offcanvas";
import { ConditionsGearIcon, ExchangeIcon, RedeemHistoryIcon } from "./redeem-icons";
import { RedeemModal } from "./redeem-modal";

type Filters = RedeemFilters & { offset: number; limit: number };

type RedeemPointsPageProps = {
  makers: string[];
  conditions: RedeemConditions;
  initialData: { rows: RedeemHistoryRow[]; total: number };
};

const INITIAL_FILTERS: Filters = { search: "", dates: null, maker: null, offset: 0, limit: 10 };

// /mission/redeem-points — แต้มแลกรางวัล: redeem history table + "เงื่อนไขการแลกรางวัล" panel + "แลกรางวัล" popup
export function RedeemPointsPage({ makers, conditions, initialData }: RedeemPointsPageProps) {
  const t = useT();
  const table = useReportTable(getRedeemHistory, INITIAL_FILTERS, initialData);
  const conditionsPanel = useOffcanvas();
  const redeemPopup = useSystemPopup();
  const [popupAlert, popupAlertHolder] = useCustomPopupAlert();
  const { filters, data, loading } = table;
  const filter = (patch: Partial<Filters>) => table.update({ ...patch, offset: 0 });

  // recordRedeemCondition() success popup (page script read on staging 15/11/2026)
  const showConditionsSaved = () =>
    popupAlert.show({
      title: "บันทึกเงื่อนไขการแลกของรางวัล สำเร็จ !",
      type: "edit-3",
      message: (
        <>
          {" "}
          ระบบทำการบันทึกรายละเอียดเงื่อนไข
          <br /> การแลกของรางวัลสำเร็จแล้ว{" "}
        </>
      ),
      needConfirmation: false,
    });

  return (
    <>
      <div className="page-content">
        <div className="container-fluid full-container">
          <FilterGradientDefs />
          <div className="inner-container full-flex">
            <div className="custom-card full-card full-flex">
              <div className="w-title mb-3">
                <h4 className="mb-0 mission-page">{t("missionPointsPage.title", "แต้มแลกรางวัล")}</h4>
                <div className="group-btn gap-4">
                  <button className="mission-btn-outline" onClick={conditionsPanel.show}>
                    <ConditionsGearIcon />
                    <span className="mission-page">{t("missionPointsPage.rewardCondition", "เงื่อนไขการแลกรางวัล")}</span>
                  </button>
                  <button className="mission-btn" onClick={redeemPopup.open}>
                    <ExchangeIcon />
                    <span className="mission-page">{t("missionPointsPage.rewardExchange", "แลกรางวัล")}</span>
                  </button>
                </div>
              </div>
              <h3 className="ps-4 mb-4">
                <RedeemHistoryIcon />
                <span className="mission-page">{t("missionPointsPage.rewardExchangeHistory", "ประวัติการใช้แต้มแลกรางวัล")}</span>
              </h3>
              <div className="row align-items-center gx-2 mb-3">
                <SearchColumn onSearch={(search) => filter({ search })} />
                <div className="col-auto">
                  <DateRangeFilter
                    id="filterCreatedDate"
                    inputId="datepickerCreatedDate"
                    title={t("missionPointsPage.date", "วันที่")}
                    titleClassName="mission-page"
                    icon={<ReportCalendarIcon />}
                    onChange={(dates) => {
                      if (dates.length === 2) filter({ dates: { from: dates[0], to: dates[1] } });
                      else if (dates.length === 0) filter({ dates: null });
                    }}
                  />
                </div>
                <div className="col-auto">
                  <MakerFilter makers={makers} value={filters.maker} onChange={(maker) => filter({ maker })} />
                </div>
              </div>
              <div id="redeemHistoryTable" className="redeem-point-table system-table table-height table-full">
                <TableLoading
                  show={loading}
                  titleKey="missionPointsPage.findingData"
                  textKey="missionPointsPage.findingDataText"
                  textClassName="mission-page"
                />
                {!loading && (
                  <>
                    <div className="table-scrollable">
                      <table className="h-100">
                        <thead>
                          <tr>
                            <th className="w-0 mission-page">{t("missionPointsPage.dateUsed", "วัน/เวลาที่ใช้")}</th>
                            <th className="mission-page">{t("missionPointsPage.user", "ยูสเซอร์")}</th>
                            <th className="text-end mission-page">{t("missionPointsPage.pointsBefore", "แต้มก่อนแลก")}</th>
                            <th className="text-end mission-page">{t("missionPointsPage.pointsExchange", "แต้มที่แลก")}</th>
                            <th className="text-end mission-page">{t("missionPointsPage.pointsAfter", "แต้มหลังแลก")}</th>
                            <th className="mission-page">{t("missionPointsPage.reward", "รางวัลที่แลก")}</th>
                            <th className="w-0 text-center mission-page">{t("missionPointsPage.editedUser", "ผู้ทำรายการ")}</th>
                          </tr>
                        </thead>
                        <tbody>
                          {data.rows.length === 0 ? (
                            <tr className="border-0">
                              <td colSpan={7}>
                                <img
                                  className="d-block mx-auto mb-4"
                                  width="100"
                                  src="/assets/images/mission/redeem-not-found.png"
                                  draggable="false"
                                  alt="redeem not found"
                                />
                                <h3 className="text-center mb-1 mission-page">{t("missionPointsPage.title", "แต้มแลกรางวัล")}</h3>
                                <p className="text-center">
                                  <span className="mission-page">{t("missionPointsPage.tableSubText1", "ตั้งค่าเงื่อนไขการแลกของรางวัล")}</span>
                                  <br />
                                  <span className="mission-page">
                                    {t("missionPointsPage.tableSubText2", "เพื่อให้สมาชิกสามารถใช้แต้มแลกของรางวัลได้")}
                                  </span>
                                </p>
                              </td>
                            </tr>
                          ) : (
                            // Row markup was never captured (no rows on staging): a guess in the report-table style
                            data.rows.map((row) => (
                              <tr key={row.id}>
                                <td>
                                  {row.date}
                                  <br />
                                  <small>{row.time}</small>
                                </td>
                                <td>{row.username}</td>
                                <td className="text-end">{row.pointsBefore.toLocaleString()}</td>
                                <td className="text-end">{row.pointsUsed.toLocaleString()}</td>
                                <td className="text-end">{row.pointsAfter.toLocaleString()}</td>
                                <td>{row.reward}</td>
                                <td className="text-center">
                                  <span className="system-badge badge-primary">{row.maker}</span>
                                </td>
                              </tr>
                            ))
                          )}
                        </tbody>
                      </table>
                    </div>
                    <Pagination
                      total={data.total}
                      offset={filters.offset}
                      limit={filters.limit}
                      onOffsetChange={(offset) => table.update({ offset })}
                      onLimitChange={(limit) => table.update({ limit, offset: 0 })}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
        {/* #redeemModal sits at the end of .page-content on the original */}
        <RedeemModal control={redeemPopup} onSaved={table.refresh} />
      </div>
      <RedeemConditionsOffcanvas control={conditionsPanel} initial={conditions} onSaved={showConditionsSaved} />
      {popupAlertHolder}
    </>
  );
}
