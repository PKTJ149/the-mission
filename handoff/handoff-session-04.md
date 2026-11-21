# Session Handoff — 21/11/2026

**Created:** 21/11/2026 (session ran 19/11/2026 → 21/11/2026, Bangkok time)
**Project:** `/Users/martinfranck/Projects/the mission` (Missions feature. It has three front-ends:
- `wallet-app/`: the player site
- `backoffice-app/`: a rebuild of the lost "AUTO FAST" mini-game/mission back office
- `lsm-bo-app/`: a rebuild of the LSM-SYSTEM merchant back office, plus our Minigames sales pages)

It also now holds `sale-video/`, the HyperFrames project for the vertical Thai SmartGame sales film.

**Stack:**
- All apps: Next.js 16.4.5 (App Router), React 19.3.0, TypeScript 5. `wallet-app` also uses Tailwind v4.
- `sale-video/film/`: HyperFrames (HTML compositions rendered to video).

**Branch:**
- `main` at `0d856cc`, in sync with `origin/main`.
- **`main` is the only branch**, both locally and on GitHub. The 5 merged branches were deleted on 21/11 with PK's yes.
- Working tree: clean except this handoff file, which is not committed yet.

**Repo:** https://github.com/PKTJ149/the-mission (**private**, account `PKTJ149`). The git root is the whole `the mission/` folder. The repo has no CI checks.

**Live:** not deployed. Dev servers come from `.claude/launch.json`:
- `lsm-bo-app`: port 3200
- `backoffice-app`: port 3100
- `wallet-app-3300`: port 3300 (feeds the live missions iframe)
- **Port 3000 belongs to another project (tu-credit-back). Never touch it.**

## Project Status Overview
- **New milestone: the Minigames sales kit is on `main`.**
  - `/minigames-preview` in `lsm-bo-app`: a one-screen sale page with the sales video (autoplay, pause and sound buttons), what the system can do, playable demos and a contact CTA.
  - The Minigames sidebar item and the login banner CTA now open `/minigames-preview`. The older promo still lives at `/minigames`.
  - `sale-video/`: the full film source, a 53.5 s vertical (1080 × 1920) Thai film.
- **backoffice-app:** Step 4 colour labels renamed, and a Thai copy/label/logic audit of the settings is written (PR #1).
- **Git is tidy:** 3 PRs squash-merged, only `main` left.
- **Next:** PK's feedback on the sale page and video, team review of the 3 PRs, and the open items carried over from handoff 03.

## Session Summary
1. **Session start (19/11).** Read handoff 03. PK had no presentation feedback and chose to work on "Case 2". This turned into a new sales page instead.
2. **The brief (19/11).**
   - **Pain point:** many merchants don't know the Minigames and Missions product exists, including some current AUTO FAST users.
   - **Selling point:** competitors only offer the three basic games (wheel, mystery box, card flip). Our games can be re-themed, and their backgrounds change for any festival or season.
   - **Manager's rule:** never show the settings screens or "how it is built" (competitors would learn how we built it).
   - Branch `redesign/sale-page` was created.
3. **Sales video, in steps:**
   - **Storylines:** PK merged storylines A and B. A shows how many games there are; B shows festival marketing. The format is vertical.
   - **Voice:** a HeyGen Thai voice was tested first. PK chose ElevenLabs Eleven v4, voice "Raccoon - Friendly", from PK's own account. Use is internal to PK's organisation only, not commercial or public.
   - **Script rules:** never say "AUTO FAST" (say "เรา"), and no festival names in the voiceover.
   - **Storyboard:** 9+ shots from real game screens exported from Figma; v1 and v2 stills.
   - **Look:** PK's reference was the flashmotion.io portfolio style.
   - **PK's changes:**
     - IBM Plex Sans Thai font
     - full-frame festival scenes inside an iPhone mockup
     - the title "สร้างสรรค์เกม ได้หลากหลาย ดั่งใจนึก"
     - an animated SmartGame logo teaser at the start
     - real play screens, three side by side
     - one checklist-card section that follows the speech
     - the card flip and box open shown big
     - the logo at the end, then the button
     - festival symbols (snow for Christmas, many fireworks for Loy Krathong)
   - **Music:** from the HeyGen catalogue.
   - **Voice re-recorded:** PK re-recorded the voice from the start up to the festival part. It was sped up to fit the picture.
   - **Renders:** 10 drafts, then `smartgame-final.mp4`.
4. **Sale page (20/11).** PK asked for the video to go on the sale page, with autoplay and a pause button. A sound button was added as well.
   - **Web copy of the video:** 720 × 1280, 8.3 MB.
   - **Poster image:** `smartgame-poster.jpg`.
5. **Git (20–21/11):**
   - PK said "commit and push".
   - **Merge plan.** Before merging, the checks ran (tsc, eslint, build) in temporary worktrees, so the running dev server was not disturbed.
   - **PR #1 and PR #2.** Both were squash-merged on PK's word.
6. **Old page bug (21/11).** PK saw the old promo because the menu still pointed to `/minigames`. PR #3 points the menu and the login banner to `/minigames-preview`. PR #3 was checked, then squash-merged.
7. **Cleanup (21/11).**
   - I first confirmed that merging each branch into `main` would add nothing.
   - Then, on PK's yes, I deleted all 5 merged branches, both locally and on GitHub.
8. **This handoff.**

## Completed This Session
- **The sales video** is done and approved: `sale-video/film/renders/smartgame-final.mp4`, 53.5 s, 1080 × 1920.
- **The film source** is on `main`:
  - 11 scene compositions
  - voice, music and sound effects
  - festival decorations, logo and masks
- **The `/minigames-preview` sale page** is on `main`:
  - what the system can do (minigames and missions tabs)
  - playable demos in a phone pop-up: gold boxes, wheel, Lucky Cards from Figma, and the live missions page
  - the video in a phone mockup
  - a contact CTA
- **The Minigames menu and login banner** now open the new page.
- **backoffice-app Step 4 colour labels:**
  - Each label now names what the original actually saves.
  - The "ปรังแต่ง" typo is fixed.
  - 5 new i18n keys were added.
  - The original wording is kept in `// ORIGINAL:` comments.
- **Settings audit:** 87 findings, ours vs the original, in Markdown and HTML.
- **Repo docs:** a README, the shared `CLAUDE.md` rules, and handoff 03 committed.
- **PRs #1, #2, #3** squash-merged. The 5 merged branches were deleted.

## Files Created
**`lsm-bo-app/`**
- `app/(shell)/minigames-preview/page.tsx`: the sale page route, marked as a throwaway spike (PK, 20-11-2026).
- `app/(shell)/minigames-preview/_components/`:
  - `sale-preview.tsx` + `.module.css`: the page, including the `SaleVideo` player with autoplay, pause and sound buttons.
  - `play-phone.tsx` + `.module.css`: the phone pop-up for the demos.
  - `lucky-cards.tsx` + `.module.css`: the card game demo.
  - `try-it.tsx`
- `public/minigames-preview/`:
  - `games/`, `play/`: game images
  - `smartgame-logo.png`
  - `video/smartgame.mp4`, `video/smartgame-poster.jpg`
  - `video/shot-*.webp`: 10 storyboard stills, **no longer used** (see Pending).

**`sale-video/`**
- **Planning docs:**
  - `SPEC.md`
  - `STORYLINES.md`
  - `VO-SCRIPT.md`: the voice, settings and the 9 lines with takes.
  - `ASSETS-NEEDED.md`: how to re-export the game screens from Figma.
  - `TOOLKIT.md`
- `storyboard/`: `board.html`, `board-v1.html`, the `stills/` and `stills-v1/` folders, and style tests.
- `voice/`: 18 renamed takes. `voice-tests/` holds PK's raw ElevenLabs exports.
- `film/`:
  - `index.html`, `compositions/s0-title … s9-end.html`
  - `assets/`: fonts, logo, masks, music, sfx, voice, deco
- `.gitignore`: ignores `assets/games/`, `film/assets/games`, `film/renders/`, `film/node_modules/` and `film/.hyperframes/`.

**`backoffice-reference/`**
- `AUDIT-2026-11-20-SETTINGS-COPY-LOGIC.md` and `.html`

**Root**
- `README.md`, `CLAUDE.md` (shared rules)
- `handoff/handoff-session-04.md`: this file.

## Files Modified
- **`lsm-bo-app/lib/menu.ts`:** the Minigames item now links to `/minigames-preview`, with a `CHANGED (PK, 21-11-2026)` comment.
- **`lsm-bo-app/app/login/_components/login-page.tsx`:** the banner CTA calls `router.push("/minigames-preview")`.
- **`backoffice-app/app/…/_components/setting/step4-display.tsx`:** the colour labels were renamed.
- **`backoffice-app/public/locales/en.json` and `th.json`:** the new keys, and the typo fix.

## Git Commits
All on `main`, squash-merged from PRs:
- `fc2beb5` — Rename mini-game colour labels and add settings audit report (#1)
- `9db5ca8` — Add Minigames sale page preview to lsm-bo-app (#2). 246 files: the sale page, the sale-video project, the README, `CLAUDE.md` and handoff 03.
- `0d856cc` — Point Minigames menu and login banner to the new sale page (#3)

## In-Progress / Pending
- **Unused storyboard stills.** Should the 10 `lsm-bo-app/public/minigames-preview/video/shot-*.webp` files be deleted? Waiting on PK's yes.
- **No review on PRs #1–#3.** The project rule asks for at least 1 review, and PK chose to merge without one. The team can review them after the fact on GitHub.
- **This handoff file is not committed.** It needs a small PR, since `main` takes no direct pushes.
- **Optional, only if PK asks:**
  - replace the low-resolution card and green-wheel images in the video
  - re-encode the web video from `smartgame-final.mp4`
- **Carried over from handoff 03, still open:**
  - the real contact URL (`MINIGAMES_CONTACT_URL` is a placeholder)
  - a corrected banner 1 image
  - Case 2, the subscribed-merchant view
  - how `lsm-bo-app` connects to `backoffice-app`
  - removing the committed `__pycache__`
  - hiding the dev badge in the missions iframe
  - wallet-app feedback items

## Known Issues / Blockers
- **The game screen exports are not in git.** `sale-video/assets/games/` and `film/assets/games` are ignored. A fresh clone cannot re-render the film until they are re-exported from Figma (`ASSETS-NEEDED.md`). Renders are also ignored.
- **The live missions demo needs `wallet-app-3300` running.**
- **Some images in the video are low resolution:** the card and the green wheel.
- **Not tested by hand:** clicking the login banner CTA. Only its target path changed.
- **No real API anywhere.** Everything is mock data.

## Key Decisions Made
- **A sale page instead of Case 2 (PK, 19/11).** The bigger problem is that merchants don't know the product exists.
- **Never show settings screens or "how it is built"** in the video or on the page. This is the manager's rule, to avoid tipping off competitors.
- **"เรา" instead of "AUTO FAST"** in the script (PK, 20/11).
- **ElevenLabs voice instead of HeyGen.** PK preferred the sound of it. Use stays internal, not commercial.
- **Built in code with HyperFrames**, so every frame comes from real game screens and PK can ask for exact edits.
- **The sale page is a throwaway spike next to `/minigames`.** The old promo stays untouched until PK picks a direction. The menu now points to the new page.
- **Squash and merge for every PR.** Each PR becomes one clean commit on `main`.
- **Checks ran in temporary worktrees.** This avoided running `next build` in the same folder as the running dev server.

## Important Context
- **Safety rules on the original systems** (superx staging, LSM-SYSTEM):
  - Look, hover, scroll and read only.
  - See `CLAUDE.md` for the never-click list.
- **Before pushing:** check `gh auth status` shows `PKTJ149` active. Two accounts are on this Mac.
- **zsh gotcha:** `$VAR` holding several names does not split into words. Write the names out, or use an array.
- **Next dev** allows only one dev server per app folder.
- **HyperFrames:**
  - Run the CLI inside `sale-video/film/`.
  - The finished render is `renders/smartgame-final.mp4`. The web copy is a 720p re-encode.
- **PK's working rules:**
  - Reply in Thai; file content in English.
  - Short questions, and say the plan before big tasks.
  - Never delete, push or submit without a yes.
  - Always show file links.

## Next Session: Start Here
1. Run `session start`, then `git status`. Expect `main` at `0d856cc` or later, clean.
2. If this handoff is still uncommitted, offer a small PR for it.
3. Start `lsm-bo-app` (and `wallet-app-3300` for the missions demo) and open `http://localhost:3200/minigames-preview`. Collect PK's feedback on the page and the video.
4. Ask PK:
   - whether to delete the 10 unused `shot-*.webp` stills
   - whether the team will review PRs #1–#3
5. Then pick up the open items carried over from handoff 03 (contact URL, banner 1 image, Case 2, how the apps connect).

## Conversation Highlights
- **Who the sale page is for:** merchants who don't know Minigames and Missions exist. The pitch is themed games for every festival, not just the three basic ones.
- **The video was built shot by shot from PK's notes.** Storyboard stills came first and PK approved them. Only then was the film animated.
- **Why the old page still showed:** the menu link, not the cache. Fixing the link was a 2-line PR.
- **Safe merging:**
  - `--match-head-commit` makes sure only the checked commit gets merged.
  - `git merge-tree --write-tree` shows whether a branch would add anything to `main` before deleting it.

---
*Auto-generated by Session Handoff automation*
