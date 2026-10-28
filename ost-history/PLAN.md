# Treaty in the Papers: plan

A newspaper-based history of the 1967 Outer Space Treaty (OST). It tells the story from Sputnik (Oct 1957) through UN Resolutions 1721, 1884 and 1962, the 1966 negotiation, signature (27 Jan 1967) and entry into force (10 Oct 1967), using what newspapers printed at the time. Every clipping links to an archive page. Nothing is re-hosted as an image.

Status as of 2026-10-28: working static prototype in `ost-history/`. 18 clippings are seeded (16 verified, 2 partly verified), with 7 leads marked TO VERIFY and 9 primary documents. All 27 citation links pass `tools/check_links.py`.

## 1. What is in the prototype

| Path | Purpose |
|---|---|
| `index.html`, `style.css`, `app.js` | Static site with no build step. Views: Timeline (SVG axis + filterable clippings), Articles I–XVII, Archives, About & method. |
| `data/events.json` | 13 milestones, 1957–1967, each with phase, summary, places and primary documents. |
| `data/articles.json` | Clippings: outlet, date, page, headline (+ English gloss), byline/wire, archive URL, excerpt, translation, rights class, links to events, treaty articles, people and places, and verification status/date. |
| `data/leads.json` | Coverage known or likely to exist but not yet confirmed (NYT, Pravda, Canberra Times, etc.). Never shown as citations. |
| `data/documents.json` | UN resolutions (UN Digital Library), LBJ statements, FRUS. |
| `data/treaty.json` | Plain-language gist of Articles I–XVII with antecedent resolution or Declaration principle. |
| `data/sources.json`, `data/rights.json` | Source map and rights classes, both rendered on the site. |
| `tools/check_links.py` | Re-checks every citation URL (uses each archive's JSON/XML view, since the HTML is bot-blocked). |
| `tools/bundle_artifact.py` | Optional: inlines everything into one HTML file for sharing. Not needed to run the site. |

Run locally with `cd ost-history && python3 -m http.server`, then open http://localhost:8000. Browsers block `fetch()` of JSON from `file://`.

### Content model, in brief

- **Event**: `id, date, end_date?, phase (origins | declaration | negotiation | signature | aftermath), title, summary, places[], documents[], status`
- **Article (clipping)**: `id, outlet, outlet_place, date, page, headline, headline_en?, deck?, byline?, wire?, language, archive, archive_url, excerpt?, excerpt_note, translation?, rights, events[] (first = primary), treaty_articles[], people[], places[], status (verified | partial), verified_on`
- **Lead**: `outlet, date, what, where_to_look, status: "TO VERIFY", note`
- **Person / Place / Document / Treaty article / Source / Rights class**: see the JSON files.

Treaty-article links are an editor's mapping of what a clipping discusses. The site says so on the Articles page.

## 2. Source map (verified 2026-10-28)

| Archive | 1957–68 coverage | Fit | Access | Rights |
|---|---|---|---|---|
| **Chronicling America** (LOC) | US papers to **1963** only; 1923–63 titles included only where copyright was not renewed | Backbone for 1957–63 (Evening Star, Key West Citizen, Atlanta Daily World…) | Free, OCR, JSON API | Public domain / no known restrictions; wire items can differ |
| **Delpher** (KB, NL) | Dutch and Dutch-Caribbean dailies into the 1990s | **Best open source for 1966–67**, with Reuters, AP, AFP and NYT wire copy | Free web; open SRU API, no key; some titles on-site only | In copyright; short quotes under Auteurswet art. 15a |
| **UN Digital Library / UNOOSA** | All resolutions; Legal Subcommittee records | Primary anchors | Free | Quotable with attribution |
| **NYT TimesMachine** | 1851–2002 page replicas | Paper of record, **main gap** | Subscribers | 1964+ in copyright (automatic renewal, 1992 Act); 1957–63 renewal TO VERIFY |
| **Google News Archive** | Few hundred papers; scanning ended 2011 | Possible free US/Canadian 1966–67 pages | Browse only | Publishers' copyright |
| **Trove** (NLA) | Canberra Times to 1995 (with permission) | Australian view | Free; API needs key | Research/study use |
| **Gallica / RetroNews** | Mostly pre-1950 free; later on RetroNews | Weak for 1966–67 (TO VERIFY) | Free / paid | In copyright |
| **East View** | Current Digest of the Soviet Press from 1949; Pravda/Izvestia archives | Needed for a Soviet voice | Institutional | Licensed |
| **CIA CREST** | FBIS monitoring of foreign press | Supplementary | Free | US gov (PD) |
| **FRUS / American Presidency Project** | Diplomatic record, presidential statements | Fact-checking the press | Free | US gov (PD) |

Correction for the brief: the Declaration of Legal Principles is **A/RES/1962 (XVIII)**, 18th session, adopted 13 Dec 1963. "(XVII)" would be the 1962 session.

## 3. Phased roadmap

**Phase 0: prototype (done).** Static site, content model, 18 seeded clippings, source map, rights policy, link checker.

**Phase 1: close the gaps (2–3 weeks part-time).**
- Resolve the 2 "partial" items (Evening Star 21 Dec 1961, 6 Dec 1963) and the page numbers marked "image N" against the LOC page images.
- Find the Chronicling America story on adoption of Res. 1962 (13–16 Dec 1963) and coverage of Res. 1348 / 1721.
- Work the NYT leads in TimesMachine: 9 Dec 1966, 20 Dec 1966, 28 Jan 1967, 11 Oct 1967. Cite headline, page and date with a TimesMachine link. No images.
- Add one Soviet voice through the Current Digest (library access).
- Target: about 40 clippings, at least 1 per event, at least 3 languages.

**Phase 2: depth (1–2 months).**
- Per-article essays: Article IV (from "no bombs in orbit" to treaty text), Article II (non-appropriation and how the press read "province of all mankind"), Article VI (non-governmental entities, which barely registered in 1967 coverage).
- Senate advice and consent (spring 1967) and ratification coverage; early accessions.
- People and places pages; small map.
- Optional: compare wire copy across outlets (e.g. one Reuters story as printed in Dutch, US and Australian papers).

**Phase 3: publish.**
- Rights review of every excerpt before going public (see §5).
- Accessibility pass; citation export (Chicago / Bluebook) per clipping.

## 4. Sourcing workflow (one clipping)

1. **Find**: search the archive's API by keyword and date window (`loc.gov ... &fo=json`, `jsru.kb.nl` SRU for Delpher, UN DL `of=xm`).
2. **Confirm**: pull the OCR for that page or article. Headline, date and passage must all be present. Note the page or image number.
3. **Transcribe**: copy at most 1–2 sentences. Correct only obvious OCR errors and say so in `excerpt_note`. Translate non-English excerpts and label the translation as the editor's.
4. **Classify rights** using `rights.json`.
5. **Link**: to the archive's own page URL (LOC resource URL; Delpher `view?identifier=`).
6. **Record**: set `status` (`verified` only if all of the above passed) and `verified_on`.
7. **Re-check**: run `python3 tools/check_links.py` before every release.

Anything short of step 2 goes into `leads.json` as TO VERIFY. Nothing is cited from memory or secondary sources.

## 5. Rights policy

- **Never re-host page images** in this phase. Link to the archive viewer.
- **US 1957–1963 (Chronicling America)**: treated as public domain because LOC only admits unrenewed titles. Still quote briefly, since AP/UPI/INS wire stories and syndicated features may carry their own rights. Check item by item before any image use.
- **US 1964+**: in copyright (renewal automatic). Fair use (17 U.S.C. § 107) only: short quotes for commentary and history, with attribution and a link.
- **Netherlands (Delpher)**: in copyright; quotations allowed under the citation right (art. 15a Auteurswet) when short, attributed, and serving commentary. Respect "on-site only" items: metadata only.
- **UN documents and US government works**: quote freely with attribution.
- **Translations** are the editor's own and are labelled.

## 6. Hosting options

| Option | Cost | Notes |
|---|---|---|
| GitHub Pages from this repo | Free | Simplest. Needs your go-ahead (not enabled). Public by default. |
| Netlify / Cloudflare Pages | Free tier | Preview deploys per branch; password protection on paid tiers. |
| Claude Artifact (private link) | — | Single-file preview, already published privately for review. |
| University / library host (e.g. a law school digital-scholarship server) | Varies | Adds credibility and possibly licensed-archive access. |

The site is static JSON + HTML. Moving later is a copy.

## 7. Open decisions for Kwame

1. **Repo home**: keep it inside `BULWARK` or move it to its own repository? It has nothing to do with the existing app.
2. **Audience and voice**: a scholarly companion (footnoted, Bluebook-style citations) or a public-facing explainer?
3. **NYT and paid archives**: do you have TimesMachine, ProQuest Historical Newspapers or East View access (personal, bar or university)? That decides how fast the 1966–67 US and Soviet gap closes.
4. **Language scope**: keep Dutch as the 1966–67 backbone, or prioritise French/German/Spanish UN-member press?
5. **Hosting and visibility**: GitHub Pages (public) vs. a private preview until the rights review is done.
6. **Rights posture**: confirm the 1–2 sentence quotation ceiling and the no-images rule, or allow page images for the public-domain 1957–63 items.
7. **Post-1967 scope**: stop at entry into force, or carry on to the Rescue Agreement (1968), Liability Convention (1972) and Moon Agreement (1979)?

Defaults used meanwhile: separate folder in this repo, scholarly-but-readable voice, no images, 1957–1967 scope, Dutch backbone for 1966–67.
