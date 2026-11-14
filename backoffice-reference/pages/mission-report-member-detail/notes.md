# mission-report-member-detail — /mission/report-mission-member-detail/<memberId>

Reached by clicking a member username (or its row link) in the /mission/report table (captured with id 3948023 = 0Tsuperx97420509115). `<title>` สรุปรายงานรายสมาชิก.
`#layout-wrapper.layout-mission-report` (Logout chip hidden). Common CSS + IBM-Plex-Sans-Thai.css + mission.css. Scripts: common + sweetalert2, /js/table.js (page logic inline). `.main-content` also holds `input#hiddenMemberId` (member id; value omitted).

## What it is
Same layout and table as mission-report-member, but **filtered to one member** and **without the username column, without pagination** and **without breadcrumb/member name** — nothing on the page says which member it is. Table id `#reportMemberTable` (vs `#reportTable` on the parent).
- Header: h4 "สรุปรายงานรายสมาชิก" + `button.btn.system-btn.btn-rounded` "เพิ่มรางวัลให้สมาชิก (Manual)" — on this page it has no `manual` class and there is no `#openModalManual` markup, so clicking it does nothing (verified).
- Filters: search, วันที่สรุป (flatpickr), ภารกิจ `#filterMission` (all + missions), ประเภท `#filterCategory` (ทั้งหมด/Auto/Admin/Manual/Complete), ผู้ทำรายการ `#filterMakeBy` (All/Admin/Auto/User). The parent page's filter-icon SVGs (blocked in round 1) are complete here.
- Table: วันที่รับรางวัล (date + `<small>` time), ภารกิจ ("Mission - Sub mission", 216px wrap), ประเภท badge (Complete = `.custom-badge-status.text-orange-50.bg-orange-10`; Manual = `.text-teal-900.bg-teal-green-300.br-teal-green-900` + people icon), group header รางวัลที่ลูกค้าได้รับ (เครดิต pill `.custom-badge-pill.bg-teal-900`, สิทธิ์มินิเกมส์, สิทธิ์โปรโมชั่น, แต้มสะสม, อื่น ๆ), ผู้ทำรายการ (`.system-badge` Auto olive / `.system-badge.badge-primary` User lavender). Sticky `tr.tr-summary` ยอดรวมทั้งหมด.

## Captured states
`screenshots/01-full-page-top.jpg`; dropdowns open: `modals/filter-mission-dropdown-open_zoom.png`, `filter-type-dropdown-open_zoom.png`, `filter-maker-dropdown-open_zoom.png` (dropdown DOM is already in page.html; open state = `.dropdown-wrapper` shown under the pill). `page.styles.json` has inline values.

## Network
- POST /mission/mission-member-detail-table/<memberId>
- /api/agent/get-credit-agent, /sms/get-credit (shell)
