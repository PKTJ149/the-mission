# The Mission

Front-end for the **Missions** feature: a player wallet site plus two back office rebuilds.
All three apps run on mock data — there is no real API yet.

| App | What it is | Local URL |
|---|---|---|
| `wallet-app/` | Player site (wallet, missions, mission detail) | http://localhost:3000 |
| `backoffice-app/` | "AUTO FAST" mini-game / mission back office | http://localhost:3100 |
| `lsm-bo-app/` | LSM-SYSTEM merchant back office + Minigames promo | http://localhost:3200 (opens `/login`) |

## Getting started

### 1. What you need
- [Node.js](https://nodejs.org) 20 or newer
- [Git](https://git-scm.com) and access to this repository on GitHub
- Optional: [Claude Code](https://claude.com/claude-code) or the Claude desktop app — it reads `CLAUDE.md` automatically

### 2. Get the code
```bash
git clone <repository URL>
cd the-mission
```

### 3. Run an app
Each app is independent. Install and start only the one you need:
```bash
cd wallet-app          # or backoffice-app / lsm-bo-app
npm install
npm run dev -- --port 3000   # 3100 for backoffice-app, 3200 for lsm-bo-app
```
Open the local URL from the table above.

> The Minigames demo in `lsm-bo-app` embeds the live missions page. For it to show, also run
> `wallet-app` on port 3300: `npm run dev --prefix wallet-app -- --port 3300`.

## How we work

### Branches and Pull Requests
1. Update `main`: `git checkout main && git pull`
2. Create a branch: `git checkout -b <area>/<short-topic>` (e.g. `wallet/redeem-popup`)
3. Commit small, clear steps.
4. Before pushing, in every app you touched:
   ```bash
   npx tsc --noEmit
   npx eslint .
   npm run build
   ```
5. Push and open a Pull Request into `main`. Add screenshots for UI changes.
6. Get at least 1 review, then merge.

Never push to `main` directly. Never commit `.env*` files or secrets.

### Designers
- `wallet-app` follows Figma (file `F3SPD1aAysw0JKTjpAWKDI`, "Section 2"). New screens need a Figma design or owner sign-off.
- The back offices copy the original systems **exactly** — including their bugs. Design changes there are a separate decision.
- Review work by checking out the PR branch and running the app, or from the screenshots in the PR.

### Developers
Read [`CLAUDE.md`](CLAUDE.md) first: per-app rules, the safety rules for the original systems, and the comparison method.

## Repository map
```
the-mission/
├── CLAUDE.md               Team rules (read by people and by Claude)
├── wallet-app/             Player site
├── backoffice-app/         AUTO FAST back office rebuild
├── lsm-bo-app/             LSM-SYSTEM back office rebuild
├── backoffice-reference/   Captures, briefs, audits and tools for backoffice-app (not shipped)
├── lsm-bo-reference/       Captures, briefs, audits and tools for lsm-bo-app (not shipped)
├── handoff/                Session handoff notes — the newest one says where work stopped
└── .claude/launch.json     Dev server presets
```

## Questions
Ask the project owner (PK).
