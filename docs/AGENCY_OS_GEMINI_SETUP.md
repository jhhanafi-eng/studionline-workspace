# Agency OS: Gemini Gateway & Worker Setup

## Configuration decision

- Provider: Gemini Developer API.
- Default model: `gemini-3.5-flash-lite`.
- Cost mode: low, minimal thinking, temperature 0.2, default maximum output 1,400 tokens.
- Default daily execution cap: 30 AI task runs.
- Worker interval: every 5 minutes, one task per invocation.
- Safe mode: workers paused until the owner explicitly enables them.
- External actions: disabled. The Social Distribution agent can prepare a manifest only.

The model is configurable through Apps Script Script Properties. Check the current Gemini model catalogue and pricing before changing model IDs or enabling paid usage.

## Files to add to the Apps Script project

- `Code.gs`
- `AgentGateway.gs`
- `WorkerService.gs`
- `Index.html`
- `appsscript.json` (enable manifest file visibility in Apps Script project settings before replacing it)

All server-side `.gs` files belong to the same Apps Script project namespace. Do not wrap them in modules or duplicate global constant names.

## Initial setup

1. Create a new Apps Script project owned by the STUDIONLINE Google account.
2. Add the files listed above from this directory.
3. Enable **Show appsscript.json manifest file** in Project Settings and apply the supplied manifest.
4. Run `setupAgencyOS()` once from the Apps Script editor.
5. Review the permissions and authorize spreadsheet access.
6. Open **Project Settings → Script Properties** and add:
   - Property: `GEMINI_API_KEY`
   - Value: your private Gemini API key
7. Keep the key out of GitHub, Sheets, browser HTML, logs, screenshots, and chat.
8. Optionally set:
   - `AGENCY_OS_MODEL` = `gemini-3.5-flash-lite`
   - `AGENCY_OS_MAX_OUTPUT_TOKENS` = `1400`
   - `AGENCY_OS_MAX_DAILY_RUNS` = `30`
9. Run `testGeminiConnection()` manually. Confirm it returns `ok: true`.
10. Deploy as a Web App with **Execute as: Me** and **Who has access: Only myself** for the first test.
11. Open the deployment URL and create a test workflow using non-sensitive test content.
12. Only after reviewing the test output, run `enableAgencyWorkers()` to install the five-minute trigger.
13. To stop all worker activity, run `pauseAgencyWorkers()`.

## How the workflow behaves

- The owner submits one objective through the dashboard.
- A Research & Strategy task is added to the queue.
- The worker claims one eligible task using a lock and lease.
- Gemini returns a JSON deliverable and may propose the next internal department task.
- The worker stores the result, AgentRuns record, and AuditLog event.
- If a next task is proposed, it is queued as a child task in the same workspace.
- When Approval Manager runs, the task changes to `WAITING_APPROVAL` and the workflow pauses.
- The owner must approve or reject the exact stored output in the Approval Inbox.
- Approval may enqueue the next internal step. It does not authorize publishing, messaging, ad spend, or live account changes.
- Social Distribution prepares a publishing manifest only. No platform publishing adapter is active in this MVP.

## Cost and quota controls

- The worker is paused by default.
- The default daily limit is 30 AI calls. Adjust only after reviewing actual API usage.
- Output tokens are capped by default at 1,400.
- The worker processes one task per five-minute trigger invocation.
- Retries are bounded to three attempts with exponential backoff.
- The task queue is resumable; expired leases are returned to the retry queue.
- No search grounding, image generation, video generation, or other paid tools are enabled in this gateway.

## Data privacy warning

The gateway sends task descriptions, selected workspace brand context, and task input to the Gemini API. Minimize and redact personal data, credentials, customer records, and confidential client information before using it.

Google's Gemini API pricing documentation distinguishes free and paid data-use terms. Do not send confidential client information through a free tier unless the applicable terms and your client agreement explicitly permit it. For sensitive client workloads, use an approved paid/API data-processing arrangement and a separate client workspace with least-privilege context.

## Operational limitations

- Apps Script is trigger-driven, not an always-on server. A five-minute trigger is a polling cadence, not a real-time guarantee.
- Google Sheets is an MVP store. It is not a high-throughput multi-tenant database.
- A task can only be autonomous to the extent that its required APIs and permissions are connected.
- Research agents do not have web search in this build. If fresh external research is required, the agent must flag the missing source/tool rather than invent findings.
- No automatic publishing, direct messages, email outreach, payments, or ad-spend actions are implemented.
- The source has not been deployed or runtime-tested in the owner's Google account. Complete the test plan before enabling live workflows.
