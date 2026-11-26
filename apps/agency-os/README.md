# Karyawan Agency STUDIONLINE OS

Hybrid autonomous AI agency operations console.

## Current implementation status

**Source foundation available on a development branch. Not deployed or runtime-tested yet.**

Read:
- [Architecture](../../docs/AGENCY_OS_ARCHITECTURE.md)
- [Gemini and worker setup](../../docs/AGENCY_OS_GEMINI_SETUP.md)
- [MVP test plan](../../docs/AGENCY_OS_MVP_TEST_PLAN.md)

## Current source files

```text
apps/agency-os/
  appsscript.json
  Code.gs
  AgentGateway.gs
  WorkerService.gs
  Index.html
  README.md
```

## Implemented in this branch

- Google Apps Script Web App dashboard shell.
- Workspace registry with STUDIONLINE owner workspace seed.
- Workspace-scoped task intake and workflow goal intake.
- Google Sheets schema bootstrap with additive header migration.
- Task queue with lock-based claim, lease expiry recovery, retry/backoff and daily AI-run cap.
- Gemini Developer API gateway using configurable low-cost model `gemini-3.5-flash-lite`.
- Structured JSON agent response contract and eight department role prompts.
- AgentRuns and AuditLog records.
- Approval Manager pause state and owner Approval Inbox with approve/reject controls.
- Worker trigger installation and emergency pause functions.
- External actions remain disabled.

## Setup

Follow [AGENCY_OS_GEMINI_SETUP.md](../../docs/AGENCY_OS_GEMINI_SETUP.md). Never commit API keys or store them in Sheets or client-side HTML.

## Important

This is not a deployed or verified production system. The owner must create the Apps Script project, authorize it, add the Gemini key to Script Properties, test the connection, deploy privately, run the test plan, and explicitly enable workers. Social publishing, messages, spending and campaign mutations are not implemented.
