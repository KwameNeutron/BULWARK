# Connections — stay close to your people

Offline-first iPhone PWA that reminds you to reach out to the people you're
thinking of, or should be. No App Store and no Apple developer account: it's a
web app you add to your Home Screen from Safari. All data stays in the app on
your phone.

## Install on iPhone

1. Once GitHub Pages is on for this repo (see the root README), open
   `https://KwameNeutron.github.io/bulwark/connections/` in **Safari**.
2. Share → **Add to Home Screen**. Open it from the icon from now on, since the
   home-screen app keeps its own data, separate from Safari.

## What it does

- **Today**: who's *on your mind*, who's *due now*, upcoming birthdays, who's
  coming up, plus a daily nudge with ideas for what to say.
- **Cadence per person**: weekly to yearly. "Done" logs the touch (text, call,
  in person…) with an optional note and resets the clock. "Later" snoozes.
- **On my mind**: flip it on, with a note on why, the moment someone crosses
  your mind. They stay on the Today screen until you reach out.
- **Text / Call / Email** buttons open Messages, Phone or Mail. When you come
  back, the app asks you to log it.
- **Import**: iPhone Contacts → Share Contact → Save to Files → Settings →
  Import contact cards (.vcf).
- **Reminders**:
  - *Notifications + badge*: turn on in Settings (iOS 16.4+, home-screen app
    only). The count updates whenever you open the app.
  - *Calendar*: Settings → Download calendar (.ics) adds a repeating event for
    each person at their cadence. iOS doesn't let offline web apps wake
    themselves, so this is the most reliable way to get a nudge.
- **Backup**: export or restore JSON from Settings.
