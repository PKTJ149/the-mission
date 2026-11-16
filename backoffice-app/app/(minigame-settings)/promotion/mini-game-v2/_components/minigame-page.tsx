"use client";
/* eslint-disable @next/next/no-img-element, jsx-a11y/alt-text -- original markup: plain <img> without alt */

import { memo, useCallback, useEffect, useMemo, useRef, useState, type ComponentProps, type DragEvent } from "react";
import {
  DateRangeFilter,
  FilterDropdown,
  Pagination,
  SearchInput,
  StatusFilterIcon,
  TableLoading,
  useCustomModal,
  useCustomSweetAlert,
  useOffcanvas,
  type DropdownItem,
} from "@/components/ui";
import { useT } from "@/lib/i18n";
import { getAgents, getMiniGameCreators, getMiniGames, type Agent, type MiniGame, type MiniGameBonusCount, type MiniGameType } from "@/lib/api/mini-games";
import { MiniGameCard } from "./minigame-card";
import { CreateMinigameIcon, DragLinesIcon, PersonFilterIcon, SnackbarCloseIcon } from "./minigame-icons";
import { WheelDetailModal, type WheelDetail } from "./wheel-detail-modal";
import { MinigameSettingOffcanvas, type SettingSession } from "./setting/minigame-setting-offcanvas";

type Filters = {
  search: string;
  dates: Date[];
  status: string | null;
  type: string | null;
  createdBy: string | null;
  agent: string | null;
};

const NO_FILTERS: Filters = { search: "", dates: [], status: null, type: null, createdBy: null, agent: null };

// "ทั้งหมด" items carry " " / "all" as their value: the server treats them as "no filter"
const isAll = (value: string | null) => value === null || value.trim() === "" || value === "all";

// "09/11/2026 13:02" → the calendar day, for the created-date range filter
function dayOf(text: string) {
  const [d, m, y] = text.slice(0, 10).split("/").map(Number);
  return new Date(y, m - 1, d).getTime();
}

function applyFilters(games: MiniGame[], f: Filters) {
  return games.filter((game) => {
    if (f.search && !game.name.toLowerCase().includes(f.search.toLowerCase())) return false;
    if (f.dates.length > 0) {
      const start = new Date(f.dates[0]).setHours(0, 0, 0, 0);
      const end = new Date(f.dates[1] ?? f.dates[0]).setHours(0, 0, 0, 0);
      const day = dayOf(game.createdAt);
      if (day < start || day > end) return false;
    }
    if (!isAll(f.status) && game.status !== f.status) return false;
    if (!isAll(f.type) && game.type !== f.type) return false;
    if (!isAll(f.createdBy) && game.createdBy !== f.createdBy) return false;
    if (!isAll(f.agent) && !game.agentIds.includes(f.agent!)) return false;
    return true;
  });
}

// Pages of the original table.js: every request shows the loader for at least 500 ms
const MIN_LOADING_MS = 500;

// The wizard offcanvas is a very large tree. Re-rendering it on every page state change (create
// menu, popups, filters) made each click lag about a second, while the original reacts at once.
// Skip its re-render unless something it shows changed. useOffcanvas() returns a new control object
// on every render, but only phase / backdrop change what it renders (show / hide are stable).
type SettingOffcanvasProps = ComponentProps<typeof MinigameSettingOffcanvas>;
const StableSettingOffcanvas = memo(
  MinigameSettingOffcanvas,
  (prev: SettingOffcanvasProps, next: SettingOffcanvasProps) =>
    prev.control.phase === next.control.phase &&
    prev.control.backdrop === next.control.backdrop &&
    prev.session === next.session &&
    prev.games === next.games &&
    prev.agents === next.agents &&
    prev.onEdit === next.onEdit &&
    prev.onSaved === next.onSaved,
);

export function MiniGamePage() {
  const t = useT();
  const [swal, swalHolder] = useCustomSweetAlert();
  const wheelModal = useCustomModal();
  const settingPanel = useOffcanvas();

  const [games, setGames] = useState<MiniGame[]>([]);
  const [agents, setAgents] = useState<Agent[]>([]);
  const [creators, setCreators] = useState<string[]>([]);
  const [filters, setFilters] = useState<Filters>(NO_FILTERS);
  const [shownFilters, setShownFilters] = useState<Filters>(NO_FILTERS);
  const [loading, setLoading] = useState(true);
  const [offset, setOffset] = useState(0);
  const [limit, setLimit] = useState(10);
  const [createMenuOpen, setCreateMenuOpen] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [viewingId, setViewingId] = useState<string | null>(null);
  const [wheelDetail, setWheelDetail] = useState<WheelDetail | null>(null);
  const [session, setSession] = useState<SettingSession | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const createButtonRef = useRef<HTMLButtonElement>(null);
  const createMenuRef = useRef<HTMLUListElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let alive = true;
    Promise.all([getMiniGames(), getAgents(), getMiniGameCreators()]).then(([list, agentList, creatorList]) => {
      if (!alive) return;
      setGames(list);
      setAgents(agentList);
      setCreators(creatorList);
    });
    return () => {
      alive = false;
    };
  }, []);

  // table.js requestData(): hide the cards, show the loader, then show the new result
  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => {
      setShownFilters(filters);
      setLoading(false);
    }, MIN_LOADING_MS);
    return () => clearTimeout(timer);
  }, [loading, filters]);

  const refresh = (patch: Partial<Filters>) => {
    setFilters((current) => ({ ...current, ...patch }));
    setOffset(0);
    setLoading(true);
  };

  // Bootstrap dropdown of "สร้างมินิเกมส์": closes on any click outside or Escape
  useEffect(() => {
    if (!createMenuOpen) return;
    const close = (event: MouseEvent | KeyboardEvent) => {
      if (event instanceof KeyboardEvent && event.key !== "Escape") return;
      if (event instanceof MouseEvent && createButtonRef.current?.contains(event.target as Node)) return;
      setCreateMenuOpen(false);
    };
    document.addEventListener("click", close);
    document.addEventListener("keydown", close);
    return () => {
      document.removeEventListener("click", close);
      document.removeEventListener("keydown", close);
    };
  }, [createMenuOpen]);

  const toggleCreateMenu = () => {
    const button = createButtonRef.current;
    // Popper "bottom-start" with Bootstrap's [0, 2] offset, relative to the shared offsetParent
    if (button) setMenuPosition({ x: button.offsetLeft, y: button.offsetTop + button.offsetHeight + 2 });
    setCreateMenuOpen((open) => !open);
  };

  const showPanel = settingPanel.show;
  const hidePanel = settingPanel.hide;
  const openSetting = useCallback(
    (next: Omit<SettingSession, "key">) => {
      setSession({ ...next, key: Date.now() });
      showPanel();
    },
    [showPanel],
  );
  const onEdit = useCallback((game: MiniGame) => openSetting({ action: "edit", type: game.type, game }), [openSetting]);

  const visible = useMemo(() => applyFilters(games, shownFilters), [games, shownFilters]);
  const page = visible.slice(offset, offset + limit);

  // viewMinigameDetail(): spinner in the eye button while POST /api/promotion/lucky-wheel/get/ runs
  const viewDetail = (game: MiniGame) => {
    setViewingId(game.id);
    setTimeout(() => {
      setViewingId(null);
      openSetting({ action: "detail", type: game.type, game });
    }, MIN_LOADING_MS);
  };

  // openModalShowWheelDetail() → viewMinigameDetail(): the modal opens only after
  // POST /api/promotion/lucky-wheel/get/ returns; clicks during that wait are ignored
  // (onloadShowWheelDetail). No spinner is shown for the pill.
  const wheelRequestRunning = useRef(false);
  const showWheelDetail = (game: MiniGame, bonus: MiniGameBonusCount) => {
    if (wheelRequestRunning.current) return;
    wheelRequestRunning.current = true;
    setTimeout(() => {
      wheelRequestRunning.current = false;
      setWheelDetail({ bonus, slice: game.detail.slices[bonus.index - 1] });
      wheelModal.open();
    }, MIN_LOADING_MS);
  };

  // ORIGINAL: changeMinigameStatus(id, this, type) lives in the page's inline script, which was not
  // captured (status toggles were not clicked for safety). The confirm text below is a guess in the
  // style of the other CustomSweetAlerts; cancelling leaves the switch as it was.
  const toggleStatus = async (game: MiniGame, checked: boolean) => {
    const { isConfirmed } = await swal.open({
      type: "saving",
      title: "ยืนยันการเปลี่ยนสถานะมินิเกมส์หรือไม่ ?",
      text: checked ? "มินิเกมส์นี้จะถูกเปิดใช้งานทันทีที่คุณกด “ยืนยัน”" : "มินิเกมส์นี้จะถูกปิดใช้งานทันทีที่คุณกด “ยืนยัน”",
      onConfirm: () => new Promise((resolve) => setTimeout(resolve, MIN_LOADING_MS)),
    });
    if (!isConfirmed) return;
    setGames((list) => list.map((item) => (item.id === game.id ? { ...item, status: checked ? "active" : "inactive" } : item)));
  };

  // CustomDraggable (helper.js:4262): drag a card over the others to re-order them
  const onDragStart = (game: MiniGame) => (event: DragEvent<HTMLDivElement>) => {
    event.dataTransfer.effectAllowed = "move";
    setTimeout(() => setDraggingId(game.id), 0);
  };

  const onDragOver = (event: DragEvent<HTMLDivElement>) => {
    if (!draggingId || !listRef.current) return;
    event.preventDefault();
    const others = Array.from(listRef.current.querySelectorAll<HTMLElement>(".menu-item:not(.dragging)"));
    const next = others.find((el) => {
      const r = el.getBoundingClientRect();
      return event.clientY <= r.top + r.height / 2;
    });
    setGames((list) => {
      const moving = list.find((g) => g.id === draggingId);
      if (!moving) return list;
      const rest = list.filter((g) => g.id !== draggingId);
      const at = next ? rest.findIndex((g) => g.id === next.dataset.draggableId) : rest.length;
      const reordered = [...rest.slice(0, at), moving, ...rest.slice(at)];
      return reordered.every((g, i) => g === list[i]) ? list : reordered;
    });
  };

  const onDragEnd = () => {
    setDraggingId(null);
    // ORIGINAL: onSort posts the new order { id, order } to the mini-game sequence API. Nothing is sent here.
  };

  // swal changes identity on every render; read the latest one when the timer fires
  const swalRef = useRef(swal);
  useEffect(() => {
    swalRef.current = swal;
  });

  const onSaved = useCallback((saved: MiniGame, action: "create" | "edit") => {
    hidePanel();
    setGames((list) => (action === "create" ? [saved, ...list] : list.map((item) => (item.id === saved.id ? saved : item))));
    setLoading(true);
    // Original: the success alert appears 2 s after the offcanvas closes
    setTimeout(() => {
      swalRef.current.open({
        type: "success",
        title: action === "create" ? "บันทึกการสร้างข้อมูลมินิเกมส์ สำเร็จ !" : "บันทึกการแก้ไขข้อมูลมินิเกมส์ สำเร็จ !",
        text: "คุณสามารถกลับเข้ามาแก้ไขข้อมูลมินิเกมส์ของคุณได้ตลอดเวลา ตามที่คุณต้องการ แต่การเปลี่ยนแปลงอะไร บ่อย ๆ ไม่ใช่เรื่องดีนัก คุณอาจจะสร้างความสับสนให้กับสมาชิกของคุณก็เป็นได้ หากมีข้อสงสัยใดสามารถติดต่อ เราได้ที่กลุ่ม Support ของคุณใน Telegram เรามีทีมงานเตรียมพร้อมตอบทุกปัญหาข้อสงสัย ตลอด 24 ชั่วโมง",
        showConfirmButton: false,
        cancelText: "ปิดหน้าต่าง",
      });
    }, 2000);
  }, [hidePanel]);

  const statusItems: DropdownItem[] = [
    { value: "active", label: t("minigameSetting.filterStatusOn", "เปิดใช้งาน") },
    { value: "inactive", label: t("minigameSetting.filterStatusOff", "ปิดใช้งาน") },
  ];
  const typeItems: DropdownItem[] = [
    { value: " ", label: t("minigameSetting.filterTypeAll", "ทั้งหมด") },
    { value: "lucky-wheel", label: t("minigameSetting.filterTypeLuckyWheel", "วงล้อ") },
    { value: "mini-game", label: t("minigameSetting.filterTypeMinigame", "มินิเกมส์") },
  ];
  const creatorItems: DropdownItem[] = [
    { value: "all", type: "all", label: t("minigameSetting.createByAll", "ทั้งหมด") },
    ...creators.map((name) => ({ value: name, label: name })),
  ];
  const agentItems: DropdownItem[] = [
    { value: " ", label: t("minigameSetting.usedByAgentAll", "ทั้งหมด") },
    ...agents.map((agent) => ({ value: agent.value, chip: agent.label, label: agent.label })),
  ];
  // Original fakeValue: item.textContent (the label, not the chip)
  const labelText = (item: DropdownItem) => item.label;

  return (
    <>
      <div className="page-content">
        <div className="container-fluid full-container">
          <svg width="0" height="0" viewBox="0 0 0 0" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="filter-gradient" x1="7.91113" y1="0.666748" x2="7.91113" y2="17.3334" gradientUnits="userSpaceOnUse">
                <stop offset="0" stopColor="#50A198" />
                <stop offset="1" stopColor="#FEDB6B" />
              </linearGradient>
            </defs>
          </svg>
          <div className="inner-container full-flex">
            <div className="custom-card full-card full-flex">
              <div className="title-header-custom-mini-game">
                <h4 className="mb-0" data-i18n="minigameSetting.title">
                  {t("minigameSetting.title", "ตั้งค่ามินิเกมส์")}
                </h4>
              </div>
              <div className="d-flex align-items-center mb-2">
                <h4 className="mb-0" data-i18n="minigameSetting.subTitle">
                  {t("minigameSetting.subTitle", "รายชื่อมินิเกมส์")}
                </h4>
                <div className="snackbar-collapes-group ms-4">
                  {/* ORIGINAL: onclick CustomSnackBar.open('#customSnackbar1') returns early because
                      #customSnackbar1 has no "unseen" class (and sits in a d-none row), so nothing happens. */}
                  <div data-snackbar-collape="customSnackbar1" className="snackbar-collapes unseen minigame-tips">
                    <div className="snackbar-icon">
                      <img src="/assets/images/minigame/Info-icon.png" />
                    </div>
                  </div>
                </div>
                <div className="flex-fill"></div>
                <div>
                  <button
                    ref={createButtonRef}
                    className={createMenuOpen ? "btn system-btn btn-rounded ms-2 show" : "btn system-btn btn-rounded ms-2"}
                    id="btnAddMinigame"
                    data-bs-toggle="dropdown"
                    aria-expanded={createMenuOpen}
                    style={{ width: "168px" }}
                    onClick={toggleCreateMenu}
                  >
                    <CreateMinigameIcon />{" "}
                    <span className="create-minigame-btn" data-i18n="minigameSetting.createBtn">
                      {t("minigameSetting.createBtn", "สร้างมินิเกมส์")}
                    </span>
                  </button>
                  <ul
                    ref={createMenuRef}
                    className={createMenuOpen ? "dropdown-menu p2 fw-500 show" : "dropdown-menu p2 fw-500"}
                    data-popper-placement={createMenuOpen ? "bottom-start" : undefined}
                    style={{
                      background: "rgb(13, 42, 39)",
                      borderRadius: "12px",
                      width: "207px",
                      ...(createMenuOpen && { position: "absolute", inset: "0px auto auto 0px", margin: "0px", transform: `translate(${menuPosition.x}px, ${menuPosition.y}px)` }),
                    }}
                  >
                    <li>
                      <a
                        className="dropdown-item dropdown-item-custom-mini-game"
                        href="#"
                        onClick={(event) => {
                          event.preventDefault();
                          openSetting({ action: "create", type: "lucky-wheel" });
                        }}
                      >
                        <span data-i18n="minigameSetting.createLuckyWheel">{t("minigameSetting.createLuckyWheel", "วงล้อนำโชค")}</span>
                      </a>
                    </li>
                    <li>
                      <a
                        className="dropdown-item dropdown-item-custom-mini-game"
                        href="#"
                        onClick={(event) => {
                          event.preventDefault();
                          openSetting({ action: "create", type: "mini-game" });
                        }}
                      >
                        <span data-i18n="minigameSetting.createMinigame">{t("minigameSetting.createMinigame", "มินิเกมส์อื่น ๆ")}</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </div>
              <div className="d-none gap-3 mb-3">
                <div id="customSnackbar1" className="system-snackbar minigame-tips">
                  <div className="snackbar-icon">
                    <img src="/assets/images/minigame/Info-icon.png" />
                  </div>
                  <div className="snackbar-title">
                    <span className="p3 fw-700">Tips !</span>
                    {" รู้หรือไม่ ? คุณสามารถเรียงลำดับการแสดงมินิเกมส์ที่หน้า เล่นได้เพียงกดที่ไอคอน "}
                    <DragLinesIcon /> แล้วลากไปวางในลำดับที่ต้องการ
                  </div>
                  <div className="snackbar-divider"></div>
                  <button className="snackbar-close">
                    <SnackbarCloseIcon />
                    <div className="p4">ปิดคำแนะนำ</div>
                  </button>
                </div>
              </div>
              <div className="row gx-0 mb-3">
                <div className="col">
                  <div className="row align-items-center g-2">
                    <div className="col-auto" style={{ flexBasis: "264px" }}>
                      <SearchInput
                        id="minigameSearch"
                        placeholder={t("minigameSetting.phSearchMiniGame", "ค้นหาด้วย ชื่อมินิเกมส์")}
                        onSearch={(value) => refresh({ search: value })}
                        // Original × onclick: CustomInput.clearValue(this); tableMinigame.refresh();
                        onClear={() => refresh({ search: "" })}
                      />
                    </div>
                    <div className="col-auto">
                      <DateRangeFilter
                        id="filterPromotionDateTime"
                        inputId="datepickerPromotionDateTime"
                        title={t("minigameSetting.filterDateCreate", "วันที่สร้าง: ")}
                        onChange={(dates) => refresh({ dates })}
                      />
                    </div>
                    <div className="col-auto">
                      <FilterDropdown
                        id="filterStatus"
                        dropdownId="dropdownStatus"
                        icon={<StatusFilterIcon />}
                        title={t("minigameSetting.filterStatus", "สถานะมินิเกมส์ :")}
                        defaultText="All"
                        stretch
                        items={statusItems}
                        value={filters.status}
                        fakeValue={labelText}
                        onChange={(status) => refresh({ status })}
                      />
                    </div>
                    <div className="col-auto">
                      <FilterDropdown
                        id="filterType"
                        dropdownId="dropdownType"
                        icon={<StatusFilterIcon />}
                        title={t("minigameSetting.filterType", "ประเภทมินิเกมส์ :")}
                        defaultText="All"
                        items={typeItems}
                        value={filters.type}
                        fakeValue={labelText}
                        onChange={(type) => refresh({ type: type as MiniGameType | null })}
                      />
                    </div>
                    <div className="col-auto">
                      <FilterDropdown
                        id="filterCreatedBy"
                        dropdownId="dropdownCreatedBy"
                        icon={<PersonFilterIcon />}
                        title={t("minigameSetting.createBy", "ผู้สร้างมินิเกมส์ :")}
                        defaultText="All"
                        items={creatorItems}
                        value={filters.createdBy}
                        fakeValue={labelText}
                        onChange={(createdBy) => refresh({ createdBy })}
                      />
                    </div>
                    <div className="col-auto">
                      <FilterDropdown
                        id="filterAgent"
                        dropdownId="dropdownAgent"
                        icon={<PersonFilterIcon />}
                        title={t("minigameSetting.usedByAgent", "Agent ที่ใช้งาน :")}
                        defaultText="All"
                        stretch
                        items={agentItems}
                        value={filters.agent}
                        fakeValue={labelText}
                        onChange={(agent) => refresh({ agent })}
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div id="divMinigameTable" className="system-table mx-0 w-100 content-minigame">
                <TableLoading show={loading} />
                {!loading && (
                  <>
                    {/* The server's empty result renders no card list, no #offset and no empty-state
                        message: only the pagination row ("แสดง 0 - 0 จาก 0 รายการ") remains. */}
                    {visible.length > 0 && (
                      <>
                        <div id="customMinigameDraggable" ref={listRef} className={draggingId ? "main-minigame dragging" : "main-minigame"} onDragOver={onDragOver}>
                          {page.map((game) => (
                            <MiniGameCard
                              key={game.id}
                              game={game}
                              agents={agents}
                              loadingDetail={viewingId === game.id}
                              dragging={draggingId === game.id}
                              onView={viewDetail}
                              onBonusClick={showWheelDetail}
                              onToggleStatus={toggleStatus}
                              onDragStart={onDragStart(game)}
                              onDragEnd={onDragEnd}
                            />
                          ))}
                        </div>
                        <input type="hidden" id="offset" value={offset} readOnly />
                      </>
                    )}
                    <Pagination
                      total={visible.length}
                      offset={offset}
                      limit={limit}
                      onOffsetChange={setOffset}
                      onLimitChange={(next) => {
                        setLimit(next);
                        setOffset(0);
                      }}
                    />
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <WheelDetailModal control={wheelModal} detail={wheelDetail} onClose={() => wheelModal.close()} />
      <StableSettingOffcanvas control={settingPanel} session={session} games={games} agents={agents} onEdit={onEdit} onSaved={onSaved} />
      {swalHolder}
    </>
  );
}
