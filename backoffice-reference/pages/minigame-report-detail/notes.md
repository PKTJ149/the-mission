# minigame-report-detail — drill-down of /report/promotion/minigame

**There is no separate detail URL for the mini-game report.** Clicking a summary row (or its eye button `button.system-action.action-square.action-outline.action-info`, tooltip "รายละเอียด") calls `nextDetail(event, name, id)` and swaps the SAME page into the per-member drill-down state. Round 1 already saved that state's DOM: `../minigame-report/page_state-drilldown-per-member.html` (+ round-2 inline values: `../minigame-report/page_state-drilldown-per-member.styles.json`). This folder holds what round 1 lacked.

## Captured here
- `screenshots/01-drilldown-after-row-eye-click_QA-Other-Retest.jpg` — drill-down for a "มินิเกมส์อื่น ๆ" (other type) row: detail card with checkerboard game image, 3 sub-cards, breadcrumb `Anonymous > QA Other Retest 20261015`, filters, table (7103 rows), pager. Note: the row's eye-button tooltip stays stuck at the top-left after the click (legacy Bootstrap tooltip bug; visible in screenshots).
- `screenshots/02-detail-card-period-bar-click_zoom.png` — clicking the "ระยะเวลาโปรโมชั่น" bar in the detail card shows no change for this game (no period set).
- `modals/row-eye-button_tooltip-hover_zoom.png` — "รายละเอียด" tooltip on the row eye button.
- `modals/status-info-tooltip_hover.html` (+ `.styles.json`, `_zoom.png`) — hovering the (i) icon next to a status label (`รอใช้โปร`) shows `.tooltip.custom-tooltip.promotion-deposit-tooltip` with status title (yellow, `p4 fw-700 text-yellow-50`) + date/time.
- `modals/view-minigame-other_offcanvas-summary.html` (+ `.styles.json` with all 141 inline values, screenshots `_a-top.jpg`, `_b-limits.png`, `_c-rewards-turnover-bottom.png`) — the eye button inside the detail card (`viewMinigameDetail()`) opens `#offcanvasMinigameSetting` in view mode showing ONLY `#SettingMinigameStep5` (summary) for a mini-game-other: title "รายละเอียดเกมส์อื่น ๆ", header "สรุปข้อมูลการตั้งค่าเกมส์อื่นๆ ของคุณ", 14 sections (`.label-minigame` + `.input-col-1-p` pairs), reward items "Minigame 1..6" as collapsible rows (`.dropdown-wheel-detail` → `#openDropdownWheelDetailN`, first expanded). On/off state is expressed by toggling `display` on paired elements (`…Active` / `…Inactive`, `…1` / `…2`) — see styles.json. Closed with ×.
- Legacy-JS quirk worth reproducing or fixing consciously: Minigame 3 value renders literally "undefined 1 สิทธิ์".

## Network (observed)
- POST /report/promotion/minigame-table (summary)
- POST /report/promotion/minigame-detail-table?anyMiniGameId=<id> (drill-down table)
- POST /api/report/summary-mini-game (sub-card numbers)
- POST /api/promotion/mini-game/get/ (view offcanvas data)
- /api/agent/get-credit-agent, /sms/get-credit
