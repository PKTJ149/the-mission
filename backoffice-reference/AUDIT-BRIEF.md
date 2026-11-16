# Audit brief: local vs staging, zero visible differences (15/11/2026)

PK opened the rebuilt back office next to staging and found many differences. PK will not accept any.
Your job: for the pages and states you are given, find EVERY visible or behavioural difference between
staging and our local app, fix it in code right away, and re-measure until the diff is clean.
Do not claim something matches unless you measured it.

## Read first
1. `backoffice-reference/BUILD-BRIEF.md` (code rules), `backoffice-app/AGENTS.md`, `backoffice-app/components/ui/README.md`.
2. `backoffice-reference/INVENTORY.md` and your pages' folders under `backoffice-reference/pages/` (captured HTML, `*.styles.json`, `notes.md`, screenshots), `backoffice-reference/legacy-js/` for behaviour.

## Browser setup (Claude in Chrome)
- Load the tools once: ToolSearch `select:mcp__claude-in-chrome__tabs_context_mcp,mcp__claude-in-chrome__tabs_create_mcp,mcp__claude-in-chrome__tabs_close_mcp,mcp__claude-in-chrome__navigate,mcp__claude-in-chrome__computer,mcp__claude-in-chrome__javascript_tool,mcp__claude-in-chrome__browser_batch,mcp__claude-in-chrome__find,mcp__claude-in-chrome__read_page,mcp__claude-in-chrome__get_page_text,mcp__claude-in-chrome__read_console_messages`.
- Call `tabs_context_mcp`, then create **two tabs of your own** with `tabs_create_mcp`: one for staging (`https://superx.staging.lsmloyalty.com/...`, already logged in) and one for local.
- **Local URL must be `http://127.0.0.1:3100/...`, never `localhost`.** This Chrome has `localhost` zoomed to 125%; `127.0.0.1` is at 100% like staging.
- Check both tabs: `[innerWidth, innerHeight, devicePixelRatio]` must be `[1704, 1731, 2]` on both. If not, stop and report.
- Check the local tab hydrated: `Object.keys(document.querySelector('#sliderMenuBtn')).some(k => k.startsWith('__react'))` must be `true` (`next.config.ts` has `allowedDevOrigins: ["127.0.0.1"]` for this).
- **Never resize the window** (other agents share it). **Never touch tabs you did not create.** Close your tabs when done.
- Use `browser_batch` to run several steps in one call.

## Staging safety rules (non-negotiable)
- **Never click:** save / บันทึก / ยืนยัน / submit / ยืนยันการสร้าง…, delete / ลบ, any toggle or switch, export / download / ดาวน์โหลด, Logout, the THA/ENG switcher, file inputs, drag handles, test-spin. Close popups with × or Escape.
- **Click only elements you have identified by name** (via `find`, `read_page` ref, or a specific selector you checked). Never run JS that clicks generic `[onclick]` elements: once this fired a delete handler.
- Opening popups, dropdowns, offcanvases, tabs, accordions, date pickers and typing into fields is allowed (nothing is sent until a save button is clicked). Wizard "ถัดไป"/"ย้อนกลับ" (next/back) and switches **inside an unsaved create/edit form or wizard** are allowed. Status toggles on list cards/rows (mini-game cards, mission cards, banner auto-slide, agent switches) are never allowed: they save immediately. On a row's change-status dropdown you may open it but never pick an option. Revealing a wizard step by toggling `display` on the step container in your own staging tab is allowed (client-side only).
- Never read cookies or storage. Don't work around the tool's output filter (if a value comes back `[BLOCKED]`, measure it another way, e.g. from a screenshot).
- `/promotion/mini-game-v2` on staging calls `update-sequence-auto` on every load. Load it as few times as possible.

## Measuring method
1. Put both tabs in the same state (same page, same popup/step/tab open, same scroll position).
2. Paste `backoffice-reference/tools/inspect.js` into `javascript_tool` on both tabs (after every navigation or reload).
3. Screenshot both tabs: `computer {action:"screenshot", save_to_disk:true}` (scale 1). The saved path is in the `[Image: source: …]` line.
4. Diff: `python3 -I "/Users/martinfranck/Projects/the mission/backoffice-reference/tools/shot-diff.py" STAGING LOCAL OUT_PREFIX --scroll-y <scrollY>`
   (OUT_PREFIX in your scratchpad). It prints JSON regions (screenshot px and CSS px) and writes OUT_PREFIX.png (staging | local | heat-map). Read the PNG when there are regions.
   - The mouse cursor is drawn into screenshots: a ~18 px region at the last mouse position is the cursor, not a difference.
   - JPEG noise is below the default threshold. For dense areas (tables, forms, small icons, 1px borders) also diff full-resolution crops: `computer {action:"zoom", region:[x0,y0,x1,y1], save_to_disk:true}` on both tabs (region in screenshot-frame px, 1092 wide), then run shot-diff with `--css-width <(x1-x0)*1.5604>`.
5. For each region, find the cause on both sides with `__at([[x,y]])` (viewport CSS px) or `__sub(selector)`, and compare computed values.
6. Fix the code. The local tab hot-reloads (open popups may close; reopen them). Re-screenshot and diff until clean.
7. Scroll through the whole page (`window.scrollTo(0, y)` on both tabs, step = 1600) and through scrollable containers (offcanvas bodies, modal bodies, tables) the same way. Compare `document.documentElement.scrollHeight` and container `scrollHeight` too.

## What counts as a difference
Anything a person could see or feel: position or size (1 px or more), colour, font, weight, line height, icon, image, border, radius, shadow, spacing, scrollbar, text/copy (including data values, dates, counts, ordering), empty/loading states, hover / focus / active / disabled looks, cursor type, what opens on click, open/close animation, validation messages, placeholder text, tooltip text and position.

## Data
Mock data must equal **what staging shows now** (text, numbers, dates, images, order, counts, pagination totals). If staging data changed since the 14/11 capture, update the mock to match. If a value is live (clock, countdown, "x minutes ago"), note it and move on.

## Original-system bugs (PK decision 15/11/2026)
Copy staging exactly, including its bugs. Where our code "corrected" an original bug (look for `// ORIGINAL:` comments), switch to the original behaviour and keep a comment: `// ORIGINAL BUG (kept on purpose, PK 15/11/2026): <what is odd and what the fix would be>`.

## Code rules
- Never edit `public/` (original CSS etc.), `components/shell/`, `lib/i18n/`, `app/(group)/layout.tsx`, `components/shell/page-groups.ts`. If the shell (sidebar, header, language switcher) differs, report it with measured values; the parent fixes it.
- Edit only your own area (listed in your task). Shared files you may need (`components/ui/*`, `lib/mock/*.ts`, `lib/api/*.ts` used by another agent too): use the Edit tool only (never Write / rewrite the whole file), re-read right before editing, keep the change minimal, keep existing props and exports backward compatible, and list every such edit in your report. Other agents are editing other areas at the same time.
- Same DOM, same class names, same element order as staging. Don't restyle; don't add CSS frameworks. Plain `<img>`.
- Do NOT run `npm run build` or start a server (shared `.next`; dev server already runs on port 3100). Do NOT commit.
- At the end run in `backoffice-app/`: `npx tsc --noEmit` and `npx eslint <files you changed>`. Your files must be clean (errors from other agents' in-progress files: mention them, don't fix them).

## Write-up
Write `backoffice-reference/pages/<page>/AUDIT-2026-11-15.md` per page: a table of state → differences found → cause → fix (file) → final result (diff pixel count / regions left and why). List every state you could NOT reach or verify, and why.

## Final report to the parent (under ~400 words)
Per state: clean / what is still different and why. Shared-file edits. Shell differences for the parent. Unverifiable states. Command results.
