# Session Handoff — 15/11/2026

**Created:** 15/11/2026 (session ran 14/11/2026 → 15/11/2026)
**Project:** `/Users/martinfranck/Projects/the mission` (Missions feature. `wallet-app/` is the player-site front-end. `backoffice-app/` is the NEW rebuild of the lost "AUTO FAST" back office.)
**Stack:** `backoffice-app`: Next.js 16.4.5 (App Router), React 19.3.0, TypeScript 5, flatpickr 4.6.13. **No Tailwind.** It loads the ORIGINAL back-office CSS (Bootstrap "material"/Velzon theme) mirrored under `public/`. `wallet-app`: unchanged since session 01.
**Branch:** `backoffice/design-implement`. It has 2 commits and is in sync with `origin`, but **20 files are uncommitted** (14 modified, 6 new; see In-Progress).
**Repo:** https://github.com/PKTJ149/the-mission (**private**, account `PKTJ149`). The git root is the whole `the mission/` folder.
**Live:** not deployed.
- Dev server: `.claude/launch.json` → `backoffice-app` (port **3100**). It was still running at handoff time.
- `wallet-app` keeps its own config.
- Source system (read-only reference): https://superx.staging.lsmloyalty.com

## Project Status Overview
- **New milestone this session:** PK's original back-office front-end code was lost. The live staging system still runs (ASP.NET MVC + jQuery + Bootstrap). PK asked for an exact copy of **every page and every detail**, so the team can keep building it.
- **Built:**
  - All 17 back-office routes and the pages reachable from them, plus a `/dev/components` showcase.
  - Original CSS, original DOM and class names, and mock data.
  - Popups and forms work but save nothing.
- **Verified against staging:** the mini-game wizard (steps 1–6), the mini-game detail summary and the mission create/edit form match staging block-by-block at the same 1704×1675 CSS viewport. Local save flows work.
- **Builds:** `tsc`, `npm run lint` and `npm run build` (65 pages) all pass.
- **Overall:** visual rebuild done and verified. Next: commit the last round, then get PK's policy on copying original-system bugs, then continue building the unfinished features.

## Session Summary
1. **Session start:** read handoff 01 and briefed PK.
2. **GitHub:**
   - Created the private repo `PKTJ149/the-mission` (PK chose the account, Private, and the whole folder).
   - Added `.gitignore` and made the first commit `3fd448e` on `main` (wallet-app).
3. **Branch:** created `backoffice/design-implement`.
4. **Capture (staging, read-only):** agents captured every back-office page into `backoffice-reference/`:
   - HTML, screenshots, and recovered inline styles (`*.styles.json`)
   - legacy JS + `NOTES.md`, and locale files
   - `INVENTORY.md` (what was and wasn't captured, and why)
   - `BUILD-BRIEF.md` (the shared rules for page agents)

   Original CSS, fonts, icons and images were downloaded with PK's permission.
5. **Build:** sub-agents (Opus 5.5, effort high, as PK asked) built `backoffice-app/`:
   - the shell (sidebar, header, language switcher)
   - shared UI primitives
   - every page, in parallel
6. **Comparison rounds:** each page was measured against staging (block rects, element counts, text hashes) and fixed until it matched.
7. **Commit `aaaa6bc`** pushed to `backoffice/design-implement` (490 files).
8. **Last request:** "click through wheel wizard step 2–6 and the mission form to save, compare with staging".
   - A sub-agent compared each step on both sides and wrote `WIZARD-DIFFS.md` and `FORM-DIFFS.md`.
   - Fixes went in, and the final round matches.
   - Saves were tested in Chrome on localhost.
   - This round is **not committed yet**.

## Completed This Session
- Private GitHub repo + 2 commits pushed.
- `backoffice-app/` with 17 routes mirroring the original URLs:
  - **Mini-game:** `/promotion/mini-game-v2` (also `/`), `/report/promotion/minigame`, `/promotion/minigame/history`, `/promotion/minigame/minigame-period-deposit`
  - **Mission:** `/mission`, `/mission/setting`, `/mission/agent-setting`, `/mission/banner-setting`, `/mission/mission/history`, `/mission/redeem-points`
  - **Mission reports:** `/mission/report`, `/mission/report-mission`, `/mission/report-mission-member-detail/[memberId]`, `/mission/report-mission-by-mission/[missionId]`, `/mission/report-mission-by-reward/[id]`, `/mission/report-mission-by-member/[id]`
  - **Dev:** `/dev/components`, `/dev/components/mission`
- **Wheel wizard (create + edit), steps 1–6:** the button-group y positions match staging exactly (1020 / 770 / 3043 / 1048 / 7696 / 962 / 3117).
- **Mini-game detail summary:** all 12 blocks match in position, height, count and text.
- **Mission form, all 4 sections:**
  - They match. The left column is 698 vs 694px (text rounding).
  - Save flow: confirm → "บันทึกการแก้ไขภารกิจ สำเร็จ !" → Close → `/mission`.
- **Local save flows:**
  - Wheel edit: confirm "ยืนยันการแก้ไขข้อมูลมินิเกมส์หรือไม่?" → "บันทึกการแก้ไขข้อมูลมินิเกมส์ สำเร็จ !"
  - Wheel create: the new card is added at the top.
- **Checks:** type check, lint and build (65 pages) pass. No stray `dropped-->` text remains.
- **Project memory** (`~/.claude/projects/-Users-martinfranck-Projects-the-mission/memory/`): added `github-repo.md` and `backoffice-rebuild.md`.
- **MemPalace:** mined into wing `the-mission`, and a diary entry was written.

## Files Created
**Repo root**
- `.gitignore` — `.DS_Store`, `node_modules/`, `.next/`, `.env*`.
- `handoff/handoff-session-02.md` — this file.

**`backoffice-app/`** (289 tracked files)
- **`app/(group)/…`** — one route group per original stylesheet set, so each page loads the same `<link>` order as staging.
  - Groups: `(minigame-settings)`, `(minigame-reports)`, `(mission-settings)`, `(mission-form)`, `(mission-plain)`, `(mission-reports)`, `(mission-redeem)`, `(mission-history)`.
  - Each page keeps its own `_components/`.
- **`components/shell/`** — the original page skeleton:
  - `document.tsx`, `page-groups.ts` (which CSS each group loads), `app-shell.tsx`
  - `sidebar.tsx`, `language-switcher.tsx`, `flag-icons.tsx`
- **`components/ui/`** — shared primitives:
  - popup / CustomSweetAlert (`.system-swal`), offcanvas, toast
  - select2, google-dropdown, filter-dropdown, toggle-switch, color-picker (asColorPicker)
  - CKEditor config, table states, icons
  - `README.md` explains each one.
- **`lib/api/*`** — async functions the pages call.
- **`lib/mock/*`** — mock data: mini-games, missions, minigame-reports, mission-reports.
- **`lib/i18n/*`** — `useT()` → `t(key, fallback)`. It reads `/locales/th.json` and `/locales/en.json`, and stores the language in localStorage `self-language`.
- **`public/`** — original CSS, fonts, JS plugins, images and locales, mirrored at their original URL paths.
- **New in the uncommitted round:**
  - `app/(mission-form)/mission/setting/_components/lang-flags.tsx` — the exact EN/TL flag SVGs from staging, with `useId()` for unique ids.
  - `public/assets/images/minigame/countdown-time-icon-1.png` and `countdown-time-icon-2.png`

**`backoffice-reference/`** (200 tracked files; reference only, not shipped)
- `INVENTORY.md` — every captured page, plus what was NOT captured and why. Read this before building anything missing.
- `BUILD-BRIEF.md` — the rules every page agent followed.
- `styles.md`, `shell/`, `pages/<page>/` (HTML, screenshots, `*.styles.json`, data notes)
- `legacy-js/` + `NOTES.md` — the original jQuery logic. It is the source for dialog texts and flows.
- **New, uncommitted:**
  - `pages/minigame-settings/WIZARD-DIFFS.md`
  - `pages/mission-settings/FORM-DIFFS.md`
  - `pages/mission-settings/lang-pill-flags.md`

**Outside the repo**
- `.claude/launch.json` — added the `backoffice-app` config (`npm run dev --prefix backoffice-app -- --port 3100`).

## Files Modified
These are the uncommitted round. They are all fixes found by the step-by-step staging comparison.

**Mini-game wizard** (`app/(minigame-settings)/promotion/mini-game-v2/_components/setting/`)
- `step2-period.tsx` — step 2.2 rebuilt with the real structure (6 `col-12` cells, 2 of them empty) and the real countdown icons.
- `step3-rights.tsx` — removed the stray text node `" dropped-->"` (twice). It added a grid row and pushed the buttons down 43px.
- `step4-display.tsx` — colour pickers are 92×32, and background preview images stay hidden until upload.
- `step5-turnover.tsx` — fixed the broken layout (a capture-gap `<div />` had replaced the input, and a label was not closed).
- `step6-summary.tsx` — `WorkingTimes` now renders `#showMinigameTime` from React; the label is "เวลาทำงานที่ N :".
- `wizard-summary.ts` — the summary fill runs in a microtask plus a layout effect, not `requestAnimationFrame`, so it works in a hidden browser pane.
- `wizard-dom.ts` — fixes to the jQuery-style DOM port that the steps above needed.
- `minigame-setting-offcanvas.tsx` — the bottom edit-mode button reads "ยืนยันการสร้างโปร", like staging, but it still performs an update.
- `lib/mock/mini-games.ts` and `lib/api/mini-games.ts` — added the 73 game providers, and mock data shaped to match staging's detail summary.

**Mission form** (`app/(mission-form)/mission/setting/_components/`)
- `section-basic.tsx` — language pills use the exact flag SVGs and keep the 4px whitespace gaps.
- `section-duration.tsx` — the round-time row shows "-" and 00:00 – 00:00 like staging. The add-round wrapper stays rendered (it keeps its 16px gap), but the button is hidden.
- `form-section.tsx` — header status logic. It shows "ข้อมูลสมบูรณ์", with an `// ORIGINAL:` comment saying staging shows "ข้อมูลไม่สมบูรณ์".
- `lib/api/missions.ts` — edit-load and save behaviour for the form.

## Git Commits
- `3fd448e` — Initial commit: Missions front-end (wallet-app) — on `main`
- `aaaa6bc` — Rebuild back office front-end (backoffice-app) — on `backoffice/design-implement`, pushed

## In-Progress / Pending
- **Uncommitted round (20 files):** waiting on PK's answer to "Commit และ push งานแก้รอบนี้ขึ้น branch เดิมเลยไหม?". On a yes:
  1. Check `gh auth status` shows `PKTJ149` as the active account.
  2. Commit on `backoffice/design-implement` with the Co-Authored-By line.
  3. Push to `origin`.
- **Original-system bugs, waiting on PK's policy:** copy them exactly, or keep the corrected behaviour? Claude recommended keeping the corrected versions. Each spot has an `// ORIGINAL:` comment.
  1. Step 2.1 "ทั้งวัน" button: on staging the button is empty. Ours shows the label.
  2. Step 4 table-colour labels: staging shows "ปรับแต่งสีตาราง" five times. Ours shows the proper labels.
  3. Mission edit headers: staging shows "ข้อมูลไม่สมบูรณ์" on load even when the data is complete. Ours shows "ข้อมูลสมบูรณ์".
  4. Edit-mode wheel button: staging reads "ยืนยันการสร้างโปร". **Ours now copies this**, and the action is still an update. If PK picks "keep corrected", change it to an edit label.
- **Carried over from handoff 01 (wallet-app), still open:**
  - PK's feedback on the desktop history, redeem and detail screens
  - the admin contact channel
  - whether to delete `mission-logo.tsx`
  - the 6 pop-up types and the floating expiry button, which wait on Figma

## Known Issues / Blockers
- **No real API.** Everything runs on mock data. The endpoint paths are listed per page in `backoffice-reference`, but only `POST /mission/redeem-points-table` has a verified method.
- **Not captured, so built from screenshots, legacy JS or guesses** (full list in `INVENTORY.md`):
  - mini-game step 4a DOM
  - parts of `<template>` markup
  - hover states
  - pagination pages 2+
  - tooltips
  - the theme customizer
  - the "คัดลอกการตั้งค่าจากภารกิจอื่น" copy picker
  - a few inline style values the tool filter blocked (`[BLOCKED…]`)
- **Empty on staging, so our mock data is a guess:**
  - populated tables for deposit-check, redeem-points, report-by-reward and report-by-member
  - offline missions
  - expired or inactive mini-games
- **Legacy JS not downloaded:** `scriptmission-agent-setting.js` and `scriptmission-banner-setting.js`.
- **The mini-game list page on staging auto-calls `update-sequence-auto` on every load.** Opening it is not a pure read.
- **Pixel offsets of 1–2px** on `line-height: normal` text are device-pixel-ratio rounding, not bugs.

## Key Decisions Made
- **Next.js + the original CSS (PK).** Re-creating the original DOM and class names lets the original stylesheets give a pixel match without re-styling. The cost: the markup follows the legacy structure, including its odd parts.
- **Mock data (PK).** Async functions in `lib/api` hide `lib/mock`, so a real API can replace them later without touching pages.
- **Popups and forms are usable but save nowhere (PK).** Flows end in the same success dialogs as staging.
- **Staging permissions (PK):** popups, forms and dropdowns may be opened, but nothing may be saved, deleted or toggled. CSS, fonts, icons, images and locales may be downloaded.
- **Sub-agents on Opus 5.5, effort high (PK)**, with one shared `BUILD-BRIEF.md` so every page follows the same rules.
- **Original typos and odd copy are kept** (for example "การติดเทริ์น"). Clear functional bugs are corrected and marked `// ORIGINAL:` until PK decides.

## Important Context
- **How to compare with staging:**
  - Use the same CSS viewport on both sides: 1704×1675.
  - Staging is measured in Claude-in-Chrome. Local is measured in the built-in browser with `resize_window` set to 1704×1675.
  - PK's Chrome zooms staging to 80% and localhost to 100%, so raw screenshots look like different sizes.
  - Compare block rects, element counts and text hashes, not screenshots.
- **The built-in browser pane is often hidden.** Then `requestAnimationFrame` and CSS animations don't run, and dialogs never open. Test dialogs, animations and save flows in Chrome on `localhost:3100`.
- **JSX pitfalls found:**
  - JSX drops whitespace between inline-block siblings (4px gaps): add `{" "}`.
  - The original uses `&nbsp;` in places: use `" "`.
  - Empty containers still take grid/flex gaps, so render them.
  - Watch for leftovers from the capture-conversion script, such as `{" dropped-->"}` and capture-gap `<div />` placeholders.
- **Staging safety rules (agreed with PK, keep following them):**
  - **Never click:** save/บันทึก/ยืนยัน/submit, delete/ลบ, toggles, export/download, Logout, the THA/ENG switcher, or file inputs. Close popups with × or Escape.
  - **Click only explicitly named elements.** A generic `[onclick]` click once fired `deleteTemplateTimeMission(1)` client-side on the mission form. The page was reloaded at once and nothing was saved; this was disclosed to PK.
  - **Never touch PK's own Chrome tabs** (296764006, 296764009). Never read cookies or storage. Don't work around the tool's output filter.
- **Two `gh` accounts are on this Mac.** Make sure `PKTJ149` is active before pushing.
- **Before editing, read:** `backoffice-app/components/ui/README.md` and `backoffice-reference/BUILD-BRIEF.md`.
- **PK's working rules:**
  - Reply in Thai; file content in English.
  - Ask short questions and state the plan before big tasks.
  - Never delete, push or submit without a yes.
  - Explain code briefly with one learning point.
  - Always show file links.

## Next Session: Start Here
1. Run `session start`, then `git status`. If the 20 files are still uncommitted, ask PK whether to commit and push them (check the `gh` account is `PKTJ149` first).
2. Ask PK for the policy on the 4 original-system bugs: copy exactly, or keep corrected. Apply it to every `// ORIGINAL:` comment, including the edit-mode "ยืนยันการสร้างโปร" button.
3. Start `backoffice-app` (port 3100) and let PK look through the pages. Collect any differences they spot.
4. Ask PK what "finish the system" means next:
   - which features are unfinished in the original
   - whether there is an API or spec to connect to
   - whether the wallet-app should read missions from this back office
5. Optional follow-ups:
   - capture what is still missing (step 4a DOM, pagination 2+, hover states, the copy picker), staying inside the staging safety rules
   - open a PR from `backoffice/design-implement` to `main` once PK is happy

## Conversation Highlights
- **Why the original CSS works:** re-creating the original HTML structure and class names lets the old stylesheets do all the styling. Matching is about DOM fidelity, not writing CSS.
- **Some "bugs" were the test environment.** In the hidden in-app browser, animations and `requestAnimationFrame` never fire, so the summary looked empty and dialogs never opened. Real users won't see this, but the code was moved off `requestAnimationFrame` anyway, to be safe.
- **Edit button label:** Agent A traced the original edit save to `openConfirmUpdatePromotionSwal('saving')` → PUT `update-v2`. The "ยืนยันการสร้างโปร" label is only odd wording, not a duplicate-create bug.
- **Measuring beats eyeballing.** Every fix this session came from comparing numbers, such as rect y positions and element counts, on both sides at the same viewport.

---
*Auto-generated by Session Handoff automation*
