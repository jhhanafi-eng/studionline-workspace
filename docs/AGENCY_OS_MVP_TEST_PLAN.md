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
