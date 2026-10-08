# Design Patterns for Multi-Agent AI Collaboration via Shared Files/Documents (as of Oct 2026)

Context note: the target scenario is Anthropic's Claude and Meta's Muse coordinating asynchronously through a shared folder (e.g., Google Drive). Meta launched Muse, a personal agent that can send email, book travel, fill forms and keeps working after the app is closed, on Sept 8, 2026 (US only; powered by the Muse Spark model released April 2026) — [Relevant Audience](https://www.relevantaudience.com/ai/meta-muse-personal-ai-agent-launch/); [Upstox](https://upstox.com/news/business-news/latest-updates/meta-launches-ai-agent-muse-that-can-plan-browse-and-act-for-you-here-s-what-it-can-do/article-200028/); [Android Authority](https://androidauthority.com/meta-muse-ai-3709007). These are secondary news sources; I found no Meta documentation on whether Muse reads AGENTS.md or any instruction-file convention.

## 1. Agent instruction file conventions (AGENTS.md, CLAUDE.md, GEMINI.md, llms.txt, SKILL.md, .cursorrules)

### Takeaway
AGENTS.md is the de facto cross-vendor standard: plain Markdown, no required schema, nearest-file-wins, explicit user chat instructions override it. It is now under the Linux Foundation's Agentic AI Foundation. Vendor files (CLAUDE.md, GEMINI.md) concatenate hierarchically rather than strictly override, and both can be pointed at AGENTS.md. Skills (SKILL.md) add progressive disclosure: a short always-loaded description, a body loaded on trigger, and bundled files read on demand. For a cross-vendor shared folder, the portable choice is one root `AGENTS.md`, kept short, that links to on-demand detail files.

### Cited Findings
**AGENTS.md (agents.md standard)**
- AGENTS.md is plain Markdown with "no required fields or headings". It works like a README for agents. — [agents.md](https://agents.md/)
- Recommended sections: project overview, build/test commands, code style, testing instructions, security considerations; also commit/PR guidelines, gotchas, deployment steps. — [agents.md](https://agents.md/)
- Discovery and precedence: the file sits at the repo root, and nested AGENTS.md files can live in subprojects. "The closest one to the edited file takes precedence." Explicit user chat prompts override everything in AGENTS.md. — [agents.md](https://agents.md/)
- Migration pattern: rename existing docs to AGENTS.md and symlink the old filename for backward compatibility. — [agents.md](https://agents.md/)
- Support: OpenAI Codex, Google Jules, Cursor, Amp, Factory, Aider, goose, opencode, Zed, Warp, VS Code, Devin, Junie, RooCode, Gemini CLI, GitHub Copilot coding agent, Windsurf, and others. Aider and Gemini CLI need configuration to read it. — [agents.md](https://agents.md/)
- Governance: stewarded by the Agentic AI Foundation under the Linux Foundation ("AGENTS.md, a Series of LF Projects, LLC"). — [agents.md](https://agents.md/)

**CLAUDE.md (Claude Code)**
- Two mechanisms: CLAUDE.md (human-written instructions) and auto memory (Claude-written learnings; the first 200 lines or 25KB load each session). Both are "context, not enforced configuration". Hard blocks require hooks. — [Claude Code memory docs](https://code.claude.com/docs/en/memory)
- Load order runs from broadest to most specific: managed policy (e.g., `/etc/claude-code/CLAUDE.md`), then user, then project (`./CLAUDE.md` or `./.claude/CLAUDE.md`), then `CLAUDE.local.md`. Files are concatenated rather than overridden, ordered from the filesystem root down to the working directory, so more specific instructions are read last. Subdirectory CLAUDE.md files load on demand when Claude reads or edits files there. — [Claude Code memory docs](https://code.claude.com/docs/en/memory)
- Conflict handling: "if two instructions contradict each other, Claude may pick one arbitrarily". If a user rule and a project rule conflict, "Claude may follow either one". The recommendation is to audit for contradictions (the `/doctor prompt-audit` command). — [Claude Code memory docs](https://code.claude.com/docs/en/memory)
- Size guidance: "target under 200 lines per CLAUDE.md file". Longer files "reduce adherence". Multi-step procedures belong in skills or path-scoped `.claude/rules/*.md`. — [Claude Code memory docs](https://code.claude.com/docs/en/memory)
- `@path` imports: relative paths resolve from the importing file, with a maximum recursion depth of four hops. Imports don't reduce context cost. External imports (outside the working directory) require one-time approval, as protection against files "other people commit to a shared project". — [Claude Code memory docs](https://code.claude.com/docs/en/memory)
- AGENTS.md interop: by default Claude Code reads AGENTS.md only when no CLAUDE.md/CLAUDE.local.md exists in the working directory or above (requires v2.1.277+). The `claude-md-and-agents-md` setting reads both. Claude Code does not read `AGENTS.local.md`, `AGENTS.override.md`, or `.agents/`. An alternative is a CLAUDE.md that imports AGENTS.md. — [Claude Code memory docs](https://code.claude.com/docs/en/memory)

**GEMINI.md (Gemini CLI)**
- Gemini CLI loads context files in three layers and concatenates them: global `~/.gemini/GEMINI.md`, then workspace directories and their parents, then just-in-time files found when a tool touches a directory. It supports `@file.md` imports. `context.fileName` can be set to `["AGENTS.md", "CONTEXT.md", "GEMINI.md"]`. `/memory show` and `/memory reload` inspect and reload the context. — [Gemini CLI docs](https://geminicli.com/docs/cli/gemini-md/)

**llms.txt**
- Proposed by Jeremy Howard on Sept 3, 2024 (page updated Aug 10, 2026). The structure is: required H1 name, blockquote summary, optional prose, then H2 sections listing `[name](url): notes` links. An `## Optional` section marks skippable links. A file can live at the root or a subpath, and the most specific file wins. Clean `.md` versions of pages are encouraged. — [llmstxt.org](https://llmstxt.org/)

**Claude Skills (SKILL.md)**
- SKILL.md requires YAML frontmatter with `name` (64 characters or fewer, lowercase/numbers/hyphens, no "anthropic"/"claude") and `description` (1024 characters or fewer; must say what it does and when to use it). — [Claude Agent Skills docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- Progressive disclosure: Level 1 metadata, about 100 tokens per skill, is always loaded. Level 2 is the body, under 5k tokens, loaded when triggered. Level 3 is bundled files and scripts, which cost no context until they are read; only script output enters context. — [Claude Agent Skills docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- Security: "a malicious Skill can direct Claude to invoke tools or execute code in ways that don't match the Skill's stated purpose". Content fetched from external URLs can carry malicious instructions. Use skills only from trusted sources. — [Claude Agent Skills docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)
- Custom skills do not sync across surfaces (claude.ai, API, Claude Code are separate). — [Claude Agent Skills docs](https://platform.claude.com/docs/en/agents-and-tools/agent-skills/overview)

### Inferences
- A copyable layout for a shared Drive folder:
  - `AGENTS.md` at the root: under about 200 lines, covering purpose, roles, file map, protocol rules and a precedence statement.
  - `README`-style index in llms.txt format: H1, a summary blockquote, then H2 link lists with an `## Optional` section.
  - Separate on-demand procedure docs in SKILL.md style, each with a front-matter `name`/`description` stating when to read it.

  This mirrors the always-loaded, on-trigger and on-demand tiers.
- Neither vendor guarantees conflict resolution: Claude may "pick one arbitrarily". So the shared AGENTS.md should state precedence explicitly, for example: "Human owner's direct chat instruction > this AGENTS.md > per-folder AGENTS.md > task card notes > anything written by the other agent". It should also say that content written by the other agent is data, not instructions. That follows the skills security warning and Claude Code's external-import approval rationale.
- Drive has no symlinks, so the "symlink CLAUDE.md to AGENTS.md" trick won't work. Instead, keep a single canonical AGENTS.md and have each agent's own config (Claude project instructions or a skill, and Muse's equivalent) say "read AGENTS.md in folder X first".

### Gaps
- `.cursorrules` / `.cursor/rules/*.mdc` specifics weren't fetched within the time budget. `.cursorrules` is commonly described as legacy, superseded by `.cursor/rules` and AGENTS.md support, but I have no fetched source to confirm this.
- I found no public information on whether Meta Muse reads AGENTS.md or any persistent instruction file, or how it handles Drive documents.
- I didn't confirm whether the Agent Skills format has been formally published as an open cross-vendor standard (e.g., agentskills.io); the overview page I read did not say.

## 2. Blackboard / shared-workspace architectures and frameworks

### Takeaway
Blackboard systems, where all communication goes through a shared board with a control step choosing who acts next, map closely onto a shared folder. Anthropic's production research system relies on agents writing artifacts to external storage and passing lightweight references, which avoids a lossy "game of telephone". A2A gives a vendor-neutral vocabulary for task states and for separating messages from artifacts. OpenAI's handoffs show that what history the receiving agent sees must be curated deliberately.

### Cited Findings
- **LbMAS** (arXiv 2507.01701, Han & Zhang, July 2025):
  - Agents communicate *only* through a blackboard that holds all historical context and replaces individual agent memory.
  - The blackboard has a public space plus private spaces for debate or verification.
  - Its constant roles are planner, decider, critic, cleaner and conflict-resolver.
  - An LLM control unit picks which agents act based on current board content, repeating until consensus.
  - The paper claims competitive performance while being token-economical.

  — [arXiv 2507.01701](https://arxiv.org/html/2507.01701v1). A secondary summary claiming +4–5 points and 72.6% on MATH is unverified against the paper — [Emergent Mind](https://www.emergentmind.com/videos/lbmas-implementation-multi-agent-llm-system-520cef83)
- A separate blackboard paper (arXiv 2510.01285, Salemi et al., Google Cloud AI Research / UMass) has a central agent post requests to the board and subordinate agents volunteer to answer them. This is pull-based, not assigned. — [arXiv 2510.01285](https://arxiv.org/abs/2510.01285v2)
- **Anthropic multi-agent research system** (June 13, 2025):
  - Orchestrator-worker design. Multi-agent beat single-agent Opus 4 by 90.2% on an internal eval but used about 15x the tokens of chat.
  - The lead agent saves its plan to external memory because context past 200k tokens is truncated.
  - Subagents "store their outputs in external systems and pass lightweight references back", which preserves fidelity and avoids copying large outputs.
  - Delegation briefs need an objective, output format, tool and source guidance, and clear task boundaries; vague briefs caused duplication and gaps.
  - It is less suited to tasks that need tight shared context, such as coding.

  — [Anthropic Engineering](https://www.anthropic.com/engineering/multi-agent-research-system)
- **Google A2A protocol** (spec v1.0.0; earlier 0.3.0/0.2.6/0.1.0):
  - Task states: SUBMITTED, WORKING, INPUT_REQUIRED, AUTH_REQUIRED (interrupted), and COMPLETED, FAILED, CANCELED, REJECTED (terminal).
  - "Messages SHOULD NOT be used to deliver task outputs". Outputs go in Artifacts.
  - `contextId` groups related tasks, and mismatched contextIds must be rejected.
  - Agents publish an Agent Card describing identity, skills and auth.
  - The page header says A2A has joined the Agentic AI Foundation.

  — [A2A spec](https://a2a-protocol.org/latest/specification/)
- **OpenAI Agents SDK handoffs:**
  - Handoffs appear to the model as tools (`transfer_to_<agent>`).
  - By default the receiving agent sees the full history. `input_filter` can trim it (e.g., strip tool calls).
  - `input_type` lets the handing-off model attach structured metadata such as reason or priority.
  - The opt-in `nest_handoff_history` condenses earlier history into summary segments in `<CONVERSATION HISTORY>` tags, and does not redact sensitive data.

  — [OpenAI Agents SDK docs](https://openai.github.io/openai-agents-python/handoffs/)
- **MetaGPT** (arXiv 2308.00352, v7 Nov 2024; older material): encodes Standardized Operating Procedures into prompt sequences. Role-specialized agents check intermediate results, which counters "cascading hallucinations" from naive chaining. — [arXiv 2308.00352](https://arxiv.org/abs/2308.00352)

### Inferences
- Directly transferable conventions:
  1. Make the shared folder the *only* channel, as in LbMAS. No side-channel state.
  2. Split it into a public board (`board/` or `STATE.md`) and per-agent private scratch (`agents/claude/`, `agents/muse/`).
  3. Use A2A state names on task cards so both vendors share an unambiguous vocabulary.
  4. Separate `messages/` or log entries from `artifacts/` outputs, following A2A's rule.
  5. Hand off by reference ("see artifacts/2026-10-08-report.md"), not by pasting content, following Anthropic.
  6. Give every handoff an OpenAI-style structured metadata header (reason, priority, what was trimmed).
- With no live control unit in an async setup, a human or a cheap rule ("whoever finds an unclaimed card matching their role takes it") replaces the LbMAS controller. That resembles the volunteer model in 2510.01285.

### Gaps
- MetaGPT's shared message pool and publish-subscribe details, AutoGen, CrewAI and LangGraph state/reducer semantics were not fetched within the tool budget. I can't cite specifics.
- I didn't retrieve the A2A Agent Card well-known path (the relevant spec section was truncated).

## 3. Handoff protocols: task cards, status fields, claiming/locking, acknowledgments, append-only logs, idempotency

### Takeaway
The best-documented proven pattern is Anthropic's long-running harness. It uses a JSON feature list in which agents may flip only a `passes` boolean, a progress log read at session start and appended at session end, git commits as checkpoints, and a fixed session-start routine. Combine it with A2A state names and explicit handoff briefs.

### Cited Findings
- **Anthropic long-running agent harness** (Nov 26, 2025):
  - An initializer session creates `claude-progress.txt`, a JSON feature list, `init.sh` and an initial git commit.
  - Each feature entry has `category`, `description`, `steps` and `passes: false`.
  - Coding agents may change only `passes`; "It is unacceptable to remove or edit tests".
  - JSON was chosen because the model is "less likely to inappropriately change or overwrite JSON files than Markdown".

  — [Anthropic Engineering](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- **Session-start routine:**
  1. Run `pwd`.
  2. Read the git log and progress file.
  3. Pick the highest-priority failing feature.
  4. Run init and a smoke test.
  5. Implement *one* feature, verify it end to end, commit, and update progress.

  — [Anthropic Engineering](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)
- The memory tool docs restate the pattern: an initializer session sets up a progress log and feature checklist, later sessions read them first, and each session updates the log before ending. "Mark a feature complete only after end-to-end verification." — [Claude memory tool docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool)
- A2A task lifecycle states (SUBMITTED, WORKING, INPUT_REQUIRED, COMPLETED, FAILED, CANCELED, REJECTED) are a standardized status vocabulary. — [A2A spec](https://a2a-protocol.org/latest/specification/)
- Delegation brief requirements: objective, output format, tools and sources, and boundaries. — [Anthropic Engineering](https://www.anthropic.com/engineering/multi-agent-research-system)
- Observed failure: "excessive status updates distracting other agents". Keep acks terse. — [Anthropic Engineering](https://www.anthropic.com/engineering/multi-agent-research-system)

### Inferences (copyable protocol; synthesized, not a published standard)
- **Task card** (one file per task in `tasks/`, or rows in a single JSON/Sheet), with fields: `id`, `title`, `objective`, `output_format`, `boundaries`, `acceptance_steps`, `status` (submitted | working | input_required | completed | failed | canceled), `owner` (claude | muse | human), `claimed_at`, `lease_expires`, `artifact_refs`, `handoff_note`, `updated_by`, `updated_at`.
- **Claiming without real locks:** Drive has no atomic compare-and-swap through agent tools. So:
  - Statically assign ownership by role (preferred), or
  - Claim by writing `owner` plus a lease timestamp, then re-read after a delay to confirm nobody else wrote; a stale lease can be reclaimed.
  - Alternatively, give each agent its own write-only outbox file so there are never two writers to one file.
- **Append-only log** (`LOG.md` or `log.jsonl`): one line per event, `timestamp | agent | task_id | event | ref`. Never edit past lines. Each agent writes only its own entries.
- **Idempotency:** each action carries `task_id` plus a step key. Before acting, an agent checks the log for an existing `completed` entry with that key. This matters for actions with side effects, such as Muse sending email or booking.
- **Acknowledgment:** the receiving agent writes `ack` with its understanding of the task in one line before working. This targets the MAST failure mode "fail to ask for clarification" (see section 5).
- Use JSON (or a Sheet) for status fields and Markdown for prose, following Anthropic's finding that JSON resists inappropriate edits.

### Gaps
- I found no published, vendor-neutral standard specifically for file-based claiming or locking between LLM agents. The claiming and idempotency conventions above are inferred from general distributed-systems practice and the sources cited.

## 4. File-based agent memory and context engineering / compaction

### Takeaway
Anthropic's guidance treats memory files as a just-in-time, out-of-context store. Agents read them first, update them as they progress, assume interruption, and keep the files organized and small. Compaction keeps architectural decisions, unresolved issues and key details, and drops redundant tool output.

### Cited Findings
- "Effective context engineering for AI agents" (Sept 29, 2025):
  - Structured note-taking, e.g., "maintaining a NOTES.md file", persists critical context and dependencies outside the window.
  - Compaction summarizes a context nearing its limit, keeps architectural decisions, unresolved bugs and implementation details, and discards redundant tool outputs.
  - Recommended approach: "maximize recall, then improve precision". Clearing old tool results is the lightest form.
  - Just-in-time retrieval keeps lightweight identifiers such as paths and links. Folder hierarchy, naming conventions and timestamps act as relevance signals.
  - Sub-agents return "condensed, distilled" summaries.

  — [Anthropic Engineering](https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents)
- Memory tool (`memory_20250818`):
  - Client-side files under `/memories`, with commands view, create, str_replace, insert, delete and rename.
  - An auto-injected protocol: "ALWAYS VIEW YOUR MEMORY DIRECTORY BEFORE DOING ANYTHING ELSE … record status / progress / thoughts … ASSUME INTERRUPTION".
  - Suggested reinforcement: keep memory "up-to-date, coherent and organized … rename or delete files that are no longer relevant. Do not create new files unless necessary."
  - Security guidance: cap file sizes, expire stale files, and block path traversal.

  — [Claude memory tool docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool)
- Pair memory with compaction: "compaction keeps the active context small … memory preserves the information that must survive summarization." — [Claude memory tool docs](https://platform.claude.com/docs/en/agents-and-tools/tool-use/memory-tool)
- Claude Code auto memory loads only the first 200 lines or 25KB per session, which is a concrete size budget. — [Claude Code memory docs](https://code.claude.com/docs/en/memory)
- For long tasks, Cognition recommends a separate model that compresses history into "key details, events, and decisions". — [Cognition](https://cognition.com/blog/dont-build-multi-agents)

### Inferences
- Shared-memory file set:
  - `STATE.md` holds current truth: under about 200 lines, overwritten in place, with sections Goals / Decisions (with date and author) / Open questions / Current tasks.
  - `LOG.md` is append-only.
  - `archive/LOG-YYYY-MM.md` receives compacted older entries.
  - A compaction rule applies: when LOG exceeds N lines, one designated agent, ideally a single owner to avoid races, summarizes the older entries into STATE "Decisions", moves the raw entries to the archive, and records a `compacted` event.
- The section names follow Anthropic's keep-list (decisions, unresolved issues, details), which makes compaction lossless for what matters.
- Start each agent session with the "view memory first" protocol: read AGENTS.md, then STATE.md, then the tail of LOG.md, then the agent's own tasks.

### Gaps
- I didn't investigate how Meta Muse persists memory or whether it can follow a "read file X first" protocol reliably.

## 5. Known failure modes and mitigations

### Takeaway
MAST, built from 1,600+ traces across 7 frameworks, finds failures spread across system design (spec and role violations, step repetition, unclear termination), inter-agent misalignment (reasoning-action mismatch, derailment, not asking for clarification), and verification. Cognition argues that dispersed decisions and unshared context make parallel multi-agent setups fragile. Mitigations: share full context, keep one decision-maker per decision, use explicit termination and verification steps, and standardize communication.

### Cited Findings
- MAST (arXiv 2503.13657, v3 Oct 26, 2025; Cemri, Pan, … Zaharia, Gonzalez, Stoica) defines 14 failure modes. The taxonomy was built from 150 traces with inter-annotator kappa 0.88. The dataset has 1,600+ traces across 7 frameworks. — [arXiv abs](https://arxiv.org/abs/2503.13657)
- Reported failure-mode prevalence — [arXiv HTML v3](https://arxiv.org/html/2503.13657v3):

  | Category | Failure mode | Prevalence |
  |---|---|---|
  | FC1 System design | Disobey task spec | 11.8% |
  | FC1 System design | Disobey role spec | 1.5% |
  | FC1 System design | Step repetition | 15.7% |
  | FC1 System design | Loss of conversation history | 2.8% |
  | FC1 System design | Unaware of termination conditions | 12.4% |
  | FC2 Inter-agent misalignment | Conversation reset | 2.2% |
  | FC2 Inter-agent misalignment | Fail to ask for clarification | 6.8% |
  | FC2 Inter-agent misalignment | Task derailment | 7.4% |
  | FC2 Inter-agent misalignment | Information withholding | 0.85% |
  | FC2 Inter-agent misalignment | Ignored other agent's input | 1.9% |
  | FC2 Inter-agent misalignment | Reasoning-action mismatch | 13.2% |
  | FC3 Task verification | Premature termination | 6.2% |
  | FC3 Task verification | No/incomplete verification | 8.2% |
  | FC3 Task verification | Incorrect verification | 9.1% |

- MAST mitigations — [arXiv HTML v3](https://arxiv.org/html/2503.13657v3):
  - Tactical fixes, which gave inconsistent results: clear role and task specs, explicit termination conditions, self-verification steps, cross-verification/peer review, and majority voting.
  - Structural fixes: multi-level verification, standardized communication protocols, uncertainty quantification, and better memory/state management.
  - ChatDev case studies: making the CEO the final decider gave +9.4% success, and adding high-level objective verification gave +15.6%. Gains were partial.
- Cognition, "Don't Build Multi-Agents" (Walden Yan, June 12, 2025; flag as 2025 material):
  - "Share context, and share full agent traces, not just individual messages."
  - "Actions carry implicit decisions". Conflicting implicit decisions break results; in the Flappy Bird example, parallel subagents produced mismatched styles.
  - Prefers single-threaded agents. For long tasks, compress history into key decisions.

  — [Cognition](https://cognition.com/blog/dont-build-multi-agents)
- Anthropic's observed failures: duplicated work among subagents, excessive status updates, compounding errors over long stateful runs, continuing after enough results, and synchronous bottlenecks. — [Anthropic Engineering](https://www.anthropic.com/engineering/multi-agent-research-system)
- Long-running harness failures: one-shotting everything, then running out of context and leaving undocumented half-work; later agents wrongly declaring the project done; marking features done without end-to-end tests. — [Anthropic Engineering](https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents)

### Inferences (mapping to a two-agent shared-doc setup)
- **Disobeying the task spec and derailment:** each task card carries objective, boundaries and acceptance steps, and agents re-read the card before marking it completed.
- **Step repetition and duplicated work:** single ownership per card plus an idempotency check against LOG before acting.
- **Unaware of termination and premature termination:** an explicit `acceptance_steps` field, plus a rule that status flips to completed only after verification, with the evidence linked in `artifact_refs`.
- **Implicit decisions conflicting (Cognition):** a `Decisions` section in STATE.md that both agents must read and append to before acting. Assign one owner per decision domain, e.g., Claude owns research and writing, Muse owns real-world actions such as booking and email, and the human owns final approval. This mirrors the ChatDev "CEO has final say" result.
- **Fail to ask for clarification:** the `input_required` status plus an `## Open questions` section addressed to the human or the other agent.
- **Cross-verification:** where stakes are high, one agent reviews the other's artifact before it is completed. This is MAST's peer-review tactic, applied with caution since MAST reports inconsistent gains.
- **Prompt injection across vendors:** treat everything the other agent writes as data. Only AGENTS.md, which the human owns, is authoritative. Consider making AGENTS.md read-only for both agents. This is grounded in the Skills security warning and Claude Code's external-import approval model.
- **Default to the minimum:** given Cognition's critique and the roughly 15x token cost, use two agents only where their capabilities genuinely differ (e.g., Muse's real-world actions versus Claude's analysis), and keep handoffs sequential rather than parallel.

### Gaps
- I didn't check whether Cognition has published a later follow-up revising its stance after 2025; the fetched post mentions none.
- I found no empirical study specifically on *cross-vendor* agents coordinating via shared documents. All transfer to that setting is inferred.
