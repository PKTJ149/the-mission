# mission-history — /mission/mission/history (ประวัติการแก้ไข)

Path verified from the "ประวัติการแก้ไข" link on /mission (`a.mission-btn-outline[href="/mission/mission/history"]`); also linked from /mission/agent-setting. `<title>` is EMPTY on this page.
`#layout-wrapper` class `""`. **Does NOT load mission.css / IBM Plex** — only common CSS + an inline style (703 chars, see styles.md) — and the container gets `.font-set` (Noto Sans Thai !important). Scripts: common + cleave.min.js, /js/table.js, /js/moment.js (page logic inline).

## Structure
- Header `.title-header-custom-mission.flex`: h4 "ตั้งค่าภารกิจ" + `.title-header.title-margin` breadcrumb (`/assets/images/mission/purpose.png` 24px, link "รายชื่อภารกิจ >" → /mission in teal `rgb(114,220,217)`, then "ประวัติการแก้ไข").
- Filters row: Search `#tableSearch` (264px col) with clear icon `#clearValueMissionHistorySearch`; date-range filter pill `#filterDateSummary` "วันที่แก้ไข" (flatpickr range, `datepickerDateSummary`).
- Table `#missionTable.promotion-deposit-table.system-table.table-full` (System table from /js/table.js): thead `.color-th-report-theme-emerald`, rows `tr.color-tr-status-emerald-detail-mini-game`, editor badge `span.system-badge.badge-success-mission` "(superx)" (olive gradient pill). Column widths 10/40/40/10 %. Note the stray `<tzr>` element before `<table>` (present in live DOM).
- Pagination `.system-pagination` (limit dropdown 10/20/50/100, "แสดง 1 - 10 จาก 25 รายการ", first/prev/pages/next/last).

## Interactive elements
- Search: filters via table reload. Date pill: opens flatpickr range calendar (`modals/filter-edit-date_flatpickr-open_zoom.png`; calendar DOM identical to `shell/flatpickr-calendar_rangeMode_open.html`).
- Limit dropdown open: `modals/pagination-limit-dropdown-open_zoom.png`. With 50: all 25 rows (`screenshots/02-limit-50-all-25-rows_0.6x.jpg`); full row list in data.json.
- Rows are not clickable (no drill-down).

## Network
- POST /mission/history-table (table data; re-sent on paging/limit/filter)
- /api/agent/get-credit-agent, /sms/get-credit (shell)
