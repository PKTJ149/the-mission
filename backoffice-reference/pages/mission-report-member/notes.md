# mission-report-member — /mission/report (สรุปรายงานรายสมาชิก)

Layout `#layout-wrapper.layout-mission-report`; stylesheets common + IBM-Plex-Sans-Thai.css + mission.css. Logout chip hidden on this layout.
- Header: `h4.mission-page` + button `.btn.system-btn.btn-rounded.manual` เพิ่มรางวัลให้สมาชิก (Manual) → `#openModalManual.system-popup-alert.show` (captured): typeahead `#manualSelectCustomer.dropdown-google` (ยูสเซอร์เนม *), `#dropdownSelectMission` with mission (bold) / sub-mission (indented) items, buttons ยกเลิก / ยืนยัน (NOT clicked). Closed with ยกเลิก.
- Filters: Search, วันที่สรุป (flatpickr), ภารกิจ, ประเภท, ผู้ทำรายการ (option lists in data.json).
- Table `#reportTable.mission-report-table.system-table.table-full` (thead badges `bg-teal-950` / `bg-teal-500`), date with `<small>` time, member link → `/mission/report-mission-member-detail/<n>` (separate drill-down page, NOT captured), type badge, credit pill `.custom-badge-pill.bg-teal-900`, maker `.system-badge`.
- Pagination 45 rows.
Network: /mission/get-mission-submission, /mission/report-table, GET /api/agent/get-credit-agent, GET /sms/get-credit.
