# Bulwark — Hernia-Safe Strength Tracker

Offline-first iPhone PWA. 5 moves, 3 rounds, last set to failure.
All data lives in localStorage on your phone. No server, no account, no network after install.

## Deploy in ~3 minutes (GitHub Pages)

1. New repo (e.g. `bulwark`), upload the app files (index.html, sw.js, manifest, 3 icons) to the repo root.
2. Repo → Settings → Pages → Source: `main` branch, `/ (root)` → Save.
3. Open `https://KwameNeutron.github.io/bulwark/` in **Safari** on your phone.
4. Share button → **Add to Home Screen**.

That's it. The service worker caches everything on first load; the app works
in airplane mode from then on. Your data never leaves the phone.

## Files

- `index.html` — the entire app (UI, exercise library, tracker, timer)
- `sw.js` — service worker (offline cache)
- `manifest.webmanifest` — home-screen install metadata
- `icon-192.png`, `icon-512.png`, `apple-touch-icon.png`

## Using it

- **Setup** — pick 1 of 3–4 options per slot, once. Change anytime in ⚙.
- **Train** — Round pills 1/2/3. Log weight + reps per move. Round 3 is the
  failure round. Rest timer auto-starts after each logged set.
- **History** — per-exercise failure-set sparklines + full session log +
  JSON export/import for backup.
- **Info** — breathing rule, lifestyle levers, red flags (stop vs. ER).

## Notes

- Weight steppers move in 5 lb increments (machine stacks / DB pairs).
- Bodyweight moves show **BW**; tap ＋ to add load later (e.g. DB on hips).
- localStorage is per-browser-origin: the home-screen app keeps its own data.
  Back up occasionally via History → Backup.

## Updating the app

Bump `VERSION` in `sw.js` and `APP_VERSION` in `index.html` (same value), add a
line to `CHANGELOG.md`, and push. Installed phones pick up the new version the
next time the app is opened online. The version is shown at the bottom of
the Info tab.

## Smoke test

```sh
npm i -g playwright && npx playwright install chromium   # once
node tests/smoke.mjs
```

It serves the repo on localhost, drives the app at iPhone size (Setup → Train →
History → Info, backup/import, offline, bad data), and exits non-zero on failure.
