# cost-meter

A Claude Code mod that pins a status line like `$1.23 · ctx 18% · 5h 12% · wk 40%`:
session cost, context window fill, and each rate-limit window.

Past 80% of any rate limit:
- a red band appears above the prompt (terminal and desktop app only),
- the status line gets a `⚠` prefix (every surface, including mobile),
- a toast fires once per crossing.

## Use it

Load the folder for a session with `claude --plugin-dir mods/cost-meter`, or copy it into a
session's mods folder. Check it with `claude plugin validate mods/cost-meter` and
`claude plugin test mods/cost-meter`.

`hooks/register.tsx` currently shows a "cost-meter loaded" toast at start as a diagnostic;
remove that line once the meter is confirmed on screen.
