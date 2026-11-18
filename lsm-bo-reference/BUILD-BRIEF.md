# LSM-SYSTEM rebuild brief — dashboard + menu (16/11/2026)

## Goal (PK)
Rebuild the front-end of the LSM-SYSTEM back office (`https://bo-superx.merchant.mclsm.com`) as a **separate app**
`lsm-bo-app/` in this repo (branch `backoffice/lsm-bo`). This round: the **dashboard page** (`/dashboard`,
"กระดานแดชบอร์ด") and the **full shell**: sidebar menu with every item and sub-item, top bar, floating widgets.
Other menu items link to their original URLs and show the same shell with an **empty content area**.
It must look and behave **exactly** like the original ("เหมือนเป๊ะ ๆ"). How it connects to the mini-game/mission
back office (`backoffice-app/`) will be decided later; keep it fully separate for now.

## Decisions already made (PK, 16/11/2026)
- Separate app `lsm-bo-app/`: Next.js 16 + React 19 + TypeScript, same versions as `backoffice-app/package.json`.
  No Tailwind / CSS framework of our own.
- Data: copy exactly what the original shows (numbers, names, badges, dates as displayed) into mock data.
- Original system: **read-only**. Downloading its CSS, fonts, icons and images is allowed.
- Menu items without a page: link to the original URL, render the shell with the active item highlighted and an empty
  content area.

## What is already done
- The original is a Nuxt 2 SPA (PrimeVue + PrimeFlex, Kanit). All CSS is injected by JS as 75 `<style>` tags.
  They are recovered **exactly** (SHA-256 verified against the live page) in `source/styles/NN-<hash>.css`, in
  document order (00…74). Load them in that order, unchanged. Tool: `tools/extract-css.py`.
- The Nuxt bundles are in `source/_nuxt/*.js` (read them for behaviour, menu config, i18n keys; never execute them).
- Fonts/images the CSS and page load (from `performance` entries): `/_nuxt/fonts/primeicons.{d44157b.eot,7817295.woff2,10d3152.woff,ea53586.ttf}`,
  `/_nuxt/img/primeicons.e1441b1.svg`, `/_nuxt/img/color.6441e63.png`, `/background/bg-white2.jpg`, `/icon/AUTO-FAST-TRACK.png`,
  `/icon/Side-AUTO-FAST-TRACK.png`, `/icon/th.png`, `/icon/en.png`, `/icon/php.png`, `/images/user.png`, `/01-icon-MC-.ico`,
  `/api/th.json` (i18n), `/sound/cash-money.mp3`. Google Fonts are loaded by style tag 02 (`@import`), keep that.

## Safety rules on the original (non-negotiable)
It may be a live system with real data. Only look, hover, scroll and read.
- **Allowed clicks:** expanding/collapsing sidebar groups (they only toggle), opening and closing the two date pickers
  on the dashboard, and the hamburger that collapses the sidebar (restore it to how PK left it afterwards).
- **Never click:** logout / the user menu items, the TH/EN language picker options, "design ใหม่", P2P, the 2FA item,
  the floating chat button or its bubble (opening it can mark messages read), header notification/deposit/withdraw icons
  (they can mark items read), ค้นหา / รายงานวันนี้, any save/approve/delete/confirm, any form submit.
- Don't navigate away from `/dashboard` by clicking; read link targets from `href` / the router config instead.
- Never read cookies, localStorage or tokens. Don't send anything anywhere except downloading the static files above.
- PK can see the browser pane. Keep the original tab (`tab-1`) on `/dashboard` and leave it as you found it.

## Capture (into `lsm-bo-reference/pages/dashboard/`)
- The DOM is ~151 KB (`#__nuxt`, 1,665 elements, 478 inline `style` attributes). Save it in chunks with
  `javascript_tool` (e.g. top bar, sidebar, content split by section) to `page.html`; keep every class, `data-v-*`
  attribute, inline style, `href`, `src` and text exactly.
- Also capture: each sidebar group expanded (sub-items + hrefs), the sidebar collapsed (hamburger), hover states of menu
  items and buttons, the date picker open, the bottom-left version/status dots, the floating chat button + bubble,
  the header (badges, flags, user name), the whole page height (scroll to the bottom: payment-gateway account cards).
- Write `notes.md`: route list for the menu, what each interactive part does, every value that is live/dynamic.

## Build (`lsm-bo-app/`)
- Scaffold by copying `backoffice-app`'s `package.json` (rename to `lsm-bo-app`), `tsconfig.json`, `eslint.config.mjs`,
  `next.config.ts` (keep `allowedDevOrigins: ["127.0.0.1"]` and `devIndicators: false`), `.gitignore` entries; run
  `npm install`. Read `node_modules/next/dist/docs/` for anything Next-16-specific (see `backoffice-app/AGENTS.md`).
- Put the 75 CSS files in `public/` (e.g. `public/lsm-css/NN.css`) and link them in order in the root layout `<head>`
  (plain `<link rel="stylesheet">`, no `precedence`, so React keeps the order). Mirror downloaded assets at their
  original URL paths under `public/`.
- Same DOM as the original: element order, class names, `data-v-*` scoped attributes (the scoped CSS needs them), inline
  styles, PrimeVue markup. Plain `<img>`. Internal links with `next/link` (renders `<a href>` like `nuxt-link`).
- Structure: `components/shell/` (topbar, sidebar, floating widgets), `app/dashboard/page.tsx` + `_components/`,
  `app/[...slug]/page.tsx` (shell with empty content for the other menu URLs), `/` behaves like the original `/`
  (check where it goes), `lib/menu.ts`, `lib/mock/dashboard.ts`, `lib/api/dashboard.ts` (async functions the page
  calls, so a real API can replace the mock later). Short English comments only where the "why" isn't obvious.
- Behaviour to copy: sidebar groups expand/collapse (same animation), hamburger collapse, active item, date pickers
  (PrimeVue Calendar look), default dates = today like the original, hover states. Buttons that would send data do
  nothing (comment them `// ORIGINAL: …`).
- Dev server: `/Users/martinfranck/Projects/the mission/.claude/launch.json` already has a `lsm-bo-app` entry
  (`npm run dev --prefix lsm-bo-app -- --port 3200`, port 3200). Start it with `preview_start {name: "lsm-bo-app"}`
  once `npm install` is done (never with Bash).

## Measure until identical
- Open the local page in a **second tab of the same browser pane** (`http://127.0.0.1:3200/dashboard`). Check both tabs
  report the same `[innerWidth, innerHeight, devicePixelRatio]`.
- Use `backoffice-reference/tools/shot-diff.py` (screenshots of both tabs at the same scroll positions, pass
  `--css-width <innerWidth>`) and `backoffice-reference/tools/inspect.js` (`__at`, `__sub`) to find and explain every
  difference. Full page top to bottom, every state above, zoom crops for dense areas. Fix until clean; list anything
  left (live values only).

## Checks and write-up
- In `lsm-bo-app/`: `npx tsc --noEmit`, `npx eslint .`, `npm run build` must pass.
- Write `lsm-bo-reference/pages/dashboard/AUDIT.md`: state → result (diff px / regions left and why).
- Don't commit. Close any tab you opened; leave `tab-1` on `/dashboard`.
