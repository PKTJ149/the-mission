# Wheel wizard: live comparison against staging (14/11/2026)

**Method.** Both sides open the EDIT flow of "QA Test Wheel 0911": click the eye button, then "แก้ไขข้อมูลวงล้อนำโชค", then step through with ถัดไป. Nothing is ever saved on staging.
- Both sides use a 1704×1675 CSS viewport.
- Each visible block in the step is compared by its rect relative to the panel, its descendant count, a geometry hash and a text hash.
- Differences of 1px in text height come from device-pixel-ratio rounding; ignore them.

Tree notation below: `tag#id.classes [type] WxH "leaf text"`. `{none}` means display:none.

---

## Detail view (eye → step 6 summary, `main-in-detail-body`)
Matches except for these 4 blocks. Block numbers are the visible children of the body, in order.

**Block 4 (ระยะเวลา / วันทำงาน):**
- Staging's "วันทำงาน :" `div.p2` is 120px wide; ours is 97px.
- The working-time row has different markup on staging (24px tall):
  ```
  div.row 483x24
    div.col-12 121x24 > div.p2 120x24 > span.minigame-date-no "เวลาทำงานที่" + span "1"
    div.col-12 362x24 > div.p2 338x24 "00:00 - 23:59"
  ```
- Ours is `div.col-4 "เวลาทำงานที่ 1"` (161px) + `div.col "00:00 - 23:59"` (21px tall), so the time text sits at x=414 instead of x=386.

**Block 6 (การนับถอยหลัง):** staging shows ONLY the selected option: "สถานะ : ปิดใช้งาน รูปแบบการนับถอยหลัง : นับถอยหลังทันทีที่สร้างวงล้อนำโชคสำเร็จ" (74px tall). Ours also lists the unselected options "นับถอยหลังทันทีเมื่อเหลืออีก 7 วัน" and "นับถอยหลังทันทีเมื่อเหลืออีก" (98px).

**Block 18 (การจำกัดสิทธิ์):** staging ends with "…หากมียอดเครดิตที่ยอดคงเหลือ 0 บาท". Ours is missing the final "บาท".

**Block 22 (Turnover):** staging reads "รูปแบบการติด Turnover : ต้องทำ Turnover ขั้นต่ำ 0 บาท" (19 visible elements). Ours reads "ต้องทำ Turnover ขั้นต่ำ x เท่า เท่า บาท": it shows the wrong variant and leaks the other variant's text.

## Step 1 (edit)
Matches. The CKEditor internals have 5 more elements on ours, but the size and text are identical. OK.

## Step 2.1 (วันทำงาน)
Matches, with one exception. On staging, the "ทั้งวัน" button (`#boxMinigameSelectAllDay-1`, 207×40) renders EMPTY. The `data-i18n` is never applied to cloned rows, which is an original bug. Ours shows "ทั้งวัน". **Keep ours**, and add an `// ORIGINAL:` comment saying staging renders it empty.

## Step 2.2 (การนับถอยหลัง)
The structure is wrong. Staging has SIX `div.col-12` children in a 2-column grid (339px each; left x=50, right x=411):
```
0 div.col-12 339x62  > div.form-check.minigame-reset.disabled.fistempty 339x60
      input#minigameEnableCountDownCreated.form-check-input.me-2.active[radio] 24x24
      label.form-check-label.d-flex.flex-column 307x60
        div#textTabsStep2-2-2.p2 > span "นับถอยหลังทันทีที่สร้างวงล้อนำโชคสำเร็จ"
        span#textTabsStep2-2-3.p3 > span "ระบบจะทำการนับเวลาถอยหลังทันทีที่คุณสร้า…"
1 div.col-12 339x62  (EMPTY)
2 div.col-12 339x62  > div.form-check.minigame-reset.disabled.fistempty 339x60
      input#minigameEnableCountDownSetTime.form-check-input.me-2.active[radio] 24x24
      label.form-check-label.d-flex.flex-column 307x60
        div.p2 "นับถอยหลังทันทีเมื่อถึงกำหนด"
        span#textTabsStep2-2-4.p3 > span "ระบบจะทำการนับเวลาถอยหลังทันทีเมื่อถึงวั…"
3 div.col-12 339x62  (EMPTY)
4 div.col-12 339x204 > div#boxMinigameCountdownRadioDays.custom-card.h-100.box-minigame-click-select.minigame-box-reset.disabled
      input#minigameEnableRemainingDay.box-radio.active[radio] {none}
      div.row.flex-column.justify-content-between.h-100 313x154
        div.row.pe-0 313x82
          div.col-3.mb-3 75x66 > img[src=/assets/images/minigame/countdown-time-icon-1.png] 56x56
          div.col-9.mb-3 226x66
            div.p2.fw-700 "นับถอยหลังทันเมื่อเหลือ x วัน"
            span.p3 "ระบบจะนับถอยหลังทันทีที่วันหมด อายุโปรเห…"
        div 313x72 > div.col-12 289x72 > div#inputMinigameCountdownRemainingDay.custom-input.custom-float 289x72
            div.p2.fw-700.mb-2 "นับถอยหลังทันทีเมื่อเหลืออีก..."
            div.input-group.minigame-box-reset.disabled 289x40
              input#minigameCountdownRemainingDay.form-control.active[text] 244x40
              span.input-group-text.custom-color 46x40 "วัน"
            div#error-promotionCountdownAmount.invalid-feedback {none} "นับถอยหลังทันทีเมื่อถึงกำหนด"
5 div.col-12 339x204 > div#boxMinigameCountdownRadioDaterange.custom-card.h-100.box-minigame-click-select.minigame-box-reset.disabled
      input#minigameEnableRemainingDateTime.box-radio.active[radio] {none}
      div.row.flex-column.justify-content-between.h-100 313x154
        div.row.pe-0 313x85
          div.col-3.mb-3 75x69 > img[src=/assets/images/minigame/countdown-time-icon-2.png] 56x56
          div.col-9.mb-3 226x69
            div.p2.fw-700 "นับถอยหลังทันทีเมื่อถึงวัน และเวลาที่กำห…" (2 lines, 202x48)
            span.p3 "กำหนดวันและเวลาให้นับถอยหลัง"
        div.row.pe-0.minigame-box-reset.disabled 313x40
          div.col-12.col-md-6.mb-3.mb-md-0.pe-0 151x40 > div#inputMinigameCountdownRemainingDateBkk.custom-input.custom-float 139x40
              input#minigameCountdownRemainingDateBkk.form-control.custom-date-flatpickr.flatpickr-input.active[text]
              div.float-prepend 32x40 > svg 16x16 + svg {none}
              div#error-promotionCountdownDate.invalid-feedback {none} "กรุณาเลือกวันที่"
          div.col-12.col-md-6.pe-0 151x40 > div#inputMinigameCountdownRemainingTimeBkk.custom-input.custom-float 139x40
              input#minigameCountdownRemainingTimeBkk.form-control.custom-date-flatpickr.flatpickr-input.active[text]
              div.float-prepend 32x40 > svg 16x16 + svg {none}
              div#error-promotionCountdownTime.invalid-feedback {none} "กรุณาเลือกวันที่"
```
Ours has only 3 children: option 1, option 2 placed in the RIGHT column, and option 3, which is 377px tall and wraps option 4. Rebuild it to match the tree above.

The icons are `countdown-time-icon-1.png` and `countdown-time-icon-2.png` (now in public/). The old `countdown-days.png` / `countdown-date.png` paths are wrong.

## Step 2.3 (การจำกัดสิทธิ์ / หักสิทธิ์ / ค่ายเกม)
Matches in 10 of 13 blocks.
- **Block 3 copy spacing.** Staging has no space before the opening curly quote in "จำกัดการรับสิทธิ์เล่นมินิเกมส์“ต่อสัปดาห์”" and "…มินิเกมส์“ต่อเดือน”". Ours has "เล่นมินิเกมส์ “ต่อสัปดาห์”" with a space. The “ต่อครั้ง” line has no space on either side, and the “ต่อวัน” line has a space on both sides. Match staging exactly, line by line.
- **Block 9 (หักสิทธิ์จากมินิเกมส์อื่น).** For this wheel, staging shows NO deduction rows: only the description, "ระบุจำนวนสิทธิ์…1 สิทธิ์" and the "เพิ่มมินิเกมส์ที่ต้องการหักสิทธิ์" add button. That block is 156px tall with 9 elements. Ours renders one empty row ("มินิเกมส์ เลือกมินิเกมส์ สิทธิ์ สิทธิ์"), making it 244px with 25 elements. Start with zero rows when the data has none.
- **Block 11 (ค่ายเกม).** Staging says "ค่ายเกมทั้งหมด 73 ค่าย"; ours says "0 ค่าย". Staging renders all 73 provider checkboxes (`input#prov-game-<n>.form-check-input.form-check-input-custom-mini-game` with attrs `providerid`, `providercode`, `name`, `category`, inside `div.form-check.minigame-reset.game-provider-checker-di…` that carries `is-category-sport|game|casino|lotto="true|false"`). The category tabs filter by those flags; on the sport tab only 4 are visible. Full list below as `providerid:providercode:category:flags:label`, where flags are s=sport, g=game, c=casino, l=lotto and blank means none:

15:ab:casino:c:ALLBET | 87:amigo:game:g:AMIGO | 63:astar:casino:c:ASTAR | 46:ADVANTPLAY:game:g:Advantplay | 88:allbet:fishing-game::Allbet Game | 88:allbet:game:g:Allbet Game | 56:bng:fishing-game::BNG | 56:bng:game:g:BNG | 54:btgaming:game:g:BT Gaming | 50:bg:casino:c:Big Gaming | 90:cg:casino:c:CG Casino | 94:cp:game:g:CP Gaming | 19:dg:casino:c:DG Casino | 69:dragoonsoft:fishing-game::DragoonSoft | 69:dragoonsoft:game:g:DragoonSoft | 3:evolution:casino:c:Evolution | 53:expanse:game:g:Expanse | 72:fachai:game:g:Fachai | 2:fastspin:game:g:FastSpin | 95:fungaming:game:g:Fun Gaming | 30:gpi:game:g:GPI Game | 32:gw:game:g:Gaming World | 29:haba:game:g:Habanero | 75:hotdog:game:g:Hotdog Gaming | 82:iamlotto:lotto:l:IAM LOTTO | 5:jili:game:g:JILI | 27:jk:game:g:Joker | 36:ka:fishing-game::KA Game | 36:ka:game:g:KA Game | 33:kingmaker:game:g:KingMaker | 76:rbsevenlotto:lotto:l:Lotto Plus | 57:megawin:game:g:MEGAWIN | 41:mp:game:g:MPoker | 41:mp:p2p::MPoker | 59:mylotto99:lotto:l:MYLOTTO99 | 71:mangoplay:casino:c:MangoPlay | 84:microgame:game:g:Micro Gaming | 48:naga:game:g:NAGA GAMES | 25:nextspin:game:g:Next Spin | 73:nolimitcity:game:g:Nolimit City | 9:muaypukyok:sport:s:ONE BX | 24:ps:game:g:Play Star | 38:playtech:casino:c:Playtech | 38:playtech:game:g:Playtech | 78:pgsoft:game:g:Pocket Game (PG) | 43:pp:casino:c:PragmaticPlay | 43:pp:game:g:PragmaticPlay | 20:pretty:casino:c:Pretty Gaming | 22:qqkeno:lotto:l:QQKeno | 22:qqkeno:keno::QQKeno | 86:audi:casino:c:RB7 Casino | 70:rbsevenslot:game:g:RB7 Slot | 47:rich:game:g:RICH88 | 80:relax:game:g:Relax Gaming | 18:sa:casino:c:SA Casino | 11:sabasport:sport:s:SABA | 11:sabasport:e-sport::SABA | 12:sbo:sport:s:SBO | 7:newsportbook:sport:s:SPORT LSM | 16:sexy:casino:c:Sexy | 31:spsg:fishing-game::SimplePlay | 31:spsg:game:g:SimplePlay | 44:sw:casino:c:Sky Wind | 44:sw:game:g:Sky Wind | 26:fg:fishing-game::Spadegaming | 26:fg:game:g:Spadegaming | 85:vivo:casino:c:Vivo Gaming | 83:vplus:game:g:Vplus | 1:wcasino:casino:c:WCASINO | 17:wm:casino:c:WM | 58:yeebet:casino:c:YEEBET | 81:alize:game:g:alize | 62:uuslots:game:g:uuslots

## Step 3 (การได้รับสิทธิ์)
All blocks match. One bug was found and FIXED by the parent: the stray text `{" dropped-->"}` left over from HTML conversion in step3-rights.tsx. It created an extra grid row (22px gap + 21px line), which pushed the step buttons down 43px.

## Step 4 (ตั้งค่าและตกแต่งวงล้อ + สี)
All 8 prize/slice rows match: same text, element counts and heights. Every block below the first one is offset by +8px because of difference 1.
1. **Slice-count dropdown** `#customNumberPartsLuckywheel` (in "จำนวนชิ้นส่วน :"): **127×32** on staging, 79×40 on ours. Its header row (`div.d-flex.justify-content-between.align-items-center.p2.mb-2.fw-700`) is 32px tall on staging and 40px on ours.
2. **Upload column** (`div.col-5.mb-3`, under the wheel): ours is missing part of the hint under "อัพโหลดรูปตอนได้รับรางวัล". Staging reads: "คำแนะนำ : รูปต้องเว้นพื้นที่สำรับคำ อธิบายของรางวัลไว้ตรงกลางของภาพ **ที่ขนาด 200x200 px ขนาดรูปโดยรวมที่แนะนำคือ 342 px x 240 px สกุล png, gif, jpg**". Staging has 57 visible elements here; ours has 54.
3. **Hint under the wheel** (`div.mt-5.p4.text-gray30`): staging reads "คำแนะนำ : ขนากรูป…" with a space after the colon. Ours reads "คำแนะนำ :ขนากรูป…".
4. **Background block** (`box-main-set-color-mini-game` #1, "ปรับสีหรือรูปภาพพื้นหลังหน้าจอ"), and the same for block #2: ours renders uploaded-background previews (`img.img-bg-pc-show-in-box-upload`, `img.img-bg-mb-show-in-box-upload`, 2× `img.w-100`, `div.btn-close-img-bg-pc-mini-game`, `div.btn-close-img-bg-mobile-mini-game`). Staging has none: this wheel has NO custom background images, so only the default images show. Fix the mock data for QA Test Wheel 0911 so it has no custom PC/mobile background.
5. **Colour blocks #3 and #4** are 191px and 226px tall on staging vs 185px and 220px on ours (6px each). Compare the inner spacing once points 1–4 are fixed.
6. **Table colours, left column** (`div.w-50`, "ปรับแต่งสีตาราง"): the DOM order is wrong. Staging reads: สี พื้นหลัง → สี ข้อความ → สี เส้นกรอบ → [title] การแบ่งหน้า (Pagination) → สี เลขหน้า Inactive → … Ours puts "การแบ่งหน้า (Pagination)" right after "สี พื้นหลัง". The column is 429px tall on staging vs 411px on ours.
7. **Table colours, right column (เนื้อหาตาราง):** staging shows "สี พื้นหลัง 1", then the h4 of the next 5 pickers literally reads **"ปรับแต่งสีตาราง"** five times (getColorTableTdBg2Group3, TdFontGroup3, TdFontHighlights1Group3, TdFontHighlights2Group3, TdBorderGroup3). That's an original bug. Ours shows the guessed sensible labels marked `// GUESS`. Replace the GUESS comments with `// ORIGINAL: staging shows "ปรับแต่งสีตาราง" here (bug)`, and keep the sensible labels until PK decides.
8. **Step buttons:** staging renders `group-btn-minigame` (ถัดไป / ย้อนกลับ) as the last visible child of `#SettingMinigameStep4`, at y=7696, 800px wide (x=0). Ours has no button group inside `#SettingMinigameStep4`; check where ours renders it.

## Step 5 (Turnover / ถอน / ปลดเทิร์น): LAYOUT BROKEN on ours
Root cause is in `step5-turnover.tsx` lines 22–30. The first `div.label-minigame` is never closed, so every following section is nested INSIDE the 30px header bar. On screen, the bar becomes a narrow teal column on the left and the content is squeezed to x=162 (588px wide). Staging's structure:
```
div.main-in-detail-body.content-col-1
  div.label-minigame 748x30
    span "กำหนดเงื่อนไขการติด Turnover"
    div.switch 170x28
      div.custom-switch.switch-alone.form-check.form-switch 47x23
        input#minigameEnableConditionTurnover.form-check-input[type=checkbox]   (onclick = changeStatusSwitch(…, "2-3-6"), like the other sections)
      span.color-emerald-title-1 "เปิด / ปิด การใช้งาน"      ← sibling of custom-switch, NOT inside it
  div.input-col-1-p.switch-2-3-6 748x564
  div.label-minigame.d-none … (withdraw)   ← siblings, same pattern as lines 167–176
```
Ours has a CAPTURE-GAP `<div />` in place of the input, puts the span inside `custom-switch`, and has no `</div>` for `label-minigame`. Fix it to match the other sections, which are correct, and remove the now-extra closing `</div>` further down. Once fixed, staging's body is 666px tall, with the step buttons at y=962 relative to the panel.

## Step 6 (summary + save), edit flow
- **Summary blocks:** same 4 diffs as in the detail view at the top of this file.
- **Final button:** on staging, the edit flow (eye → แก้ไขข้อมูลวงล้อนำโชค → ถัดไป ×5) ends with **"ยืนยันการสร้างโปร"** (168×40). Ours shows "ยืนยันการแก้ไข".
  - The legacy `case "6"` in `btnStepSettingMinigame` would set `minigameConfirmButton` ("ยืนยันการแก้ไข") for `actionNow == 'edit'`.
  - Staging doesn't show that, so the step-5 → 6 path probably goes through `nextPromotionMiniGameStepFinal` (scriptminigame.js ~9197), which sets the create label. Mirror what that function does, and add an `// ORIGINAL:` note. Find out from the legacy JS whether the edit save on staging then calls 'create' (that would be a real original bug worth telling PK about), and report it.
  - The button group has 6 visible elements on staging and 7 on ours.
- **Local save flow (verified in the browser):**
  1. Confirm dialog "ยืนยันการแก้ไขข้อมูลมินิเกมส์หรือไม่?" (ยกเลิก / ยืนยัน).
  2. Loading dialog "เรากำลังทำงานอย่างหนักเพื่อคุณ !…".
  3. The panel closes.
  4. Success dialog "บันทึกการแก้ไขข้อมูลมินิเกมส์ สำเร็จ !" with ปิดหน้าต่าง.

  The texts match legacy JS (line 7294). OK.
