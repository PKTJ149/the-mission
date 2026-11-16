# Audit 15/11/2026: mission create / edit form (`/mission/setting`)

Staging `https://superx.staging.lsmloyalty.com/mission/setting` vs local `http://127.0.0.1:3100/mission/setting`.

## Method

- Both tabs were 1704 × **1675** CSS px, DPR 2. The brief expects 1704 × 1731. The width and DPR were right, and both tabs had the same height, so the audit went ahead.
- **Structure check (main method).** A script walked every visible element under a root (`.page-content`, a section panel, a popup, the flatpickr calendar). For each element it recorded:
  - its path and class list (classes sorted, random `uuid-*` and CKEditor ids dropped);
  - its position relative to its parent and its size;
  - its own text;
  - colour, background, font, borders, radius, shadow, opacity, cursor, padding, `::before`, `src`, `value` and placeholder.

  It then hashed the lines on both tabs and compared them. Each state was rebuilt from a fresh page load with the same click / pick / type sequence on both tabs.
- **Pixel check.** `shot-diff.py` was used on full screenshots (create page, edit mission 1, image popup) and on zoomed crops for hover states.
- **Source.** Behaviour was read from staging's own form script (`/js/scriptmission-setting.js`, fetched in the page). The edit data came from `GET /mission/get-mission`, which the edit page itself calls.
- **Staging safety.** Nothing was saved. No บันทึก / ยืนยัน / ยินยันคัดลอก / delete clicks. Toggles were used only inside the unsaved form.

## Results

Every state in the table matches staging, apart from the items listed under "Left / not verifiable" below.

| State | Difference found | Cause | Fix (file) | Final |
| --- | --- | --- | --- | --- |
| Create, section 1 open (TH/EN/TL pills, switches, format, countdown, restrict, visibility) | Agent error text after any input; member-type rows showed errors before / after validation differently | Ours validated live; the original only updates errors when `validateMission1` runs, and writes `missionPage.js.errorSelectAgent` | `form-state.ts` (new: snapshot of last validation), `section-basic.tsx`, `form-section.tsx` | 0 diff lines |
| Member types: add row, pick member-group / life-span / created-date, age value, group pick | Header number position (`&nbsp;` is a flex item); `created-date` error shown by us, never on staging; `fill` / `error-input-group` / `custom-invalid` classes; add-row runs validation | Template uses `&nbsp;`; original shows and then hides the register error (ORIGINAL BUG kept) | `section-basic.tsx`, `form-state.ts` | 0 diff lines (one staging chunk is not stable between runs: animation) |
| Section header status texts (all sections, create + edit) | Edit showed "ข้อมูลสมบูรณ์" | toggleTranslate() puts the data-i18n text back after validation (ORIGINAL BUG kept: `.valid` teal colour + "ข้อมูลไม่สมบูรณ์") | `form-state.ts`, `form-section.tsx` | Matches after load, after typing, after any "เพิ่ม…" |
| EN / TL pill status | Ours followed typed names | Original never updates it in create; in edit `checkMultiSetting()` marks all three as set, then localize restores "(ยังไม่กำหนด)" (ORIGINAL BUG kept) | `section-basic.tsx` | 0 |
| Preview card name / date line | Name only from TH; our own date format | `changeMissionName` uses any language input; `handleMissionTimeAndRewardInput` writes "SD ST - ED ET"; edit shows `data.time` | `form-state.ts`, `section-basic.tsx`, `section-duration.tsx` | 0 |
| Section 2 round types (custom / day-of-week / day-of-month, daily, weekly, monthly), add round, all-day, reset | Day text listed days (staging always "-"); time text recomputed; custom + ระบุวันที่ showed the month grid (staging: date picker); custom did not reset to day-of-week; add-round button hidden on weekly; new round showed errors; all-day cleared times | Behaviour of `handleMissionTimeAndRewardRadioTimeSet` / `handleMissionRoundTypeCustom` / `addTemplateTimeMission` / `validateMission2` | `section-duration.tsx`, `validation.ts`, `form-state.ts`, `lib/api/missions.ts` (`specifyDate`) | 0 for all reachable sequences |
| Section 2 rewards: switch, add reward, every type, credit + turnover "x เท่า" card | New reward row showed errors and translated placeholders (staging: "Select reward type", "สิทธิ์", "Select promotion" until next toggleTranslate); mini-game error stays after type change; promotion error never shows; count error text; "x เท่า" card appears while a reward is เครดิต | Original row cloning / validation paths (ORIGINAL BUGs kept) | `reward-item.tsx`, `form-state.ts`, `validation.ts`, `section-duration.tsx`, `lib/api/missions.ts` (`turnOverType`, `turnOverTimeValue`) | 0 |
| Sub-mission 1: every condition type / deposit / turnover / login / affiliate sub-type, receive switch, every reward type, reset + limit, turnover, alert, add condition, add reward, name typing | Errors with "-template" ids shown by us (never on staging); sub reward rows 2+ never show errors; template texts ("ตั้งค่าการแสดงผลภารกิจย่อยที่ " + `&nbsp;`, "ภารกิจทันที ที่ทำสำเร็จ", "เท่ากับ x บาท", turnover warning spans); sub mini-game placeholder and "สิทธิ์"; condition dropdown keeps `mission-page` and shows the placeholder again after a toggleTranslate | Template ids / text not localized / ORIGINAL BUGs | `sub-condition.tsx`, `sub-mission.tsx`, `reward-item.tsx`, `section-duration.tsx`, `mission-dropdowns.tsx` | 0 for all listed states |
| Add sub-mission 2 (open, type name) | none | | | 0 |
| Section 4: open (header runs validateMission4), some / value / all / reset | Amount lock only via the radio handler | `handleCompleteMission` | `mission-form.tsx` | 0 |
| Edit missions 1 and 2, all four sections | Mission 1 start date showed 15/10/2026 (staging empty); mission 2 used card values (wrong sub-mission, round times 12:00–23:00, complete = some) | Mock not from get-mission | `lib/mock/missions.ts` `capturedEditValues`, `lib/api/missions.ts` `getMissionFormValues` | 0 (pixel diff: cursor only) |
| Edit missions 3 and 4 (expired) | Ours filled the form from card data | Staging get-mission answers "Mission not found" → empty create form | `lib/api/missions.ts` (returns null) | 0 |
| Image style popup: open, pick, the 3 categories | none | | | 0 (pixel: cursor only) |
| Icon style popup: open, all 12 categories, pick | Categories 2, 4–12 missing / short | Capture gap | `lib/mock/missions.ts` `iconStyleGroups` (all 80 icons) | 0 |
| Game type popup: open, sport / game / casino / lotto, provider + select-all | Ours kept `animate-in` | `chooseGameType` only adds `show` | `game-type-popup.tsx` (`useGameTypePopup`), `mission-form.tsx` | 0 |
| Copy picker: closed, open, pick | List stretched to pill width; pick shown in `.input-fake` | Original: not stretched, value in `.filter-value` | `mission-form.tsx` | 0 |
| Date / time pickers (start date, start time, round time) | none | | | 0 |
| Hover: EN pill, section header, cancel / confirm buttons | none | | | cursor only |

## Left / not verifiable

- **Weekly radio + hidden "ระบุวันที่" radio.** Staging lets JS click the hidden "ระบุวันที่" radio while ทุกสัปดาห์ is selected. A user cannot reach that state, so it is not copied.
- **Staging timing.** A few staging chunks change between identical runs (animations, debounce), e.g. sub-mission "turn-over" with `isCustomBrandGame`. Ours matches one of staging's results.
- **Not clicked, per the safety rules:**
  - save (บันทึก / ยืนยันการสร้างภารกิจ);
  - copy (ยินยันคัดลอก), so the copy result was not compared;
  - every delete (round / reward / member / sub-mission / condition);
  - popup "ยืนยัน" buttons;
  - THA / ENG switch.
- **Display-only DOM wrappers.** Shared `ColorPicker` / `RichTextEditor` add `display: contents` wrapper elements that staging does not have. They are not visible.
- **Not compared:**
  - focus ring on text inputs while typing (DOM was compared after typing);
  - CKEditor toolbar dropdowns;
  - file upload (the file input must not be clicked);
  - the edit page's empty frame while values load (ours renders nothing for a moment; staging shows the create form, then fills it).
- **Viewport height.** It was 1675, not 1731, in both tabs.
