# Audit 15/11/2026: mini-game LIST page (`/promotion/mini-game-v2`, `/`)

Scope: list page only (header, filters, cards, pagination, create menu, bonus popup, card tooltip).
The create/edit/view offcanvas belongs to the wizard audit.
Tabs: staging `superx.staging.lsmloyalty.com` and local `127.0.0.1:3100`. Both `[1704, 1675, 2]`. The brief expects
height 1731; both tabs measured 1675, so the comparison is still like-for-like. Local was reloaded after the
parent's `allowedDevOrigins` fix, and hydration was confirmed (`__react*` keys on `#btnAddMinigame`).

Method: `shot-diff.py` on full screenshots and zoom crops, plus a computed-style signature of every element under
`.page-content` (rect, colours, borders, shadow, cursor, font, text; random `uuid-N` classes removed), compared
by hash on both tabs.

| # | State | Differences found | Cause | Fix (file) | Final result |
|---|---|---|---|---|---|
| 1 | Default page (top, and scrolled to bottom, scrollY 48) | none | — | — | 0 px diff (only the Next dev "N"/issues badge, which exists in dev only); 484/484 elements identical; scrollHeight 1723 = 1723 |
| 1b | `/` | none | — | — | both redirect to `/promotion/mini-game-v2` (fetch `redirected: true`) |
| 2 | Hover: create button, search, all filter pills, card body, bonus pill, drag handle, toggle, badges, agent chip, tips icon, pagination (page, first, next), limit | none, once transitions settle (1 s) | — | — | identical style hashes for every hover state |
| 2b | Hover: eye button tooltip | Local tooltip `tooltip bs-tooltip-auto fade show`, 65×43 at (1472,289), no custom style. Staging `tooltip custom-tooltip bs-tooltip-auto show`, 56.4×36.8 at (1476,293): teal `#1f7e7b`, Noto Serif Thai 10px/16px 500, shadow, arrow at 21.5 px | helper.js `CustomTooltip.initBootstrap()` uses `customClass: 'custom-tooltip'`, `animation: false`, `offset: '0,4'`; Popper rounds positions by DPR | `detail-tooltip.tsx`: classes, 4 px offset, DPR rounding, `tooltipNNNNNN` id + `aria-describedby` on the button | position/size/arrow/styles identical; zoom diff = cursor only |
| 2c | Eye button click | Staging hides the tooltip, swaps in the spinner, and ~220 ms later the tooltip shows again. It stays visible above the offcanvas and after the offcanvas closes, until the pointer enters and leaves the eye button again. Local hid it for good | Original bug (Bootstrap re-shows the tooltip on the content swap; the disabled button gets no mouseleave) | `minigame-card.tsx`: re-show after 220 ms if still hovered, ignore leave until the next enter. Comment `ORIGINAL BUG (kept on purpose, PK 15/11/2026)` | same sequence measured on both (hide → re-show at +240 ms local / +220 ms staging, still shown after close, gone after re-enter/leave) |
| 3 | Create dropdown open + item hover, close by Escape / outside click | none | — | — | menu rect 207×86.4 at (1452,186) on both; zoom diff = cursor only |
| 3b | Responsiveness of the create menu, popups and every page-state change | Local reacted about 1.1 s after the click (menu `show` +1128 ms, modal `bounceOut` +1057 ms). Staging reacts at once | Every page state change re-rendered the large wizard offcanvas tree (dev mode) | `minigame-page.tsx`: wizard offcanvas wrapped in `memo` with a comparator (control phase/backdrop, session, games, agents) + stable `onEdit` / `onSaved` | menu +172 ms, modal close +67 ms (what is left is the page's own dev render) |
| 4a | Status dropdown open + item hover | none | — | — | style hashes equal (except random uuid class); zoom diff 0 px |
| 4b | Status = ปิดใช้งาน (empty result) | Local showed the shared empty state (icon + ไม่พบข้อมูลที่ค้นหา) above the pagination. Staging renders nothing: only `.table-loading` (hidden) + `.system-pagination` "แสดง 0 - 0 จาก 0 รายการ", with no `#customMinigameDraggable` and no `input#offset` | Server partial for an empty list | `minigame-page.tsx`: no list, `#offset` or EmptyState when the result is empty | full-page diff 0 px; 210/210 elements identical |
| 4c | Loader during a list reload | none (same DOM, lord-icon, texts, sizes) | — | — | identical. Staging duration is network latency (2.8 s measured); local uses 500 ms |
| 4d | Created-date flatpickr open, day hover, range 09/11–15/11 picked | none | — | — | calendar 307.9×310 at (593,230) on both, 72/72 elements equal, zoom diff 0 px; filtered result full diff 0 px |
| 4e | Search: typing (no search on input on either), Enter ("Wheel Retest" → empty), × clear | × on staging runs `CustomInput.clearValue(this);tableMinigame.refresh();` and searches again (card comes back). Local only emptied the field | Page-specific onclick on the × | `components/ui/search-input.tsx`: optional `onClear` prop (backward compatible); `minigame-page.tsx` passes `onClear={() => refresh({ search: "" })}` | empty-result zoom diff 0 px; × now reloads the list (0 → 1 card) like staging |
| 4f | Type / created-by / agent dropdowns open | none | — | — | style hashes equal |
| 5 | Bonus pill popup `#modalShowWheelDetail` | (1) "ปิดหน้าต่าง" button 101 px wide locally vs inline `width: 168px` on staging, which shows on hover (pill background). (2) Staging opens the modal only after `POST /api/promotion/lucky-wheel/get/` (~850 ms) and ignores clicks meanwhile; local opened at once | Inline style not captured; `viewMinigameDetail(..., sequencePie)` awaits the request and sets `onloadShowWheelDetail` | `wheel-detail-modal.tsx`: `style={{ width: "168px" }}`. `minigame-page.tsx`: opens after the same 500 ms simulated request as the eye button and ignores clicks during it | modal full-screen diff 0 px; hover on close button diff 0 px; slices 1–8 all read "Wheel N - จำนวนโบนัสที่แจก / Credit Fixed Rate 1 baht / Get Amount ไม่จำกัด" on staging = mock |
| 5b | Modal open/close animation | none | same CSS (bounceIn/bounceOut 0.75 s), hide on animationend on both | — | measured gaps (~935 vs ~1058 ms) are main-thread noise |
| 7 | Pagination / limit dropdown open + option hover | none | — | — | full diff = cursor only; 34/34 elements equal except the random uuid classes (staging adds a second uuid after each list reload) |

## Not reached / not verified
- Inactive card look (`minigame-off`) and limited bonus pills (`givenOut / limit`): staging has no inactive mini-game and no limited slice. Status toggles must not be clicked.
- Drag-reorder: drag handles are off limits on staging.
- Status-toggle confirm dialog: toggles are off limits (text is still the earlier guess).
- More than one page of results: staging has 3 mini-games, so the next/last pages and limits 20/50/100 can't show a difference.
- Loader length: staging's is network time; local uses a fixed 500 ms.
- The offcanvas itself (wizard scope). One finding for its owner: on staging **Escape does not close** `#offcanvasMinigameSetting` after opening it with the eye button (Bootstrap 5 listens for Escape on the offcanvas element, and focus is outside it). Locally `useOffcanvas` listens on `window`, so Escape closes it.

## Notes
- Every list load on staging (filter, search, × clear, page load) runs an inline script from the list response that POSTs `/api/promotion/mini-game/update-sequence-auto`, not only the first page load. 7 staging list loads were made during this audit.
- The local dev "N" badge turns red ("issues") because of console errors from other areas (`htmlFor`, wizard). It is dev only.
