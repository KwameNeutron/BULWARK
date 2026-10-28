#!/usr/bin/env python3
"""Inline style.css, app.js and data/*.json into one HTML file (for previews/Artifacts).

The site itself needs no build step; this is only for single-file sharing.
Usage: python3 tools/bundle_artifact.py OUT.html [--fragment]
--fragment drops <!doctype>/<html>/<head>/<body> wrappers (Artifact publishing adds them).
"""
import json, pathlib, re, sys

root = pathlib.Path(__file__).resolve().parent.parent
out = pathlib.Path(sys.argv[1])
fragment = "--fragment" in sys.argv
html = (root / "index.html").read_text()
css = (root / "style.css").read_text()
js = (root / "app.js").read_text()
data = {p.stem: json.loads(p.read_text()) for p in sorted((root / "data").glob("*.json"))}
payload = json.dumps(data, ensure_ascii=False).replace("</", "<\\/")

html = html.replace('<link rel="stylesheet" href="style.css">', "<style>\n" + css + "\n</style>")
html = html.replace('<script src="app.js"></script>',
                    "<script>window.OST_DATA = " + payload + ";</script>\n<script>\n" + js + "\n</script>")
if fragment:
    head = re.search(r"<head>(.*?)</head>", html, re.S).group(1)
    head = re.sub(r'<meta charset="utf-8">\s*|<meta name="viewport"[^>]*>\s*', "", head)
    body = re.search(r"<body>(.*?)</body>", html, re.S).group(1)
    html = head.strip() + "\n" + body.strip() + "\n"
out.write_text(html)
print(f"wrote {out} ({len(html):,} bytes)")
