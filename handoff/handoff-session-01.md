# Session Handoff — 14/11/2026

**Created:** 14/11/2026 (session ran 06/11/2026 → 14/11/2026)
**Project:** `/Users/martinfranck/Projects/the mission` (front-end for the "Missions" feature of a player wallet site; the app lives in `wallet-app/`)
**Stack:** Next.js 16.4.5 (App Router), React 19.3.0, TypeScript 5, Tailwind CSS v4, IBM Plex Sans Thai; three 0.187 + @react-three/fiber 9 + @react-three/drei 10 (lab page only)
**Branch:** none — `the mission/` and `wallet-app/` are **not git repos**. Nothing has been committed.
**Repo:** none (local only)
**Live:** not deployed. Local dev server: `.claude/launch.json` → name `wallet-app` (`npm run dev --prefix wallet-app`, port 3000 in the config; at the end of this session it was serving on **3001**, so check the real port in the server log)
**Figma:** wallet + missions file `F3SPD1aAysw0JKTjpAWKDI` (current source of truth: "Section 2", node `50:35848`). The first link PK sent (`IeNo0rIdDyA1TM2cbLmIPM`, "The Mission Master") was a flat image and was replaced by the file above.

## Project Status Overview
- **Feature scope** (from PK): Missions created in a Back office are shown on the player site. 3 play structures (single mission; main + sub-missions in order; main + sub-missions in any order). UI surfaces: missions list page, mission detail page, 6 pop-up types (deposit, turnover, invite friend, daily check-in, collect points, multi-sub-mission), and a floating button warning about missions close to expiry.
- **Built (front-end only, mock data, no API):**
  - Wallet page `/`: mobile (Figma-exact) + desktop
  - Missions list `/missions`: mobile + desktop, three section tabs. The tabs are ทำภารกิจ, ประวัติรับรางวัล (history) and แลกรางวัล (redeem).
  - Mission detail `/missions/[id]`: mobile + desktop, for all 7 missions
  - 3D reward-reveal prototype `/lab/reward-reveal`. It is not linked from the app.
- **Not built yet:** the 6 pop-up types and the floating expiry button. There are no Figma designs for them yet, and there is no Back office or real API.
- **Overall:** every screen that has a Figma design is built and verified. The desktop layouts for history, redeem and detail have no Figma design; Claude designed them from PK's layout choices.

## Session Summary
This session started the project from nothing. It was built in rounds, each one confirmed with PK first:

1. **Wallet mobile:** built from Figma node `2:27` (430×932). Every position matched Figma within 1px.
2. **Sticky top bar:** the wallet top bar sticks when scrolling. It is transparent at the top and turns `#131314` at 90% once scrolled.
3. **Wallet desktop:** the same page adapts at `lg` (1024px) with a left sidebar. It adds a promotions section and a game-providers section using mock SVG art. The provider names are fictional.
4. **Wallet mobile extras:** a swipeable promo carousel and a 4-column provider grid, added below the bonus wallet (not in Figma).
5. **Missions list `/missions`:** mobile `10:38922` and desktop `8:19902`. It has 7 tilted cards in 5 states, working filters, pin/favourite, desktop search and live countdowns.
   - A tilted-frame bug on one card was fixed (Tailwind v4 applies transforms in a different order from Figma).
   - Later redesigned to the updated Figma: section tabs, and a banner carousel in place of the logo. The carousel auto-slides every 3 s.
6. **three.js discussion, then prototype:** `/lab/reward-reveal` is a mystery box built from code shapes, with a reduced-motion fallback and a no-WebGL fallback. It loads only on that page.
7. **Figma Section 2 (`50:35848`), mobile:**
   - New 80px mission header.
   - History tab with 5 mock pages, and the redeem tab.
   - Mission detail page with demo check-in → claim → rocket progress.
   - Measured within about 1px of Figma.
8. **Desktop for the 3 new screens (last round):**
   - History and redeem tabs: 2 columns at `xl`, stacked at `lg`.
   - Detail page: 2 columns. Left has the art and the main reward; right has the progress card and the sub-missions.
   - Detail state is shared between the mobile and desktop trees.

## Completed This Session
- **Wallet page:**
  - Mobile Figma-exact layout with the sticky top bar.
  - Desktop version with sidebar, promotions and game providers.
  - Mobile promo carousel and provider grid.
- **Missions list (mobile + desktop):**
  - Filters, pin/favourite, search and countdowns work on mock data.
  - The "ภารกิจ" menu links here from the wallet quick menu and from the desktop sidebar.
- **Missions list redesign:**
  - Section tabs.
  - Banner carousel that auto-slides every 3 s. It pauses on hover, finger down, keyboard focus, when off-screen or the browser tab is hidden, and never moves with reduced motion. There is no pause button (PK's choice).
- **3D prototype:** `/lab/reward-reveal`.
- **Section 2 mobile:** 80px header, history tab, redeem tab, and the detail page for all 7 missions. The arrows and dots switch missions.
- **Desktop of history, redeem and detail.** Checks run:
  - Type check, lint and `npm run build`: all pass.
  - Mobile layout positions are unchanged after the desktop work.
  - No horizontal scroll at 375 / 1024 / 1440px.
- **Project memory:** kept current in `~/.claude/projects/-Users-martinfranck-Projects-the-mission/memory/` (`wallet-app-setup.md`, `mission-feature-scope.md`, `figma-mcp-asset-gotchas.md`).

## Files Created
All paths are relative to `wallet-app/`. The whole Next.js project was scaffolded this session.

**Wallet**
- `app/page.tsx` — wallet page. It switches the mobile tree (`lg:hidden`) and the desktop tree (`hidden lg:flex`).
- `app/layout.tsx` — loads IBM Plex Sans Thai.
- `app/globals.css` — colour tokens from Figma (`gold`, `surface-card`, `page`, …).
- `components/wallet/*` — mobile pieces:
  - Header and layout: `wallet-header`, `top-bar` (sticky), `bottom-nav`, `icon`.
  - Wallet cards: `main-credit-card`, `income-wallets`, `bonus-wallet`.
  - Menu: `quick-menu`.
  - Added sections: `section-heading`, `promo-carousel`, `game-providers`.
- `components/wallet-desktop/*` — desktop pieces:
  - Layout: `desktop-wallet`, `sidebar`, `desktop-top-bar`, `section-header`.
  - Wallet cards: `main-wallet-card`, `income-wallet-cards`, `bonus-wallet-card`.
  - Added sections: `promotions-section`, `game-providers-section`.
- `lib/wallet-data.ts` — mock wallet data, shared by mobile and desktop.
- `public/wallet/` — Figma icons, plus mock art in `promos/` and `providers/`.

**Missions**
- `app/missions/page.tsx` — the list page.
- `app/missions/[id]/page.tsx` — the detail page. The id is read inside `<Suspense>`, and all 7 ids are prerendered.
- `components/missions/missions-view.tsx` — list page shell (mobile and desktop), filter/search/countdown state, and section-tab switching.
- `components/missions/mission-card.tsx`, `card-frames.tsx` — the 7 tilted card frames, card states, blur, and the MISSION COMPLETE stamp.
- `components/missions/section-tabs.tsx`, `filter-tabs.tsx`, `search-field.tsx`, `balance-pills.tsx`, `mission-banner.tsx` (auto-slide carousel)
- `components/missions/mission-header.tsx` — the 80px mobile header from Section 2.
- `components/missions/desktop-mission-header.tsx` — the shared desktop header for the list and detail pages.
- `components/missions/history-panel.tsx`, `redeem-panel.tsx` — mobile tabs.
- `components/missions/history-panel-desktop.tsx`, `redeem-panel-desktop.tsx` — desktop tabs.
- `components/missions/mission-detail-view.tsx` — detail page shell. It holds the shared state and renders the mobile tree and `<MissionDetailDesktop>`.
- `components/missions/mission-detail-desktop.tsx` — desktop detail layout.
- `components/missions/mission-detail-shared.tsx` — pieces both detail layouts use:
  - `useMissionSwipe`, `ArrowLink`, `MissionDots`, `DemoButton`, `RewardList`
  - the `ICONS`, `EASE_OUT` and `HERO_SIZES` constants
- `components/missions/mission-logo.tsx` — **unused** since the redesign. Kept on PK's request.
- `lib/mission-data.ts` (7 missions + banners), `lib/mission-detail-data.ts`, `lib/reward-history-data.ts`
- `lib/use-mobile-zoom.ts` — CSS `zoom` for screens narrower than 430px.
- `lib/use-prefers-reduced-motion.ts` — shared by the banner and the 3D demo.
- `public/missions/` — Figma `frames/`, `icons/`, `art/` and `banners/`. `art/logo.png` is unused but kept.

**3D lab**
- `app/lab/reward-reveal/page.tsx`
- `components/reward-reveal/reward-reveal-demo.tsx` (UI + 2D fallback)
- `components/reward-reveal/mystery-box-scene.tsx` (3D scene)

**Project root**
- `.claude/launch.json` — dev server config.
- `handoff/handoff-session-01.md` — this file.

## Files Modified
These are the last round's changes to files created earlier in the session.
- `components/missions/missions-view.tsx`
  - The desktop header now uses `DesktopMissionHeader`.
  - The history and redeem tabs render through `SectionPanel` with a mobile or desktop variant. The old centred 430px wrapper on desktop is gone.
- `components/missions/mission-detail-view.tsx`
  - State (sub-missions, main reward claimed, live announcement) lives once in `MissionDetailView` and feeds both trees.
  - The shell has a sticky mobile header and a desktop header (`lg:contents` wrapper).
  - Shared pieces moved out to `mission-detail-shared.tsx`.
- `components/missions/history-panel.tsx` — `Pagination` is exported for the desktop tab.
- `components/missions/redeem-panel.tsx` — `formatPoints` is exported for the desktop tab.
- `package.json` — added `three`, `@react-three/fiber`, `@react-three/drei` and `@types/three` (earlier round).

## Git Commits (if applicable)
- None. The project is not a git repository.

## In-Progress / Pending
- **Desktop review:** PK has not reviewed the desktop layouts of history, redeem and detail in the browser yet. They are waiting for feedback.
- **Admin contact button** ("ติดต่อแอดมินเพื่อแลกของรางวัล", mobile + desktop): it has no action (TODO). This waits on PK naming the contact channel.
- **Unused files** `components/missions/mission-logo.tsx` and `public/missions/art/logo.png`: kept until PK says to delete them.
- **Pop-ups (6 types) and the floating expiry button:** not started. This waits on Figma designs.

## Known Issues / Blockers
- **Untested sizes:**
  - Short laptop screens (for example 1366×768).
  - Real phones, including how the 3D lab performs on low-end Android.
- **Untested fallbacks:** the 3D lab's no-WebGL fallback, and the banner under OS reduced motion. The in-app browser could not emulate either.
- **Heavy assets:**
  - MISSION COMPLETE stamp: 684KB.
  - Rabbit art: 2.3MB.
  - Banners: 0.9–4MB each.
  - Next.js resizes them when serving, but production should get lighter source files from design.
- **Tablet (768–1023px):** shows the 430px mobile layout centred, with wide empty sides.
- **`npm audit`:** reports 8 moderate issues, all in pre-existing ESLint tooling. Not touched.
- **Console warning in the 3D lab:** "THREE.Clock deprecated". It comes from React Three Fiber, not our code.
- **Port mismatch:** `launch.json` says port 3000, but the server ended on 3001.

## Key Decisions Made
- **Separate mobile and desktop trees** (`lg:hidden` / `hidden lg:*`). The mobile tree is a pixel match of Figma, so desktop changes can never break it. The cost is two copies of the markup to maintain.
- **Below 430px, mobile scales with CSS `zoom`.** The layout stays identical to Figma; the text shrinks too (about 87% at 375px).
- **Turnover bar stays at 54.8%** to match Figma, even though 2,650 / 5,000 = 53% (PK: "ตาม Figma ต่อ"). It is a one-line change in `app/page.tsx` once real data arrives.
- **Typos in Figma copy were corrected in code**, for example ทะเลทราย, บริษัท, ไอโฟน, สิทธิ์หมุนวงล้อ.
- **Section 2 choices (PK):**
  - Build everything in one round.
  - Every card opens a detail page, and the arrows/dots switch missions (7 dots = 7 missions).
  - Buttons are a working demo that saves nothing.
- **Banner (PK):** 3 images with 3 dots (Figma draws 4). Auto-slides every 3 s and pauses automatically; no pause button.
- **3D prototype (PK):** mystery box, on a separate lab page, built from code shapes with no model file. It is loaded with `next/dynamic` `ssr:false`, so its ~265KB gzip chunk only loads there.
- **Desktop for the 3 new screens (PK):**
  - Build all 3 in one round.
  - History and redeem: 2 columns.
  - History: a real columned table (date / mission / reward / amount).
  - Detail: 2 columns.
- **Detail left column is not sticky.** Both columns are about a screen tall, so sticky would hide the bottom of the left column while scrolling. This differs from the option description PK picked.
- **Desktop-only helper copy was added** (not in Figma):
  - progress card title + counter
  - "ดูเงื่อนไข/ซ่อนเงื่อนไข" on sub-mission headers
  - a hint under the locked main-reward button
  - "หน้า X จาก 5"
  - ledger badges ได้รับแต้ม/แลกแต้ม, so the table doesn't rely on colour alone
  - desktop header title "รายละเอียดภารกิจ"
- **The ui-ux-pro-max design-system suggestion (Retro-Futurism, Fira fonts) was ignored.** It clashes with the existing black/gold brand.

## Important Context
- **Read before editing:** `wallet-app/AGENTS.md`. It says this Next.js version has breaking changes, so check `node_modules/next/dist/docs/` before relying on remembered APIs.
- **Figma MCP gotchas:**
  - Asset hash collisions can return the wrong icon. Export the node SVG instead and strip the section background.
  - When re-syncing, diff the metadata with ids stripped, and re-download the card frame SVGs. A vector can move inside a group without the group's size changing; frame `f.svg` moved 19px.
- **Tailwind v4 transforms:** classes apply in a different order from Figma's rotate → skew → scale. Flipped, skewed frames need a raw `transform` string (see `card-frames.tsx`).
- **Chrome blur:** `mix-blend-luminosity` greyscale blocks `backdrop-blur`. Completed cards use a saturation-based grey instead.
- **Detail page:**
  - Next 16 `cacheComponents` / partial prefetch warns unless the params read is inside `<Suspense>`.
  - Buttons use `aria-disabled` rather than `disabled`, so focus isn't lost after a press.
  - The desktop rocket track is fluid: `clip-path` for the fill, and a `translateX(p*100%)` strip for the rocket.
- **Tabs between 1024 and 1279px:** the tab cards use container queries (`@container` + `@xl:` / `@2xl:`), so they rearrange inside when stacked.
- **PK's working rules (global CLAUDE.md):**
  - Reply in Thai; file content in English.
  - Ask short clarifying questions and state the plan before building.
  - Never delete without asking.
  - Explain code briefly with one learning point.
  - Always show file links.

## Next Session: Start Here
1. Run `session start`, then start the dev server (`wallet-app` in `.claude/launch.json`) and confirm the port in the log.
2. Ask PK for feedback on the desktop history tab, redeem tab and detail page at 1024px and 1440px. Points to confirm:
   - the non-sticky left column
   - the added helper copy
   - the header title "รายละเอียดภารกิจ"
3. Ask PK for the Figma designs of the next surfaces: the 6 mission pop-ups and the floating expiry button. Build mobile first, Figma-exact, following the same pattern.
4. Ask for these decisions:
   - the admin contact channel (to wire the redeem button)
   - whether to delete `mission-logo.tsx` + `art/logo.png`
   - whether to `git init` and make a first commit
5. When there's time:
   - Test at 1366×768 and on a real phone.
   - Request lighter image assets.
   - Decide on a tablet (768–1023px) layout.

## Conversation Highlights
- **Flat images can't be built Figma-exact.** PK's first Figma link was one flat image. Only real layers give exact colours, type and spacing, so PK switched to file `F3SPD1aAysw0JKTjpAWKDI`.
- **`sticky` vs `fixed`:** `sticky` keeps its space in the page flow, so content isn't covered while at the top.
- **Mission card fix:** one card's gold border tilted the wrong way. The cause was Tailwind v4's transform order versus Figma's.
- **three.js:** best for short, rare reward moments (box opening, mission complete). Not for lists, cards or pop-up layouts. Spline was suggested if PK wants to design a nicer box model.
- **Fluid rocket track:** the desktop rocket moves along a strip as wide as its travel distance, shifted by a percentage of its own width. This keeps the distance correct at any column width.
- **Unanswered question set:** PK left one AskUserQuestion set unanswered and re-sent it in Thai ("ถามมาใหม่เป็นภาษาไทย"). Always ask PK questions in Thai.

---
*Auto-generated by Session Handoff automation*
