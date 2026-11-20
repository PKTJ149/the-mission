# Session Handoff — 18/11/2026

**Created:** 18/11/2026 (session ran 15/11/2026 → 18/11/2026, Bangkok time)
**Project:** `/Users/martinfranck/Projects/the mission` (Missions feature. It has three front-ends:
- `wallet-app/`: the player site
- `backoffice-app/`: a rebuild of the lost "AUTO FAST" mini-game/mission back office
- `lsm-bo-app/` (NEW): a rebuild of the LSM-SYSTEM merchant back office, with our Minigames promo, popup banners and a login mockup)

**Stack:**
- `lsm-bo-app`: Next.js 16.4.5 (App Router, `cacheComponents`), React 19.3.0, TypeScript 5, `motion` 14 (only on the promo, banners and login).
  - No Tailwind.
  - It loads the ORIGINAL LSM CSS: 75 files recovered from the Nuxt bundles.
- `backoffice-app`: same Next/React. It loads the original superx CSS.

**Branch:**
- Current branch: `backoffice/lsm-bo`.
- `main` is fast-forwarded to the same commit `2b7504f`. Both are pushed and in sync with `origin`.
- `backoffice/design-implement` sits at `e4aa355`, also pushed.
- The working tree is clean.

**Repo:** https://github.com/PKTJ149/the-mission (**private**, account `PKTJ149`). The git root is the whole `the mission/` folder.

**Live:** not deployed. Dev servers come from `.claude/launch.json`:
- `backoffice-app`: port 3100
- `lsm-bo-app`: port 3200 (`/` redirects to `/login`)
- `wallet-app-3300`: port 3300. It feeds the live missions iframe on `/minigames`.
- **Port 3000 belongs to another project (tu-credit-back). Never touch it.**

**Source systems (read-only):**
- superx staging: https://superx.staging.lsmloyalty.com
- LSM-SYSTEM: https://bo-superx.merchant.mclsm.com

## Project Status Overview
- **backoffice-app:** a full audit against staging is done. Every route and state was checked and fixed. On PK's decision, the 4 original-system bugs are now copied on purpose. Committed `e4aa355`.
- **lsm-bo-app (new milestone):**
  - `/dashboard` and the full shell match the original. The audit found 0 DOM differences and 0 layout/style differences across 1,668 elements.
  - Other menu URLs show the shell with an empty content area.
- **Our additions (sales tools PK needed for a presentation):**
  - a featured **Minigames** sidebar item
  - the `/minigames` promo page for unsubscribed merchants, with playable demos and the live missions page
  - a popup with 4 swipeable banners
  - a `/login` mockup with the same banners as an auto-slider
- **Everything is committed, pushed, and on `main`** (`2b7504f`).
- **Next:** PK's feedback on the promo, banners and login; the real contact URL; the subscribed-merchant view of Minigames (case 2); how lsm-bo-app connects to backoffice-app.

## Session Summary
1. **Session start (15/11).** Read handoff 02 and briefed PK.
2. **Audit backoffice-app against staging.** PK had found many differences and said they were unacceptable.
   - **PK's decisions:**
     - audit everything (every page and every state)
     - copy the original bugs exactly
     - commit locally first
   - **Method:**
     - Agents compared each page side by side in Chrome at 1704 px, using screenshot pixel diff (`tools/shot-diff.py`) and computed styles (`tools/inspect.js`).
     - The parent agent fixed the shared parts and then re-measured 14 routes: 0 differing regions.
   - On "Commit + push เลย": committed `e4aa355` and pushed it to `backoffice/design-implement`.
3. **New branch `backoffice/lsm-bo` (16/11).**
   - PK asked for the LSM-SYSTEM back office dashboard and full menu, "เหมือนเป๊ะ" (exact), as a separate system.
   - PK's rules:
     - Read-only; downloading files is allowed.
     - Copy the displayed data exactly.
     - Other menus show the shell with an empty content area.
   - The CSS was recovered exactly. `tools/extract-css.py` hashes every CSS string in the downloaded Nuxt bundles and matches it against the live `<style>` tags (75/75).
   - An agent built `/dashboard`, the shell, the topbar, the sidebar (every group, collapse, hover) and the date pickers. It audited them with DOM, style and pixel diffs (`pages/dashboard/AUDIT.md`).
4. **Minigames sidebar item**, built up over several PK messages:
   - a top-level item named "Minigames"
   - a 3D-style SVG icon that loops: a gold-rim wheel spins, then a purple mystery box opens
   - a distinct gradient row with a shimmer
   - a blinking NEW badge

   PK suggested react-three-fiber. We used SVG and CSS instead, because they are lighter for a sidebar icon (see Key Decisions).
5. **`/minigames` promo page.** Built with `/ui-ux-pro-max` and Motion; PK asked for one verification round only.
   - **Sections:** hero with an auto-playing showcase, capability chips, playable demos, features, mission structures, benefits, how it starts, final CTA.
   - **Demos:** wheel, mystery box, card flip, and missions.
   - **CTA:** the contact link (placeholder URL). No prices and no invented numbers.
6. **Popup banners.**
   - 4 swipeable banners open every time the page loads, with "ไม่แสดงอีกในวันนี้" (don't show again today).
   - The CTA closes the popup and scrolls to the demos.
   - PK sent images for banners 1, 2 and 4; banner 3 is drawn in code.
   - PK was about to present, so the slow banner agent was stopped. The parent built the carousel and popup directly.
7. **Missions demo.** On PK's request it now shows the REAL wallet-app `/missions` page in an iframe (phone frame, zoom 0.72), centred.
8. **`/login` mockup.**
   - Left: a dark showcase with the banner auto-slider. Right: the form.
   - Submit always signs in: a 700 ms loading state, then `/dashboard`.
   - `/` redirects to `/login`.
9. **18/11, "commit & push main":**
   - committed `2b7504f` (297 files, about 14 MB)
   - pushed `backoffice/lsm-bo`
   - fast-forwarded `main` and pushed it (`3fd448e..2b7504f`)
   - restarted both dev servers, which had stopped
10. **This handoff.**

## Completed This Session
- **backoffice-app**, every route and state re-audited against staging. The fixes:
  - shared fixes: `allowedDevOrigins`, favicon, the dev badge hidden, offcanvas Escape and backdrop semantics like Bootstrap 5.2, Select2 highlight and Escape, missing images, `instant = false` on the dynamic report pages
  - per-page fixes, listed in `backoffice-reference/AUDIT-2026-11-15-SUMMARY.md`
- **The 4+ original-system bugs are now copied on purpose**, each marked `// ORIGINAL BUG (kept on purpose, PK 15/11/2026)`.
- **lsm-bo-app**, built from scratch:
  - **Shell:** root layout with the 75 original CSS links in order; `#__nuxt > #__layout`.
  - **`(shell)` route group:** `AppShell` with the topbar, the sidebar and the support widget.
  - **`/dashboard`:** cards, provider cards and PrimeVue-style calendars.
  - **`[...slug]`:** empty-content pages for the other menu URLs.
- **The Minigames sidebar item:** a featured row, an animated icon, the NEW badge, and reduced-motion fallbacks.
- **The `/minigames` promo:**
  - every page string lives in `_content.ts`, so PK can edit it
  - a subscription switch, `getMinigamesSubscription()` → `{ subscribed: false }`
- **The promo banners kit** (`components/promo-banners/`):
  - Reusable on both the popup and the login page.
  - **Carousel:** drag, arrows, dots and keys. Autoplays every 5 s, paused on hover, focus, drag, a hidden tab, or reduced motion.
  - **Popup:** Escape and backdrop close it, scroll is locked while open, focus returns afterwards, and the daily hide uses `localStorage`.
- **`/login` mockup:** username, password with show/hide, remember me, demo-mode chip.
- **Checks:** `npx tsc --noEmit`, `npx eslint .` and `npm run build` passed for both apps before the commits.
- **Commits:** `e4aa355` and `2b7504f`, pushed; `main` updated.
- **Project memory:** added `lsm-bo-rebuild.md` and indexed it in `MEMORY.md`.
- **MemPalace:** the project was mined into wing `the-mission` with the CLI, and a diary entry was written (the MCP server was down; see Important Context).

## Files Created
**`lsm-bo-app/`** (new app, about 120 tracked files outside the CSS)
- `package.json`, `tsconfig.json`, `eslint.config.mjs`, `.gitignore`: copied from backoffice-app and renamed.
- `next.config.ts`: `cacheComponents`, `partialPrefetching`, `allowedDevOrigins: ["127.0.0.1"]`, `devIndicators: false`, and the `/` → `/login` redirect.
- `app/layout.tsx`: html/head with the 75 `/lsm-css/NN.css` links in order, plus `#__nuxt > #__layout`. There is no shell here, so `/login` can be full-page.
- `app/(shell)/layout.tsx`: `getShellData()` → `<AppShell>`.
- `app/(shell)/dashboard/`: `page.tsx` and `_components/{dashboard-page,cards,provider-card}.tsx`.
- `app/(shell)/[...slug]/page.tsx`: shell with an empty content area for every other menu URL.
- `app/(shell)/minigames/`:
  - `page.tsx`: Kanit 400–700 as `--mg-font`; reads the subscription mock.
  - `_content.ts`: all copy.
  - `_components/`: hero, showcase, demos, demo-wheel/box/cards/missions, `demo-missions-live` (the iframe), sections, missions, reveal, art, motion-utils, promo-page, and their CSS modules.
- `app/login/`: `page.tsx`, `_components/login-page.tsx`, `login.module.css`.
- `components/shell/`: `app-shell`, `topbar`, `sidebar`, `support-widget`, `minigames-icon.tsx` + `.module.css`.
- `components/primevue/`: `badge`, `button`, `calendar`, `number-format`. Plus `lib/primevue/dom.ts`.
- `components/promo-banners/`: `banners.ts` (content and themes), `banner-slide`, `banner-carousel`, `banner-art`, `banner-scenes`, `minigames-banner-popup`, `banner.module.css`.
- `lib/`:
  - `menu.ts`: the full menu. `Minigames` is `featured: true` and links to `/minigames`.
  - `api/{dashboard,shell,subscription}.ts`, `mock/{dashboard,shell}.ts`
  - `config/minigames.ts`: `MINIGAMES_CONTACT_URL` (placeholder) and `WALLET_APP_URL`
  - `use-mounted.ts`
  - `allow-nested-li.ts`: silences the dev warning about `li` inside `li`, which the original markup needs.
- `public/`: original assets mirrored at their original paths:
  - `lsm-css/00–74.css`, `_nuxt/fonts|img`, `background/`, `icon/`, `images/user.png`, `01-icon-MC-.ico`
  - plus `promo-banners/banner-01|02|04.webp` (PK's images)

**`lsm-bo-reference/`** (reference only, not shipped)
- `BUILD-BRIEF.md`: rules and safety list for the LSM rebuild.
- `source/_nuxt/*.js`: the 28 original bundles, about 4 MB. Read them; never execute them.
- `source/styles/NN-hash.css` (75 files) and `source/style-hashes.txt`.
- `tools/`: `extract-css.py`, `dom-diff.py`, `style-dump.js`, `style-diff.py`, `tool-result.py`.
- `pages/dashboard/`: `page.html`, `notes.md` (route list, live values), `AUDIT.md`, `providers.json`, `inputs.json`, `body-tail.json`.
- `pages/minigames-promo/`: `BRIEF.md`, `BANNERS-BRIEF.md`, `content-reference.png`, `banners-reference.png`, `banner-0N-from-pk.webp`.
- `assets/`: the downloaded originals.

**`backoffice-reference/`**
- `AUDIT-BRIEF.md`
- `AUDIT-2026-11-15-SUMMARY.md`
- per-page `pages/*/AUDIT-2026-11-15*.md`
- `tools/shot-diff.py`
- `tools/inspect.js`

**Other**
- `handoff/handoff-session-03.md`: this file.

## Files Modified
- **`backoffice-app/` (commit `e4aa355`, 92 files)**
  - `next.config.ts`: `allowedDevOrigins`, `devIndicators: false`.
  - `components/shell/document.tsx`: the favicon and the author meta tag.
  - `components/ui/offcanvas.tsx`:
    - Escape is listened for on the element only, like Bootstrap.
    - No `tabIndex`.
    - The backdrop is portalled to the parent element.
  - `components/ui/select2.tsx`: the highlighted row gets `aria-selected`; Escape no longer bubbles up and closes the offcanvas.
  - Most pages under `app/(…)/`: per-page fixes from the audit, plus `// ORIGINAL BUG` copies.
  - `lib/mock/*`, `lib/api/*`: real IDs for the drill-down links, and data to match the counts.
  - `public/`: 3 icons and the Thai redeem-condition image.
- **`.claude/launch.json`**: added `lsm-bo-app` (3200) and `wallet-app-3300` (`npm run dev --prefix wallet-app -- --port 3300`).

## Git Commits
- `e4aa355` — Audit every back office page against staging and fix differences (on `backoffice/design-implement`, pushed, now in `main`)
- `2b7504f` — Add LSM-SYSTEM back office app with Minigames promo and login (on `backoffice/lsm-bo`, pushed; `main` fast-forwarded to it and pushed)
- `main` history now: `3fd448e` → `aaaa6bc` → `450462c` → `e4aa355` → `2b7504f`

## In-Progress / Pending
Nothing is uncommitted. Open items:
- **Real contact URL.** `MINIGAMES_CONTACT_URL` is `"https://line.me/"`, with a `TODO(PK)` comment in `lsm-bo-app/lib/config/minigames.ts`. Waiting on PK.
- **Banner 1 image typos.** PK's image has Thai typos ("หลูกค้า", "ตกแบบ/เป้าเหมือน"). PK may send a fixed image. Banner 3 is code-designed; PK may supply an image for it too.
- **Case 2: the Minigames view for subscribed merchants.** It comes later. The switch is `getMinigamesSubscription()` in `lib/api/subscription.ts`.
- **How lsm-bo-app connects to backoffice-app.** PK said they will decide later. The apps are fully separate for now.
- **Offered, not done:** hide the Next "N" dev badge inside the wallet-app iframe on `/minigames`.
- **Carried over, still open:**
  - wallet-app: PK's feedback on the desktop history, redeem and detail screens; the admin contact channel; whether to delete `mission-logo.tsx`; the 6 pop-up types and the floating expiry button (waiting on Figma).
  - backoffice-app: unfinished features; no API yet.

## Known Issues / Blockers
- **No real API anywhere.** Everything is mock data behind `lib/api/*`.
- **The missions demo needs wallet-app running on port 3300.** Without it the iframe on `/minigames` is empty. Set `NEXT_PUBLIC_WALLET_APP_URL` to point elsewhere.
- **`lsm-bo-reference/tools/__pycache__/extract-css.cpython-312.pyc` was committed by mistake.** It is harmless, but consider adding `__pycache__/` to `.gitignore` and removing it from git (ask PK first).
- **The repo grew by about 14 MB**, mostly the original Nuxt bundles and CSS kept for reference.
- **Dashboard pixel diffs left:** glyph anti-aliasing only. Live values (badges 243/3/3/1/1/12, support count 246, today's date) are frozen copies.
- **Things the audit could not verify:**
  - backoffice-app: any staging state after save, delete, toggle or confirm (forbidden). Those flows were rebuilt from the original scripts.
  - LSM: original pages other than `/dashboard` (navigating by click was not allowed).
- **First compile of `/minigames` takes about 18 s** in dev. It can look unhydrated until then; it is not a bug.

## Key Decisions Made
- **Copy original bugs exactly (PK, 15/11).** Fidelity wins. Each copy is marked `// ORIGINAL BUG (kept on purpose, PK 15/11/2026)`, so it is easy to undo later.
- **lsm-bo-app is a separate system (PK, 16/11).** Keeping it apart lets each back office match its own original CSS. How they connect is PK's call later.
- **Recover the LSM CSS from the bundles, not by restyling.** The original injects its CSS through JS. Matching the strings by SHA-256 gives the exact 75 stylesheets, so the DOM copy renders identically.
- **Route groups.** `(shell)` holds the pages with the LSM shell; `/login` sits outside it, so it is full-page.
- **SVG and CSS for the 3D icon, not react-three-fiber.** A WebGL canvas in every sidebar render is heavy for a 20 px icon. SVG with shading gives the 3D look at almost no cost.
- **Promo content rules (PK):**
  - no prices
  - no invented stats, testimonials or logos, only true capability facts
  - the CTA is a contact link
- **Popup behaviour (PK):** show every time, with "ไม่แสดงอีกในวันนี้"; the CTA closes the popup and scrolls to the demos.
- **Banners reusable on login:** the same `BannerCarousel` runs as an in-page auto-slider (4.5 s) on `/login`. Its CTA goes to `/minigames`.
- **Live missions via an iframe of wallet-app (PK):** shows the real page without copying code. The cost: wallet-app must run alongside.
- **Speed over polish near PK's presentation:** the parent took over the banner work from a slow agent.

## Important Context
- **Safety rules on the original systems (non-negotiable; full list in `lsm-bo-reference/BUILD-BRIEF.md`):**
  - Look, hover, scroll and read only.
  - Never click any of these:
    - save, confirm or submit
    - delete
    - toggles
    - export or download
    - Logout or the user menu
    - the TH/EN or THA/ENG switcher
    - file inputs
    - chat, or notification, deposit or withdraw icons
    - "design ใหม่", P2P, 2FA
    - ค้นหา or รายงานวันนี้ on LSM
  - Never read cookies or storage. Don't work around the tool output filter. Never touch PK's own Chrome tabs.
- **Measuring:**
  - Compare at the same viewport and DPR in the same browser.
  - backoffice uses 1704 px. The LSM dashboard used the pane's 1552 × 1829.
  - Use 127.0.0.1 for the local tabs (allowed by `allowedDevOrigins`).
- **Hidden built-in browser pane:** `requestAnimationFrame` and CSS animations don't run there. Test animations and dialogs with the pane visible, or in Chrome.
- **Stale `.next/types` after moving routes:** `tsc` errors after moving folders into `(shell)` were stale types. `npm run build` regenerates them.
- **Before pushing:** check `gh auth status` shows `PKTJ149` active. Two accounts are on this Mac.
- **MemPalace:** the MCP server failed to connect this session. The CLI works through the shell function `mempalace` (`uv tool run --python 3.12 mempalace`). Use `mempalace mine "<project>" --wing the-mission`.
- **PK's working rules:**
  - Reply in Thai; file content in English.
  - Ask short questions and state the plan before big tasks.
  - Never delete, push or submit without a yes.
  - Always show file links.
  - Do one thing at a time.

## Next Session: Start Here
1. Run `session start`, then `git status` (it should be clean on `backoffice/lsm-bo` at `2b7504f` or later).
2. Start `wallet-app-3300` and `lsm-bo-app` with `preview_start`. Open `http://localhost:3200`; it goes to `/login`, then sign in to `/dashboard` and open Minigames. Collect PK's feedback from the presentation.
3. Ask PK for:
   - the real contact link → set `MINIGAMES_CONTACT_URL`
   - a corrected banner 1 image, and optionally one for banner 3
4. Ask PK what is next:
   - (a) case 2, the subscribed-merchant Minigames view (likely the backoffice-app mini-game and mission settings inside the LSM shell)
   - (b) how lsm-bo-app and backoffice-app connect
   - (c) more LSM pages
5. Small cleanups to offer: remove the committed `__pycache__` and ignore it; hide the dev badge inside the missions iframe.

## Conversation Highlights
- **Why the LSM copy matches so closely:** the CSS is the original, byte for byte. It was found by hashing every string in the JS bundles against the live `<style>` tags. The DOM, including the `data-v-*` scoped attributes, is copied too, so the original styles apply unchanged.
- **Audit method that worked:** DOM diff, then computed style of every element, then pixel diff. Only glyph anti-aliasing remained, which proves boxes and colours match.
- **Staging behaviours copied faithfully:**
  - Bootstrap 5.2 offcanvas listens for Escape only on the element.
  - select2 4.1 marks the highlighted row with `aria-selected`.
  - LSM's SimpleBar sidebar is inert, so no scrollbar was added.
- **Agent speed vs a deadline:** when PK needed to present, stopping a slow sub-agent and building directly was faster than waiting.
- **Iframe instead of re-implementing:** showing the real missions page kept the demo honest and took minutes, at the cost of a runtime dependency.

---
*Auto-generated by Session Handoff automation*
