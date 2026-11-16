# Audit 15/11/2026: mini-game setting offcanvas `#offcanvasMinigameSetting` (create / edit / view)

Scope: the wizard offcanvas only (steps 1, 2.1-2.3, 3, 4 / 4a / 4b / 4c, 5, 6, header, progress, button bars,
summary, rewards accordion). The list page has its own write-up (`AUDIT-2026-11-15-list.md`).
Tabs: staging `superx.staging.lsmloyalty.com` and local `127.0.0.1:3100`, both `[1704, 1675, 2]` (the brief expects
height 1731; both tabs are 1675, so the comparison is like-for-like). Local was reloaded after the parent's
hydration fix and after every code edit (hot reload can close the offcanvas and reorder the CKEditor stylesheet).

Method: per-block signatures of every visible element inside the current step (rect relative to the step,
own text, colours, font, borders, radius, opacity, cursor, placeholder, input value, checked, img src),
hashed per element and compared with an LCS diff; for the last pass, a per-block digest of geometry plus
style plus input/switch values. Hidden steps were revealed in my own tab only. Staging was loaded as few times
as possible (one reload, to get an un-polluted edit DOM). No screenshot pixel diff was run on the final state.

| # | State | Differences found | Cause | Fix (file) | Final result |
|---|---|---|---|---|---|
| 1 | Create lucky wheel, step 1 | CKEditor toolbars showed the "insert file" button; icon default | Staging hides `.ck-file-dialog-button` in `onReady` (not the image split button) | `step1-detail.tsx`: `hideFileDialogButton` on the 3 editors; icon from `initial.icon` | identical |
| 2 | Step 2.1 period / days / times | Day preset buttons had different ids/classes; "ทั้งวัน" had a label | Staging markup; the empty button is an original bug | `step2-period.tsx`: `boxMinigameSelectWeekday/Weekend/Everyday`, classes; empty "ทั้งวัน" with `ORIGINAL BUG` comment | identical |
| 3 | Step 2.2 countdown | `data-value-*` / click on the wrong element, `for` on first card | Staging markup | `step2-period.tsx` (cards are `type="button"`, attributes on the `col-12`) | identical (switch, both options, input) |
| 4 | Step 2.3 limits, customer group, reset, remove chance, game providers | Input id `MaxCountPerPromotionPerPerson`, missing `data-group`; provider count and list hard-coded; category icons; cloned deduct row label; edit values | Staging markup and loader | `step2-period.tsx`, new `game-category-icons.tsx` (SVGs captured from staging), `wizard-dom.ts` (`fillLoadedZeros`) | identical in create and edit (incl. provider tab, customer group dropdown open) |
| 5 | Step 3 rights / deposit types | Accumulated / continuous boxes and the range box differed | Staging markup | `step3-rights.tsx`: `#showBoxDepositCollectAndContinue`, "ครบ" prefix, range box `custom-input-middle` | identical for once / accumulated / continuous |
| 6 | Step 4 lucky wheel (8 slices, bonus rows, theme 4c) | Table colour labels, default `#232121`, `px-4`, slice labels, bonus row fields | Staging markup; "ปรับแต่งสีตาราง" on every colour row is an original bug | `step4-display.tsx` (`ORIGINAL BUG` comment on the labels) | identical (only invisible `fistempty` / class order left) |
| 7 | Step 4a / 4b mini-game (3x9 upload slots, 9 choices) | Bonus dropdown hidden for mini-game, label ids, error box shown | Staging markup | `step4-display.tsx` | identical (only invisible `fistempty`) |
| 8 | Step 5 turnover | Switch did not enable the boxes like staging | `changeStatusSwitchMinigameTurnover` behaviour (incl. an original quirk: always re-selects the first box) | `step5-turnover.tsx`, `wizard-dom.ts` | identical |
| 9 | Step 6 summary (create) | Labels, limit texts, bonus texts, remaining-day rows, "Minigame"/"Wheel" titles | Legacy summary builder | `step6-summary.tsx`, `wizard-summary.ts` (remaining-day parents stay hidden: `ORIGINAL BUG`) | identical, except the "กลับไปแก้ไข" button, see Notes |
| 10 | View lucky wheel (detail) incl. rewards accordion | Accordion behaviour, bonus texts | Bootstrap collapse (independent rows, 350 ms, first open) | `step6-summary.tsx` | all blocks identical, Wheel 2 opened and compared |
| 11 | View mini-game other | Cover picture, bonus texts (percentage, mini-game coupon) | Mock lacked the staging record | `lib/mock/mini-games.ts` (uuid-3 = "QA Other Retest 20261015" as staging shows it), `lib/api/mini-games.ts` (bonus fields) | 23/23 blocks identical |
| 12 | Edit lucky wheel | Loaded wheel images, "0" in unused numeric fields | `getMinigameDetail` writes every field with `.val()` | `wizard-dom.ts` `applyLoadedWheelImages`, `fillLoadedZeros`; `minigame-setting-offcanvas.tsx` | identical (only invisible `active` / `fistempty` / class order) |
| 13 | Edit mini-game, steps 1-6 | (a) step 4 -> 5 blocked: "image required" although the cover was loaded; (b) 6 switches had value "on" locally, "false" on staging | (a) React `defaultValue=""` on the hidden image inputs reset the loaded value on re-render; (b) the loader runs `.val(false)` on the switches (original bug) | (a) `step4-display.tsx`: removed `defaultValue=""` from the 31 hidden image inputs, `applyLoadedMiniGameImage`; (b) `wizard-dom.ts` `LOADED_FALSE_SWITCHES` (`ORIGINAL BUG` comment), `step2-period.tsx` sets the `enableLimitCustomerGroup` value once through a ref | every block of steps 1, 2.1, 2.2, 2.3, 3, 4, 5, 6 identical in geometry, style and values; summary text identical (109 lines) |
| 14 | Edit button "ยืนยันการสร้างโปร" | kept | Original wording | — | identical |

## Not reached / not verified
- Open/close animation and backdrop: not measured frame by frame. Known difference in the shared `Offcanvas`
  component (not mine): the backdrop is appended to `body` locally, to `.main-content` on staging.
- Validation message texts of step 1 (agent missing etc.) were not re-checked after the last edits.
- Create after an edit: staging keeps the loaded switch values ("false") because it is one persistent form;
  local does the same. Staging's create button did not open from a script click in the background tab, so the
  create-after-edit state was not compared on staging.
- Lucky wheel edit was compared before the switch-value check was added; the same loader code now applies.
- Saving, test-spin, file uploads and delete: off limits on staging.

## Notes
- Staging shares `localStorage.action` across tabs (other agents use it); this made staging show the step-6
  summary buttons ("กลับไปแก้ไข") in create mode. Treated as contamination, not reproduced
  (comment in `minigame-setting-offcanvas.tsx`).
- Invisible leftovers: `fistempty` / `active` classes and class order differ where staging keeps classes from
  earlier sessions in the same DOM. No visual effect.
- Original bugs copied (each with `ORIGINAL BUG (kept on purpose, PK 15/11/2026)`): empty "ทั้งวัน" button,
  "ปรับแต่งสีตาราง" labels, hidden remaining-day rows in the summary, loader writing "false" into switch values,
  turnover switch re-selecting the first box. The edit button text "ยืนยันการสร้างโปร" is kept.
