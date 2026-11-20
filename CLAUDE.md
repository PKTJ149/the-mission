# CLAUDE.md — The Mission

Shared rules for anyone (person or Claude) working in this repo. Keep it short and current.
Personal preferences (reply language, tone) belong in your own `~/.claude/CLAUDE.md`, not here.

## What this repo is
Front-end for the **Missions** feature: missions created in a back office, shown on a player wallet site.
Three separate Next.js apps live side by side. There is **no real API yet** — everything runs on mock data.

| App | What it is | Dev port | Visual source of truth |
|---|---|---|---|
| `wallet-app/` | Player site: wallet, missions list, mission detail | 3000 (3300 when used by the `/minigames` iframe) | Figma file `F3SPD1aAysw0JKTjpAWKDI`, "Section 2" |
| `backoffice-app/` | Rebuild of the "AUTO FAST" mini-game / mission back office | 3100 | https://superx.staging.lsmloyalty.com |
| `lsm-bo-app/` | Rebuild of the LSM-SYSTEM merchant back office + our Minigames promo and login mockup | 3200 | https://bo-superx.merchant.mclsm.com |

Reference folders (`backoffice-reference/`, `lsm-bo-reference/`) hold captures, briefs, audits and tools. They are **not shipped**.
`handoff/` holds session handoff notes — read the newest one to see where work stopped.

Stack (all apps): Next.js 16.4.5 (App Router), React 19.3.0, TypeScript 5. `wallet-app` also uses Tailwind v4.

## Read before you change anything
1. The app's `AGENTS.md`. **This Next.js version has breaking changes** — check `<app>/node_modules/next/dist/docs/` instead of relying on memory.
2. The newest file in `handoff/`.
3. For `backoffice-app`: `backoffice-reference/BUILD-BRIEF.md` and `backoffice-app/components/ui/README.md` (use the shared primitives; don't write your own).
4. For `lsm-bo-app`: `lsm-bo-reference/BUILD-BRIEF.md`.

## Commands
Run inside the app folder:
```bash
npm install
npm run dev -- --port <port>   # see the table above
npx tsc --noEmit               # type check
npx eslint .                   # lint
npm run build                  # production build
```
`.claude/launch.json` has a ready-made dev server entry for each app.

## Rules for each app
**Back offices (`backoffice-app`, `lsm-bo-app`) — copy the original exactly**
- Load the ORIGINAL CSS from `public/` unchanged. Never edit those files. No Tailwind, no CSS framework of our own.
- Re-create the original DOM: same class names, ids, element order, attributes, icons and copy. Don't restyle or "improve".
- Original bugs are copied on purpose and marked `// ORIGINAL BUG (kept on purpose, PK 15/11/2026)`. Don't fix them without the owner's OK.
- Behaviour you chose not to copy gets a `// ORIGINAL:` comment describing what the original does.
- Use plain `<img>`, not `next/image`, to keep the original DOM.
- Text goes through the i18n helper (`useT()` / `t(key, "Thai")`) with the original keys.

**`wallet-app` — match Figma**
- Mobile and desktop are separate trees (`lg:hidden` / `hidden lg:*`). The mobile tree is a pixel match of Figma — don't change it to fix desktop.
- Screens without a Figma design need the owner's sign-off before building.

**All apps**
- Pages get data only through `lib/api/` (async functions), backed by `lib/mock/` for now. Forms never save anywhere.
- Page-only components go in `_components/` next to the page.
- Simple, readable code. Short English comments only where the "why" isn't obvious.
- No new dependencies without a reason written in the PR.

## Safety rules for the original systems (non-negotiable)
The staging and LSM sites may hold real data. **Look, hover, scroll and read only.**
- Never click: save / บันทึก / ยืนยัน / submit, delete / ลบ, toggles, export / download, file inputs, Logout or the user menu,
  the TH/EN switcher, chat / notification / deposit / withdraw icons, "design ใหม่", P2P, 2FA, ค้นหา / รายงานวันนี้ (LSM).
- Click only elements you named on purpose — never "click everything with an onclick".
- Never read cookies, localStorage or tokens. Never work around a tool's output filter.
- Downloading CSS, fonts, icons and images is allowed.

## Git workflow
- `main` is the stable branch. **Don't push to `main` directly** — open a Pull Request.
- Branch from `main`, named `<area>/<short-topic>`, e.g. `backoffice/report-filters`, `wallet/redeem-popup`, `lsm/login`.
- Before opening a PR: `npx tsc --noEmit`, `npx eslint .` and `npm run build` pass in every app you touched.
- PR description: what changed, screenshots for UI changes, anything you guessed or couldn't match.
- At least 1 review before merging.
- Never commit `.env*` files, secrets, `node_modules/`, `.next/` or `__pycache__/`.

## Comparing with the original
- Compare at the same viewport and device pixel ratio in the same browser (back office audits used 1704 px wide).
- Use `127.0.0.1` for local tabs (allowed by `allowedDevOrigins`).
- Tools: `backoffice-reference/tools/shot-diff.py` (pixel diff) and `backoffice-reference/tools/inspect.js` (computed styles).

## Open items
See the "In-Progress / Pending" section of the newest `handoff/` file.
