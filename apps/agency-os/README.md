# Karyawan Agency STUDIONLINE OS

Hybrid autonomous AI agency operations console.

## Current status

**Architecture draft / implementation foundation.** This directory is reserved for the Apps Script Web App implementation. The application is not deployed and no Google account data has been initialized yet.

Read [the architecture decision](../../docs/AGENCY_OS_ARCHITECTURE.md) before implementation.

## MVP implementation target

- Google Apps Script Web App (HTML Service SPA).
- Google Sheets as the initial operational store.
- Google Drive for workspace-scoped assets.
- Trigger-driven, resumable task workers.
- Provider-neutral AI gateway; first provider selected during integration setup.
- Workspace-scoped dashboard, task queue, approvals, audit log and integration status.

## Planned source layout

```text
apps/agency-os/
  appsscript.json
  Code.gs
  Index.html
  README.md
  services/
    Database.gs
    WorkspaceService.gs
    TaskService.gs
    WorkerService.gs
    AgentGateway.gs
    ApprovalService.gs
    AuditService.gs
```

The implementation should start with the smallest vertical slice: bootstrap database, create/switch workspace, create tasks, show task status, and write audit events. AI execution and external integrations are separate phases.

## Setup prerequisites

1. A Google account that owns the Apps Script deployment and operational spreadsheet.
2. An Apps Script project created from this source.
3. Explicit owner authorization for spreadsheet/Drive access and time-driven triggers.
4. A model provider API key stored in Script Properties before enabling AI workers.
5. Separate OAuth/developer setup for any social publishing integration.

Never paste credentials into source files or chat. The application must start in safe mode with external actions disabled.
