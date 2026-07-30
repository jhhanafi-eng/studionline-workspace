# STUDIONLINE Google Apps Script Standards

## Purpose

This document defines the official STUDIONLINE standard for Google Apps Script application architecture. It should be used when creating internal tools, client systems, automations, dashboards, and Google Workspace applications.

The standard is organized into three architecture levels. Developers and AI assistants should choose the lowest level that satisfies the project requirements.

## Official Architecture Levels

## Level 1: Simple Apps

### Recommended Structure

```text
Index.html
Code.gs
```

### Purpose

Use Level 1 for small, focused applications with limited logic and a narrow user workflow.

### Typical Use Cases

- Simple internal forms
- Small automation dashboards
- One-purpose utilities
- Proofs of concept that may later become formal projects
- Lightweight Google Sheets or Google Docs helpers

### File Responsibilities

#### `Index.html`

Contains the user interface for the application. For simple apps, this may include HTML, CSS, and client-side JavaScript in a single file when doing so improves clarity.

#### `Code.gs`

Contains server-side Apps Script functions, page rendering, simple handlers, and direct interactions with Google Workspace services.

### When to Use

Use Level 1 when the app is easy to understand in two files and is unlikely to require complex data access, multiple APIs, or reusable modules.

### When to Upgrade

Move to Level 2 when the project gains persistent data operations, multiple business workflows, API-like server functions, configuration needs, or repeated utilities.

## Level 2: Business Apps

### Recommended Structure

```text
Index.html
Code.gs
Database.gs
Utils.gs
API.gs
Config.gs
```

### Purpose

Use Level 2 for business applications that require clearer separation of responsibilities but do not need a full platform-style folder architecture.

### Typical Use Cases

- CRM tools
- Approval workflows
- Operational dashboards
- Client portals
- Reporting tools
- Apps connected to one or more Google Sheets
- Internal systems with several user actions

### File Responsibilities

#### `Index.html`

Contains the single-page application shell, UI markup, client-side behavior, and calls to server-side Apps Script functions.

#### `Code.gs`

Contains application entry points, web app rendering, routing bootstrap logic, and high-level orchestration.

#### `Database.gs`

Contains data access logic, spreadsheet table operations, persistence functions, query helpers, and record mapping.

#### `Utils.gs`

Contains general helper functions that are useful within the application but not necessarily reusable across the entire repository.

#### `API.gs`

Contains server-side functions intended to be called from the frontend through `google.script.run` or similar client-server boundaries.

#### `Config.gs`

Contains application constants, environment-specific settings, feature flags, spreadsheet identifiers, sheet names, and configuration accessors.

### When to Use

Use Level 2 when business logic has enough complexity that separating configuration, API handlers, utilities, and data access improves maintainability.

### When to Upgrade

Move to Level 3 when the application becomes a platform, supports multiple domains, requires shared modules, has significant frontend organization needs, or is expected to become a reusable foundation for other projects.

## Level 3: Workspace Platform

### Recommended Structure

```text
frontend/
backend/
core/
shared/
```

### Purpose

Use Level 3 for platform-level applications, reusable frameworks, and large business systems.

### Typical Use Cases

- Multi-module internal platforms
- Complex client systems
- Reusable STUDIONLINE frameworks
- Applications with shared business domains
- Systems with multiple screens, services, integrations, or deployment environments

### Folder Responsibilities

#### `frontend/`

Contains client-facing UI assets, HTML templates, CSS, client-side JavaScript, and frontend-specific documentation.

#### `backend/`

Contains application-specific server-side Apps Script modules, API functions, business services, data access, and backend orchestration.

#### `core/`

Contains reusable framework-level modules shared across the platform or across multiple projects.

#### `shared/`

Contains reusable helpers, constants, schemas, documentation fragments, and code that may be used by both frontend and backend layers when appropriate.

### When to Use

Use Level 3 when the application must scale as a maintained platform rather than a single script project.

## SPA Philosophy

STUDIONLINE prefers single-page application architecture for Apps Script web apps when a user-facing interface is required.

The SPA approach means:

- The application loads a primary HTML shell.
- User interactions happen without unnecessary full-page reloads.
- Frontend code communicates with Apps Script backend functions through explicit API-style functions.
- UI state is managed intentionally.
- Server calls are named clearly and kept narrow.

SPA architecture is preferred because it improves user experience, makes interfaces feel modern, and supports clearer separation between frontend actions and backend operations.

## `include()` Philosophy

Apps Script supports HTML templating through helper functions that include reusable HTML fragments.

STUDIONLINE uses `include()` patterns to:

- Avoid duplicated HTML, CSS, and JavaScript fragments
- Separate layout, style, and behavior when an app grows
- Keep `Index.html` readable
- Support reusable components in larger applications

The `include()` pattern should not be used to hide unclear structure. It should make the application easier to read and maintain.

## Modularization

Modularization should follow actual responsibility boundaries.

Recommended boundaries include:

- Rendering and entry points
- API handlers
- Data access
- Business rules
- Configuration
- Utilities
- Shared framework functions

Avoid splitting files only for appearance. A module should have a clear purpose and should be named after that purpose.

## Deployment Philosophy

Google Apps Script deployment should be treated as a formal engineering step.

Each deployable project should document:

- Script project ownership
- Deployment type
- Production URL or deployment reference when appropriate
- Required Google Workspace permissions
- Required triggers
- Required spreadsheet, document, or drive dependencies
- Environment-specific configuration
- Rollback expectations

Production deployments should be deliberate, versioned when practical, and supported by basic validation steps.

## Architecture Selection Rule

When creating a new Apps Script project, choose the simplest level that can support the expected lifecycle:

- Choose **Level 1** for small apps and prototypes.
- Choose **Level 2** for maintained business applications.
- Choose **Level 3** for platforms, frameworks, and complex systems.

Do not start at Level 3 unless the project has a real platform requirement.
