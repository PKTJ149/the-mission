# mission-redeem-points — /mission/redeem-points (แต้มแลกรางวัล)

Layout `layout-mission-report`; CSS common + IBM-Plex-Sans-Thai.css + mission.css + ckeditor styles (+ runtime). `.main-content` also holds `#offcanvasRedeemConditions` (offcanvas-end).
Header `.w-title` with 2 buttons:
1. `button.mission-btn-outline` เงื่อนไขการแลกรางวัล → `redeemCondition()` → `#offcanvasRedeemConditions` (captured open): enable switch `#enablePointExchange`, language pills TH/EN/TL, CKEditor `#redeemCondition` (+ -en, -tl), footer ยกเลิก (`cancelRedeemCondition()`) / บันทึก (`recordRedeemCondition()`, NOT clicked). Closed via ×.
2. `button.mission-btn` แลกรางวัล → `redeemPoint()` → `#redeemModal.system-popup.redeem-point-modal.show` (markup in page.html; screenshot of open state): customer typeahead, `#redeemCustomerPoint` (current points, hidden until a customer is picked), points input with prepend แต้ม, reward name, ยกเลิก / ยืนยัน (`confirmRedeemPoint()`, NOT clicked).
`h3` ประวัติการใช้แต้มแลกรางวัล; filters Search / วันที่ / ผู้ทำรายการ; table `#redeemHistoryTable.redeem-point-table.system-table.table-height.table-full` — empty state only on staging.
Network: POST /mission/redeem-points-table, GET /api/agent/get-credit-agent, GET /sms/get-credit, /mission/get-condition-point-exchange (method not verified).
