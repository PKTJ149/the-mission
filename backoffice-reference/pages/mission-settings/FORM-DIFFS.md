# Mission form: live comparison against staging (14/11/2026)

**Method.** Both sides open the EDIT page of "QA Happy Mission Retest 20261015" (card 1 edit icon). Staging is `/mission/setting?missionId=<guid>&edit=1`; ours is `/mission/setting?missionId=uuid-1&edit=1`.
- Both sides use a 1704×1675 CSS viewport.
- Each accordion section is opened in turn and compared block by block: position, height, element count and text hash.
- 1px offsets are device-pixel-ratio rounding; ignore them.
- Nothing was saved on staging.

**Result.** All 4 sections and the bottom buttons match in structure and size. The bottom buttons ("ยกเลิก" / "ยืนยันการสร้างภารกิจ") match exactly. Remaining differences:

1. **Section status text (all 4 headers).** On staging, when the edit page loads, every header shows "ข้อมูลไม่สมบูรณ์" even though the data is complete. The status element `.group-mission-setting-status` is grey, rgb(71,71,71). Ours shows "ข้อมูลสมบูรณ์". You chose this deliberately; **leave it**. PK will decide whether to copy original bugs. Make sure the `// ORIGINAL:` comment states exactly what staging shows.

2. **Section 2, left column ("รอบเวลาทำภารกิจ").**
   - On staging, row 1 reads "รอบเวลาทำภารกิจที่ 1 วัน - 00:00 - 00:00 - ทั้งวัน": the day dropdown shows "-" and the times are 00:00 – 00:00. Ours reads "วัน ทุกวัน 00:00 - 23:59 - ทั้งวัน".
   - Staging does not show the "เพิ่มรอบเวลาทำภารกิจ" button in this state. Ours does.
   - The column is 694px tall on staging (62 elements) and 738px on ours (66 elements).
   - Make the mock and the edit-load logic for this mission produce exactly what staging shows. Check the legacy JS (scriptmission.js) for when the add-round button is hidden, for example when the round type is not "กำหนดเอง", or after a max count.

3. **Section 3 (ภารกิจย่อยที่ 1), right column, "กำหนดการติดเทิร์นโอเวอร์".** Ours is missing the second part of the hint. Staging: "หากไม่เปิดใช้งานการติดเทิร์นโอเวอร์ ของอรางวัลทุกชิ้นที่ให้สมาชิกจะไม่มี การติดเทริ์น". Ours stops after "…การติดเทิร์นโอเวอร์". The text after the line break was lost; keep the original typos.

4. **Section 1, language pills block (`multi-language-b…`).** Staging has 39 visible elements and ours has 36, at the same 423×188 size. Diff the three TH/EN/TL pills against the capture.

**Local save flow (verified in the browser), OK.**
1. "ยืนยันการสร้างภารกิจ" opens the confirm popup "ยืนยันบันทึกการแก้ไขภารกิจ หรือไม่ ?" with `missionMsg2` and Cancel / Edit buttons. These match legacy NOTES.
2. Edit shows the success popup "บันทึกการแก้ไขภารกิจ สำเร็จ !" + "ระบบได้ทำการแก้ไขภารกิจ ตามการตั้งค่าของคุณ เรียบร้อยแล้ว" + Close.
3. Close goes back to `/mission` with the 4 cards.
