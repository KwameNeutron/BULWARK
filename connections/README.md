# Connections — private, on-device contact book

An offline iPhone PWA. It ships with **no contact data**. You import your own file on
the phone, and the app keeps it in IndexedDB encrypted with AES-256-GCM, using a key
derived from your passcode (PBKDF2-SHA256, 310k rounds). The app makes no network
requests, so contacts never leave the phone unless you export them.

## Install

1. Open the app's URL in **Safari** on the iPhone.
2. Share → **Add to Home Screen**.
3. Open it from the home screen, choose a passcode (there is no recovery).
4. Settings → **Import from Files** → pick `connections-import.json`.

## Features

- Search across name, company, title, email, phone, notes and tags.
- Filters: favorites, has phone, iPhone, LinkedIn, needs a name, hidden.
- One-tap call, text, email, LinkedIn.
- Edit any contact, add notes and tags, add new contacts, hide noise.
- "Add to iPhone Contacts" per contact (vCard), or export all as one `.vcf`.
- Encrypted backup file you can store in Files/iCloud and re-import.
- Re-importing merges by ID, email, phone or LinkedIn, and keeps your edits.
- Auto-locks after 5 minutes idle or 1 minute in the background.

## Privacy notes

- Never commit contact data to this repo. Import files stay on the phone.
- `noindex` and a strict Content-Security-Policy are set in `index.html`.
- Erase everything from Settings → Erase all data.
