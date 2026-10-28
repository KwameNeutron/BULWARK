#!/usr/bin/env python3
"""Re-check every archive and document URL in data/*.json; print status per link.

Some archives block plain HTML fetches from scripts, so the check uses each
archive's machine-readable view of the same record:
  loc.gov/resource/...      -> same URL + &fo=json
  digitallibrary.un.org/record/N -> same URL + ?of=xm
Needs curl. Usage: python3 tools/check_links.py   (exit 1 if any citation link fails)
"""
import json, pathlib, subprocess, sys

root = pathlib.Path(__file__).resolve().parent.parent / "data"


def probe_url(url):
    if "loc.gov/resource/" in url:
        return url + ("&" if "?" in url else "?") + "fo=json"
    if "digitallibrary.un.org/record/" in url:
        return url + "?of=xm"
    return url


def status(url):
    out = subprocess.run(["curl", "-sS", "-L", "-m", "60", "-o", "/dev/null", "-w", "%{http_code}", probe_url(url)],
                         capture_output=True, text=True)
    return out.stdout.strip() or "ERR"


cites = [(a["id"], a["archive_url"]) for a in json.loads((root / "articles.json").read_text())]
cites += [(d["id"], d["url"]) for d in json.loads((root / "documents.json").read_text())]
archives = [(s["id"], s["url"]) for s in json.loads((root / "sources.json").read_text())]

bad = 0
for group, rows in (("citations", cites), ("archive home pages (informational)", archives)):
    print(f"## {group}")
    for ident, url in rows:
        code = status(url)
        ok = code == "200"
        if group == "citations":
            bad += not ok
        print(f"{'OK ' if ok else 'BAD'} {code}  {ident}  {url}")
print(f"\n{len(cites) - bad}/{len(cites)} citation links OK")
sys.exit(1 if bad else 0)
