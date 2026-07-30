# Client Project Guide

Client projects are isolated applications built with reusable framework modules.

## Lifecycle
1. Discovery: goals, users, data, integrations, risks, and success criteria.
2. Planning: scope, architecture, module selection, timeline, and acceptance criteria.
3. Development: implementation within the approved project structure.
4. Testing: functional, permissions, data, quota, and deployment validation.
5. Deployment: release notes, production configuration, and rollback plan.
6. Maintenance: support, monitoring, fixes, and version updates.
7. Archive: final export, documentation, ownership notes, and inactive status.

## Storage
Client projects are stored under `apps/client-projects/` with status folders:
- `active/` for current engagements.
- `completed/` for delivered projects under maintenance or reference.
- `archived/` for inactive projects retained for history.

Client-specific logic must not be promoted into framework modules without generalization and documentation.
