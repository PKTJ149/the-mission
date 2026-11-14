# Legacy JS notes (reference only)

These files were downloaded from staging so we can see how the original UI behaved.
They are never imported or executed by `backoffice-app`. Line numbers refer to the
downloaded copies in this folder.

| File | Lines | Role |
| --- | --- | --- |
| `scriptminigame.js` | 10,272 | Mini-game / lucky-wheel list page + the 5-step create/edit offcanvas |
| `scriptmission.js` | 274 | Mission list: status toggle, delete, edit redirect, custom popup alert |
| `helper.js` | 4,590 | Shared widgets: `CustomSweetAlert`, `CustomModal`, `Popup`, `CustomDropdown`, `CustomDatePicker`, `CustomTabs`, `CustomSnackBar`, `FormValidator`, `YupSchema` |
| `table.js` | 492 | `Table` class: POSTs filters, receives **server-rendered HTML rows** and appends them |
| `i18n.js` | 128 | i18next + jquery-i18next setup (see "i18n" below) |
| `base.js`, `operator.js` | 532 / 183 | Layout helpers (sidebar, operator switch) |
| `layout.js`, `plugins.js` | 1 line each | Minified theme bootstrap (layout attrs from sessionStorage) |

## Shared building blocks (helper.js)

- **`CustomSweetAlert`** (helper.js:3527) - not the SweetAlert2 library. Injects
  `.system-swal > .swal-wrapper > .swal-content` with `.swal-close`, `img.swal-banner`,
  `img.swal-avatar`, `.swal-inner` (`h4.swal-title`, `p.swal-text.p3`, `.swal-custom`,
  `.swal-btns` with `.swal-btn-cancel.btn.system-btn.btn-a.btn-rounded` and
  `.swal-btn-confirm.btn.system-btn.btn-rounded`).
  - `type` in `['saving','success','danger','loading']` sets banner/avatar to
    `/assets/images/swal/banner-${type}.png` and `/assets/images/swal/icon-${type}.png`
    (saving/success/danger exist; loading uses lottie `/assets/images/swal/save-file.json`).
  - Defaults: `confirmText: 'ยืนยัน'`, `cancelText: 'ยกเลิก'`, closes on backdrop.
  - Loading body text: "เรากำลังทำงานอย่างหนักเพื่อคุณ !" / "อดใจอีกสักนิดนะคะ...ระบบกำลังบันทึก ..."
- **`CustomModal`** (helper.js:4081) - wraps an element with `.modal-wrapper`,
  `.modal-container`, `.modal-close`; opened through the shared `Popup` backdrop.
  Not Bootstrap's `.modal()` (no `.modal(` calls exist in scriptminigame.js).
- Bootstrap **offcanvas** is used for the big panels (`$(...).offcanvas('show'|'hide')`).

## scriptminigame.js - page `/promotion/mini-game-v2`

### What renders the list
- On ready (line ~176): `new Table("#divMinigameTable", "/api/promotion/mini-game-v2")`
  with search `#minigameSearch`, date range `#datepickerPromotionDateTime` (field `dateBkk`),
  multi filters `status`, `type`, `createdBy`, `agentId` (CustomDropdowns
  `#dropdownCreatedBy` etc.). The rows/cards are **HTML returned by the server**, so their
  markup must come from the capture, not from this file.
- Each row has `[data-minigame-id="{id}"]` with an eye button -> `viewMinigameDetail`.

### Panels / modals and who opens them
| Function | Line | Opens |
| --- | --- | --- |
| `openminigameSetting(action, type)` | 7353 | `#offcanvasMinigameSetting` (create / edit / detail). `action='detail'` shows `.show-detail`, hides `.show-edit` / `.show-create`, jumps to step 6 summary |
| `editMinigameDetail(id, type)` | 7634 | same offcanvas in edit mode |
| `viewMinigameDetail(id, type, sequencePie?, ...)` | 7639 | fetches detail; with `sequencePie` opens `modalShowWheelDetail` (`CustomModal('#modalShowWheelDetail')`, line 9274, body `#showModalShowWheelDetail`), otherwise the offcanvas in detail mode. Shows a spinner in the row button while loading |
| `openModalShowWheelDetail` / `closeModalShowWheelDetail` | 9277 / 9283 | wheel reward detail modal |
| `spinWheel()` | 3430 | offcanvas `#wheelDisplayRewardMain` (preview result) |
| `#btnWindowTestLuckywheelSpin` click | ~3465 | offcanvas `#minigameTestLayout` |
| `#btnWindowTestMinigame` click | ~3468 | offcanvas `#minigameTestLayout2` |
| `testMinigame()` | 3472 | offcanvas `#minigameDisplayRewardMain` |
| `openConfirmUpdatePromotionSwal(type)` | 6464 | confirm swal before save (below) |

### Create/edit wizard (inside `#offcanvasMinigameSetting`)
- Two kinds: `typeNow = 'mini-game'` or lucky wheel (`.custom-type-mini-game` /
  `.custom-type-lucky-wheel` toggled).
- `btnStepSettingMinigame(el, current, next)` (3482) / `btnPreviousStepSettingMinigame` (3478)
  switch `#SettingMinigameStep{n}` sections and update header:
  `#textTitleStepSettingMinigame` ("Step 2.2", "Step 3"...), `#textStepAllSettingMinigame`
  ("Step 2/5"...), `#progressStepSettingMinigame` width (40/60/80%),
  `#textDetailStepSettingMinigame` + `#textdescriptionStepSettingMinigame` using
  `minigameSetting.*` keys, e.g. `minigameSettingCountdown`, `minigameStepSettingText`,
  `minigameLimitRights` / `luckWheelLimitRights`, `minigameLimitText`,
  `minigameRightsSetting` / `luckyWheelRightsSetting` (+`...Text`),
  `minigameTurnoverSetting` (+`Text`). Step 4 text is hard-coded Thai:
  "กำหนดรูปแบบการแสดงผลมินิเกมส์" / "กำหนดรูปแบบการแสดงผล และของรางวัลสำหรับมินิเกมส์".
- Steps: 1 name + agent, 2-1/2-2 countdown, 2-3 limits, 3 rights/bonus, 4 display images
  + colours, 5 turnover, 6 summary (`nextPromotionMiniGameStepFinal`, 9197).
- Repeating templates: `addTemplateMinigameDatetime` (3031, "เวลาที่ {n}"),
  `addTemplatePromotionConditionType` (4395), `addTemplateMinigameRemoveChance` (4853),
  `addtemplateMinigameWheel` (5185), all cleared by `clearAllAddTemplat`.
- `changeWheel(number)` (8872) switches 6/8/10 slice wheels; `changeMinigame(number)` (8932)
  switches 3/6/9 box mini-game. Image hint `showLabalLuckywheelImagePixel` (2644):
  "ขนากรูป 220px x 220px" / "132px x 218px" / "150px x 196px" สกุลไฟล์ .png .jpg.
- Colour pickers (10002-10213) with defaults at the top of the file (e.g. bg
  `rgba(0,0,0,0.36)`, gold gradient `linear-gradient(270deg,#AB8B4D 0%,#FFF4DE 50%,#AB8B4D 100%)`).
- Enum values: types `deposit-once | accumulated-deposit | continuous-deposit`; amount
  `min-deposit | max-deposit | equal-deposit | deposit-period`; bonus `credit_fix |
  credit_percentage | lucky-wheel | mini-game | lotto | point | reward`.

### Validation (`validateStep`, line 3876)
Disables `#groupBtnSettingMinigame{step} [data-type="next"]` (class `disabled`) until all
checks pass; shows `.invalid-feedback` / adds `is-invalid` / `custom-invalid`.
- Step 1: name required -> "กรุณากรอกชื่อมินิเกมส์"; agent required (`#error-selectAgentDropdown`)
  -> "กรุณากรอกชื่อเลือก Agent".
- Name uniqueness: `checkMiniGameNameAvialable` (4350, debounced 500 ms) -> POST
  `/api/promotion/check-mini-game-name` `{name}`; taken -> `.invalid-feedback-minigame-name`
  "กรุณาเปลี่ยนชื่อเนื่องจากมีชื่อนี้ในระบบอยู่แล้ว".
- 2-2 countdown: when enabled, the chosen radio box's text inputs must be filled.
- 2-3 limits: per-person count must be a number > 0 (`#error-getPromotionPerUserTime`);
  customer-group dropdown required when `#enableLimitCustomerGroup` is on.
- 3 / 5: visible numeric inputs must be non-empty and > 0.
- Going to step 5 (mini-game): images required -> `.txt-error-img-require`
  "รบกวนอัพโหลดรูป ให้ครบถ้วน" and scroll the offcanvas body to top.

### Endpoints
| Method | URL | Used by |
| --- | --- | --- |
| POST | `/api/promotion/mini-game-v2` | list table (returns HTML) |
| POST | `/api/staff/select2` | "created by" filter options |
| GET | `/api/promotion/get-promotion-deposit-mini-game` | deposit promotion options |
| GET | `/api/promotion/get-game-provider-list` | game provider checklist |
| POST | `/api/promotion/check-mini-game-name` | name uniqueness |
| POST | `/api/promotion/mini-game/get/` `{MiniGameId}` | detail (mini-game) |
| POST | `/api/promotion/lucky-wheel/get/` `{LuckyWheelId}` | detail (wheel) |
| POST | `/api/promotion/mini-game/create-v2` | create mini-game |
| POST | `/api/promotion/lucky-wheel/create-v2` | create wheel |
| PUT | `/api/promotion/mini-game/update-v2` | update mini-game |
| PUT | `/api/promotion/lucky-wheel/update-v2` | update wheel |
| POST | `uploadUrl` (global from the page view) `{file, directory:'setting-minigame'}` | every image upload |

### Alert dialogs (all `CustomSweetAlert`, Thai text hard-coded, no i18n keys)
| When | type | title | text | buttons |
| --- | --- | --- | --- | --- |
| Before create | saving | ยืนยันการสร้างข้อมูลมินิเกมส์หรือไม่ ? | ระบบจะทำการบันทึกข้อมูลที่คุณได้ทำการสร้างใหม่ทันทีที่คุณกด “ยืนยัน” หากยังไม่แน่ใจว่าข้อมูลที่ สร้างนั้นถูกต้องหรือไม่ให้ กด “ยกเลิก” แล้วกลับไปตรวจสอบข้อมูลอีกครั้งให้แน่ใจ ก่อนจะทำการยืนยันบันทึก การแก้ไขข้อมูลนี้ แต่ไม่ต้องกังวัลไป คุณยังสามารถกลับมาแก้ไขข้อมูลได้ตลอดเวลา | ยืนยัน / ยกเลิก |
| Before edit | saving | ยืนยันการแก้ไขข้อมูลมินิเกมส์หรือไม่? | ระบบจะทำการเปลี่ยนแปลงข้อมูลที่คุณได้ทำการแก้ไขไว้ล่าสุด ... (see line 6486) | ยืนยัน / ยกเลิก |
| Saved (create) | success | บันทึกการสร้างข้อมูลมินิเกมส์ สำเร็จ ! | คุณสามารถกลับเข้ามาแก้ไขข้อมูลมินิเกมส์ของคุณได้ตลอดเวลา ... (line 7319) | ปิดหน้าต่าง only |
| Saved (edit) | success | บันทึกการแก้ไขข้อมูลมินิเกมส์ สำเร็จ ! | same | ปิดหน้าต่าง only |
| Upload failed | danger | ทำรายการไม่สำเร็จ ! | พบปัญหาในการบันทึกข้อมูล อัปโหลดไฟล์ไม่สำเร็จ | ปิดหน้าต่าง |
| Save failed | danger | ทำรายการไม่สำเร็จ ! | พบปัญหาในการบันทึกข้อมูล (Error : {status}) | ปิดหน้าต่าง |
| Load failed | danger | ทำรายการไม่สำเร็จ ! | พบปัญหาในการดึงข้อมูล (Error : {status}) | ปิดหน้าต่าง |
| No providers | danger | ไม่พบ Game Provider ! | พบปัญหาในการดึงข้อมูล Error : {status} | ปิดหน้าต่าง |

After a successful save: offcanvas hides, success swal appears after 2 s, table refreshes.

### Images referenced
`LEGACY_ASSET_BASE + "/images/minigame/..."` (wheel-spin-6, wheel-frame-6,
wheel-display-reward-6, wheel-6-6, minigame-reward, minigame-popup) and `/images/default/*`.
`LEGACY_ASSET_BASE` comes from `window.lsmLegacyAssetBase` (server config
`Media:AssetBaseUrl`), i.e. a separate media host. These 404 on the staging host, so they
were not downloaded - the capture should reveal the real host.

## scriptmission.js - page `/mission`

- **`CustomPopupAlert`** (line 1) - own popup, appended to `.main-content`:
  `.system-popup-alert > .system-popup-alert-content > .system-popup-alert-content-header h4`
  + `.system-popup-alert-content-inner > .system-popup-alert-content-inner-text`
  (`img /assets/images/mission/system-popup-alert/icon-${type}.png`, message) +
  `.system-popup-alert-btns(.confirm)` with `button.mission-btn-outline.system-popup-alert-btn-cancel`
  "Cancel" and `button.mission-btn.system-popup-alert-btn-confirm` "Confirm" ("Edit" when
  `type==='edit'`). Show = add classes `show animate-in`; hide = `animate-out`, removed after 800 ms.
  Icon types used: `on`, `off`, `delete`, `error`, `success`, `edit` (all downloaded).
- `toggleMissionStatus(missionId, input)` - switch in the list.
  Confirm popup: title `t('missionPage.js.confirm') + newStatus + t('missionPage.js.confirmMsg')`
  (newStatus is literally `online`/`offline`), type `on`/`off`, message
  `missionPage.js.missionStatusOnline` / `missionStatusOffline`. On confirm: POST
  `/mission/update-status` `{MissionId, Status}`, then a second popup
  title `newStatus + t('missionPage.js.confirmMission')`, message
  `missionStatusOnlineNew` / `missionStatusOfflineNew`, then `location.reload()`.
  Cancel reverts the checkbox. Error popup: `missionPage.js.error` / `tryAgainMission`, type `error`.
- `toggleMissionDelete(missionId)` - popup type `delete`, title `missionPage.js.confirmDelete`,
  message `confirmDeleteMsg`; on confirm POST `/mission/delete-mission` `{MissionId}`, then
  `confirmDeletePass` / `confirmDeletePassMsg`, reload. Error: `error` / `errorMissionMsg`.
- `toggleMissionEdit(missionId)` -> navigates to `/mission/setting?missionId={id}&edit=1`.
- `.main-content-mission` converts vertical wheel scroll into horizontal scroll (x2 speed).
- `toggleTranslate()` re-runs `$(".mission-page").localize()`.
- The list markup itself is server-rendered (not built in JS).

## i18n (i18n.js)

- i18next with HTTP backend, `fallbackLng: false`, `load: 'languageOnly'`, default `th`.
- Language stored in `localStorage['self-language']` (`th` | `en`); `?lang=th|en` also accepted.
- Markup uses `data-i18n="namespace.key"` (dot-separated nested keys, 2-4 levels, no
  `{{interpolation}}`, no arrays). jquery-i18next also supports `data-i18n="[attr]key"`
  but none of these files use that form.
- JS uses `$.t('missionPage.js.confirm')` or `i18nText(key, thaiFallback)`.
- Missing key -> i18next returns the key itself. Locale JSON files start with a UTF-8 BOM.
