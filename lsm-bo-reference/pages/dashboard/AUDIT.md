# /dashboard — audit (16/11/2026)

Original: `https://bo-superx.merchant.mclsm.com/dashboard` (tab-1). Rebuild: `http://127.0.0.1:3200/dashboard` (tab-2,
`lsm-bo-app` dev server). Both tabs at the pane's own size: innerWidth × innerHeight 1552 × 1829, DPR 1, page height
3944. Both in the same state for every check (sidebar group "โปรโมชั่น" open as PK left it, unless stated).

## How it was measured
1. **DOM** — `#__nuxt` outerHTML of both tabs, compared with `tools/dom-diff.py` (comments dropped, whitespace runs
   collapsed, style declarations parsed, class order ignored). Every tag, attribute (`data-v-*`, `href`, `src`,
   `aria-*`, `to`, `isactive`), class, inline style and text is compared.
2. **Layout + computed style** — `tools/style-dump.js` (`__dump()`) on both tabs, compared with `tools/style-diff.py`:
   page-coordinate box (±0.5 px), colour, background, font, borders, radius, shadow, opacity, visibility, alignment,
   padding, margin and `::before` content (the PrimeIcons glyph) of **every** element.
3. **Pixels** — screenshots of both tabs, `backoffice-reference/tools/shot-diff.py --css-width 1552` (threshold 70,
   min-hits 6), plus zoomed crops.

## Results

| State | DOM | Layout + style (all elements) | Pixels |
|---|---|---|---|
| Default, top (scroll 0) | 0 differences (1,667 elements) | 0 / 1,668 differ, except the pulsing support button ring | 1,223 px in 17 glyph-sized spots, no box edges |
| Default, middle (scroll 1829) | (same page) | (covered by the full-page dump above) | 14,647 px, text edges only (½-scale shots upscaled) |
| Default, bottom (scroll 2115) | (same page) | (covered) | 4,194 px, text edges only |
| All sidebar groups + sub-groups open | `<ul>` classes identical (`hidden` gone, `style=""` left by slidedown) | 0 / 1,668 differ (ring only) | — |
| Groups closed again (back to PK's state) | open/closed pattern identical | — | — |
| Sidebar collapsed (hamburger) | `hide-menu`, 35 × `isactive="true"`, 6 × `main-nemu`, item padding `13px 13px 13px 0` — identical | 0 / 1,668 differ (ring only) | 962 px, glyph spots |
| Collapsed sidebar hovered (widens to 241 px) | — | 0 / 385 sidebar elements differ | 1,245 px, glyph spots |
| Date picker open ("จากวันที่") | identical markup (`role class pv_id_7 style`, 5 weeks, today `p-highlight`, other-month `p-disabled`) | same box / colours / fonts for every element of both calendars (only the z-index value differs) | crops identical by eye |
| Top-bar tooltip (hover ยืนยันสมาชิก) | identical `p-tooltip p-component p-tooltip-bottom`, same left/top (619.766 / 46.4531 px) | same box 100.1 × 48 | crops identical by eye |
| Hover: menu item, group header, ค้นหา button | — | same colour / background / border | — |
| Other menu URL (e.g. /member/information, /report/rebate) | shell + empty content; item `nuxt-link-exact-active`, its group open like the original's `routeCheck()` | not compared (no original page opened: clicking menu links is not allowed) | — |

## What is left and why
- **Pixel spots**: every remaining region sits on text glyphs or icon strokes, never on box edges. The two tabs are
  rasterised differently by the pane (tab-1 screenshots are 800 × 943, tab-2 800 × 942; tab-1 text is slightly
  heavier), so anti-aliasing never matches 1:1. The exact checks (2) show no element moves or changes colour.
- **Support button ring** (`sw-ring`): an endless CSS animation, so its box-shadow is at a different phase in each tab.
- **z-index / `pv_id_N` of overlays**: PrimeVue counters. The rebuild starts from the original's values after page
  load (`pv_id_7` for the first picker), but the numbers grow with every overlay opened, so they only match on a fresh load.
- **Live values**: all numbers, badges (243 / 3 / 3 / 1 / 1 / 12), the support count (246) and today's date are copies of
  what the original showed on 16/11/2026 (`lib/mock/`), and will drift from the live system.
- **Not checked against the original** (never-click list or not allowed): language and user dropdowns, download / P2P
  panels, expense dialog, One2Coin dialog, support chat, month/year views of the date picker, ค้นหา / รายงานวันนี้.
  Their markup / behaviour come from the original bundle (`_nuxt/*.js`), not from a capture.
- **DOM details React cannot reproduce**: Vue's `<!---->` placeholders and the blank text nodes inside the date picker's
  `<table>`/`<tr>` (they never render). Inline `style` attributes written by React use `prop:value` without spaces
  (same declarations).
