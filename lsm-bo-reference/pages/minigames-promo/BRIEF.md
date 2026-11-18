# Minigames promo page — brief (PK, 16/11/2026)

## Goal
When a merchant who has **not subscribed** clicks the sidebar item **Minigames** in `lsm-bo-app`, show a promo page that
sells our **Mini Games + Missions** product and makes them want to contact us to turn it on. It must feel exciting:
**live, animated, playable demos** of a lucky wheel, a mystery box, a card flip and missions being completed.
(Case 2, an already-subscribed merchant, comes later. Only build case 1 now, but keep a clean switch for it.)

## Decisions (PK)
- Content source: `content-reference.png` (this folder) + what our real systems do (below). You may add sections.
- CTA "เปิดใช้บริการ" = a link to our contact channel. PK hasn't given the URL yet: put it in ONE config constant
  (`lib/config/minigames.ts`, e.g. `MINIGAMES_CONTACT_URL`) with a `// TODO(PK): real LINE/contact link` comment,
  open it in a new tab (`target="_blank" rel="noopener noreferrer"`).
- **No prices / packages.** **No made-up numbers, stats, testimonials or client logos.** Use true capability facts
  instead (e.g. "วงล้อ 6 / 8 / 10 ช่อง", "เกมเลือก 3 / 6 / 9 ตัวเลือก", "ภารกิจ 5 รูปแบบ", "รองรับ 3 ภาษา TH / EN / TL").
- PK suggested **Motion** (motion.dev, `npm i motion`, import from `motion/react`) for the animations. Use it for the
  interactive/sequenced demos; plain CSS is fine for simple loops. Load it only on this route.
- PK reads Thai; page copy is Thai (+ the English product terms from the image). Code, comments, file names in English.

## Content from the image (keep, refine wording if needed)
- H1: **MINI GAMES - PLAY, ENGAGE, REPEAT.**
- Sub: **ทุกลูกค้ามีค่า ไม่ใช่แค่หามา แต่ต้องรักษาไว้ด้วย**
- Body: เปลี่ยนทุกการเล่นให้เป็นโอกาสสร้างความผูกพัน ด้วย Mini Games ที่ปรับแต่งเกม กติกา และรางวัลได้ตามแคมเปญของคุณ
- Features: **Customizable Design** (เปลี่ยนสี ธีม และรูปแบบเกม ให้เข้ากับแบรนด์และเทศกาล), **Flexible Game Rules**
  (กำหนดกลุ่มผู้เล่น จำนวนครั้ง และการใช้สิทธิ์ร่วม/แยก), **Reward Management** (กำหนดรางวัลได้ทั้งสิทธิ์เล่นเพิ่ม
  เครดิตเว็บไซต์ และคะแนนสะสม), **Multiple Campaigns** (เปิดหลายเกมหรือหลายวงล้อ พร้อมแยกกติกาตามแคมเปญ)
- Business benefits: เพิ่ม Engagement • ส่งเสริมการกลับมาใช้งาน • สร้าง Customer Loyalty • ต่อยอดแคมเปญการตลาด

## What our systems really do (use for extra sections; all true)
Read for detail: `backoffice-reference/pages/minigame-settings/notes.md`, `backoffice-reference/pages/mission-settings/`
(`notes.md`, `create/`), `backoffice-reference/INVENTORY.md`, and the memory summary below.
- **Mini games:** lucky wheel (6 / 8 / 10 slices, own frame / spin button / popup images, test spin); "mini-game อื่น ๆ"
  = pick 1 of 3 / 6 / 9 choices (cards or boxes) with before / after / result images. Rights come from deposits (single,
  accumulated, consecutive; equal / minimum / maximum / range amounts). Schedule by date, weekday / weekend / every day,
  time slots; countdown with 8 styles. Limits per system and per member (per time / day / week / month / promo),
  customer groups, reset rules, game-provider restrictions. Rewards: fixed credit, % credit, extra spins / rights, points,
  quotas, named rewards, chance % per slice. Turnover conditions. Theme: background images per device + 28 colours.
  TH / EN / TL. Per agent. Reports: summary, per member, history; manual grants.
- **Missions:** 3 structures: single; main mission with sub-missions in order (each unlocks the next, each pays a
  reward, the main mission pays a bigger one); sub-missions in any order. 5 action types: ฝากเงิน, ทำเทิร์นสะสม,
  ชวนเพื่อน, เช็คอินประจำวัน, สะสมแต้ม. Rewards: credit, rights, points; redeem points for rewards; mission banners;
  expiry warnings; reports by member / mission / reward; edit history.

## Design direction (decided — build this)
- Lives in the LSM shell content area (`AppShell`: topbar + sidebar stay). Route: **`/minigames`**. Update the sidebar
  item in `lib/menu.ts`: `Minigames` becomes a real link to `/minigames` (drop `action: true`, keep `featured: true`),
  so clicking it navigates and the row shows as active.
- Subscription switch: `lib/api/subscription.ts` → `getMinigamesSubscription()` returns `{ subscribed: false }` (mock).
  The page renders the promo when false; leave a short comment for case 2.
- Look: clean and light like the reference image (navy headings `#13285C`-ish, white cards, soft borders) **plus** a
  vivid, game-like hero and demo stage (deep navy → indigo/purple background, gold, pink, orange accents) that match the
  sidebar Minigames icon (`components/shell/minigames-icon.*`: purple box, gold rim wheel, pink/orange NEW badge).
  Primary CTA = orange→pink gradient like the NEW badge. Kanit for Thai; load Kanit 400/500/600/700 for this route with
  `next/font/google` (the shell only loads 400). Icons: PrimeIcons (`pi pi-*`, already loaded) or inline SVG. No emoji.
- Sections, top to bottom:
  1. **Hero**: eyebrow (MINI GAMES & MISSIONS), H1, sub, body, CTAs ("เปิดใช้บริการ" → contact link; "ลองเล่นตัวอย่าง"
     → scrolls to the demo). Right side: an auto-playing showcase (phone/device frame) that cycles wheel spin → box
     open → card flip → mission complete, with floating reward chips (e.g. "+100 เครดิต", "+1 สิทธิ์หมุน").
  2. **Capability strip**: the true facts above as chips.
  3. **ลองเล่นเลย (playable demos)**, tabs: วงล้อนำโชค (click spin → decelerates onto a random slice → reward
     pop-up), กล่องสุ่ม (pick 1 of 3 boxes → shake, lid pops, reward), เปิดไพ่ (pick 1 of 6 → 3D flip, then the others
     reveal), ภารกิจ (mission list: progress bars fill, sequential sub-missions unlock one by one, check marks, reward
     + confetti on completion; show the 5 action types). Beside each demo: "ตั้งค่าได้ใน Back Office" bullets that tie
     the demo to real settings. Demos are fake (no data sent); rewards are illustrative.
  4. **Features**: the 4 cards from the image + a grid of detailed capabilities from "What our systems really do".
  5. **Missions**: the 3 structures as small animated diagrams (single / sequential / any order) + 5 action-type chips.
  6. **Business benefits**: the 4 benefits with an icon and one line each.
  7. **How it starts**: 3 steps (ติดต่อทีมงานเพื่อเปิดใช้บริการ → ตั้งค่าเกม/ภารกิจใน Back Office → ลูกค้าเล่นบนหน้าเว็บ
     และดูผลในรายงาน).
  8. **Final CTA band**.
- Motion rules (non-negotiable): animate transform / opacity (and clip-path) only; strong ease-out
  `cubic-bezier(0.23, 1, 0.32, 1)` for entrances, springs only where things should feel physical (wheel deceleration
  can be a custom ease-out of several turns); UI micro-interactions 150–250 ms; `useReducedMotion()` / CSS
  `prefers-reduced-motion` → no spinning / flying, keep simple fades and instant results; hover effects gated to
  `(hover: hover) and (pointer: fine)`; scroll-reveal sections with a light stagger (30–80 ms), once. Auto-playing loops
  pause when off-screen (`useInView`) to save CPU.
- Accessibility: buttons are real `<button>`s with labels, visible focus rings, 4.5:1 contrast, demo results announced
  with `aria-live="polite"`, decorative SVG `aria-hidden`.
- Responsive: content area at 1552 px window (sidebar 240 px) is the main target; must also look right at ~1280 and
  ~1024 window widths and not break below (stack columns).

## Code rules
- `lsm-bo-app/` only (Next.js 16 — read `node_modules/next/dist/docs/` for anything version-specific). No Tailwind.
  Page styles in CSS modules next to the components. Don't edit `public/lsm-css/` (original CSS) or the original shell
  markup beyond the menu item change above.
- Structure: `app/minigames/page.tsx` (server, reads the subscription mock) + `app/minigames/_components/*`
  (`promo-page.tsx`, `hero.tsx`, `demo-wheel.tsx`, `demo-box.tsx`, `demo-cards.tsx`, `demo-missions.tsx`, …),
  copy/data in `app/minigames/_content.ts` or `lib/mock/minigames-promo.ts` so text is easy for PK to edit.
- Simple, readable code; short English comments only where the why isn't obvious.

## Verify
- Dev server already runs: `preview_start {name: "lsm-bo-app"}` (port 3200). Check `http://localhost:3200/minigames` in the
  built-in browser pane (open your own tab; don't touch the `bo-superx` tab). Screenshot each section, play each demo,
  check reduced motion (`resize_window` has `colorScheme` only; emulate reduced motion by toggling a class or by reading
  `useReducedMotion` paths), check widths with `resize_window` (reset to `preset: "desktop"` after).
- `npx tsc --noEmit`, `npx eslint .`, `npm run build` in `lsm-bo-app/` must pass. Console must be free of errors.
- Don't commit. Close tabs you opened.

## Report (under ~350 words)
Sections built, demos and how they behave, files, anything you deviated from, command results, and 3–5 screenshots'
paths (saved with `save_to_disk`) that show the hero, each demo mid-animation, and the final CTA.
