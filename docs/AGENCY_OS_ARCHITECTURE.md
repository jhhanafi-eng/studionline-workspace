# Karyawan Agency STUDIONLINE OS
## Hybrid Autonomous Agency Operating System

**Document status:** Architecture draft v0.1  
**Date:** 2026-11-26  
**Target workspace:** STUDIONLINE (owner brand)  
**Operating mode:** Hybrid  
**Autonomy mode:** Autonomous for internal/reversible work; guarded approval for consequential external actions.

## 1. Product definition

Karyawan Agency STUDIONLINE OS is an operational system, not a collection of chat personas. The owner defines an objective. The system converts it into a campaign/project, decomposes it into tasks, assigns department agents, runs eligible tasks, validates outputs, stores artifacts and audit events, and advances work through a controlled lifecycle.

The owner operates as Founder/CEO through a central dashboard. AI departments act as virtual employees with explicit roles, permissions, input/output contracts, and measurable task states.

## 2. Architecture decision

### MVP stack

- **Control plane / web app:** Google Apps Script Web App with an HTML/CSS/JS single-page interface.
- **Workflow orchestrator:** Apps Script services and time-driven triggers. A worker claims queued tasks, runs one bounded unit of work, persists its result, and schedules/continues subsequent work.
- **Operational database:** Google Sheets as the MVP relational-like store, accessed only through repository/service functions. Keep IDs, schema versions, timestamps, and workspace IDs on every record.
- **Asset storage:** Google Drive folders partitioned by workspace and project. Store metadata in the database; store binary files in Drive.
- **AI model gateway:** Provider adapter. Gemini is the initial candidate for Google-native integration, but model/provider is configurable and must not be hard-coded into business logic.
- **Secrets:** Apps Script Properties / managed secret storage. Never commit API keys, OAuth tokens, passwords, or customer secrets.
- **External integrations:** Connector adapters for Canva, social platforms, email, and analytics. Integrations are added incrementally and must declare scopes and capabilities.
- **Source control:** This repository. Development branch and pull request before production deployment.

### Logical flow

`Owner → Dashboard/API → Workflow Orchestrator → Task Queue → Department Agent → QC/Policy Gate → Next Task`

Persistence is shared through workspace-scoped repositories. Every task execution writes an audit event. External side effects go through a separate action gateway and require an exact approval record.

### Runtime constraints

Apps Script is a trigger-driven serverless runtime, not an always-on process. The system must use short, resumable jobs, leases, idempotency keys, retry/backoff, and checkpointing. It must respect execution quotas and trigger limits. A worker must never assume that one invocation can finish an entire campaign.

## 3. Department agents

1. Research & Strategy: evidence collection, audience/problem analysis, competitor research, opportunity scoring.
2. Content Planner: calendar and platform-specific content plans.
3. Scriptwriter: scripts, hooks, voice-over, captions, CTA and shot timing.
4. Creative Production: production briefs, prompts, image/video generation requests and asset manifests.
5. Quality Control: evidence-based content and platform QA; PASS / REVISE / BLOCK.
6. Approval Manager: exact-version review packets and approval records.
7. Social Distribution: destination-specific publishing manifests and approved publishing actions.
8. Performance Analytics: collect authorized metrics, compare periods and recommend experiments.

Agents are task executors, not independent unrestricted identities. Each agent receives only the minimum workspace/project context required for its task.

## 4. Workspace isolation

- `STUDIONLINE` is the owner brand workspace.
- Each client gets a separate workspace ID, Drive root, brand brief, connected-account registry, and access policy.
- Every business record must include `workspace_id`.
- Repository queries must require a workspace scope; no unscoped client-data query is allowed.
- Cross-workspace copy/move is disabled by default. Any deliberate export requires owner authorization and an audit event.
- Client assets, credentials, audience data, unpublished content, and strategy must never enter the STUDIONLINE workspace.

## 5. Core data model

MVP tables (Google Sheets tabs initially):

- `Workspaces`: workspace_id, name, type, status, timezone, brand_brief_json, created_at, updated_at.
- `Projects`: project_id, workspace_id, name, objective, owner, status, start_at, due_at, metadata_json.
- `Campaigns`: campaign_id, workspace_id, project_id, name, objective, audience, offer, channels_json, status.
- `Tasks`: task_id, workspace_id, project_id, campaign_id, parent_task_id, department, task_type, title, instructions, input_json, output_json, status, priority, attempt_count, max_attempts, run_after, lease_until, idempotency_key, created_at, updated_at.
- `Assets`: asset_id, workspace_id, project_id, task_id, file_name, mime_type, drive_file_id, version, status, metadata_json, created_at.
- `Approvals`: approval_id, workspace_id, task_id, asset_id, version, action_type, destination, payload_hash, decision, decided_by, decided_at, expires_at.
- `Integrations`: integration_id, workspace_id, provider, account_label, status, scopes_json, secret_reference, capabilities_json.
- `Metrics`: metric_id, workspace_id, campaign_id, content_id, platform, metric_name, metric_value, period_start, period_end, source_ref, collected_at.
- `AuditLog`: event_id, workspace_id, actor_type, actor_id, event_type, entity_type, entity_id, details_json, created_at.
- `SystemConfig`: key, value, updated_at. Secrets must not be stored in plain cells.

Use generated opaque IDs, ISO timestamps in UTC, and an explicit IANA timezone on schedules.

## 6. Task lifecycle

Content tasks follow the agency lifecycle:

`IDEA → RESEARCHED → PLANNED → SCRIPT_DRAFT → PRODUCTION_BRIEF → ASSET_READY → QC_REVIEW → QC_PASSED → PENDING_APPROVAL → APPROVED → SCHEDULED → PUBLISHED → PERFORMANCE_REVIEW`

Alternative transitions: `REVISION_REQUIRED`, `REJECTED`, `BLOCKED`, `CANCELLED`, `FAILED`.

Operational tasks may use `QUEUED`, `CLAIMED`, `RUNNING`, `WAITING_DEPENDENCY`, `RETRY_WAIT`, `SUCCEEDED`, `FAILED`, `CANCELLED`. Store both operational execution status and business lifecycle status where needed.

Transitions must be validated centrally. No department may skip QC or fabricate a later state. A platform variant has its own approval and publication state.

## 7. Autonomy and approval policy

### Autonomous without per-task approval
- Research and summarization.
- Draft strategy, calendars, scripts, prompts, and production briefs.
- Internal asset generation where the user has enabled the relevant provider and budget limits.
- QC, revision suggestions, internal task routing, status updates, analytics on authorized data.
- Retry of safe/idempotent internal operations within configured limits.

### Approval required
- Publishing or scheduling public content.
- Sending emails, DMs, customer messages, or outreach.
- Spending money, buying media, subscriptions, or credits.
- Deleting or overwriting production assets/data.
- Changing live campaigns, account settings, or permissions.
- Exporting client data or moving information across workspaces.

Approval is bound to the exact workspace, action, platform/account, media/file version, caption/payload hash, destination, and execution time. Any change invalidates approval. Silence is never approval.

## 8. Orchestration rules

1. A goal intake creates a project/campaign and a task graph.
2. The planner validates required inputs and creates tasks with dependencies.
3. The dispatcher selects eligible tasks by priority, due time, and workspace policy.
4. A worker claims a task with a lease and idempotency key.
5. The agent receives a scoped context packet and returns structured output plus evidence/asset references.
6. Output schema and workspace scope are validated before persistence.
7. QC runs as a separate task; failed checks create revision tasks or block the pipeline.
8. Eligible next tasks are queued automatically.
9. Consequential actions are routed to the approval inbox, not executed.
10. Every transition, tool call outcome, retry, approval, and error is written to AuditLog.

## 9. Reliability and security requirements

- Use LockService for critical queue claims and schema migrations.
- Use lease expiration to recover abandoned tasks.
- Use exponential backoff with jitter and a bounded max-attempt count.
- Make writes idempotent; duplicate trigger executions must not duplicate external actions.
- Validate all input, output, workspace IDs, destination IDs, and payload hashes.
- Enforce least-privilege integration scopes and workspace access checks.
- Do not store API keys in source files, Sheets, logs, or client-side HTML.
- Redact secrets and personal data from logs.
- Provide an emergency pause switch for all workers and a separate kill switch for each integration.
- Record model/provider, model version, prompt/template version, usage/cost estimate, and result reference for agent runs.
- Apply retention and deletion policies to client data and generated assets.

## 10. MVP build sequence

### Phase 0: Foundation
- Apps Script project scaffold and manifest.
- Workspace-scoped repositories and schema initializer.
- Dashboard shell and workspace switcher.
- Task queue, worker lease, audit log, retry and pause controls.

### Phase 1: First autonomous workflow
- Goal intake for one campaign.
- Task graph generation.
- Research → Planner → Scriptwriter → Production Brief → QC.
- Approval inbox with exact-version payload.
- Manual asset upload and asset registry.

### Phase 2: AI gateway and production
- Provider adapter and structured-output validation.
- Gemini adapter as first provider if credentials/quotas are available.
- Canva/image/video production adapters as separately enabled capabilities.
- Budget and rate limits.

### Phase 3: Distribution and analytics
- Platform account connection and permission checks.
- Per-platform publishing manifest.
- Approval-gated scheduling/publishing.
- Authorized performance metric ingestion and reports.

### Phase 4: Scale and client workspaces
- Stronger database (Cloud SQL/Firestore) if Sheets limits are reached.
- Workspace-level roles and audit review.
- Client portal and tenant-level billing/usage controls.

## 11. MVP acceptance criteria

- Create and switch between STUDIONLINE and client workspaces without data leakage.
- Create a campaign from one owner goal.
- Generate a dependency-aware task graph.
- Worker claims and executes tasks in bounded resumable jobs.
- Failed tasks retry safely and eventually reach FAILED without infinite loops.
- A pause switch stops new work.
- QC can PASS, REVISE, or BLOCK and prevents invalid transitions.
- Approval is bound to an immutable exact-version payload.
- External action gateway refuses unapproved actions.
- Dashboard shows task state, department, owner, errors, due date, and next action.
- Audit log can reconstruct every state transition.
- No claim of deployment or external integration until verified in the live environment.

## 12. Known limitations and open implementation dependencies

- Apps Script and Google Sheets are suitable for a low-cost MVP, not unlimited high-throughput multi-tenant execution.
- True autonomous AI execution requires an enabled model API, configured secrets, quota/budget policy, and structured-output tests.
- Social publishing requires platform-specific developer access, permissions, and approved integrations.
- Canva and video generation require connected accounts and supported API capabilities.
- Production deployment, trigger installation, OAuth scopes, and data store initialization must be completed in the owner's Google account.
