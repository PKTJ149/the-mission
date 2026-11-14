# minigame-history — /promotion/minigame/history (ประวัติการรับ/ใช้สิทธิ์มินิเกมส์)

Same inline style as minigame-report (`.main-content{height:100vh}` …). Common stylesheets only.
`.page-content` + hidden page-level popups in `.main-content`: `#dropdownChangeStatusPromotion`, `#modalConfirmChangeStatus` (system-modal: banner-saving.png, status-chang.png, title ยืนยันเปลี่ยนสถานะใช่หรือไม่ ?, required remark input สาเหตุการยกเลิกโปร, buttons ยกเลิก / ยืนยัน[disabled until valid]), the same pair with suffix `CancelPromotion`, and `#offcanvasCreateManual`. All captured in page.html (closed state) / modals.

## Elements
- Header button เพิ่มโปรให้สมาชิก (Manual) → `openCreateManual()` → `#offcanvasCreateManual` (offcanvas-end): customer autocomplete `#manualSelectCustomer.dropdown-google` (typeahead, "ไม่พบข้อมูล" empty caption), select2 `#anyMiniGameId` (3 mini-games), select2 `#selectRewardPiece` (depends on mini-game), remark `#manualRemark`, deposit amount `#depositAmount` with helper text, buttons ยกเลิก (`cancelCreateManual()`) / ยืนยัน (`createManual()`, disabled; NOT clicked).
- Filters: search, วันที่สรุปข้อมูล (flatpickr), ประเภท, สถานะ, ผู้ทำรายการ, Agent ที่ใช้งาน; auto-refresh group.
- Table `#promotionTable.promotion-deposit-table.system-table.table-full`; rows `tr.color-tr-status-emerald-detail-mini-game-warning`; status label `.promotion-deposit-change-status.system-label.label-xs.label-warning.label-hover.label-dropdown` → `openDropdownChangeStatus(this,'',id)` (changes data — NOT opened), info icon (tooltip, not captured); customer search shortcut `shortcutSearchCustomer(username)`.
- Pagination 14214 rows.

## Network
/promotion/minigame/history-table (page load), GET /api/agent/get-credit-agent, GET /sms/get-credit. Methods of *-table endpoints not verified (redeem-points-table is POST, so these are most likely POST too).
