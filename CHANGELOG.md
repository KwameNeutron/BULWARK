# Changelog

## 1.1.0 — 2026-10-28 · Hardening pass

No new features. Same five slots, same screens, same data format (old backups
still import).

### Fixed
- **Session day used UTC.** From 8 PM ET the app thought it was tomorrow and
  threw away a half-logged workout. Now uses the phone's local date.
- **＋ on a bodyweight move did nothing visible** (it silently stored a weight).
  It now switches BW to a weight; − back to 0 returns to BW.
- **Stepper changes were lost** whenever another set was logged (whole page
  re-rendered). Unsaved values are now kept per move and round.
- **Moves were listed in the order you tapped them in Setup**, not slot order.
- **Rest timer covered the "Finish & save session" button.** Extra bottom space
  while resting. The countdown now runs off the clock, so it stays right after
  the screen locks.
- **"Erase all data" cleared the whole `github.io` origin** (every Pages app
  of the account). It now removes only Bulwark's `bw.*` keys.
- **Other apps in the same site got Bulwark's page offline.** `connections/`
  and `ost-history/` sit inside Bulwark's service-worker scope, and the offline
  fallback answered any uncached page with Bulwark's `index.html`. The worker
  now handles only Bulwark's own pages and leaves the rest to their own workers.
- **A bad backup bricked the app.** An unknown exercise crashed Train on every
  launch, and a malformed set showed "Invalid JSON" after half-importing.
  Imports are now validated; numbers are coerced (an HTML string in a backup
  used to be rendered as markup in History).
- **Backup box was hidden until you had a session**, so you couldn't restore a
  backup onto a new phone.

### Service worker / updates
- Versioned cache (`VERSION` in `sw.js`, mirrored as `APP_VERSION` and shown on
  the Info tab). Page loads are network-first with a 3 s fallback to cache, so
  a deploy reaches home-screen installs on the next launch; still fully
  offline. `updateViaCache:'none'`, update check when the app is foregrounded,
  and old-cache cleanup limited to `bulwark-*` caches.

### Storage
- Every `localStorage` call is wrapped. Private Browsing or a full quota shows a
  banner instead of throwing.
- Unreadable saved data is copied to `bw.corrupt.<key>.<timestamp>` before being
  reset, and a banner says so.

### Accessibility
- Tap targets ≥ 44×44 px (Log moves under the steppers on 320 px phones).
- Labels for steppers, Log, rest select, backup box; `aria-pressed` on picks and
  rounds; `aria-current` in nav; keyboard-operable Setup cards; focus ring;
  tab switches focus the heading and scroll to top. Pinch-zoom allowed.
- Contrast checked: body/muted text is ≥ 4.5:1 on every panel colour; no
  palette changes needed.

### Tooling
- `tests/smoke.mjs`: Playwright smoke test (iPhone 13 + iPhone SE) covering
  Setup → Train → History → Info, backup export/import, offline, corrupted and
  blocked storage, the evening-date bug, and tap targets.

### Decisions
Conservative calls made without asking; easy to revisit.
- **No auto-reload on update.** A new version applies on the next launch rather
  than reloading mid-workout.
- **Midnight rollover unchanged.** An unfinished session from a previous day is
  still dropped when you open Train. Only the UTC error was fixed.
- **Logging after saving today's session** still shows fresh cards with no
  second Finish button (existing behaviour, left as is).
- **Unsaved stepper values are in memory only.** They're lost if the app is
  killed; logged sets are saved as before.
- **Import replaces data rather than merging**, as before, but now asks first.
- **Rest time** on import is limited to the existing choices (60/75/90/120 s);
  anything else falls back to 75 s. Sets per move are capped at 3.
- **No package.json.** The smoke test uses a local or global Playwright, so the
  app stays dependency-free and build-free.
- **Removed `user-scalable=no`.** iOS ignores it anyway, and it blocks zoom
  elsewhere.
