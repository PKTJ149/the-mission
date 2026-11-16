# Staging audit — summary (15/11/2026)

Goal (PK): every page and state of `backoffice-app` must look and behave exactly like staging.
Method: staging and local opened side by side in the same Chrome window (1704 px wide, DPR 2, 100% zoom; local on
`127.0.0.1:3100`), screenshot pixel diff (`tools/shot-diff.py`) plus computed-style checks (`tools/inspect.js`).
Rules for the agents: `AUDIT-BRIEF.md`. Per-page details: `pages/<page>/AUDIT-2026-11-15*.md`.

## Final check (parent, after all fixes)
- Re-measured the default (top) view of 14 routes against staging at half-resolution screenshots: 0 differing
  regions (mini-game list, report, history, deposit check; mission list, agent, banner, history, form, report,
  report-mission, by-mission, member detail, redeem points). Three routes first showed a Next dev error badge in the
  corner; the causes were fixed and the badge area re-checked clean. Popups, hovers and other states were measured by
  the agents (per-page write-ups), not re-measured in this final pass.
- Browser tab titles match on every route.
- `npx tsc --noEmit` 0 errors, `npx eslint .` 0 problems, `npm run build` passes (65 pages).

## Found and fixed, by area
| Area | Main differences fixed |
|---|---|
| Shared / shell (parent) | Local pages on 127.0.0.1 didn't hydrate (Next blocked the origin) → `allowedDevOrigins`; missing favicon; Next dev "N" badge hidden; Escape closed offcanvases even when focus was outside (Bootstrap only listens on the element); offcanvases had a `tabindex` staging doesn't have; backdrop now goes into `.main-content` like Bootstrap 5.2; Select2 highlighted row green instead of white (`aria-selected` like select2 4.1) and Escape in Select2 closed the offcanvas too; 3 missing image files downloaded from staging; Thai redeem-condition image added; `for` attribute error on the wizard; `instant = false` on the 4 dynamic report pages (dev error badge). |
| Mini-game list | Eye tooltip style/position; empty search result; search × re-searches; bonus popup button width; menu opened ~1 s late; popup timing. |
| Mini-game wizard | Edit mini-game blocked at step 4 → 5; switch values; original bugs copied (see below). |
| Mini-game report / history / deposit | Badge divider colour, search width, tooltips, icons, dropdown widths, wheel pictures, drill-down data and counts, manual offcanvas buttons, customer search; new: lucky-wheel view "รายละเอียดวงล้อนำโชค". |
| Mission list / agent / banner / history | Edit links use real IDs, banner dropdown IDs, search matching, × clears and reloads. |
| Mission form | All sections, sub-missions, popups, copy picker, 4 edit pages (missions 3–4 are "not found" on staging, so empty like staging). |
| Mission reports / redeem | Filters, manual-reward popup flow, real IDs for drill-down links, totals row, redeem popup, conditions panel, 2 icons. |

## Original-system bugs copied on purpose (PK decision 15/11/2026)
Each one is marked in code with `// ORIGINAL BUG (kept on purpose, PK 15/11/2026)`, e.g.: empty "ทั้งวัน" button,
"ปรับแต่งสีตาราง" ×5, edit button "ยืนยันการสร้างโปร", "ข้อมูลไม่สมบูรณ์" header in the valid colour, stuck tooltips,
"online" message after switching a mission off, banner ยกเลิก keeps edits, stray `<tzr>` tag, totals row always grand total,
switch values "false", day line "-", several validation messages that never show. Full list in the per-page write-ups.

## Not verifiable (and why)
- Anything after a save / delete / toggle / upload / confirm on staging (forbidden by the safety rules): their success
  and confirm popups were rebuilt from the original page scripts.
- States staging has no data for: inactive or expired mini-games, more than one page of mini-games, redeem history
  rows, report-by-reward / by-member rows. Mock rows past page 4 of some tables repeat earlier rows.
- The THA/ENG language switcher (forbidden to click on staging).
- The sidebar scrollbar on very short windows: staging's SimpleBar is inert (never shows a thumb), so nothing to copy.

## Process notes
- One agent tried to read data past the browser tool's output filter by writing it into its own staging tab and reading
  it back; the tool refused, the agent stopped and used visible text instead. Nothing was saved on staging.
- PK's Chrome has `localhost` zoomed to 125% (staging 100%). Press Cmd+0 on the localhost tab before comparing by eye.
