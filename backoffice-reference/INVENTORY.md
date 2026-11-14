# Back-office capture inventory (staging superx "AUTO FAST", captured 2026-11-14)

Viewport for every screenshot: 1111 × 1092 CSS px, Chrome, Thai UI (THA). Files suffixed `_0.6x`/`_0.7x`/`_half-scale` are down-scaled; all others are full resolution.

## How to read the captured HTML (important)
- DOM was serialised from the **live, JS-rendered** page, scripts removed. CSS class names, ids, `data-*`, `onclick` etc. are exact.
- **Inline `style="…"` VALUES are NOT included.** The browser tool's output filter blocks most inline style strings, so every element that had a style attribute carries `data-capture-style-props="prop1 prop2"` listing the CSS property *names* only (e.g. `--item`, `display`, `width`, `color`). Most are runtime values set by legacy JS (display toggles, wheel `--item:N`, widths); use screenshots + `legacy-js/` to recover values. `style=""` (empty) is kept as-is.
- `<!--capture-gap…-->` / `data-capture-gap="opening tag attributes withheld…"`: a node the tool filter withheld; for openers the tag name was recovered, attributes lost. Counts per file are listed below.
- Record GUIDs were replaced by `uuid-N` (stable within one file). `?v=` query strings and base64 data-URIs were stripped.
- `<!-- [collapsed N more siblings "TAG class" …] -->`: long lists of identical siblings were shortened to the first 1–3 items; the full item lists (value | text) are in the sibling `*.lists.json` file or the page `data.json`.
- `<div data-capture="ckeditor5-ui-omitted" data-ck-class=… data-editable-class=…>`: CKEditor 5's generated UI (toolbar) was omitted; the original `<textarea>` precedes it and the editable content is inside. Load `/lib/ckeditor5-default/build/ckeditor.js` to regenerate.
- `<svg data-capture-omitted="large inline svg (N chars)…">`: inline SVG > ~3 KB skipped (game-category icons in mini-game step 2-3). See screenshots.
- Live form state (values/checked/selected) was reflected into attributes.

## Shared
| Item | File |
|---|---|
| Shell (html/body attrs, head CSS order, sidebar, logo, menu, language switcher + dropdown markup, logout, collapse button, `#back-to-top`, `#preloader`, `#removeNotificationModal`) | `shell/shell.html` (3 gaps documented in its header comment; raw: `shell/shell-body.fragment.html`) |
| Sidebar expanded / collapsed / collapsed+hover | `shell/screenshots/shell-expanded_minigame-settings.jpg`, `shell-collapsed.jpg`, `shell-collapsed-hover-item_half-scale.jpg` |
| flatpickr range calendar (open) | `shell/flatpickr-calendar_rangeMode_open.html`, screenshot `pages/minigame-settings/screenshots/04-filter-created-date-flatpickr-open.jpg` |
| Stylesheet order per page, inline styles, html/body attributes, scripts | `styles.md` |

## Pages
### 1. minigame-settings — /promotion/mini-game-v2 (also `/` redirects here)
- `pages/minigame-settings/page.html` (cards list; 2 gaps: search-clear svg, 1 svg def), `data.json`, `notes.md`
- Screenshots: `screenshots/01-full-page-top.jpg`, `02-create-dropdown-open_zoom.png`, `03-filter-status-dropdown-open_zoom.png`, `04-filter-created-date-flatpickr-open.jpg`
- Create lucky-wheel wizard (`#offcanvasMinigameSetting`) — `modals/`:
  - Step 1 details: `create-lucky-wheel_step1.html` (1 gap) + `.jpg`
  - Step 2 (3 tabs, duration/workdays, countdown, limits incl. 11 customer groups, 60 game providers): `create-lucky-wheel_step2_all-tabs.html` (21 gaps — mostly the game-category SVG icons) + `.lists.json`; screenshots `create-lucky-wheel_step2-1_duration-workdays.jpg`, `step2-2_countdown.jpg`, `step2-3_limits_a-top/b-middle/c-bottom.jpg`
  - Step 3 deposit rules + templates for per-slice reward & bonus-type rows: `create-lucky-wheel_step3_deposit-rights.html` (31 gaps — inside `<template>` elements whose style attrs could not be stripped) + `.lists.json` + `.jpg`
  - Step 4a mini-game display layout (mini-game type only): screenshot only `create-lucky-wheel_step4a_minigame-display-layout_(mini-game-type-section).jpg` (DOM NOT captured)
  - Step 4b lucky-wheel config, 8 slices, preview wheel, test-spin overlay, "Wheel 1..8" reward sections: `create-lucky-wheel_step4b_wheel-config-8-slices.html` (6 gaps; slices collapsed to Wheel 1 — Wheel 2..8 identical with index N) + `.lists.json`; screenshots `step4b_wheel-config_a-top.jpg`, `_b-slices.jpg`
  - Step 4c theme colours (28 asColorPickers, bg uploads): `create-lucky-wheel_step4c_theme-colours.html` + `.lists.json` (all 28 pickers with defaults) + `step4c_theme-colours_a-top.jpg`
  - Step 5 turnover + Step 6 summary: `create-lucky-wheel_step5-turnover_and_step6-summary.html` (1 gap) + `.lists.json`; `create-lucky-wheel_step5_turnover.jpg`, `create-lucky-wheel_step6_summary_top.jpg`
- Create "mini-game other" (same offcanvas, different title/sections): `create-mini-game-other_step1.jpg`
- View (eye) — summary filled: `view-lucky-wheel_eye_summary_top.jpg`, `view-lucky-wheel_eye_summary_rewards.jpg`, rewards accordion DOM `view-lucky-wheel_rewards-accordion_filled.html`
- Edit (filled): `edit-lucky-wheel_step1_filled.jpg`, all loaded field values `edit-lucky-wheel_filled-values.json`
- Bonus pill popup `#modalShowWheelDetail`: `bonus-slice-detail_modalShowWheelDetail_open.html` + `.jpg`

### 2. minigame-report — /report/promotion/minigame
- `page.html` (summary table state, 4 gaps), `page_state-drilldown-per-member.html` (after row click, 6 gaps), `data.json`, `notes.md`
- `screenshots/01-full-page-top.jpg`, `02-drilldown-row-click_QA-Other-Retest.jpg`

### 3. minigame-history — /promotion/minigame/history
- `page.html` (+ hidden change-status dropdowns & confirm modals; 5 gaps), `data.json`, `notes.md`, `screenshots/01-full-page-top.jpg`
- `modals/create-manual-promotion_offcanvasCreateManual_select2-open.html` (offcanvas + open select2 dropdown), `create-manual-promotion_offcanvasCreateManual.jpg`, `create-manual-promotion_select2-minigame-open_0.6x.jpg`

### 4. minigame-deposit-check — /promotion/minigame/minigame-period-deposit
- `page.html` (empty state), `data.json`, `notes.md`, `screenshots/01-full-page-empty-state.jpg`

### 5. mission-settings — /mission
- `page.html` (stats + 4 cards, server-rendered), `data.json`, `notes.md`, `screenshots/01-full-page-top.jpg`
- Create/edit form (/mission/setting): `create/create-mission_part1_basic-duration-rewards-finish.html` (29 gaps, mostly inside `<template>`s) + `.lists.json`; `create/create-mission_part2_submission-1.html` (43 gaps, same cause) + `.lists.json`; `create/edit-mission_filled-values.json`
- Screenshots `create/screenshots/01-create-top_section1-open.jpg`, `02-section1-basic-scrolled_0.7x.jpg`, `03-section2-duration-rewards-open_0.7x.jpg`, `04-section2-reward-and-turnover-switches-on.jpg`, `05-section3-submission-1-open.jpg`, `06-edit-mission_QA-Happy-Mission_filled.jpg`
- Popup `create/modals/popup-icon-style_open.html` + `popup-icon-style_open_0.7x.jpg`

### 6. mission-report-member — /mission/report
- `page.html` (1 gap), `data.json`, `notes.md`, `screenshots/01-full-page-top.jpg`
- `modals/add-reward-manual_openModalManual_open.html` + `_0.7x.jpg`

### 7. mission-report-mission — /mission/report-mission
- `page.html` (full grouped table, 1 gap), `data.json`, `notes.md`, `screenshots/01-full-page-top.jpg`

### 8. mission-redeem-points — /mission/redeem-points
- `page.html` (incl. closed `#redeemModal`; 2 gaps), `data.json`, `notes.md`, `screenshots/01-full-page-empty-state.jpg`
- `modals/redeem-point_redeemModal_open_0.7x.jpg`; `modals/redeem-conditions_offcanvasRedeemConditions_open.html` (3 gaps incl. the CKEditor image) + `.jpg`

## NOT captured (and why)
**Blocked by the browser tool output filter (cannot be worked around):**
- All inline `style` attribute values (property names only kept); some `<svg>` icons (search-clear icon on minigame-settings; filter icons for "ผู้ทำรายการ"/Agent/ภารกิจ on several pages; language-flag SVGs in mission forms; refresh icon) — marked as gaps; recover from screenshots or `legacy-js`.
- 1 line of minigame-settings inline style A and 2 rules of /mission inline style C (checked custom-checkbox background-image) — see styles.md.
- The CKEditor content image in redeem conditions (`<img>` tag withheld; visible in screenshot).
- Parts of `<template>` elements (template content isn't reachable by the style-stripping pass) — many gaps in mini-game step 3 and the mission form are inside templates; the equivalent live (non-template) markup in the same file is complete.
- CKEditor runtime CSS (190 KB) — regenerated by ckeditor.js; not transferred.
**Safety rules (not clicked/opened):** every save/บันทึก/ยืนยัน/ยืนยันการสร้าง…, delete icons and their confirmations, status toggles on cards (mini-game & mission), change-status dropdown on history rows, drag-reorder of mini-game cards, test-spin, file uploads, "ดาวน์โหลด Template" link, language switcher (THA/ENG dropdown markup is in shell.html, closed), Logout. SweetAlert/confirm popups therefore only exist as closed markup (`#modalConfirmChangeStatus*` in minigame-history/page.html, `.system-swal` empty containers) — reconstruct from legacy JS.
**Budget/time decisions (could be captured in a follow-up):**
- Mini-game step 4a (mini-game display layout) DOM; `#popup-image-style` and `#popup-game-type` (mission form) DOM; `template#templateSubMission` (same as sub-mission 1).
- Separate pages reachable from these 8 pages: /mission/agent-setting (gear), /mission/banner-setting (อัพโหลดแบนเนอร์), /mission/mission/history (ประวัติการแก้ไข), /mission/report-mission-member-detail/<n>, /mission/report-mission-by-mission/<id>, /mission/report-mission-by-reward/<id>, /mission/report-mission-by-member/<id>.
- Hover/active visuals of buttons (not compared); pagination pages 2–3 (only page 1 captured; totals noted); tooltips (info icons on history/report status).
- `#theme-settings-offcanvas` (Velzon customizer, never shown).
**Data that doesn't exist on staging:** minigame-deposit-check and mission-redeem-points tables are empty (only empty states captured); no "offline" missions; no expired/inactive mini-games (only "เปิดใช้งาน" cards).
**Other notes:** the step-2…6 screenshots of the mini-game wizard were produced by toggling step `display` via JS (Next is disabled until required fields are filled), so their header still reads "Step 1 … Step 1/5". Network methods: only `POST /mission/redeem-points-table` is verified; other endpoint paths are listed per page without verified methods.

---

# Round 2 (captured 2026-11-14, same staging session, tab in the agent's own group)

**Viewport note (important):** in round 2 the page reported `innerWidth × innerHeight = 1704 × 1675` CSS px at devicePixelRatio 1; the screenshot tool returns a down-scaled 1111 × 1092 frame of that viewport (scale ≈ 0.652). Round-1 screenshots use the same 1111 × 1092 frame, so the "1111 × 1092 CSS px" statement above is very likely the screenshot frame, not the layout viewport. Runtime pixel values in the new `*.styles.json` files (dropdown `top/left`, tooltip `transform`, etc.) were measured at 1704 px wide.

## New: inline style values (`*.styles.json`) — item 7: WORKED (mostly)
Reading `element.style` per property is NOT blocked by the tool filter (only whole `style="…"` strings are). Every `*.styles.json` maps a CSS selector path (from the captured root; `#id` when available, else `tag.firstClass:nth-of-type(n)`; `template#x ::content > …` = inside a `<template>`) → `{property: value}`. Values are longhands plus the shorthand as written (e.g. `background: var(--vz-input-group-addon-bg)`, `border-radius`, `margin`); runtime state at capture time (create wizard freshly opened = default state; mission form = state right after page load, which already shows some validation errors as `display:block`).
| File | Elements | Notes |
|---|---|---|
| `shell/shell.styles.json` | 39 | body minus page content/offcanvas/theme customizer; incl. SimpleBar track/scrollbar/placeholder values, `#modalShowWheelDetail` button width, body-level hidden template blocks (`#…-template`) |
| `pages/minigame-settings/page.styles.json` | 28 | card list: wheel `--item:1..8`, header bonus flex, `#btnAddMinigame` width 168px, create dropdown-menu bg `rgb(13,42,39)` radius 12px width 207px, pagination colours |
| `pages/minigame-settings/modals/create-lucky-wheel_step1.styles.json` | 57 | 2 values blocked ("Sensitive key") on `.show-detail` header bits |
| `…/create-lucky-wheel_step2_all-tabs.styles.json` | 78 | |
| `…/create-lucky-wheel_step3_deposit-rights.styles.json` | 60 | |
| `…/create-lucky-wheel_step4b_wheel-config-8-slices.styles.json` | 254 | incl. `#wheelDisplayRewardText` fonts (Kanit), all `--item` |
| `…/create-lucky-wheel_step4c_theme-colours.styles.json` | 68 | **64 values blocked** by the filter (all asColorPicker trigger spans/inputs and bg-upload previews). Not worked around (rule). Picker defaults are in round-1 `create-lucky-wheel_step4c_theme-colours.lists.json`. |
| `…/create-lucky-wheel_step5-turnover_and_step6-summary.styles.json` | 145 | day-dot colours (Sun `rgb(255,119,119)` … Sat `rgb(167,99,255)`, everyday `rgb(145,145,145)`), hr margins `0 -28px 8px` |
| `…/create-mini-game-other_step4a_display-layout.styles.json` | 106 | 1 value blocked |
| `pages/mission-settings/create/create-mission_part1_basic-duration-rewards-finish.styles.json` | 109 | incl. colour-picker trigger gradients (not blocked here) |
| `pages/mission-settings/create/create-mission_part2_submission-1.styles.json` | 84 | |
| `pages/minigame-report/page_state-drilldown-per-member.styles.json` | 13 | |
| new pages: `mission-history/page.styles.json`, `mission-report-member-detail/page.styles.json`, `mission-report-mission-detail-by-mission/page.styles.json`, `mission-banner-setting/modals/banner-1_…styles.json`, `minigame-report-detail/modals/*.styles.json` | | |
`pages/mission-settings/page.html` (mission cards) has no `data-capture-style-props` markers, so no styles file was needed. Paths refer to the live DOM: where the captured HTML collapsed siblings, nth-of-type indices still count the full list.

## New pages
### 9. mission-agent-setting — /mission/agent-setting (gear button on /mission)
`pages/mission-agent-setting/`: `page.html` (0 gaps; agent cards cloned from `template#missionAgentItemTemplate`), `data.json`, `notes.md`, screenshots `01-full-page-top.jpg`, `02-section-collapsed_zoom.png`, `03-section-expanded_zoom.png`. Page script `/js/scriptmission-agent-setting.js` is not in `legacy-js/`.
### 10. mission-banner-setting — /mission/banner-setting ("อัพโหลดแบนเนอร์" on /mission)
`pages/mission-banner-setting/`: `page.html` (3 banner cards, read-only `banner-disable` state, 0 gaps), `data.json`, `notes.md`, `screenshots/01-full-page-top.jpg`; `modals/banner-1_edit-mode_zoom.png`, `banner-1_edit-mode_menu-dropdown-open.html` + `.jpg` + `.styles.json`, `banner-new_after-add-button.html` + `.jpg` (client-side only; page reloaded afterwards). Script `/js/scriptmission-banner-setting.js` not in `legacy-js/`.
### 11. mission-history — /mission/mission/history (path verified from the link on /mission and /mission/agent-setting)
`pages/mission-history/`: `page.html` (0 gaps), `page.styles.json`, `data.json` (all 25 rows), `notes.md`, screenshots `01-full-page-top.jpg`, `02-limit-50-all-25-rows_0.6x.jpg`; `modals/filter-edit-date_flatpickr-open_zoom.png`, `pagination-limit-dropdown-open_zoom.png`. Empty `<title>`; no mission.css (own inline style, see styles.md).
### 12. mission-report-member-detail — /mission/report-mission-member-detail/<memberId>
`pages/mission-report-member-detail/`: `page.html` (0 gaps — the filter-icon SVGs blocked in round 1 came through here), `page.styles.json`, `data.json`, `notes.md`, `screenshots/01-full-page-top.jpg`, `modals/filter-{mission,type,maker}-dropdown-open_zoom.png`.
### 13. mission-report-mission drill-downs (one folder per link kind)
- `pages/mission-report-mission-detail-by-mission/` — /mission/report-mission-by-mission/<missionId>: `page.html` (14 rows, 0 gaps), `page.styles.json`, `data.json`, `notes.md`, `screenshots/01-full-page-top.jpg`.
- `pages/mission-report-mission-detail-by-reward/` and `…-by-member/` — /mission/report-mission-by-reward|by-member/<id>?isMission=true|false: **only the empty state exists on staging** (tried mission + sub-mission links with non-zero counts) — `page.html`, `data.json`, `notes.md`, empty-state screenshots. The two pages are byte-identical and both call `POST /mission/report-mission-by-member-table/<id>`.
### 14. minigame-report-detail (no separate URL — in-page drill-down of /report/promotion/minigame)
`pages/minigame-report-detail/`: `notes.md`, `data.json`, `screenshots/01-drilldown-after-row-eye-click_QA-Other-Retest.jpg`, `02-detail-card-period-bar-click_zoom.png`; `modals/status-info-tooltip_hover.html` + `.styles.json` + `_zoom.png`, `row-eye-button_tooltip-hover_zoom.png`, `view-minigame-other_offcanvas-summary.html` (view-mode summary of a "มินิเกมส์อื่น ๆ", 0 gaps) + `.styles.json` (141 values) + 3 screenshots. The drill-down DOM itself is round 1's `pages/minigame-report/page_state-drilldown-per-member.html`.

## Additions to round-1 pages
- **minigame-settings** (`modals/`): mini-game-other wizard step 4a DOM `create-mini-game-other_step4a_display-layout.html` (all 3×9 upload slots, 0 gaps) + `.styles.json` + screenshots `…_a-top.jpg`, `…_b-steps2-3.png`, `…_9-choices_style-section-expanded.png`, `…_9-choices_different-images_9-upload-slots.png`; step 4b for mini-game type = reward-choice sections `#minigameWheelMain-1..9` (lucky-wheel preview/frame sections hidden): `create-mini-game-other_step4b_reward-choice-1.html` (6 radio/number `<input>` tags were withheld by the filter and **rebuilt from per-attribute reads**, marked with `<!--capture: rebuilt-->`) + `…_reward-choice-config_top.png`; `create-mini-game-other_step1_0.5x.jpg`. Steps were revealed by toggling step `display` via JS in our tab (same method as round 1). Other mini-game-other steps (1,2,3,5,6) use the same DOM as the lucky-wheel files (title/i18n swapped by JS) — not re-captured.
- **mission-settings create** (`create/modals/`): `popup-image-style_open.html` + `.lists.json` (3 categories × 11/12/11 cover images, cdn.lsmloyalty.com/images/mission/cover/0N/mission-NN.webp) + `.jpg`; `popup-game-type_open.html` + `.lists.json` + `.providers.json` (all 64 provider checkboxes with `data-payload` {lsmGameId, code, name, category}) + `_open_sport-default.jpg`, `_games-category_zoom.png`. NOTE: the brief listed these two popups under minigame-settings, but they live in the mission create form (/mission/setting). `#popup-game-type` was opened by **adding `show animate-in` classes via JS** in our tab because its trigger (`chooseGameType`) stays disabled until a sub-mission condition "ทำเทิร์นโอเวอร์ + กำหนดเฉพาะเกม" is chosen, and the condition dropdown did not open in our session. Its 44 provider `<input>`s were withheld by the filter and rebuilt from per-attribute reads (exact `data-payload` whitespace unknown).
- **minigame-report** (`modals/`): auto-refresh settings dropdown open: `auto-refresh-settings-dropdown_open.html` (button group) + `auto-refresh-settings-dropdown_open.list.html` (`#dropdownAutoRefresh`: 30s/45s/60s ✓/120s/ปิดการ Auto Refresh) + `_zoom.png`.

## Discovery sweep (item 6) — reachable from the 8 sidebar pages
Everything reachable is now captured except: the "คัดลอกการตั้งค่าจากภารกิจอื่น" copy picker on /mission/setting (round 1: list only), the edit-mission view of each card (round 1 has one), per-row tooltips on minigame-history, and the theme customizer offcanvas. No other hrefs exist on minigame-history, minigame-deposit-check, mission-redeem-points or minigame-report besides those already listed.

## NOT captured in round 2 (and why)
- Populated tables of report-mission-by-reward / by-member: staging returns no rows (see notes).
- `#popup-game-type` opened through its real trigger (see above); clicking a category button inside it does not toggle an `active` class (no visual selected state found).
- 4c theme-colour inline values and 3 other single values: blocked by the tool output filter ("Sensitive key") — left as `"[BLOCKED…]"` strings, not worked around.
- Not clicked (safety): banner delete / ยืนยัน / auto-slide switch / file inputs / drag-reorder; agent switches, reset-icon link and save; manual-reward confirm; all saves. The "เพิ่มรางวัลให้สมาชิก (Manual)" button on the member-detail page is inert (no modal markup on that page).
- `/js/scriptmission-agent-setting.js`, `/js/scriptmission-banner-setting.js` (and history page's inline logic) are not in `legacy-js/` — not downloaded per round-2 rules.
