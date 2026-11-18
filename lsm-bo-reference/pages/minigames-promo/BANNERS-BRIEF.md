# Minigames popup banners — brief (PK, 16/11/2026)

## Goal
On the `/minigames` promo page in `lsm-bo-app` (unsubscribed merchants), open a **popup with 4 swipeable banners** as
soon as the page loads. The banners are designed by us (PK: "mock up the banner design yourself, make it beautiful and
eye-catching"). Later the **same 4 banners** go on the Login page as an in-page auto slider (not a popup) — not in this
round, but build the banners so they can be reused there without changes.

## Decisions (PK)
- Show the popup **every time** the Minigames page opens, with a checkbox **"ไม่แสดงอีกในวันนี้"**: when ticked and
  closed, don't show it again until the next local day (store the date in `localStorage`, guarded with try/catch).
- The banner CTA **"ดูข้อมูลเพิ่มเติม ลุ้นรับสิทธิ์ใช้งานฟรี"** closes the popup and smoothly scrolls to the playable demo
  section of the promo page (the "ลองเล่นเลย" section, give it an id if it has none).
- No emoji: the 🎡 in the reference becomes a small wheel icon (reuse the look of `components/shell/minigames-icon.tsx`).
- One verification round only (PK).

## Copy (transcribed from `banners-reference.png` in this folder; the source is small, so put all copy in the content
## file so PK can correct wording). Every banner: eyebrow **"Play. Engage. Repeat."** and CTA
## **"ดูข้อมูลเพิ่มเติม" / "ลุ้นรับสิทธิ์ใช้งานฟรี"** (two lines).
1. Headline: **ลูกค้าใหม่หายาก / หาลูกค้าเก่าง่ายกว่า...** — Body: สร้างเหตุผลให้ลูกค้ากลับมาใช้บริการเว็บไซต์
   ด้วยการทำเกมและ Mini Games ที่ออกแบบได้ตามเป้าหมายของคุณ
2. Headline: **ไม่อยากให้ลูกค้า / ได้ปุ๊ปๆปั๊บๆ ถอนปั๊บๆปุ๊บๆ** — Body: เปลี่ยนยอดเงิน เป็นยอดคอยล์ สร้างกิจกรรม
   Mini Games และระบบคะแนนสะสม เพื่อให้ลูกค้ามีเหตุผลกลับมาใช้งาน ลูกค้าไม่หาย เงินก็ไม่หาย
3. Headline: **ยอดเล่นเยอะ ยอดฝากน้อย** — Body: ต่อยอดการตลาดด้วย Mini Games ที่ช่วยสร้างกิจกรรม
   กระตุ้นการฝากเงินผ่านภารกิจ ที่พร้อมปรับกติกาและรางวัลได้ตามต้องการ
4. Headline: **วันนี้คุณทำอะไร / ให้ลูกค้ากลับมาพรุ่งนี้?** — Body: สร้างเหตุผลให้ลูกค้ากลับมา ด้วย Mini Games
   ที่ปรับแต่ง เกม กติกา และรางวัล ได้ตามเป้าหมายการตลาดของคุณ

## Design (decided — build this)
- Each banner is built in code (HTML/CSS/SVG + Motion), not a bitmap, so text stays sharp and editable. Portrait card,
  about **560 × 680 px** in the popup (scales down on small screens): top ~55% = an illustrated, gently animated scene
  on a rich gradient; bottom = eyebrow, big headline (Kanit 600/700), body, CTA pill (orange→pink gradient like the
  NEW badge / promo page CTA) with the wheel icon.
- Same visual family as the promo page (`app/minigames/_components/*`, `art.tsx`) and the sidebar icon: gold-rim wheel,
  purple mystery box, coins, sparkles, confetti. Each banner gets its own colour theme and scene that tells its line:
  1. Indigo → violet: customers (simple avatar bubbles) loop back along a curved arrow into a spinning wheel.
  2. Emerald/teal → gold: cash notes turning into gold coins that drop into a points jar/meter ("ลูกค้าไม่หาย เงินก็ไม่หาย").
  3. Orange → pink: a deposit mission card with a progress bar filling and a reward chest popping.
  4. Deep navy → dawn blue: a daily check-in calendar (today ticks), a mystery box opening, "พรุ่งนี้" tomorrow highlight.
  Scenes loop softly (only while the banner is the active slide); everything static under reduced motion.
- Carousel: drag/swipe (Motion `drag="x"` with snap), prev/next arrow buttons, dot indicators (clickable, current one
  wider), keyboard ← →, autoplay every ~5 s that pauses on hover, focus, drag and when the tab is hidden; no autoplay
  under reduced motion. Slide transition: transform/opacity, strong ease-out `cubic-bezier(0.23, 1, 0.32, 1)`, ~400 ms
  for the slide (it's large), 150–250 ms for button feedback.
- Popup: dim + blurred backdrop, centered, enter scale 0.96 → 1 + fade (~220 ms ease-out), exit faster (~160 ms).
  Close "×" button (44 px target, `aria-label`), Escape and backdrop click close it, focus moves into the dialog and
  returns afterwards, `role="dialog" aria-modal="true"` with a label. The "ไม่แสดงอีกในวันนี้" checkbox sits under the
  carousel, left; dots centered.
- Reusable split for the Login page later: `components/promo-banners/` with `banners.ts` (content + theme data),
  `banner-slide.tsx` (one banner, `active` prop to run its scene), `banner-carousel.tsx` (slider; props for
  `autoPlay`, `onCta`), and the popup wrapper used by the Minigames page (`minigames-banner-popup.tsx`). Styles in CSS
  modules. Don't edit `public/lsm-css/`.

## Verify (one round)
- Dev server: `preview_start {name: "lsm-bo-app"}` (port 3200). In your own tab of the built-in browser, open
  `http://localhost:3200/minigames`: popup appears; swipe/drag, arrows, dots, keys, autoplay; each banner's scene; CTA
  closes and scrolls to the demos; "ไม่แสดงอีกในวันนี้" works (reload → no popup; clear the key → popup again);
  Escape / backdrop / × close. Check ~1024 px width too, then `resize_window {preset: "desktop"}`.
- `npx tsc --noEmit`, `npx eslint .`, `npm run build` in `lsm-bo-app/` must pass; no console errors.
- Don't commit. Close tabs you opened (if PK is using one of them, leave it and say so).

## Report (under ~300 words)
What you built, files, how each part behaves, anything you changed from this brief, command results, and screenshot
paths (saved with `save_to_disk`) of each of the 4 banners in the popup.
