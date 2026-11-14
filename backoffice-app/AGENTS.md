<!-- BEGIN:nextjs-agent-rules -->

## This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

## Back office rebuild rules

- `public/` mirrors the original site's URL paths (`/assets/...`, `/css/...`, `/lib/...`).
  The original CSS is loaded unchanged from there — never edit those files.
- Use the original class names from the captured HTML; no Tailwind, no CSS framework of our own.
- Pages get data only through `lib/api/` (backed by `lib/mock/` for now). Forms never save.
- Text goes through `useT()` from `lib/i18n` with the original i18n keys.
