# minigame-settings — /promotion/mini-game-v2 (ตั้งค่ามินิเกมส์)

`/` redirects here (logo link target). Viewport used for all screenshots: 1111 x 1092 CSS px.

## Page structure
- `.page-content > .container-fluid.full-container > svg#filter-gradient defs + .inner-container.full-flex > .custom-card.full-card.full-flex`
- Title row: `h4` ตั้งค่ามินิเกมส์ (`.title-header-custom-mini-game`), sub-title รายชื่อมินิเกมส์, tips snackbar trigger (`.snackbar-collapes` → `CustomSnackBar.open('#customSnackbar1')`, hidden `#customSnackbar1` "Tips ! ... ลากไปวางในลำดับที่ต้องการ").
- Header button `#btnAddMinigame` "สร้างมินิเกมส์" (`data-bs-toggle="dropdown"`) → `ul.dropdown-menu.p2.fw-500` with 2 items:
  - วงล้อนำโชค → `openminigameSetting('create','lucky-wheel')`
  - มินิเกมส์อื่น ๆ → `openminigameSetting('create','mini-game')`
- Filters row (`.custom-filter` pills, each followed by `.dropdown-wrapper > .custom-dropdown > .custom-dropdown-body > .custom-dropdown-item`): search `#minigameSearch`, created-date `#filterPromotionDateTime` (flatpickr range on `#datepickerPromotionDateTime`, toggled by `datepickerPromotionDateTime.toggle()`), status `#filterStatus`, type `#filterType`, created-by `#filterCreatedBy`, agent `#filterAgent`. Option lists in data.json. Each pill has `.filter-icon`, `.filter-title`, `.filter-value`, `.filter-toggler` (chevron), `.filter-close` (x, shown when a value is set).
- List `#divMinigameTable.system-table.content-minigame`: `.table-loading` (lord-icon + กำลังค้นหาข้อมูล) then `#customMinigameDraggable.main-minigame` of `.menu-item.card-minigame[draggable=true]` (drag handle `.minigame-menu-dragger` — dragging reorders and the page auto-posts `/api/promotion/mini-game/update-sequence-auto`; NOT exercised).
- Card: `.minigame-col-1` (type badge `.type-minigame[.type-luckywheel]`, status badge `.status-minigame.minigame-on|off`, thumbnail = `.wheel-wrapper > .custom-wheel.wheel-8` with 8 `.wheel-item` (style `--item:N`) for lucky-wheel, or `img.cover-minigame` for mini-game; name, created/updated dates + `.system-badge.badge-primary|badge-secondary`), `.minigame-col-2` (header + eye button `viewMinigameDetail(id,type)` + status toggle `changeMinigameStatus(id,this,type)` [NOT clicked], bonus pills `.data-value-bonus` → `openModalShowWheelDetail(...)`), footer "Agent ที่ใช้งานอยู่" + `.custom-badge.bg-green-10` chips.
- Pagination `.system-pagination`: limit dropdown (10/20/50/100), "แสดง 1 - 3 จาก 3 รายการ", `.pagination-list` (first/prev/page/next/last).

## Interactions captured
| Element | Result | Capture |
|---|---|---|
| สร้างมินิเกมส์ button | Bootstrap dropdown | screenshots/02-create-dropdown-open_zoom.png |
| วงล้อนำโชค | `#offcanvasMinigameSetting` (offcanvas-end) create wizard, title สร้างวงล้อนำโชค | modals/create-lucky-wheel_* |
| มินิเกมส์อื่น ๆ | same offcanvas, title สร้างเกมส์อื่น ๆ, header "ระบุรายละเอียดมินิเกมส์ : เกมส์อื่น ๆ", other i18n keys (`minigameDetailText`, `minigameOpenSetting`), mini-game sections (`.custom-type-mini-game`) shown instead of lucky-wheel ones | modals/create-mini-game-other_step1.jpg (DOM identical to lucky-wheel files; sections toggled by JS) |
| Eye icon | same offcanvas in view mode: title รายละเอียดวงล้อนำโชค, orange button แก้ไขข้อมูลวงล้อนำโชค (`#btnEditMinigameDetail` → `editMinigameDetail()`), body = Step 6 summary filled from `POST /api/promotion/lucky-wheel/get/` | modals/view-lucky-wheel_* |
| แก้ไขข้อมูล… | edit mode: title แก้ไขข้อมูลวงล้อนำโชค, step 1 filled, extra footer button ไปหน้าสรุป | modals/edit-lucky-wheel_step1_filled.jpg, edit-lucky-wheel_filled-values.json |
| Bonus pill | `#modalShowWheelDetail.system-modal.popup-wrapper.show` (custom modal, success banner/avatar) | modals/bonus-slice-detail_* |
| Status filter | custom dropdown | screenshots/03 |
| Date filter | flatpickr rangeMode calendar appended to body | screenshots/04, shell/flatpickr-calendar_rangeMode_open.html |

## Create wizard (offcanvas) — steps
Steps are `#SettingMinigameStep1..6` inside `#rootScrollMinigame.offcanvas-body`; navigation `btnStepSettingMinigame(this, current, next)` validates client-side (Next stays `.disabled` until name + agent are filled), so steps 2–6 were revealed for capture by toggling `display` via JS (no data entered). Because of that the stepper header (`.session-title-minigame`) still reads "Step 1 … Step 1/5" in the step 2–6 screenshots; in the real flow `#textTitleStepSettingMinigame`, `#textDetailStepSettingMinigame`, `#progressStepSettingMinigame` (width) and `#textStepAllSettingMinigame` change per step.
1. Step 1 – details: on/off switch `#minigameStatus`, language pills TH/EN/TL (`selectMultiLanguage`), name per language, CKEditor5 condition per language (3 editors), agent custom dropdown `#customSelectAgentDropdown` (superxx=669, superx=501), icon upload slot (`#fileImageIconImage`, default ic-wheel.png).
2. Step 2 – 3 tabs: 2-1 duration & working days (flatpickr date/time inputs, day buttons อา–ส, weekday/weekend/everyday buttons, time slots template `#templateMinigameDatetime`, add-slot button); 2-2 countdown (switch, 4 radio modes, 8 colour styles `.countdown-minigame.style-N`); 2-3 limits (system-wide per day/week/month/promo, per-member per time/day/week/month/promo, customer-group multi-select (11 groups), reset modes (on expire / fixed time / d:h:m), deduct-from-other-minigames repeater (template `#templateMinigameRemoveChance`), game-provider table (4 category buttons ×3 states + 60 provider checkboxes), other limits).
3. Step 3 – deposit rules: deposit type dropdown (ฝากครั้งเดียว/ฝากสะสม/ฝากติดต่อกัน), amount type (ฝากเท่ากับ/ฝากขั้นต่ำ/ฝากสูงสุด/ช่วงยอดฝาก) → conditional amount inputs (6 variants), turnover approval checkboxes, withdraw balance checks; templates `#templateMinigameWheel` (per-slice reward block) and `#templatePromotionConditionType` (bonus type: credit_fix / credit_percentage / mini-game; plus point/quota/reward-name variants).
4. Step 4 – (a) mini-game display layout (3/6/9 cards, image upload slots) — only for mini-game type; (b) lucky-wheel config: slice count 6/8/10, bonus before/after turnover, frame/spin-button/popup image uploads, live wheel preview with 8 slices + "Wheel N" upload labels, test-spin overlay `#minigameTestLayout`, 8 × "Wheel N" reward sections (description*, chance %, limit radios, alert radios, limit/alert counts, bonus-type repeater "เพิ่มโบนัส"); (c) theme colours: bg images (mobile 430x932, desktop 1920x1080, etc.) + 28 asColorPicker inputs.
5. Step 5 – turnover: switch, two selectable cards (x times / x baht), min-turnover, period radios; hidden (d-none) withdraw / clear-turnover / add-credit sections.
6. Step 6 – summary (server-rendered with sample values e.g. "ฝากประจำนับโปร…", "agent demo 1", 20 สิทธิ์ — JS overwrites them); final button ยืนยันการสร้างโปร → `openConfirmUpdatePromotionSwal('create')` (NOT clicked).

## Not exercised (safety)
Status toggles, drag-reorder, ยืนยันการสร้างโปร / save, delete, file uploads, ดาวน์โหลด Template link (`/files/all_spin_template.zip`), test-spin button, language switcher.

## Network (method + path)
Page load: GET /locales/th.json, GET /api/staff/select2, GET /api/agent/get-credit-agent, GET /sms/get-credit, GET /api/promotion/mini-game-v2, GET /api/promotion/get-promotion-deposit-mini-game, POST /api/promotion/mini-game/update-sequence-auto (fires automatically on load — method inferred as POST is NOT verified; only path seen via performance API), lordicon JSON from cdn.lordicon.com.
Open create: GET /api/promotion/get-promotion-deposit-mini-game, GET /api/promotion/get-game-provider-list.
Eye/view: POST /api/promotion/lucky-wheel/get/

## Round 2 additions
- Mini-game-other wizard step 4a DOM + step 4b reward-choice DOM (see INVENTORY Round 2). For the mini-game type, step 4 shows: (a) `.settingImgMiniGameCustom` display layout — choice count 3/6/9 (`.box-select-quantity[data-count-mini-game]`, `.active`), Step 1 choice images (required), Step 2 after-pick images (+ "ข้าม Step 2" checkbox `#isCheckNextStep2`), Step 3 result images; each with collapsible style sections (`.btn-on-drop-header-mini-game` → class `drop` + `data-drop="drop"` when open) and upload slots `#boxUpLoadImg{Before|After}N` / `#boxUploadImgResultsN` (only slot 1 shown while "แสดงผลรูปเหมือนกันทั้งหมด" is selected; N slots when "แตกต่างกันทั้งหมด"); (b) "การปรับแต่งและตั้งค่ามินิเกมส์" before/after-turnover radios + `#minigameWheelMain-1..N` "ตั้งค่ารางวัลตัวเลือกที่ N" sections (same fields as lucky-wheel "Wheel N"); (c) theme colours (same as lucky-wheel 4c).
- Inline style values for page + all wizard step files: `*.styles.json` (4c mostly blocked).
