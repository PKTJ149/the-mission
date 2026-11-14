# minigame-deposit-check — /promotion/minigame/minigame-period-deposit (ตรวจสอบยอดฝาก)

**Differs from the other mini-game pages:** it is built with the *mission* page template: `#layout-wrapper.layout-mission-report`, stylesheets add `/css/fonts/IBMPlexSansThai/IBM-Plex-Sans-Thai.css` and `/css/style/mission.css` (after base.css), titles use `.w-title` + `h4/h5.mission-page`, filters use `missionReportPage.*` i18n keys, table container `#reportTable.mission-report-table.system-table.table-full`. The `.btn-logout-custom-mini-game` Logout element is present but hidden on this layout.
No page-specific inline style.

## State
Only the empty state exists on staging (`.table-jumbotron` with lordicon nmgjlgnk.json, ไม่พบข้อมูลที่ค้นหา). Filters: Search, วันที่สรุป (flatpickr), ประเภท (ทั้งหมด/Auto/Admin/Manual/Complete), ผู้ทำรายการ (ทั้งหมด/Admin/Auto/User). Pagination with prev/next only.

## Network
/promotion/minigame/minigame-period-deposit-table (page load), GET /api/agent/get-credit-agent, GET /sms/get-credit.
