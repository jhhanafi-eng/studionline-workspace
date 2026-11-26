# Agency OS MVP Test Plan

**Version:** 0.1  
**Status:** Test cases defined; not yet executed against a deployed Apps Script project.

## Preconditions

- Create an Apps Script project from `apps/agency-os/`.
- Set the manifest and add the `Code.gs` and `Index.html` files.
- Run `setupAgencyOS()` manually as the owner and grant the requested Sheets permission.
- Deploy a test web app with access restricted to the owner.

## Test cases

| ID | Scenario | Expected result |
|---|---|---|
| AOS-001 | Run setup for the first time | Spreadsheet is created; Workspaces, Tasks, AuditLog tabs and headers exist; STUDIONLINE owner workspace is seeded. |
| AOS-002 | Run setup a second time | Existing database is reused; no duplicate STUDIONLINE workspace is created. |
| AOS-003 | Load dashboard | Workspace selector loads; dashboard displays task counts and safe-mode integration status. |
| AOS-004 | Create a task with valid department | Task is stored as QUEUED with lifecycle IDEA; audit event is written. |
| AOS-005 | Create a task with missing title | Request is rejected with a validation error. |
| AOS-006 | Create a task with unknown department | Request is rejected; no task row is created. |
| AOS-007 | Request dashboard with unknown workspace ID | Request is rejected; no cross-workspace task data is returned. |
| AOS-008 | Create a CLIENT workspace through the server API | Workspace is stored with a distinct ID and client type. |
| AOS-009 | Switch workspace in dashboard | Only tasks for the selected workspace are shown. |
| AOS-010 | Inspect client-side rendering with HTML/script-like task title | Title is rendered as text, not interpreted as HTML. |
| AOS-011 | Open web app before setup | UI displays setup instructions; no data mutation occurs. |
| AOS-012 | Inspect external-action controls | No publishing, messaging, spending or campaign mutation controls exist in safe mode. |

## Release gates

- All AOS-001 through AOS-012 pass in a deployed test project.
- No secrets are present in source, spreadsheet cells, browser code, or logs.
- Workspace isolation tests pass using at least one owner and two client workspaces.
- Manual review confirms manifest access is owner-only.
- AI gateway and worker remain disabled until provider credentials, quotas, structured-output validation, retry policy, and pause controls are implemented.

## Current test evidence

No deployed Apps Script project was available to execute these tests during initial scaffolding. The code has been committed to a development branch only. Do not label this build tested or production-ready.


## Additional Gemini worker and workflow test cases

| ID | Scenario | Expected result |
|---|---|---|
| AOS-013 | Run setup after adding the new schema columns to an existing database | Missing columns and AgentRuns/Approvals tabs are added; existing data remains intact. |
| AOS-014 | Run worker with workers paused | Worker exits without calling Gemini or changing queued tasks. |
| AOS-015 | Run worker without GEMINI_API_KEY | Worker pauses and reports a configuration error; no external action occurs. |
| AOS-016 | Submit a workflow objective | A Research & Strategy task is created with a workflow ID and workspace scope. |
| AOS-017 | Gemini returns valid structured JSON | Task output, AgentRuns and AuditLog are stored; a valid next task is queued if proposed. |
| AOS-018 | Gemini returns malformed JSON or an unsupported department | Task is retried with bounded backoff; no unsupported follow-up task is created. |
| AOS-019 | Worker invocation is interrupted and lease expires | Task is recovered to RETRY_WAIT and can be claimed again. |
| AOS-020 | Daily run cap is reached | New work is not executed; worker trigger is paused; claimed task is returned to QUEUED. |
| AOS-021 | Approval Manager completes a task | Task changes to WAITING_APPROVAL and no next task is queued. |
| AOS-022 | Owner approves an exact waiting task | Approval record stores a SHA-256 hash of the exact output and the next internal task is queued. |
| AOS-023 | Owner rejects an exact waiting task | Task becomes REJECTED and the workflow does not advance. |
| AOS-024 | Model proposes a skipped or out-of-order workflow department | Workflow engine rejects the route and writes an audit event. |
| AOS-025 | Model proposes a repeated next step | Idempotency check prevents duplicate child task creation. |
| AOS-026 | Social Distribution agent runs | It prepares a manifest only; no publishing, messaging or scheduling side effect is possible. |
| AOS-027 | Dashboard opens Approval Inbox | Only WAITING_APPROVAL tasks from the active workspace are displayed. |

These are defined acceptance tests only. They have not been executed in the owner's Apps Script environment.
