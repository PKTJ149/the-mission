# Audit 15/11/2026 — /mission (mission list)

Method: staging tab vs local tab (`127.0.0.1:3100`), both 1704 CSS px wide, DPR 2. Viewport height was 1675
on both (not 1731: the Chrome "debugging" info bar takes 56 px; width and DPR as required).
Measured with a computed-style dump of every visible element under `.page-content` (position/size, text,
colour, background, font, borders, radius, shadow, opacity, cursor, filter, transform, ::before/::after,
image path, input state), hashed per element and compared line by line, plus `shot-diff.py` on screenshots
and full-resolution zoom crops.

| State | Differences found | Cause | Fix (file) | Final result |
| --- | --- | --- | --- | --- |
| Full page (stats row, header buttons, all 4 cards incl. reward chips / condition / sub-missions) | Only the absolute image host in `src` (same paths) | — | — | 248/248 elements identical; screenshot diff 70 px = Next dev "N" badge only; card zoom crop 0 px |
| Page height / scrolling | none | — | — | scrollHeight 1723 both; `.main-content-mission` 1320×982, no overflow on either |
| Hover: อัพโหลดแบนเนอร์, ประวัติการแก้ไข, สร้างภารกิจ, gear, switch, edit, delete, expired edit (pointer-events none), card body | none | — | — | computed styles identical |
| Tooltips | none on either page (no `title` / `data-bs-toggle`) | — | — | — |
| Edit pencil target URL | local used `missionId=uuid-1…4`, staging uses the real mission GUIDs | capture anonymised GUIDs | `lib/mock/missions.ts`: ids → staging GUIDs (also the `capturedEditValues` key and the banner-menu option values) | `onclick` GUIDs read from staging = local ids |
| Status-toggle result popup text | local showed the "offline" text when switching off; original always shows the "online" text (`newStatus === 'ปิด'` is never true) | our code had fixed an original bug | `mission-list.tsx`: original behaviour kept, `ORIGINAL BUG` comment | code matches legacy `scriptmission.js` (not clickable on staging) |

## Not verified (and why)
- Toggle confirm/result popups, delete confirm popup: clicking card switches / delete is forbidden on staging. Texts follow `legacy-js/scriptmission.js`.
- After-confirm `location.reload()` is still replaced by an in-place update (mock data cannot persist a reload).
