"use client";

import { useState, type CSSProperties } from "react";
import {
  DateRangeFilter,
  EmptyState,
  FilterDropdown,
  Pagination,
  SearchInput,
  TableLoading,
  cx,
  useOffcanvas,
  type DropdownItem,
} from "@/components/ui";
import { useT } from "@/lib/i18n";
import {
  getMinigameDetail,
  getMinigameOtherView,
  getMinigameSummary,
  getRightsRows,
  type MinigameDetail,
  type MinigameOtherView,
  type RightsRow,
  type SummaryRow,
  type SummaryTotals,
} from "@/lib/api/minigame-reports";
import { AutoRefresh } from "@/app/(minigame-reports)/_components/auto-refresh";
import {
  BadgeOffIcon,
  BadgeOnIcon,
  CalendarIcon,
  CategoryIcon,
  ExpiredBadgeIcon,
  GameStatusIcon,
  MakerIcon,
  PersonGearIcon,
  TagIcon,
} from "@/app/(minigame-reports)/_components/report-icons";
import { useTooltip } from "@/app/(minigame-reports)/_components/tooltip";
import { useTableRequest } from "@/app/(minigame-reports)/_components/use-table-request";
import { DetailPanel } from "./detail-panel";
import { DetailTable } from "./detail-table";
import { MinigameViewOffcanvas } from "./minigame-view-offcanvas";
import { SummaryTable } from "./summary-table";

type SummaryData = { rows: SummaryRow[]; totals: SummaryTotals };

// Everything the table request sends (table.js filters). gameId = drill-down of that mini-game.
type Query = {
  gameId: string | null;
  search: string; // #tableSearch (summary)
  status: string | null; // สถานะเกมส์ (summary)
  customer: string; // #promotionCustomerSearch (drill-down)
  category: string | null; // ประเภท (drill-down)
  rightsStatus: string | null; // สถานะ (drill-down)
  makeBy: string | null; // ผู้ทำรายการ (drill-down)
  agent: string | null;
  dates: Date[];
  offset: number;
  limit: number;
};

const INITIAL_QUERY: Query = {
  gameId: null,
  search: "",
  status: null,
  customer: "",
  category: null,
  rightsStatus: null,
  makeBy: null,
  agent: null,
  dates: [],
  offset: 0,
  limit: 10,
};

const HIDDEN: CSSProperties = { display: "none" };
// Set inline by the original JS: 264px at a 1704px viewport, ~175px at 1111px — about 15.5vw
const SEARCH_BASIS = "15.5vw";
const BREADCRUMB_STYLE = { "--breadcrumb-max-width": "260px" } as CSSProperties;

// /report/promotion/minigame: the summary table and, after a row click (nextDetail), the
// per-member drill-down of that mini-game on the same URL.
export function MinigameReport({ initialSummary }: { initialSummary: SummaryData }) {
  const t = useT();
  const tooltip = useTooltip();
  const viewPanel = useOffcanvas();
  const table = useTableRequest();

  const [query, setQuery] = useState<Query>(INITIAL_QUERY);
  const [summary, setSummary] = useState(initialSummary);
  const [rights, setRights] = useState<{ rows: RightsRow[]; total: number }>({ rows: [], total: 0 });
  const [game, setGame] = useState<SummaryRow | null>(null);
  const [detail, setDetail] = useState<MinigameDetail | null>(null);
  const [view, setView] = useState<MinigameOtherView | null>(null);
  // The customer search is uncontrolled like the original; a new key re-creates it with a new value
  const [customerInput, setCustomerInput] = useState({ key: 0, value: "" });

  const inDetail = game !== null;

  const request = (next: Query) => {
    setQuery(next);
    tooltip.hide(); // the rows under the pointer are about to be replaced (table.js disposes tooltips too)
    if (next.gameId) {
      table.run(
        getRightsRows({
          gameId: next.gameId,
          search: next.customer,
          category: next.category,
          status: next.rightsStatus,
          makeBy: next.makeBy,
          agent: next.agent,
          dates: next.dates,
          offset: next.offset,
          limit: next.limit,
        }),
        setRights,
      );
    } else {
      table.run(getMinigameSummary({ search: next.search, status: next.status, agent: next.agent, dates: next.dates }), setSummary);
    }
  };

  // A filter change starts again from the first page
  const update = (patch: Partial<Query>) => request({ ...query, offset: 0, ...patch });
  const refresh = () => request(query);

  // nextDetail(event, name, id)
  const openDetail = (row: SummaryRow) => {
    setGame(row);
    setDetail(null);
    setView(null);
    getMinigameDetail(row.id).then(setDetail);
    update({ gameId: row.id });
  };

  // Breadcrumb "Anonymous"
  const backToSummary = () => {
    setGame(null);
    setDetail(null);
    update({ gameId: null });
  };

  // viewMinigameDetail(): the eye in the drill-down card
  const openView = async () => {
    if (!game) return;
    const data = await getMinigameOtherView(game.id);
    // The lucky-wheel version of this view was not captured on this page, so the wheels' eye does nothing
    if (!data) return;
    setView(data);
    viewPanel.show();
  };

  // shortcutSearchCustomer(username): fill the customer search and search right away
  const searchCustomer = (username: string) => {
    setCustomerInput((current) => ({ key: current.key + 1, value: username }));
    update({ customer: username });
  };

  const statusText: Record<string, string> = {
    active: t("reportPromotionMinigame.on", "เปิดใช้งาน"),
    inactive: t("reportPromotionMinigame.off", "ปิดใช้งาน"),
    expired: t("reportPromotionMinigame.expired", "หมดอายุ"),
  };
  const statusItems: DropdownItem[] = [
    {
      value: "active",
      label: (
        <span className="custom-badge-status text-cyan-60 bg-cyan-10">
          <BadgeOnIcon />
          <span>{statusText.active}</span>
        </span>
      ),
    },
    {
      value: "inactive",
      label: (
        <span className="custom-badge-status text-red-50 bg-red-5">
          <BadgeOffIcon />
          <span>{statusText.inactive}</span>
        </span>
      ),
    },
    {
      value: "expired",
      label: (
        <span className="custom-badge-status text-gray-30 bg-gray-5">
          <ExpiredBadgeIcon />
          <span>{statusText.expired}</span>
        </span>
      ),
    },
  ];
  const agentItems: DropdownItem[] = [
    { value: " ", label: t("reportPromotionMinigame.all", "ทั้งหมด") },
    { value: "669", chip: "superxx", label: "superxx" },
    { value: "501", chip: "superx", label: "superx" },
  ];
  const categoryItems: DropdownItem[] = [
    { value: "auto", chip: "auto", label: t("reportPromotionMinigame.auto", "Auto") },
    { value: "manual", chip: "manual", label: t("reportPromotionMinigame.manual", "Manual") },
    { value: "promotion", chip: "promotion", label: t("reportPromotionMinigame.mainPromotion", "โปรโมชั่นหลัก") },
    { value: "mini-game", chip: "mini-game", label: t("reportPromotionMinigame.minigame", "มินิเกมส์") },
  ];
  const rightsStatusItems: DropdownItem[] = [
    { value: "accept", chip: "accept", label: t("reportPromotionMinigame.used", "ใช้โปรแล้ว") },
    { value: "waiting", chip: "waiting", label: t("reportPromotionMinigame.waiting", "รอใช้โปร") },
    { value: "expired", chip: "expired", label: t("reportPromotionMinigame.expired", "หมดอายุ") },
    { value: "rejected", chip: "rejected", label: t("reportPromotionMinigame.cancel", "ยกเลิก") },
  ];
  const makeByItems: DropdownItem[] = [
    { value: "auto", chip: "auto", label: "auto" },
    { value: "superx", chip: "superx", label: "superx" },
  ];

  const tableContent = () => {
    if (!inDetail) {
      if (summary.rows.length === 0) return <EmptyState textClassName="" />;
      return <SummaryTable rows={summary.rows} totals={summary.totals} onOpen={openDetail} tooltip={tooltip} />;
    }
    return (
      <>
        {rights.total === 0 ? (
          <div className="table-scrollable">
            <EmptyState textClassName="" />
          </div>
        ) : (
          <DetailTable rows={rights.rows} onSearchCustomer={searchCustomer} tooltip={tooltip} />
        )}
        <Pagination
          total={rights.total}
          offset={query.offset}
          limit={query.limit}
          onOffsetChange={(offset) => request({ ...query, offset })}
          onLimitChange={(limit) => update({ limit })}
        />
      </>
    );
  };

  return (
    <>
      <div className="page-content">
        <div className="container-fluid full-container">
          <svg width="0" height="0" viewBox="0 0 0 0" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="filter-gradient" x1="7.91113" y1="0.666748" x2="7.91113" y2="17.3334" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#50A198"></stop>
                <stop offset="1" stopColor="#FEDB6B"></stop>
              </linearGradient>
            </defs>
          </svg>
          <div className="inner-container full-flex">
            {/* Promotion Details */}
            <DetailPanel detail={inDetail ? detail : null} onView={openView} tooltip={tooltip} />
            {/* Table Promotion Minigame */}
            <div className="custom-card-report-minigame full-card full-flex">
              <div className="padding-header-report-minigame">
                <div className="title-header-custom-mini-game">
                  <h4 className="mb-0">{t("reportPromotionMinigame.title", "สรุปรายงานมินิเกมส์")}</h4>
                </div>
                <div className="d-flex align-items-center mb-2">
                  <h4 className="mb-0">{t("reportPromotionMinigame.minigameReport", "รายงานมินิเกมส์ (แยกตามเกมส์)")}</h4>
                  <div id="promotionBreadcrumb" className="custom-breadcrumb ms-3" style={BREADCRUMB_STYLE}>
                    <a className={cx("bread-item", !inDetail && "active")} data-id="Root" onClick={inDetail ? backToSummary : undefined}>
                      {t("reportPromotionMinigame.subText", "Anonymous")}
                    </a>
                    {game && (
                      <a className="bread-item active" data-id={game.id}>
                        {game.name}
                      </a>
                    )}
                  </div>
                </div>
                <div className="row align-items-center g-2 mb-3">
                  {/* Filter Promotion List */}
                  <div className="col-auto filter-customer" style={inDetail ? { flexBasis: SEARCH_BASIS } : { ...HIDDEN, flexBasis: SEARCH_BASIS }}>
                    <SearchInput
                      key={customerInput.key}
                      id="promotionCustomerSearch"
                      placeholder={t("reportPromotionMinigame.phSearchName", "ค้นหาด้วยชื่อลูกค้า")}
                      defaultValue={customerInput.value}
                      clearId="clearValuePromotionCustomerSearch"
                      onSearch={(value) => update({ customer: value })}
                    />
                  </div>
                  <div className="col-auto filter-promotion" style={inDetail ? { flexBasis: SEARCH_BASIS, ...HIDDEN } : { flexBasis: SEARCH_BASIS }}>
                    <SearchInput
                      id="tableSearch"
                      placeholder={t("reportPromotionMinigame.phSearch", "ค้นหาโปรโมชั่น")}
                      clearId="clearValuePromotionSearch"
                      onSearch={(value) => update({ search: value })}
                    />
                  </div>
                  <div className="col-auto">
                    <DateRangeFilter
                      id="filterDateSummary"
                      inputId="datepickerDateSummary"
                      icon={<CalendarIcon />}
                      title={t("reportPromotionMinigame.dateTimeSummary", "วันที่สรุป")}
                      onChange={(dates) => update({ dates })}
                    />
                  </div>
                  <div className="col-auto filter-promotion" style={inDetail ? HIDDEN : undefined}>
                    <FilterDropdown
                      id="filterStatus"
                      dropdownId="dropdownFilterStatus"
                      icon={<GameStatusIcon />}
                      title={t("reportPromotionMinigame.gameStatus", "สถานะเกมส์ :")}
                      defaultText="All"
                      items={statusItems}
                      fakeValue={(item) => statusText[item.value]}
                      value={query.status}
                      onChange={(status) => update({ status })}
                    />
                  </div>
                  <div className="col-auto">
                    <FilterDropdown
                      id="filterAgent"
                      dropdownId="dropdownAgent"
                      icon={<PersonGearIcon />}
                      title={t("reportPromotionMinigame.usedAgent", "Agent ที่ใช้งาน :")}
                      defaultText="All"
                      items={agentItems}
                      value={query.agent}
                      onChange={(agent) => update({ agent })}
                    />
                  </div>
                  {/* Filter Promotion Detail List */}
                  <div className="col-auto filter-customer" style={inDetail ? undefined : HIDDEN}>
                    <FilterDropdown
                      id="filterCategory"
                      dropdownId="dropdownFilterCategory"
                      icon={<CategoryIcon />}
                      title={t("reportPromotionMinigame.type", "ประเภท :")}
                      defaultText="All"
                      items={categoryItems}
                      value={query.category}
                      onChange={(category) => update({ category })}
                    />
                  </div>
                  <div className="col-auto filter-customer" style={inDetail ? undefined : HIDDEN}>
                    <FilterDropdown
                      id="filterPromotionCustomerStatus"
                      dropdownId="dropdownFilterPromotionCustomerStatus"
                      icon={<TagIcon />}
                      title={t("reportPromotionMinigame.status", "สถานะ :")}
                      defaultText="All"
                      items={rightsStatusItems}
                      value={query.rightsStatus}
                      onChange={(rightsStatus) => update({ rightsStatus })}
                    />
                  </div>
                  <div className="col-auto filter-customer" style={inDetail ? undefined : HIDDEN}>
                    <FilterDropdown
                      id="filterMakeBy"
                      dropdownId="dropdownFilterMakeBy"
                      icon={<MakerIcon />}
                      title={t("reportPromotionMinigame.editBy", "ผู้ทำรายการ :")}
                      defaultText="All"
                      items={makeByItems}
                      value={query.makeBy}
                      onChange={(makeBy) => update({ makeBy })}
                    />
                  </div>
                  {/* EOF Filter Promotion */}
                  <div className="filter-fill"></div>
                  <div className="col-auto">
                    <AutoRefresh onRefresh={refresh} />
                  </div>
                </div>
              </div>
              <div id="promotionTable" className="promotion-deposit-table system-table table-hover table-full">
                <TableLoading show={table.loading} titleKey="reportPromotionMinigame.waitingText" textKey="reportPromotionMinigame.waitingSubText" />
                {!table.loading && tableContent()}
              </div>
            </div>
          </div>
        </div>
      </div>
      <MinigameViewOffcanvas control={viewPanel} view={view} />
      {tooltip.holder}
    </>
  );
}
