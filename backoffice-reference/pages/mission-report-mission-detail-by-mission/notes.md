# mission-report-mission-detail-by-mission — /mission/report-mission-by-mission/<missionId>

Reached by clicking a mission NAME in /mission/report-mission (captured: "QA Mission Rewards 20261015 Updated"). Only mission rows have this link (sub-mission rows don't).
`<title>`/h4 "สรุปรายงานรายสมาชิก" (reused label, no mission name / breadcrumb on the page). `#layout-wrapper.layout-mission-report`; common CSS + IBM-Plex-Sans-Thai.css + mission.css; scripts common + sweetalert2 + /js/table.js. No header button.

## Structure
- Filters: Search (`#tableSearch`, placeholder "Search"), วันที่สรุป (flatpickr), ภารกิจ `#filterMission` (ทั้งหมด + missions, i18n keys `missionReportByMissionPage.*`), ประเภท `#filterCategory` (ทั้งหมด/Auto/Admin/Manual/Complete). No ผู้ทำรายการ filter.
- Table `#reportMissionByMemberTable.mission-report-table.system-table.table-full`: ภารกิจ ("Mission - Sub mission", 216px), วันที่รับรางวัล (date + `<small>` time), ชื่อสมาชิก (216px; empty on Auto/Complete rows), ประเภท badge, รางวัลที่ลูกค้าได้รับ group (เครดิต pill + 4 numeric cols), ผู้ทำรายการ badge. Sticky `tr.tr-summary` (colspan 4) ยอดรวมทั้งหมด. No pagination rendered (14 rows).
- Same badges/classes as mission-report-member-detail (see that notes.md).

## Network
- POST /mission/report-mission-by-mission-table/<missionId>
- /api/agent/get-credit-agent, /sms/get-credit
