# STUDIONLINE GAS Framework Blueprint: Service Layer

## Purpose
Business-use-case orchestration boundary without business implementations. This document defines architecture only; it does not provide implementation code, HTML, Apps Script source, or business application behavior.

## Responsibilities
- Define the stable reusable contract for future Google Apps Script projects.
- Support HTML Service SPA applications, Code.gs entry points, Google Workspace APIs, Google Sheets persistence, Drive, Gmail, Calendar, Docs, Forms, external REST APIs, AI integrations, and enterprise internal systems through boundaries.
- Document public interfaces, private implementation areas, dependencies, constraints, and extension points.
- Prevent framework code from becoming product-specific or client-specific.

## Folder Location
Recommended folder: `core/services/`

## Files
- `ServiceRegistry.gs`
- `ServiceContract.gs`
- `ServiceResult.gs`

## Public Functions
Public functions are architectural contracts, not generated code:
- `ServiceLayerService.initialize(context)` for module startup when applicable.
- `ServiceLayerService.validate(input)` for contract validation when applicable.
- `ServiceLayerService.execute(request)` for the module's primary operation when applicable.
- `ServiceLayerService.describe()` for metadata, version, dependency, and capability reporting.

## Private Functions
Private functions must remain file-local or module-local and are not stable contracts:
- Normalize raw inputs before validation.
- Translate Apps Script or Google service responses into framework result objects.
- Build internal keys, projections, filters, request metadata, or rendering metadata.
- Handle adapter-specific retries, fallback paths, and cleanup.

## Dependencies
- Validation, Logger, Database, API Client.
- Dependencies must be declared in the module document before implementation.
- Dependencies may point to lower-level contracts only; no dependency may point to client applications.

## Example Usage
A future application bootstrap loads configuration, resolves the authenticated session, asks the router for the requested route, invokes a service contract, validates input, accesses persistence through the database boundary, writes structured logs, and returns a UI-safe result envelope. This is a sequence contract, not implementation code.

## Future Extensions
- Alternate persistence adapters such as Firestore, Cloud SQL, BigQuery, or enterprise data gateways.
- Additional Google Workspace adapters for Drive, Gmail, Calendar, Docs, and Forms.
- AI service adapters with policy controls, audit logging, prompt templates, and redaction.
- Enterprise SSO, role mapping, managed secrets, and administrative observability.

## Best Practices
- Keep the module generic, reusable, documented, and independently testable.
- Prefer explicit contracts over implicit global state.
- Return safe result envelopes instead of raw service objects.
- Version public contracts and document migrations.

## Architecture Rules
- **Single Responsibility:** each module owns one framework capability and delegates unrelated work through public contracts.
- **Dependency Direction:** application composition may depend on core contracts; core modules never depend on application, client, or business modules.
- **Layer Separation:** UI, service orchestration, persistence, external APIs, and utilities stay in separate layers.
- **Module Isolation:** private helpers are not imported across module boundaries.
- **No Circular Dependencies:** dependency cycles are release blockers and must be resolved by extracting shared contracts.
- **Shared Utilities:** only deterministic, side-effect-free logic belongs in helpers or utilities.
- **Error Boundaries:** module entry points translate internal failures into framework error results.
- **Service Contracts:** services accept validated DTO-style inputs and return stable result envelopes.
- **UI Contracts:** the frontend calls documented server actions only and never assumes storage internals.
- **Authentication Boundaries:** identity and permission checks happen before protected route, service, database, or API work.
- **Database Boundaries:** business modules use repositories or database contracts, not raw spreadsheet ranges.
- **API Boundaries:** external systems are reached through the API Client contract, not direct UrlFetch calls from application logic.

## Google Apps Script Limitations
- Runtime quotas, execution time limits, concurrent execution behavior, and service-specific limits must be assumed.
- HTML Service has a client/server boundary; server calls are asynchronous from the browser.
- Apps Script has no native package manager in deployed scripts, so file organization and naming are part of architecture.
- Spreadsheet operations are slow when performed cell-by-cell; batch reads and writes are required.
- Simple triggers and installable triggers have different authorization contexts.

## Performance Considerations
- Batch Google Workspace calls and avoid repeated service lookups inside loops.
- Cache configuration, route metadata, schema metadata, and external lookup results where safe.
- Keep public functions small enough to complete within Apps Script execution windows.
- Prefer immutable DTOs and explicit projections to oversized spreadsheet reads.

## Security Considerations
- Never expose secrets, tokens, spreadsheet IDs, or internal system identifiers to HTML templates.
- Validate and sanitize every browser-originated payload before service execution.
- Apply least-privilege OAuth scopes and document every required scope.
- Use Properties Service or a managed secret store pattern for environment configuration.
- Log correlation IDs and safe metadata; do not log sensitive payloads.

## Testing Strategy
- Unit-test deterministic helpers and validators outside Apps Script where possible.
- Contract-test service, router, database, cache, and API client interfaces with fake adapters.
- Use integration tests for Google service adapters in a controlled test workspace.
- Maintain deployment smoke checks for startup, route resolution, authorization, and logging.

## Deployment Notes
- Deploy framework changes as versioned releases before adopting them in applications.
- Record required OAuth scopes, script properties, triggers, and spreadsheet schema migrations.
- Keep rollback notes for any contract or storage change.
- Never deploy undocumented breaking changes to shared framework modules.
