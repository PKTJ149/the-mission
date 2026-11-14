# Page build brief (shared by all page agents)

## Goal
Rebuild the lost front-end of the "AUTO FAST" back office so every page, popup and state looks and behaves **exactly** like the original at https://superx.staging.lsmloyalty.com. PK (owner; senior designer learning to code) will keep building on this code, so it must also be clean and readable.

Decisions already made by PK:
- Next.js 16 + React 19 + TypeScript, loading the ORIGINAL CSS files unchanged. Pages re-create the ORIGINAL DOM: same class names, ids, element order, attributes, icons and copy. That's what makes them look identical — don't restyle, don't "improve".
- Mock data only (values exactly as captured). Everything in the UI must work like the original — filters, search, pagination, tabs, accordions, wizards, validation, dialogs, toggles — but nothing is sent anywhere. "Save" updates in-memory state only (lost on reload) and shows the same feedback the original shows (see legacy JS).
- Thai + English via `t(key, "captured Thai")` with the original i18n keys where the original uses `data-i18n`.

## Read before coding
1. `backoffice-app/AGENTS.md` — Next 16 has breaking changes; check `backoffice-app/node_modules/next/dist/docs/` before relying on memory.
2. `backoffice-app/components/ui/README.md` — the shared primitives (dialogs `useCustomSweetAlert` / `useCustomModal` / `useCustomPopupAlert` / `SystemPopup`, `Offcanvas`, `FilterDropdown`, `DateRangeFilter` (flatpickr), `SearchInput`, `CustomDropdown`, `GoogleDropdown`, `Select2`, `ToggleSwitch`, `Pagination`, `TableLoading`, `EmptyState`, `useToast`, `RichTextEditor` (original CKEditor build), `ColorPicker`). Use them instead of writing your own.
3. `backoffice-reference/INVENTORY.md` (rounds 1 + 2) and `styles.md`, then your pages' folders under `backoffice-reference/pages/` (`page.html`, `modals/`, `screenshots/`, `data.json`, `notes.md`, `*.styles.json`), and `backoffice-reference/legacy-js/NOTES.md` + the original JS for behaviour, dialog texts, validation rules and inline styles the JS sets.
4. Look at the screenshots (Read tool shows images). They are the ground truth when HTML and screenshot disagree.

## Capture caveats
- Inline `style="…"` values were not captured in the HTML; elements carry `data-capture-style-props="width display …"`. Values were recovered into `*.styles.json` next to most files — use them. Where still missing (`[BLOCKED…]`), derive from screenshots / legacy JS / CSS, and list each guess in your report.
- GUIDs became `uuid-N`; base64 data was removed; some icons are marked as capture gaps — use the matching file under `public/assets/images/` or the icon font if one fits, else note it.
- Content images (wheel art, mission art, banners) live on remote hosts (`storage.googleapis.com/one-loyalty-stg-media/...`, `cdn.lsmloyalty.com/...`). Reference those URLs in mock data exactly like the original does; do NOT download them. List the hosts you used (Next `<img>`: use plain `<img>`, not `next/image`, to keep the original DOM).

## Code rules (contract with the shell)
- The shell (sidebar, header, layouts, per-group stylesheets) already exists and is verified against staging. Don't edit `app/(group)/layout.tsx`, `components/shell/`, `components/ui/`, `lib/i18n/` or `public/`.
- Each route already has a stub `page.tsx` inside its route group. Replace the stub with the real page. Render `<div className="page-content">…</div>` plus the page's hidden modals/offcanvases; the shell renders everything else.
- New routes (sub-pages, drill-downs) go inside the route group whose stylesheet set matches the original page (check `styles.md` and `components/shell/page-groups.ts`). If no group matches, you may add ONE new group + entry in `page-groups.ts` following the existing pattern exactly (additive only) and say so in your report.
- Page-only components: `_components/` folder next to the page. Mock data: `lib/mock/<area>.ts`. Data access: `lib/api/<area>.ts` (async functions the page calls, so mocks can later be swapped for real fetch). Only touch files in your own area — other agents are building other pages at the same time.
- If a shared primitive is missing or buggy, build what you need inside your `_components/` and report the gap; don't edit `components/ui/`.
- Links between pages: plain `<a href>` with the original URLs.
- Dynamic routes need `generateStaticParams`.
- Faithful but sane: reproduce visible content exactly (including odd copy that comes from data). Don't deliberately reproduce broken interactions (e.g. tooltips that stay stuck); leave a `// ORIGINAL:` comment describing the original behaviour instead. Buttons that do nothing in the original may stay no-ops (comment them).
- Simple, readable code with short English comments only where the "why" isn't obvious. No new dependencies unless unavoidable (say why).

## Verification (you have no browser — the parent compares visually afterwards)
- A dev server is ALREADY running at http://localhost:3100 (hot reload). Do not start another server and do NOT run `npm run build` (other agents share the folder and `.next`).
- Run `npx tsc --noEmit` and `npx eslint <your files>` in `backoffice-app/` — both must pass for your files.
- `curl -s http://localhost:3100/<route>` for each of your routes: 200, and the server HTML contains your key markup (no error overlay text).
- Compare your rendered DOM against the captured `page.html` for class names/structure (e.g. a quick script that lists class sequences of both).

## Report (under ~350 words)
Routes and files you created; what works interactively; every value you had to guess; every original behaviour you couldn't reproduce or chose not to; shared-primitive gaps; command results.
