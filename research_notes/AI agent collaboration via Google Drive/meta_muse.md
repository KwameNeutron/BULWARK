# Meta Muse (consumer personal AI agent) and Google Workspace: capabilities as of October 2026

Source-quality legend used below:
- **[OFFICIAL]**: Meta's own pages (muse.ai/platform/docs) or a vendor's own announcement (Zapier blog).
- **[PRESS]**: reputable tech or news press (TechCrunch, AP/PBS, Axios).
- **[3P]**: third-party trackers, SEO blogs and vendor marketing (postfa.st, cellcog, parallel.ai, composio, usecarly, layer3labs, openclawdatabase, captaincompliance and similar). Many of these sell Muse connectors or workarounds, so treat them with caution. Several were the only sources for key Google details.
- Meta's Help Center and newsroom pages could not be fetched directly. Claims that cite "Meta Help Center" or "Wang on X" reach these notes only through [3P] pages.

## 1. What Meta Muse is: launch dates, platforms and the connector platform

### Takeaway
Muse is a separate agent product from the Meta AI chatbot. It launched on September 8, 2026, for US adults on web (muse.ai), iOS, Android and WhatsApp. It runs on the Muse Spark model inside a per-user cloud VM. Meta opened a connector platform to developers on September 18, 2026, and expanded the directory at Connect on September 23 and again on September 29.

### Cited Findings
- **The model:** Muse Spark was announced on April 8, 2026, as the first model from Meta Superintelligence Labs (under Alexandr Wang). At first it powered the Meta AI app and meta.ai, with rollout to WhatsApp, Instagram, Facebook, Messenger and glasses to follow. [PRESS] [Axios](https://www.axios.com/2026/04/08/meta-muse-alexandr-wang); [eMarketer](https://www.emarketer.com/content/meta-debuts-muse-spark-power-ai-across-its-apps-raise-stakes-ai-driven-discovery)
- **Launch:**
  - Meta introduced the Muse agent on Tuesday, September 8, 2026. It is US only. [PRESS] [TechCrunch Sep 8](https://techcrunch.com/2026/09/08/meta-debuts-its-muse-ai-agent-will-consumers-trust-it/)
  - Users must be 18 or older. [PRESS] [PBS/AP](https://www.pbs.org/newshour/nation/meta-launches-personal-ai-agent-muse-to-help-with-everyday-tasks)
- **Platforms:**
  - Web at muse.ai, iOS and Android apps, and WhatsApp chats; Meta AI glasses are coming "soon." [PRESS] [TechCrunch Sep 8](https://techcrunch.com/2026/09/08/meta-debuts-its-muse-ai-agent-will-consumers-trust-it/)
  - AP describes Muse as "a separate app, called Muse" plus WhatsApp. [PRESS] [PBS/AP](https://www.pbs.org/newshour/nation/meta-launches-personal-ai-agent-muse-to-help-with-everyday-tasks)
- **Model version:** TestingCatalog says Muse launched on Muse Spark 1.3. [3P] [TestingCatalog](https://www.testingcatalog.com/meta-introduces-muse-as-a-proactive-personal-agent.md)
  - Its wording suggests Meta was "inviting people to try" Muse, which implies gated access. Another tutorial mentions a waitlist. [3P] [upgpts](https://upgpts.com/en/tutorials/muse/how-to-use-muse-ai)
- **Runtime environment:**
  - Muse runs on a "dedicated, secure virtual machine" that holds both the agent and the user's data. [PRESS] [PBS/AP](https://www.pbs.org/newshour/nation/meta-launches-personal-ai-agent-muse-to-help-with-everyday-tasks)
  - Meta calls this the "Muse Secure VM," a computer with its own browser. A separate isolated agent, "Sentinel," mediates security. [PRESS] [TechCrunch Sep 8](https://techcrunch.com/2026/09/08/meta-debuts-its-muse-ai-agent-will-consumers-trust-it/)
  - The VM has a file system, terminal and web browser. Muse can write code, build tools, and create documents, PDFs, web pages and dashboards ("Artifacts"). [3P] [TestingCatalog](https://www.testingcatalog.com/meta-introduces-muse-as-a-proactive-personal-agent.md)
- **Meta Connect (September 23, 2026):**
  - Muse is described as Meta's personal AI agent that "launched in early September."
  - Upcoming features: a realtime avatar, glasses support "in the coming months," a Mac app that can operate any desktop app (no date given), and Muse's own email address so users can CC or forward to it ("soon").
  - New connectors named: GitHub, Granola and Notion.
  - Alexandr Wang said the developer platform received more than 1,500 connector applications in under a week.
  - [PRESS] [TechCrunch Sep 23](https://techcrunch.com/2026/09/23/everything-new-coming-to-metas-ai-agent-muse/)
- **Connector platform:** Announced September 18, 2026 by Zuckerberg, with the platform page at muse.ai/platform. [3P] [cellcog](https://cellcog.ai/blog/muse-connector-platform/)
- **Official connector guidelines** [OFFICIAL] [muse.ai/platform/docs](https://muse.ai/platform/docs):
  - Submissions provide "API or MCP documentation," the endpoint, authentication and scopes (OAuth client credentials or an API key), and a test account.
  - Meta runs a risk assessment, a tool review and end-to-end QA. Meeting the guidelines does not guarantee approval.
- **Small-business batch (September 29):** Meta added business skills and connectors, including Asana, Box, Canva, Dropbox, Figma, Notion, Slack, Stripe, Zoom and QuickBooks. Coverage says this was available in the US and Canada. [3P] [letsdatascience](https://letsdatascience.com/news/meta-adds-small-business-tools-to-muse-in-the-us-and-canada-dd3aac76); [relevantaudience](https://www.relevantaudience.com/meta/meta-muse-small-business-connectors/)
- **Developer portal:** Opened October 5, 2026. [3P] [postfa.st](https://postfa.st/blog/meta-muse-connectors-list)

### Inferences
- "The Meta AI app powered by Muse Spark" (the chatbot, since April 2026) and "Muse" (the agent app, since September 2026) are different products. The Drive, connector and VM capabilities in these notes belong to the **Muse agent**, not the Meta AI chat app.
- Mac availability is inconsistent:
  - TechCrunch on September 23 treats Mac as upcoming.
  - postfa.st lists a Mac app, and The Rundown has a "Muse Desktop" setup guide.
  - Mac may have shipped in early October, but this is not confirmed.

### Gaps
- Meta newsroom posts (about.fb.com) and Help Center articles could not be fetched directly. No primary Meta text was seen on the September 8 launch post.
- It is unclear whether Muse is fully open to all US adults or still invite or waitlist gated as of October 2026.

## 2. Which connectors exist: Google Drive, Docs, Sheets, Gmail, Calendar, Zapier, Notion and GitHub

### Takeaway
Meta publishes no official public connector list; the in-app Settings → Connectors screen is the source of truth.

**Google:**
- Gmail, Google Calendar and Google Docs reportedly launched on September 8, per Wang's thread as relayed by third parties.
- Google Drive, Sheets, Slides and Forms are reported in the in-app directory, but no Meta announcement backs them and sources dispute them.

**Zapier:** Officially added September 29. Zapier is the best-documented path to Google Docs, Sheets and Drive actions.

### Cited Findings
- **Gmail:**
  - Live at launch on September 8, citing Wang's X post.
  - Search and read work; sending needs a separate write permission.
  - [3P] [postfa.st](https://postfa.st/blog/meta-muse-connectors-list)
- **Google Calendar:**
  - Live at launch.
  - Read is included; sending invites needs write permission.
  - [3P] [postfa.st](https://postfa.st/blog/meta-muse-connectors-list)
- **Google Docs:**
  - Live at launch, "under Google's Workspace API rules," citing Wang's thread. [3P] [postfa.st](https://postfa.st/blog/meta-muse-connectors-list); [cellcog](https://cellcog.ai/blog/muse-connector-platform/)
  - **Contradiction:** a search-engine synthesis of the Composio and usecarly pages found "no evidence that Muse has a native Google Docs connector." Those pages describe Docs access through Composio's third-party MCP, added as a custom connector. [3P] [composio](https://composio.dev/toolkits/googledocs/framework/muse)
- **Google Drive, Sheets, Slides and Forms:**
  - "Listed in the in-app directory" based on an in-app transcription by Stark Insider on September 14. There is "no vendor announcement." [3P] [postfa.st](https://postfa.st/blog/meta-muse-connectors-list)
  - Another tracker marks Drive as "reported, not confirmed." It says Bloomberg reported Drive, but Wang's thread names Docs, not Drive. [3P] [appsformuse](https://appsformuse.com/)
- **Drive connector limits** [3P] [usecarly](https://www.usecarly.com/blog/how-to-connect-multiple-google-drive-accounts-to-meta-muse/):
  - The built-in Drive connector holds **one Google account**.
  - The vendor's workaround is its own custom connector, which is a self-interested claim.
  - The same page relays that Google Workspace data is handled under Google's API "Limited Use" rules, per Meta's help center.
- **Permission scopes:**
  - One guide warns that the Google Slides connector requested broader Drive scopes, including editing and deleting files.
  - Meta does not publish the exact Google OAuth scopes it requests.
  - [3P] (search synthesis of the usecarly and appsformuse pages; not independently verified)
- **Drive export report:** One report describes Muse exporting files from its VM filesystem to a connected Google Drive at a user's request. Meta reportedly said it was not a breach. [3P] [windowsforum](https://windowsforum.com/news/meta-muse-lets-chat-prompts-export-vm-files-to-google-drive.445858/) (page returned 403; only the search snippet was seen)
- **Other connectors:**
  - Outlook Mail, Calendar and Contacts at launch.
  - Google Contacts, Google Tasks and Calendly from two sources.
  - Dropbox, Box, Evernote, Linear, Todoist and Slack on September 29.
  - Developer connectors: Tailscale, Railway, Replit and Vercel.
  - Roughly 58 to 60 "confirmed" connectors and 18 announced; the page's own count is inconsistent.
  - [3P] [postfa.st](https://postfa.st/blog/meta-muse-connectors-list)
- **Notion and GitHub:**
  - Named at Connect on September 23. [PRESS] [TechCrunch Sep 23](https://techcrunch.com/2026/09/23/everything-new-coming-to-metas-ai-agent-muse/)
  - Notion was named again in the September 29 announcement.
  - GitHub appeared in the in-app list by September 29. Meta does not describe what the GitHub connector does. [3P] [postfa.st](https://postfa.st/blog/meta-muse-connectors-list)
- **Zapier connector** [OFFICIAL] [Zapier blog](https://zapier.com/blog/zapier-connector-in-muse/); [Zapier .md](https://zapier.com/blog/zapier-connector-in-muse.md):
  - Added as a named connector inside Muse, announced around September 29, 2026.
  - Reaches 9,000+ apps and 40,000+ actions through hosted Zapier MCP (Streamable HTTP endpoint).
  - Muse can act only within the apps and actions the user approves. Connected apps keep their own permissions and API limits.
  - Supports one-off actions in chat. Users with **Next Gen Zaps** (separate early access) can describe a workflow and have Muse build and deploy it to Zapier, where it runs unattended.
  - Zapier states SOC 2 Type II certification. Sharing a server requires a Zapier Team or Enterprise plan.
  - The integration was described as "staged for deployment," so availability depends on Meta's rollout.
- **Zapier setup** [3P] [search synthesis citing Zapier help](https://zapier.com/blog/automate-muse/):
  1. Open Muse Settings → Connectors.
  2. Search "Zapier" and click Connect.
  3. Sign in to or create a free Zapier account.
  4. Approve access.
  - Each action can be set to Allow or Ask.
- **Zapier listing:** Zapier also lists "Meta Muse" in its app directory. [OFFICIAL] [zapier.com/apps/ai-tools/meta-muse](https://zapier.com/apps/ai-tools/meta-muse)

### Inferences
- **The most defensible way to give Muse Google Docs, Sheets and Drive read/write access today is the Zapier connector.** Zapier's standard Google Docs, Sheets and Drive actions would be enabled in the user's Zapier MCP configuration:
  - Docs: create document from text, append text, find document.
  - Sheets: lookup row, add row, update row.
  - Drive: find file, upload file, create folder.
- The exact Google actions on Zapier MCP were not listed in the Muse-specific sources. They are inferred from Zapier's general Google app catalog and should be verified.
- **Zapier free plan task caps likely apply.** Zapier MCP calls typically count against Zapier task quotas, though this was not confirmed in these sources.
- If the native Google Docs and Drive connectors are present, they likely support search/read and some writes, but there is no official capability list.
  - Expect one Google account only.
  - Expect approval prompts on every write unless the user sets "Always allow."
  - Sharing or sending is a "sensitive write" and always prompts.

### Gaps
- No official Meta document lists the native Google Drive, Docs or Sheets connector tools: read, full-text export, edit, create, or comment.
- It is unconfirmed whether the native Drive connector can read files in folders **shared with** the user ("Shared with me") or only owned files.
- The exact list of Google actions exposed through Zapier MCP inside Muse is not documented in the Muse context.

## 3. Custom connectors: can a consumer have Muse build connectors to APIs or CLIs?

### Takeaway
Yes, per third-party relays of Meta's Help Center:
- Any user can ask Muse to build a per-user custom connector to any service with an API.
- Muse writes the integration on its Linux VM and stores keys in a Secure Credentials Store.
- Meta does **not** review custom connectors.
- MCP servers are reachable by having Muse build a client (there is no "add MCP server" setting).
- OAuth-only services are clunkier.

### Cited Findings
- **Official framing:** TechCrunch reports that if a service has a public API, Muse can connect using credentials the user provides; if not, it can use the browser. [PRESS] [TechCrunch Sep 8](https://techcrunch.com/2026/09/08/meta-debuts-its-muse-ai-agent-will-consumers-trust-it/)
- **Consumers vs. developers:**
  - Consumers can ask Muse to build a custom connector for their own account for any service with an API.
  - Meta does not review custom connectors; the help center says to "grant access with caution."
  - API details go in the "Secure Credentials Store."
  - Developer directory connectors go through Meta review.
  - [3P] [cellcog](https://cellcog.ai/blog/muse-connector-platform/); [postfa.st](https://postfa.st/blog/meta-muse-connectors-list)
- **How custom connectors work** [3P, vendor; claims from its own testing] [parallel.ai](https://parallel.ai/articles/meta-muse-custom-integrations):
  - The prompt names the service, the entry point (MCP URL, OpenAPI document or CLI package) and the goal. Muse tests each capability and saves the result as a reusable "skill."
  - There is no "add MCP server" setting. Muse builds a client with the MCP SDK, usually over streamable HTTP.
  - A stdio MCP server must install on Debian via npm or pip.
  - Bearer and API-key headers fit the credential store. OAuth-only services "may still work" through Muse's browser but with "more back and forth."
  - Keys are entered through a secure prompt, not chat; pasting a key into chat leaves it in history.
  - Sentinel injects the real credential at the network boundary, so the agent holds only a surrogate token.
  - Servers on the user's laptop are unreachable, because the VM is in Meta's cloud.
  - Custom connector code runs without the extra privilege separation that built-in connectors get.
  - Custom connectors draw from the same usage meter as everything else.
  - **Muse has no public API** for driving the agent or managing connectors from outside.
- **Remote MCP with OAuth:** One developer reported on October 4 that a custom connector can target a remote MCP server with OAuth in a single prompt. postfa.st did not test this. [3P] [postfa.st](https://postfa.st/blog/meta-muse-connectors-list)
- **Composio:** Composio offers Google Docs, Calendar and Tasks, and "Google Super," as MCP toolkits for Muse custom connectors. Its marketing claims create, read, edit, format and export of Docs. [3P vendor] [composio Docs](https://composio.dev/toolkits/googledocs/framework/muse); [composio Google Super](https://composio.dev/toolkits/googlesuper/framework/muse)

### Inferences
- A consumer could have Muse build a Google Drive API connector with a service-account key or API key on its VM, or install a CLI such as `rclone` or `gdrive`.
  - Google's user-data APIs require OAuth, so a service account shared into the folder is the cleanest key-based route.
  - This is plausible given the VM and terminal, but untested in any source.
- Because the VM sits in Meta's cloud, any shared-folder workflow must use cloud APIs. Muse cannot see a locally synced Drive folder.

### Gaps
- No official Meta text was read on custom-connector limits: count, rate limits, whether OAuth flows are supported natively, and allowed outbound hosts.
- No source tested Google Drive or Sheets via a custom connector.

## 4. Memory, custom instructions and projects: can Muse always read a specific doc first?

### Takeaway
Muse has persistent memory stored as user-viewable and editable "Memory files," a Goals tab, and side chats. It works in one persistent conversation, plus personality settings for name, avatar and style. No formal "custom instructions" or "projects" feature is documented. Editing Memory files or setting a Goal is the likely mechanism for "always check doc X first."

### Cited Findings
- **Memory files and Goals** [3P] [TestingCatalog](https://www.testingcatalog.com/meta-introduces-muse-as-a-proactive-personal-agent.md):
  - Memory retains context across one persistent conversation, and users can inspect and edit Memory files.
  - A Goals tab tracks tasks and plans.
  - Side chats keep complex projects separate.
  - Users can set Muse's name, avatar and communication style. No separate custom-instructions feature is described.
- **What Muse remembers:**
  - Muse learns what matters to the user from conversations and makes unprompted suggestions. [PRESS] [TechCrunch Sep 8](https://techcrunch.com/2026/09/08/meta-debuts-its-muse-ai-agent-will-consumers-trust-it/)
  - It can act on details mentioned only once, and users can tell it to forget specific information. [3P] [fonearena](https://www.fonearena.com/blog/491913/meta-muse-personal-ai-agent-features.html/amp)
- **Data persistence after disconnect:** Disconnecting a connector may leave previously acquired context in memory or conversation history. [3P] [search synthesis of rywalker/openclawdatabase](https://rywalker.com/research/meta-muse)
- **Skills:** Custom connectors are saved as reusable "skills." [3P] [parallel.ai](https://parallel.ai/articles/meta-muse-custom-integrations)

### Inferences
- A user can likely make "Before any task in this workflow, read Google Doc X (the shared protocol doc)" stick by:
  - writing it into an editable Memory file, or
  - creating a Goal or skill for the shared-folder workflow.
- Compliance is model-driven, not guaranteed.

### Gaps
- There is no official documentation of Memory file format, size limits, or whether Memory files can reference or auto-load external documents.

## 5. Scheduled and background tasks, and file reading depth

### Takeaway
Muse is explicitly built for background, long-running, schedule- and event-driven work that continues while the app is closed. That makes polling a shared Drive folder conceptually supported. Alternatively, a Zapier Next Gen Zap (trigger: new file in folder) can run independently. How fully Muse reads Drive file contents is undocumented.

### Cited Findings
- **Background and scheduled work:**
  - Muse keeps working after the user leaves the app. [PRESS] [TechCrunch Sep 8](https://techcrunch.com/2026/09/08/meta-debuts-its-muse-ai-agent-will-consumers-trust-it/)
  - Muse handles "scheduled and event-driven tasks in the background," decides whether new results merit a notification, and lets users queue tasks. [3P] [TestingCatalog](https://www.testingcatalog.com/meta-introduces-muse-as-a-proactive-personal-agent.md)
  - It can "respond to schedules and relevant events" and return when it needs approval. [3P] [fonearena](https://www.fonearena.com/blog/491913/meta-muse-personal-ai-agent-features.html/amp)
- **Proactive messages:** Proactive messaging can be reduced, increased or disabled. [3P] [TestingCatalog](https://www.testingcatalog.com/meta-introduces-muse-as-a-proactive-personal-agent.md)
- **Glasses:** On glasses, Muse "works in the background and checks back when a task is done." [PRESS] [TechCrunch Sep 23](https://techcrunch.com/2026/09/23/everything-new-coming-to-metas-ai-agent-muse/)
- **Zapier workflows:** Workflows built via Zapier (Next Gen Zaps, early access) "keep running unattended." [OFFICIAL] [Zapier blog](https://zapier.com/blog/zapier-connector-in-muse/)
- **Approvals:** Approval gates pause critical actions such as sending email or purchases. [OFFICIAL] [muse.ai/platform/docs](https://muse.ai/platform/docs):
  - Reads and non-sensitive writes default to "Ask on first use," then ask on each use unless the user picks "Always allow."
  - Sensitive writes (send, share, publish, pay) prompt **every time**.

### Inferences
- An unattended poll-and-write loop is feasible for reads and routine edits, such as appending to a Doc or adding a Sheet row, once the user sets "Always allow."
- Any **share** action, or any action Meta classifies as sensitive, will block until a human approves. This matters for a fully autonomous Claude–Muse handoff.
- Long background tasks consume weekly tokens quickly (see section 6).

### Gaps
- No source states a cron-like scheduling UI, minimum polling interval, or reliability guarantees.
- No source states whether the native Drive or Docs connector returns full document text, truncated text or summaries, or how large files are handled.
- Via the VM, Muse could download full files and parse them with code. This is inferred, not confirmed.

## 6. Limitations, regional availability, pricing and privacy for Drive content

### Takeaway
- **Availability:** US-only adults (18+). Some business connectors are US and Canada.
- **Pricing:** A free tier with a weekly token allowance (a payment card is required), plus Power at $20/month and Maximum at $100/month.
- **Privacy:**
  - Meta says Muse data stays out of ads.
  - Third-party reports say model-training use is **on by default** (opt-out).
  - Meta can access VM data operationally until a "Confidential VM" with user-held keys ships later in 2026.

### Cited Findings
- **Pricing (press):** Free to start, with a payment card required. Power costs $20/month and Maximum $100/month. There is a usage meter, and Meta expects most users to stay free. [PRESS] [TechCrunch Sep 8](https://techcrunch.com/2026/09/08/meta-debuts-its-muse-ai-agent-will-consumers-trust-it/)
- **Pricing (TechCrunch Sep 23):** Zuckerberg said Muse is free for "a huge number of tokens," and Meta plans to monetize through transaction fees. [PRESS] [TechCrunch Sep 23](https://techcrunch.com/2026/09/23/everything-new-coming-to-metas-ai-agent-muse/)
- **Token allowances:**
  - Power gives 500M tokens/week; Max gives 3B tokens/week.
  - The free cap is unpublished, with an informal estimate of about 100M/week.
  - Billing is monthly only.
  - [3P] [openclawdatabase](https://openclawdatabase.com/meta-muse/pricing/); [layer3labs](https://www.layer3labs.io/guides/meta-muse-pricing)
- **Regions:**
  - US only at launch. [PRESS] [TechCrunch Sep 8](https://techcrunch.com/2026/09/08/meta-debuts-its-muse-ai-agent-will-consumers-trust-it/); [PBS/AP](https://www.pbs.org/newshour/nation/meta-launches-personal-ai-agent-muse-to-help-with-everyday-tasks)
  - Small-business features in the US and Canada; Dropbox and Canva connectors US and Canada only. [3P] [letsdatascience](https://letsdatascience.com/news/meta-adds-small-business-tools-to-muse-in-the-us-and-canada-dd3aac76); [postfa.st](https://postfa.st/blog/meta-muse-connectors-list)
- **Ads:** Meta says Muse does not share conversations or data with its ads systems. [PRESS] [TechCrunch Sep 8](https://techcrunch.com/2026/09/08/meta-debuts-its-muse-ai-agent-will-consumers-trust-it/)
- **Training and data access** [3P; not verified against Meta's privacy policy] [captaincompliance](https://captaincompliance.com/?p=13651); [cryptobriefing](https://cryptobriefing.com/meta-muse-ai-privacy-features/); [openclawdatabase security](https://openclawdatabase.com/meta-muse/security/):
  - Model training on Muse interactions is reportedly on by default. To opt out: Settings → Data controls → "Help improve our AI models."
  - Meta can access VM data when needed to operate, secure or support the service.
  - "Muse Confidential VM" (user-held key) is promised for later in the year.
- **Connector developer data terms** [OFFICIAL] [muse.ai/platform/docs](https://muse.ai/platform/docs):
  - Data minimization.
  - No secondary use (no selling, unrelated ads, profiling, or model training by the connector developer).
  - Encrypt in transit and at rest.
  - Report incidents within 48 hours.
- **Google data:** Google Workspace data is reportedly handled under Google's Limited Use rules. [3P] [usecarly](https://www.usecarly.com/blog/how-to-connect-multiple-google-drive-accounts-to-meta-muse/)
- **Data-solicitation concern:** WIRED reporting (via NewsBytes) found Muse repeatedly nudging users to share more personal data. [3P relay of PRESS] [NewsBytes](https://www.newsbytesapp.com/news/science/meta-s-muse-ai-repeatedly-asks-users-to-share-more-data/story)
- **Self-acknowledged weaknesses:** Meta acknowledged Muse Spark weaknesses in coding workflows and complex multistep agentic tasks compared with rival labs, at the April model launch. [PRESS] [techstrong.ai](https://techstrong.ai/articles/meta-challenges-ai-giants-with-launch-of-muse-spark-reasoning-model/)

### Inferences
- **For a shared-folder workflow with Claude:**
  - The Muse user must be a US adult.
  - Any Drive content Muse reads may be used for model training unless the user opts out.
  - Content passes through Meta's cloud VM, and also through Zapier if that route is used.
  - Sensitive docs should not go in the shared folder, or the user should disable training first.
- **Recommended practical design:**
  - Use a single dedicated Google account or folder (the native connector is limited to one account).
  - Use plain Google Docs or Sheets as the message bus.
  - Grant "Always allow" on read and append actions.
  - Avoid share and send actions, which always require approval.
  - Use Zapier as a fallback or primary route if the native Drive/Docs connector is missing in the user's account.

### Gaps
- Meta's official pricing and help pages, and its privacy policy text for Muse, were not read directly. The free-tier cap and the training default are third-party claims.
- The ship date for Confidential VM is unknown.
- International expansion plans are unknown.
