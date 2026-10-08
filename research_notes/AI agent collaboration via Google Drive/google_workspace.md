# Google Drive / Docs / Sheets as a Shared Workspace for AI Agents (as of Oct 8, 2026)

Note on method: Web sources were fetched on 2026-10-08. One source is first-hand: this research session had a live "Google Drive" MCP connector attached (described by the server itself as "an MCP server provided by Drive API"). Its tool schemas were read directly. They are cited as "[Observed connector schema, this session]". They show what an agent in a Claude environment could actually call on that date. Treat this as an observation of one deployment, not a published spec.

## 1. Claude's Google Drive / Google Workspace connectors: supported operations and limits

### Takeaway
Claude's Google Workspace connectors (Gmail, Calendar, Drive, plus separate Docs/Sheets/Slides connectors) can search Drive, read text from most file types, upload or create files and folders, and share, move or trash files. Share, move and trash need approval by default. The Drive connector cannot rewrite the body of an existing file: its `update_file` changes only the title and parent folder. Editing an existing Doc or Sheet in place goes through the separate Docs/Sheets connectors and their live-editing pane, which is in beta. So for agent coordination, "create a new file per message" and "edit one shared file" are two different capability paths with different reliability.

### Cited Findings
**Anthropic help center (Google Workspace connectors article, "Updated this week" as of fetch):**
- Connectors cover Gmail, Google Calendar and Google Drive, plus separate Google Docs, Sheets and Slides connectors for live editing. They are available to all users on Claude and Claude Desktop. — [Anthropic Help Center](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors)
- Drive operations listed:
  - Search and retrieve Google Docs.
  - Share, move and trash files (approval required by default).
  - Look up file metadata and preview files.
  - Read Sheets, Slides, PDFs, images and MS Office files.
  - Upload any file type, with optional auto-conversion to Google formats.
  - Create folders.
  - View file permissions and list recent Drive changes.
  - Save Claude-generated files to Drive (requires code execution and file creation to be enabled).
  
  — [Anthropic Help Center](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors)
- "Only text is extracted from Drive files". Images embedded in documents are not processed. — [Anthropic Help Center](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors)
- The Docs/Sheets/Slides connectors can:
  - Create new files.
  - Read and work with comments and suggestions in Google Docs.
  - Edit files live in a pane beside the chat (beta).
  
  Drive still handles searching, uploading and sharing. — [Anthropic Help Center](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors)
- Live-editing pane (beta):
  - The user and Claude can edit the same file at once. Claude "re-reads the current content before each change", but users should check results in busy files.
  - It works on Claude web in Chrome, and on Desktop with the built-in browser turned on. The built-in browser is off by default on Enterprise.
  - Claude can't add charts to Slides.
  - A generic request for a "doc" creates a local file. The user must name Google or paste a Google link.
  
  — [Anthropic Help Center](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors)
- Limits:
  - File size limits are not specified.
  - Files must fit in the context window.
  - Rate limits follow Google API quotas.
  - Complex queries may need multiple API calls.
  
  — [Anthropic Help Center](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors)
- Permissions and admin controls:
  - Claude mirrors the user's Google permissions.
  - On Team/Enterprise, an Owner must enable the connectors at the org level. Owners can disable them, and can decide whether members may let share/move/trash run without per-action approval.
  - Individual users can disable specific tools.
  - Workspace admins may need to mark "Claude" as Trusted under Security > API controls (propagation about 15 minutes).
  
  — [Anthropic Help Center](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors)
- In projects, the Drive connector is available only for Files in private projects, not shared projects. Docs added to chats and projects sync with the latest Drive version. — [Anthropic Help Center](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors)
- Data handling:
  - Retrieved data is stored on Anthropic servers, tied to the chat, and deleted with the chat.
  - Connector data is not used for training.
  - Copied content may be used on consumer plans if the user opted in to training.
  
  — [Anthropic Help Center](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors)
- Older versions of the same help article described a narrower feature set ("Using the Google Drive integration"). Third-party write-ups disagree on whether write actions are paid-only; the current page says "all users". — [Search result summary of article versions](https://support.claude.com/en/articles/10166901-using-the-google-drive-integration); [aicatchup](https://aicatchup.com/news/claude-gmail-google-drive-actions)

**Observed Drive MCP tool schemas (Google_Drive connector attached to this session, Oct 8, 2026):**
- Tools present:
  - `search_files`
  - `list_recent_files`
  - `get_file_metadata`
  - `get_file_permissions`
  - `read_file_content`
  - `download_file_content`
  - `create_file`
  - `copy_file`
  - `update_file`
  - `share_file`
  - `trash_file`
  
  — [Observed connector schema, this session]
- `update_file`: "Request to update a file (currently only title and parent_id are supported)". There is no body or content update, so an existing file's content cannot be rewritten or appended through this connector. — [Observed connector schema, this session]
- `create_file`:
  - Accepts `textContent` (UTF-8) or `base64Content`, plus `contentMimeType` and `parentId`.
  - By default it converts supported content to Google types. For example, `text/plain` becomes a Google Doc.
  - `disableConversionToGoogleType: true` keeps the raw MIME type, such as a plain .md or .txt file.
  - It can create folders, and empty Docs/Sheets/Slides.
  
  — [Observed connector schema, this session]
- `read_file_content`:
  - Returns a "natural language representation", which "may be incomplete for very large files". The format "will change over time, so don't make assumptions about the particular format".
  - It can inline comments for Docs, Slides and Sheets (`includeComments`).
  - Supported types: Google Docs/Sheets/Slides, PDF, Word/.docx, .xlsx, .pptx, ODF, PNG/JPEG.
  
  — [Observed connector schema, this session]
- `download_file_content`:
  - Returns base64. Google-native files export to a chosen `exportMimeType`, defaulting to text/plain or text/csv.
  - It accepts a `revisionId`, so a specific prior revision can be fetched.
  
  — [Observed connector schema, this session]
- `search_files`:
  - Query syntax: `title`, `fullText`, `mimeType`, `modifiedTime`, `createdTime`, `viewedByMeTime`, `parentId`, `owner`, `sharedWithMe`, with and/or/not.
  - Paginated. Optional content snippets of about 1,000 to 5,000+ characters.
  - Polling a folder for new or changed files (`parentId = 'X' and modifiedTime > 'T'`) is therefore possible.
  
  — [Observed connector schema, this session]
- `share_file`:
  - Roles: writer, commenter, reader, for a user or group email.
  - It only raises permission levels ("if the new role is higher than their current role").
  - There is no remove-permission tool in the observed set.
  
  — [Observed connector schema, this session]

### Inferences
- Coordination via the Drive connector alone works best as an append-only, file-per-message pattern. Each agent creates new files, such as `2026-10-08T1405_agentA_status.md`, in a shared folder. The other agent finds them with `search_files` (parentId + modifiedTime) and reads them with `read_file_content` or `download_file_content`. In-place edits of one "state" file need the Docs/Sheets connectors (beta live pane) or another tool such as Zapier.
- Files created with conversion disabled (raw text/markdown) round-trip more predictably than converted Google Docs. `read_file_content` output on a Google Doc is a changing "natural language representation", not a stable serialization.
- Claude can approve share, move and trash per action, but trash is reachable. A coordination protocol should rely on a non-destructive convention, such as moving a file to an "archive" folder.

### Gaps
- No published file-size limit for reads, uploads or creates. "May be incomplete for very large files" gives no threshold.
- The help center does not document whether the Sheets connector supports row-level append or update outside the live pane, or whether the Docs/Sheets connectors work in non-interactive contexts (Claude Code, scheduled tasks, API). The live pane requires a browser.
- It is unclear whether the observed Drive MCP is the same server that claude.ai end users get. It may differ by surface or plan.
- Whether Claude can post or resolve comments (as opposed to read them) via the connectors is not explicit. The help text says "read and work with comments and suggestions".

## 2. Zapier Google Docs / Sheets / Drive actions and Zapier MCP

### Takeaway
Zapier offers what Claude's Drive connector lacks for state files: Docs "Append Text to Document", "Find and Replace Text" and "Get Document Content", and Sheets row-level CRUD (lookup, add, update, find-or-create, get many rows). Zapier MCP exposes these as tools to Claude and other MCP clients. Each successful call costs 2 tasks from the Zapier plan allowance, so a polling or chatty protocol gets expensive quickly.

### Cited Findings
- **Google Docs on Zapier**:
  - Triggers:
    - New Document.
    - New Document in Folder (not subfolders).
    - Updated Document (requires `document_id`).
  - Actions:
    - Append Text to Document (`file`, `text`).
    - Create Document From Template (`{{placeholders}}`).
    - Upload Document.
    - Find and Replace Text.
    - Format Text (needs indexes).
    - Insert Image.
    - Insert Text (at index).
    - Create Document From Text (limited HTML support).
    - Replace Image.
    - Update Document Properties.
  - Searches:
    - Find a Document (by name).
    - Find Text in Document (returns indexes).
    - Get Document Content.
    - Get Document Tabs Content.
    - Find or Create Document.
  
  — [Zapier Google Docs integrations page](https://zapier.com/apps/google-docs/integrations)
- The Zapier Docs page does not list rate limits, quotas or file-size limits. Examples were verified against SDK v0.112.6 and CLI v0.84.6. — [Zapier Google Docs](https://zapier.com/apps/google-docs/integrations)
- An append-style action has fields: Document Name (required), Text to Append (required), and "Append Text on New Line?". This comes from a search snippet; the block was not clearly labeled. — [Zapier search result pages](https://zapier.com/apps/ai/integrations/google-docs)
- **Google Sheets on Zapier (38 operations)**:
  - Triggers:
    - New Spreadsheet Row (fires on rows added to the bottom).
    - New or Updated Spreadsheet Row.
    - Updated Spreadsheet Row (only).
    - New Spreadsheet.
    - New Worksheet.
    - Team Drive variants.
  - Writes:
    - Create Spreadsheet Row, Create Row at Top, Create Multiple Rows.
    - Update Spreadsheet Row, Update Row(s).
    - Clear Row(s) (keeps rows) vs Delete Row(s) (removes rows).
    - Create Column, Create Spreadsheet, Create Worksheet.
    - Copy Range, Copy Worksheet.
    - Sort Range, Format Cell Range, Format Row.
    - Set Data Validation, Conditional Formatting.
    - Change Sheet Properties, Rename Sheet.
    - Delete Sheet ("cannot be undone").
  - Searches:
    - Lookup Spreadsheet Row (column = value, returns the whole row).
    - Lookup Spreadsheet Rows (Advanced), up to 500 rows.
    - Get Many Spreadsheet Rows (Advanced), up to 1,500 rows.
    - Get Row by ID (row number).
    - Get Data Range (A1).
    - Get Spreadsheet by ID (raw API data).
    - Find Spreadsheet, Find Worksheet.
  - Find-or-create:
    - Spreadsheet.
    - Worksheet.
    - Row.
  
  — [Zapier Google Sheets integrations page](https://zapier.com/apps/google-sheets/integrations)
- Zapier MCP mechanics:
  - Signing in auto-provisions a server and pre-enables actions for apps already connected.
  - Agents can discover and enable actions mid-request via `discover_zapier_actions` and `enable_zapier_action`.
  - Any Streamable-HTTP MCP client works. Listed clients include Claude, Claude Code, Claude Cowork, ChatGPT, Cursor, Codex, VS Code and Gemini CLI.
  - Auth is OAuth from the client. Code integrations use a long-lived connection token.
  - Org admins may need to approve the connector.
  
  — [Zapier MCP docs: Connect](https://docs.zapier.com/mcp/get-started/connect)
- Billing and limits:
  - "Each successful tool call uses two tasks". Failed calls are free.
  - Calls draw from the same task allowance as Zaps. When the allowance runs out, MCP calls stop until reset or upgrade.
  - Example: a search plus ten updates is 11 calls, or 22 tasks.
  
  — [Zapier MCP usage docs](https://docs.zapier.com/mcp/overview/usage.md); [Zapier help: How Zapier MCP usage works](https://help.zapier.com/hc/en-us/articles/45645738385805)
- A third-party estimate says the Free plan's 100 tasks would cover about 50 MCP calls a month. This is not an official Zapier figure. — [Latenode](https://latenode.com/blog/zapier-mcp-pricing)

### Inferences
- Zapier's Sheets "Lookup Row", "Update Row" and "Find or Create Row" give the closest thing to keyed, row-level state updates via an AI assistant (for example, a task table keyed by task_id). Docs "Append Text to Document" gives a true append to a running log. Claude's native Drive connector offers neither.
- Zapier triggers ("New Spreadsheet Row", "Updated Document") can push events into Zaps, such as notifying the other agent's channel. They do not wake an MCP client directly.
- Zapier row actions are separate API calls with no compare-and-swap. Two agents updating the same row can still clobber each other.

### Gaps
- Trigger polling interval and latency for Google Sheets/Docs Zapier triggers were not found. The integration page doesn't state it.
- Zapier Google Drive app actions (upload, move, copy, find file or folder) were not fetched in detail.
- No information on how Zapier's "Append Text" handles formatting, or whether it respects Doc tabs.

## 3. Google's official MCP servers / Workspace agent features (2026)

### Takeaway
Google opened a Workspace MCP server to public developer preview on May 1, 2026, after Cloud Next '26. It covers Gmail, Drive, Calendar, Chat and People. No Docs- or Sheets-specific MCP tools were found in official sources. The Drive MCP endpoint (`drivemcp.googleapis.com/mcp/v1`) is file-level only: it fetches, reads, creates, copies and searches files, and manages permissions. It does not edit document content.

### Cited Findings
- On May 1, 2026 Google opened the Workspace MCP server to public developer preview (gradual rollout), alongside a CLI and remote MCP integrations announced at Cloud Next '26. Tools by product:
  - Gmail: drafting, search, read/write.
  - Drive: file fetching, permissions management, listing, uploading.
  - Calendar: availability and events.
  - Chat: find conversations, search, send replies.
  - People: contacts and profiles.
  
  No Docs or Sheets tools are listed. — [Google Workspace Updates blog, May 2026](https://workspaceupdates.googleblog.com/2026/05/agent-tools-and-security-updates-for-workspace-developers.html)
- New tiered usage quotas for APIs and MCP apply to new projects from May 1, 2026. Existing projects get at least 60 days' notice. Google says fewer than 1% of developers will need more than standard tiers. — [Google Workspace Updates blog](https://workspaceupdates.googleblog.com/2026/05/agent-tools-and-security-updates-for-workspace-developers.html)
- The Drive MCP reference lists the endpoint `https://drivemcp.googleapis.com/mcp/v1`, labeled "Developer Preview" and "Available as part of the Google Workspace Developer Preview Program". Tools listed:
  - `copy_file`
  - `create_file`
  - `download_file_content`
  - `get_file_metadata`
  - `get_file_permissions`
  - `list_recent_files`
  - `read_file_content`
  - `search_files`
  
  — [Drive MCP reference](https://developers.google.com/workspace/drive/api/reference/mcp)
- The tool set observed in this session matches those names and adds `share_file`, `trash_file` and `update_file`. Either the reference page lags or the deployment differs. — [Observed connector schema, this session] vs [Drive MCP reference](https://developers.google.com/workspace/drive/api/reference/mcp)
- Third-party setup guides say:
  - The Cloud project must be enrolled in the Developer Preview Program, or every tool call returns permission errors.
  - Each product has its own endpoint, scopes and OAuth client.
  - Drive scopes cited include `drive.readonly` and `drive.file`.
  
  These are secondary sources. — [Aembit docs](https://docs.aembit.io/ai-guide/mcp/identity-gateway/supported-servers/google-workspace/); [Zeta Alpha docs](https://docs.zeta-alpha.com/gen-ai/customize/guides/configuring-capabilities/connecting-mcp-servers/how-to-connect-google-workspace)
- Community MCP servers fill the Docs and Sheets gap. Examples include gdrive-mcp forks with Docs/Sheets editing, the gws-CLI-based server, and mcp-gee-sweet (claims 101 tools). One PyPI listing explicitly states that Sheets and Docs have no official server. — [Glama listing](https://glama.ai/mcp/servers/jmxjxhfkvo); [PyPI mcp-gee-sweet](https://pypi.org/project/mcp-gee-sweet/0.8.2.dev210/)
- A May 2026 blog post called an Anthropic reference server "Google's official MCP server". That label is inaccurate. — [codewords.ai](https://www.codewords.ai/blog/google-drive-mcp-server)

### Inferences
- Content-level edits to Docs and Sheets from a non-Claude agent (for example ChatGPT or Gemini) need one of three things: Zapier MCP, a community MCP server, or direct Docs/Sheets API code. Google's official MCP will not do it as of this research.

### Gaps
- No details were found on Gemini-in-Workspace agent features, such as Gemini editing Docs/Sheets autonomously or Workspace Flows/"agents" in 2026, as a coordination participant. This was not researched in depth.
- The Workspace CLI ("gws") and the remote MCP integrations' status and capabilities were not described on the official page.
- The GA timeline for the Workspace MCP server is unknown.

## 4. Google Docs vs Google Sheets vs plain text/markdown files for agent-readable state

### Takeaway
Sheets is the best fit for structured, keyed, row-level state. It has typed append (`values.append`), atomic `batchUpdate`, and row lookup and update via Zapier. Plain text or markdown files with conversion disabled are the most faithful for free-form notes, but the Drive connector can only create them, not edit them. Google Docs are human-friendly but index-based, and reading them as text is lossy. Docs can export to `text/markdown`.

### Cited Findings
- Sheets `values.append`:
  - It finds the "table" in the input range and writes after its last row, starting in its first column.
  - By default it overwrites data below the table. `insertDataOption=INSERT_ROWS` inserts new rows instead.
  - Range choice matters: with tables at A1:C2 and B4:D6, appending to A1 lands at A3, while appending to the whole sheet lands at B7.
  
  — [Sheets API: Read & write cell values](https://developers.google.com/workspace/sheets/api/guides/values)
- `valueInputOption`:
  - RAW stores input as a literal string, so "=1+2" stays text.
  - USER_ENTERED parses it as if typed: formulas, dates and currency are recognized.
  - RAW is safer when agents write arbitrary text that might start with "=".
  
  — [Sheets API values guide](https://developers.google.com/workspace/sheets/api/guides/values)
- Sheets `spreadsheets.batchUpdate` is all-or-nothing: "If any request is not valid then the entire request will fail and nothing will be applied". Updates in one request "will be applied together atomically", though they "may be altered with respect to collaborator changes". — [Sheets API batchUpdate reference](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/batchUpdate)
- Docs API edits are index-based:
  - The best practice is to edit "backwards" (highest index first) within a batch.
  - Other collaborators may change the doc between calls, so stale indexes cause errors.
  - Tabs: `documents.get` returns other tabs only with `includeTabsContent=true`. Requests target the first tab unless a tab ID is given.
  
  — [Docs API best practices](https://developers.google.com/workspace/docs/api/how-tos/best-practices)
- Google Docs can be exported via Drive `files.export` as Markdown (`text/markdown`, .md). — [Drive export MIME types](https://developers.google.com/workspace/drive/api/guides/ref-export-formats)
- The Claude connector extracts text only, and embedded images are dropped. `read_file_content` returns a non-stable "natural language representation". — [Anthropic Help Center](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors); [Observed connector schema, this session]
- The Drive connector's `create_file` converts text/plain to a Google Doc unless `disableConversionToGoogleType` is set. — [Observed connector schema, this session]
- Zapier "Create Document From Text" supports only limited HTML. Format Text needs character indexes from "Find Text in Document". — [Zapier Google Docs](https://zapier.com/apps/google-docs/integrations)

### Inferences
- Recommended split:
  - A Sheet for the task, lock and status table: one row per task, with columns such as id, owner, status, updated_at and version.
  - Append-only text or markdown files, or an appended Doc, for logs and handoff notes.
  - Avoid using a richly formatted Doc as the source of truth for machine-parsed state.
- Markdown written into a converted Google Doc gets turned into Doc formatting, or left as literal characters. Exporting it back to markdown may not reproduce the original byte-for-byte. Keep machine state in unconverted .md/.txt/.json files or in Sheets cells.
- An agent writing to a Sheet via `values.append` should use an explicit range anchored at column A and INSERT_ROWS. That avoids landing in the wrong "table" or overwriting rows below it.

### Gaps
- Official confirmation that Drive accepts `text/markdown` as an import format for conversion to Google Docs was not found. Export is confirmed.
- The exact output format of the Claude connector for Sheets (CSV-like, markdown table?) is undocumented and subject to change.

## 5. Concurrency and integrity: concurrent edits, revision history, notifications

### Takeaway
Only the Docs API offers true optimistic concurrency: `WriteControl.requiredRevisionId` rejects writes to a changed document, and `targetRevisionId` merges them. Sheets offers per-request atomicity but no documented revision precondition. The connector and Zapier layers expose none of these controls, so concurrent agent writes to the same file or row are effectively last-write-wins. Revision history exists, and specific revisions can be downloaded. Change notifications require an HTTPS webhook (Drive `changes.watch`/`files.watch`) or Apps Script triggers. Neither directly wakes a chat-based AI agent, so agents must poll.

### Cited Findings
- Docs API concurrency:
  - Read with `documents.get` and keep the `revisionId`.
  - `requiredRevisionId`: "If the document was modified since the API read request, the write request isn't processed and it returns an error".
  - `targetRevisionId`: changes are merged against collaborator changes on the server.
  
  — [Docs API best practices](https://developers.google.com/workspace/docs/api/how-tos/best-practices)
- Sheets `batchUpdate`: atomic within a request, but "it is not guaranteed that the spreadsheet will reflect exactly your changes ... Your changes may be altered with respect to collaborator changes". — [Sheets API batchUpdate reference](https://developers.google.com/sheets/api/reference/rest/v4/spreadsheets/batchUpdate)
- The Sheets values guide does not cover concurrent writes or conflict handling. — [Sheets values guide](https://developers.google.com/workspace/sheets/api/guides/values)
- Claude's live pane: Claude "re-reads the current content before each change", but users should check results in busy files. This is a best-effort freshness check, not a lock. — [Anthropic Help Center](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors)
- Revisions:
  - Revisions of Google Docs/Sheets/Slides can't be deleted via the API, and their content can be exported.
  - Blob-file revisions are typically kept 30 days, or purged sooner once there are 100 revisions. `keepForever` pins up to 200 revisions.
  - `revisions.list` may omit older revisions for frequently edited native files.
  
  — [Drive API: Manage revisions](https://developers.google.com/workspace/drive/api/guides/manage-revisions)
- The Claude Drive connector's `download_file_content` accepts a `revisionId`, so an agent can fetch a prior version. — [Observed connector schema, this session]
- Drive push notifications:
  - `files.watch` and `changes.watch` deliver to an HTTPS webhook with a valid certificate.
  - The notification body is empty: the agent must call `changes.list` or `files.get` to see what changed.
  - Maximum channel lifetime is 1 day for files and 1 week for changes (default 1 hour). Renewal is manual.
  - The `X-Goog-Changed` header tells content, properties, parents, children and permissions changes apart.
  - No latency guarantee is given.
  
  — [Drive API push notifications](https://developers.google.com/workspace/drive/api/guides/push)
- Zapier "Updated Document", "New Document in Folder" and "New or Updated Spreadsheet Row" triggers provide another change-detection path. Polling interval is undocumented. — [Zapier Google Docs](https://zapier.com/apps/google-docs/integrations); [Zapier Google Sheets](https://zapier.com/apps/google-sheets/integrations)

### Inferences
- Practical integrity patterns for two agents:
  1. Single-writer-per-file: each agent owns its own outbox file or folder and only reads the other's.
  2. Append-only logs with timestamps and agent IDs, instead of overwriting shared state.
  3. For a shared Sheet, include a `version` or `updated_at` column and re-read the row immediately before writing. This is advisory only; there is no CAS via Zapier or the connector.
  4. Use revision history as the audit trail and rollback mechanism.
- Comments (readable by the Claude connector with `includeComments`) can serve as a lightweight side-channel for questions between agents. Whether connectors can create comments is unverified.

### Gaps
- Could not confirm whether Drive API v3 `files.update` supports ETag/If-Match preconditions for blob content. If not, blob overwrites are last-write-wins. Needs verification.
- Named versions ("Name current version" in the Docs UI) were not found exposed via API in the sources checked.
- Delivery latency of Drive push notifications and of the Zapier triggers is undocumented.

## 6. Sharing and permissions: least privilege, service accounts, limiting connector visibility

### Takeaway
Claude's connector inherits the full Google account's access ("mirrors your Google permissions"). There is no per-folder scoping in the consumer connector, so least privilege means using a dedicated Google account that can see only the shared folder. Custom integrations can use the non-sensitive `drive.file` scope, which limits an app to files it created or the user picked. The broad `drive` and `drive.readonly` scopes are "restricted".

### Cited Findings
- Claude "can only access files your Google account can access" and mirrors existing permissions. — [Anthropic Help Center](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors)
- Admin controls on Team/Enterprise:
  - Owners enable or disable the connectors.
  - Owners choose whether share/move/trash need per-action approval.
  - Users can disable individual tools.
  - Workspace admins control trusted apps under Security > API controls.
  
  — [Anthropic Help Center](https://support.claude.com/en/articles/10166901-use-google-workspace-connectors)
- Drive scopes:
  - `drive.file` (non-sensitive) gives access only to files the app created or that the user opened or shared with it via the Picker.
  - `drive.appdata` (non-sensitive) gives a hidden app-config folder.
  - `drive`, `drive.readonly` and `drive.metadata(.readonly)` are restricted, require restricted-scope verification, and are limited to certain app categories.
  - Google recommends migrating to `drive.file` where possible.
  
  — [Drive API scopes](https://developers.google.com/workspace/drive/api/guides/api-specific-auth)
- Workspace admins can manage app access to Workspace data under Security > API Controls (mentioned in the context of the MCP and agent tooling rollout). — [Google Workspace Updates blog](https://workspaceupdates.googleblog.com/2026/05/agent-tools-and-security-updates-for-workspace-developers.html)
- Drive push channels created by a service account can be stopped by any user of that OAuth client. Regular user channels can be stopped only by the same user and client. — [Drive API push notifications](https://developers.google.com/workspace/drive/api/guides/push)
- The connector's `share_file` grants writer, commenter or reader, and only upgrades roles. No revoke tool was observed. — [Observed connector schema, this session]

### Inferences
- Least-privilege setup for two assistants:
  - Create a dedicated Google account (or Workspace user) per agent, or one "bot" account.
  - Share only the coordination folder with it, as Editor (or Commenter for a review-only agent).
  - Connect each assistant's connector to that account, not the human's primary account.
  - This bounds search results to the folder, since `sharedWithMe` and `parentId` filters then match only shared content.
- Keep per-action approval on for share/move/trash, so a prompt-injected agent can't exfiltrate by sharing files externally. File content written by the other agent should be treated as untrusted input.
- Service accounts are usable for custom code (Apps Script, Cloud Functions) but are not an option for the Claude.ai or Zapier consumer connectors, which use user OAuth.

### Gaps
- No documentation found on restricting the Claude connector to a single folder (folder-scoped OAuth). It appears not to exist.
- Behavior of shared drives (Team Drives) with the Claude connector was not documented. Zapier has dedicated "Team Drive" triggers.

## 7. Apps Script as glue

### Takeaway
Apps Script can run time-driven jobs, such as archiving old log rows, rotating files or compacting state, and change triggers on Sheets. Hard limits apply. More importantly, `onEdit` does not fire for API or script edits, so agent writes through APIs, Zapier or connectors won't trigger `onEdit`. Use time-driven triggers or the installable `onChange` instead (the latter needs verification).

### Cited Findings
- Simple triggers (`onEdit`, `onOpen`):
  - Cannot run longer than 30 seconds.
  - Cannot use services that require authorization.
  - "Script executions and API requests don't cause triggers to run". For example, `Range.setValue()` does not fire `onEdit`.
  - `onEdit` queues only up to 2 events.
  
  — [Apps Script triggers guide](https://developers.google.com/apps-script/guides/triggers)
- Installable triggers include time-driven (Sheets, Docs, Slides, Forms, standalone) and Change (Sheets). They must be activated before use. — [Apps Script triggers guide](https://developers.google.com/apps-script/guides/triggers)

| Quota | Consumer accounts | Workspace accounts |
|---|---|---|
| Runtime per execution | 6 min | 6 min |
| Total trigger runtime | 90 min/day | 6 hr/day |
| Triggers per user per script | 20 | 20 |
| Simultaneous executions per user | 30 | 30 |
| URL Fetch calls | 20,000/day | 100,000/day |

  When the limit is hit, the script fails with "Service using too much computer time for one day". — [Apps Script quotas](https://developers.google.com/apps-script/guides/services/quotas)

### Inferences
- Useful Apps Script glue for agent coordination:
  1. A time-driven (for example hourly) job that moves rows with status=done to an Archive sheet, or files older than N days to /archive.
  2. A job that writes a compact "STATE.md" or summary row so agents read one small file instead of the whole log.
  3. A job that sends an email or webhook (UrlFetchApp) when a new handoff row appears. This can bridge to a notification channel the other agent watches.
  4. Using LockService inside scripts to serialize script-side writes. Not verified in sources here; LockService is a known Apps Script service, but its semantics were not fetched.
- Because API edits don't fire `onEdit`, any "react to agent write" logic should poll on a timer or use Drive push or Zapier triggers.

### Gaps
- Whether the installable `onChange` trigger fires for API-originated edits was not confirmed.
- Minimum frequency of time-driven triggers (commonly cited as every 1 minute) was not verified from the fetched page.
- LockService and PropertiesService details were not fetched.
