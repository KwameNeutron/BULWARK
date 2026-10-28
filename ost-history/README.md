# Treaty in the Papers

Prototype of a newspaper-based history of the 1967 Outer Space Treaty. Static HTML/CSS/JS with no build step; data lives in `data/*.json`.

```sh
cd ost-history
python3 -m http.server 8000      # then open http://localhost:8000
python3 tools/check_links.py     # re-verify every citation URL
```

See [PLAN.md](PLAN.md) for the roadmap, sourcing workflow, rights policy, hosting options and open decisions.
