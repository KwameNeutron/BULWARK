# BULWARK — instructions for Claude sessions

## Spawning agents: pick the model by task intensity

Kwame's rule (2026-10-28): any agent spawned from a parent (a child session, an Agent subagent,
or a scheduled task) uses a model tuned to the intensity of its task. Never leave it to default.

| Intensity | Typical tasks | Model |
|---|---|---|
| Light | logging and sync notes, formatting, status checks, quiet heartbeats | `claude-haiku-5-5` |
| Standard | web research, drafting posts or letters, dashboard rewrites, one-file reviews | `claude-sonnet-5-5` |
| Heavy | code with tests, multi-step builds, security review, judgment across several sources | `claude-opus-5-5` |

Pass it explicitly: `model` on `create_session` / `create_trigger` / the Agent tool. Write the
choice and the reason into the brief ("model: sonnet, standard research"). A child that finds
its task heavier than briefed says so in its sandbox note instead of silently continuing.

## Briefing agents

- Personal facts about Kwame come only from the latest `MEMORY ####` file in the AGENT SANDBOX
  Drive folder (01 Shared Memory). Never infer biography from calendar or file names.
- Link the live protocol doc by ID (see `agent-sandbox/README.md`); never paste a repo copy.
- Every sandbox note carries a `session:` key so parallel workers under one agent ID can be told apart.
- Red list (send, post, share, spend, merge, deploy, connect, secrets) always needs Kwame's yes in chat.

## This app

Offline-first iPhone PWA: `index.html`, `sw.js`, `manifest.webmanifest`, icons. No build step,
no dependencies. `main` is the GitHub Pages source, so a merge to `main` is a deploy.
