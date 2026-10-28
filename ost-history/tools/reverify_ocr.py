#!/usr/bin/env python3
"""Re-check each clipping against the archive OCR: share of headline/excerpt words (4+ letters)
found in the page or article text. Below 100% is expected where excerpt_note says OCR errors
were corrected. Run from ost-history/: python3 tools/reverify_ocr.py"""
import json, re, subprocess, sys, unicodedata
arts = json.load(open('data/articles.json'))
def get(url):
    return subprocess.run(['curl','-sS','-L','-m','90',url],capture_output=True,text=True).stdout
def norm(s):
    s = unicodedata.normalize('NFKD', s).encode('ascii','ignore').decode().lower()
    return re.sub(r'[^a-z0-9]+',' ',s)
def ocr(a):
    u = a['archive_url']
    if a['archive']=='chronam':
        j = json.loads(get(u+'&fo=json'))
        t = json.loads(get(j['resource']['fulltext_file']))
        return ' '.join(v['full_text'] for v in t.values())
    key = u.split('identifier=')[1]
    x = get('http://resolver.kb.nl/resolve?urn='+key+':ocr')
    return re.sub(r'<[^>]+>',' ',x)
for a in arts:
    try: t = norm(ocr(a))
    except Exception as e: print('ERR', a['id'], e); continue
    def frac(s):
        w = [x for x in norm(s).split() if len(x)>3]
        return sum(x in t for x in w)/max(1,len(w))
    h = frac(a['headline']) if not a['headline'].startswith('TO VERIFY') else None
    e = frac(a['excerpt']) if a.get('excerpt') else None
    print(f"{a['id']:24} headline={'n/a' if h is None else f'{h:.0%}'} excerpt={'n/a' if e is None else f'{e:.0%}'}")
