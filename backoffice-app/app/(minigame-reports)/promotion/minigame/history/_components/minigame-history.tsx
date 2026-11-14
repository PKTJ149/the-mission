"use client";

import { useState, type MouseEvent } from "react";
import {
  DateRangeFilter,
  EmptyState,
  FilterDropdown,
  Pagination,
  SearchInput,
  TableLoading,
  useCustomModal,
  useOffcanvas,
  type DropdownItem,
  type Select2Option,
} from "@/components/ui";
import { useT } from "@/lib/i18n";
import { changeRightsStatus, getRightsRows, type RightsRow } from "@/lib/api/minigame-reports";
import { AutoRefresh } from "@/app/(minigame-reports)/_components/auto-refresh";
import { CalendarIcon, CategoryIcon, MakerIcon, PersonGearIcon, PlusCircleIcon, TagIcon } from "@/app/(minigame-reports)/_components/report-icons";
import { useTooltip } from "@/app/(minigame-reports)/_components/tooltip";
import { useTableRequest } from "@/app/(minigame-reports)/_components/use-table-request";
import { ConfirmChangeStatusModal, StatusMenu, type ChangeStatusVariant } from "./change-status";
import { HistoryTable } from "./history-table";
import { ManualPromotionOffcanvas } from "./manual-promotion-offcanvas";

type RightsPage = { rows: RightsRow[]; total: number };

type Query = {
  search: string;
  category: string | null;
  status: string | null;
  makeBy: string | null;
  agent: string | null;
  dates: Date[];
  offset: number;
  limit: number;
};

const INITIAL_QUERY: Query = { search: "", category: null, status: null, makeBy: null, agent: null, dates: [], offset: 0, limit: 10 };

// Set inline by the original JS: 264px at a 1704px viewport, ~175px at 1111px — about 15.5vw
const SEARCH_STYLE = { flexBasis: "15.5vw" };

// /promotion/minigame/history — ประวัติการรับ/ใช้สิทธิ์มินิเกมส์
export function MinigameHistory({ initialPage, miniGames }: { initialPage: RightsPage; miniGames: Select2Option[] }) {
  const t = useT();
  const tooltip = useTooltip();
  const table = useTableRequest();
  const manual = useOffcanvas();
  const confirmWaiting = useCustomModal();
  const confirmAccepted = useCustomModal();

  const [query, setQuery] = useState<Query>(INITIAL_QUERY);
  const [page, setPage] = useState(initialPage);
  // The search box is uncontrolled like the original; a new key re-creates it with a new value
  const [searchInput, setSearchInput] = useState({ key: 0, value: "" });
  // Open change-status dropdown: the clicked label and its row
  const [menu, setMenu] = useState<{ anchor: HTMLElement; row: RightsRow; variant: ChangeStatusVariant } | null>(null);
  const [confirmRow, setConfirmRow] = useState<RightsRow | null>(null);
  const [modalKey, setModalKey] = useState(0);

  const request = (next: Query) => {
    setQuery(next);
    setMenu(null); // its label is about to be replaced
    tooltip.hide(); // so are the rows under the pointer (table.js disposes tooltips too)
    table.run(getRightsRows(next), setPage);
  };
  const update = (patch: Partial<Query>) => request({ ...query, offset: 0, ...patch });
  const refresh = () => request(query);

  // shortcutSearchCustomer(username)
  const searchCustomer = (username: string) => {
    setSearchInput((current) => ({ key: current.key + 1, value: username }));
    update({ search: username });
  };

  // openDropdownChangeStatus(this, '', id): clicking the same label again closes it
  const toggleMenu = (event: MouseEvent<HTMLSpanElement>, row: RightsRow) => {
    const anchor = event.currentTarget;
    if (menu?.row.id === row.id) setMenu(null);
    else setMenu({ anchor, row, variant: row.status === "accept" ? "CancelPromotion" : "" });
  };

  const pickStatus = (value: string) => {
    const current = menu;
    setMenu(null);
    // The first item is the current status; only "ยกเลิก" needs the confirm modal
    if (!current || value !== "Cancel") return;
    setConfirmRow(current.row);
    setModalKey((key) => key + 1);
    (current.variant === "" ? confirmWaiting : confirmAccepted).open();
  };

  const confirmCancel = async (control: ReturnType<typeof useCustomModal>, remark: string) => {
    control.close();
    if (!confirmRow) return;
    await changeRightsStatus(confirmRow.id, "rejected", remark);
    refresh();
  };

  const categoryItems: DropdownItem[] = [
    { value: "auto", chip: "auto", label: t("reportPromotionMinigameHistory.auto", "Auto") },
    { value: "manual", chip: "manual", label: t("reportPromotionMinigameHistory.manual", "Manual") },
    { value: "promotion", chip: "promotion", label: t("reportPromotionMinigameHistory.promotion", "โปรโมชั่นหลัก") },
    { value: "mini-game", chip: "mini-game", label: t("reportPromotionMinigameHistory.minigame", "มินิเกมส์") },
  ];
  const statusItems: DropdownItem[] = [
    { value: "accept", chip: "accept", label: t("reportPromotionMinigameHistory.accept", "ใช้โปรแล้ว") },
    { value: "waiting", chip: "waiting", label: t("reportPromotionMinigameHistory.waiting", "รอใช้โปร") },
    { value: "expired", chip: "expired", label: t("reportPromotionMinigameHistory.expired", "หมดอายุ") },
    { value: "rejected", chip: "rejected", label: t("reportPromotionMinigameHistory.rejected", "ยกเลิก") },
  ];
  const makeByItems: DropdownItem[] = [
    { value: "auto", chip: "auto", label: "auto" },
    { value: "superx", chip: "superx", label: "superx" },
  ];
  const agentItems: DropdownItem[] = [
    // ORIGINAL: the "all" item uses the page-title key, so it reads "ประวัติการรับ/ใช้สิทธิ์มินิเกมส์" instead of "ทั้งหมด"
    { value: " ", label: t("reportPromotionMinigameHistory.title", "ประวัติการรับ/ใช้สิทธิ์มินิเกมส์") },
    { value: "669", chip: "superxx", label: "superxx" },
    { value: "501", chip: "superx", label: "superx" },
  ];

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
            <div className="custom-card full-card full-flex">
              <div className="title-header-custom-mini-game">
                <h4 className="mb-0">{t("reportPromotionMinigameHistory.title", "ประวัติการรับ/ใช้สิทธิ์มินิเกมส์")}</h4>
              </div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <h4 className="mb-0">{t("reportPromotionMinigameHistory.titleSubText", "รายการรับ/ใช้สิทธิ์มินิเกมส์")}</h4>
                <button className="btn system-btn btn-rounded" onClick={manual.show}>
                  <PlusCircleIcon />
                  <span>{t("reportPromotionMinigameHistory.promotionManual", "เพิ่มโปรให้สมาชิก (Manual)")}</span>
                </button>
              </div>
              <div className="row align-items-center gx-2 mb-3">
                <div className="col-auto" style={SEARCH_STYLE}>
                  {/* ORIGINAL: the × of this search box has id clearValuePromotionCustomerSearch */}
                  <SearchInput
                    key={searchInput.key}
                    id="tableSearch"
                    placeholder={t("reportPromotionMinigameHistory.phSearch", "ค้นหาโปรโมชั่น")}
                    defaultValue={searchInput.value}
                    clearId="clearValuePromotionCustomerSearch"
                    onSearch={(value) => update({ search: value })}
                  />
                </div>
                <div className="col-auto">
                  <DateRangeFilter
                    id="filterDateSummary"
                    inputId="datepickerDateSummary"
                    icon={<CalendarIcon />}
                    title={t("reportPromotionMinigameHistory.dateTimeSummary", "วันที่สรุปข้อมูล :")}
                    onChange={(dates) => update({ dates })}
                  />
                </div>
                <div className="col-auto">
                  <FilterDropdown
                    id="filterCategory"
                    dropdownId="dropdownFilterCategory"
                    icon={<CategoryIcon />}
                    title={t("reportPromotionMinigameHistory.type", "ประเภท :")}
                    defaultText="All"
                    items={categoryItems}
                    value={query.category}
                    onChange={(category) => update({ category })}
                  />
                </div>
                <div className="col-auto">
                  <FilterDropdown
                    id="filterStatus"
                    dropdownId="dropdownFilterStatus"
                    icon={<TagIcon />}
                    title={t("reportPromotionMinigameHistory.status", "สถานะ :")}
                    defaultText="All"
                    items={statusItems}
                    value={query.status}
                    onChange={(status) => update({ status })}
                  />
                </div>
                <div className="col-auto">
                  <FilterDropdown
                    id="filterMakeBy"
                    dropdownId="dropdownFilterMakeBy"
                    icon={<MakerIcon />}
                    title={t("reportPromotionMinigameHistory.editBy", "ผู้ทำรายการ :")}
                    defaultText="All"
                    items={makeByItems}
                    value={query.makeBy}
                    onChange={(makeBy) => update({ makeBy })}
                  />
                </div>
                <div className="col-auto">
                  <FilterDropdown
                    id="filterAgent"
                    dropdownId="dropdownAgent"
                    icon={<PersonGearIcon />}
                    title={t("reportPromotionMinigameHistory.usedAgent", "Agent ที่ใช้งาน :")}
                    defaultText="All"
                    items={agentItems}
                    value={query.agent}
                    onChange={(agent) => update({ agent })}
                  />
                </div>
                <div className="filter-fill"></div>
                <div className="col-auto">
                  <AutoRefresh onRefresh={refresh} />
                </div>
              </div>
              <div id="promotionTable" className="promotion-deposit-table system-table table-full">
                <TableLoading show={table.loading} titleKey="reportPromotionMinigameHistory.waitingText" textKey="reportPromotionMinigameHistory.waitingSubText" />
                {!table.loading && (
                  <>
                    {page.total === 0 ? (
                      <div className="table-scrollable">
                        <EmptyState textClassName="" />
                      </div>
                    ) : (
                      <HistoryTable
                        rows={page.rows}
                        openStatusRowId={menu?.row.id ?? null}
                        onStatusClick={toggleMenu}
                        onSearchCustomer={searchCustomer}
                        tooltip={tooltip}
                      />
                    )}
                    <Pagination
                      total={page.total}
                      offset={query.offset}
                      limit={query.limit}
                      onOffsetChange={(offset) => request({ ...query, offset })}
                      onLimitChange={(limit) => update({ limit })}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <StatusMenu variant="" anchor={menu?.variant === "" ? menu.anchor : null} onPick={pickStatus} onClose={() => setMenu(null)} />
      <ConfirmChangeStatusModal key={`waiting-${modalKey}`} variant="" control={confirmWaiting} onConfirm={(remark) => confirmCancel(confirmWaiting, remark)} />
      <StatusMenu
        variant="CancelPromotion"
        anchor={menu?.variant === "CancelPromotion" ? menu.anchor : null}
        onPick={pickStatus}
        onClose={() => setMenu(null)}
      />
      <ConfirmChangeStatusModal
        key={`accepted-${modalKey}`}
        variant="CancelPromotion"
        control={confirmAccepted}
        onConfirm={(remark) => confirmCancel(confirmAccepted, remark)}
      />
      <ManualPromotionOffcanvas control={manual} miniGames={miniGames} onCreated={refresh} />
      {tooltip.holder}
    </>
  );
}
