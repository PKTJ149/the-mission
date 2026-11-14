# minigame-report — /report/promotion/minigame (สรุปรายงานมินิเกมส์)

Inline page style (head, after base.css): `.main-content{height:100vh}.page-content{height:calc(100% - 72px - 1.5rem);padding-bottom:0;box-sizing:content-box}`.
Stylesheets: common set only (no page-specific CSS file). `#offcanvasMinigameSetting` (view-only variant, 58 KB) and ~90 hidden `<input>` state fields are also rendered in `.main-content` (used by the eye button).

## States
1. Summary table (`#promotionTable.promotion-deposit-table.system-table.table-hover.table-full`, two-row `thead.color-th-report-theme-emerald`, badges per column group; rows `tr.color-tr-status-emerald-success` clickable; sticky summary row `tr.tr-summary` "ยอดรวมทั้งหมด"). `#promotionDetailPanel` hidden. Filters: search promotion, วันที่สรุป (flatpickr), สถานะเกมส์, Agent; customer filters hidden (`.filter-customer`).
2. Drill-down (row click → `nextDetail(event,name,id)`): `#promotionDetailPanel` shown (maincard with name badge, CKEditor HTML description, status badge, eye button `viewMinigameDetail()`, wheel/cover image, ระยะเวลาโปรโมชั่น; subcards blue/orange/green with counts); breadcrumb gains active item; filters swap to customer search + ประเภท / สถานะ / ผู้ทำรายการ; detail table with per-member rows (search shortcut button `shortcutSearchCustomer(username)`, Auto badge with setting.svg, yellow credit pill, `.system-label.label-warning` status + info icon tooltip, `.system-badge.badge-success` maker); pagination 7103 rows.
Clicking breadcrumb "Anonymous" returns to state 1.

## Interactions
- Auto refresh `#autoRefreshWrapper` (countdown text, settings dropdown 30/45/60/120/off) — re-requests table.
- Eye (drill-down panel) opens the same mini-game summary offcanvas as minigame-settings (view mode).
- Not captured: info-icon tooltip content on status; eye offcanvas on this page (same markup as minigame-settings view).

## Network
GET /locales/th.json, POST? /report/promotion/minigame-table (path seen; method not verified), GET /api/agent/get-credit-agent, GET /sms/get-credit; drill-down: /report/promotion/minigame-detail-table, /api/report/summary-mini-game (methods not verified).

## Round 2 additions
- Auto-refresh settings dropdown (gear `button.refresh-setting`, gets `.dropdown-show.dropdown-fill` when open) → `#dropdownAutoRefresh .custom-dropdown.show` with 30s / 45s / 60s (selected, check mark) / 120s / ปิดการ Auto Refresh: `modals/auto-refresh-settings-dropdown_open*.html` + `_zoom.png`. Not changed.
- Drill-down extras (eye tooltip, status (i) tooltip, view offcanvas for a mini-game-other): see `../minigame-report-detail/`. Inline values for the drill-down state: `page_state-drilldown-per-member.styles.json`.
- Methods verified in round 2: POST /report/promotion/minigame-detail-table?anyMiniGameId=<id>, POST /api/report/summary-mini-game, POST /api/promotion/mini-game/get/.
