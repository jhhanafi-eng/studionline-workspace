# STUDIONLINE Workspace Automation Platform

The STUDIONLINE Workspace Automation Platform is the foundation for enterprise-grade internal business systems built on Google Workspace and Google Apps Script. This repository is designed to host multiple Apps Script Single Page Applications (SPAs), reusable modules, shared assets, templates, documentation, and automation projects under one maintainable architecture.

This repository currently contains architecture scaffolding only. Application logic, frontend UI, backend workflows, and business rules are intentionally out of scope for this initialization phase.

## Project Vision

STUDIONLINE aims to create a scalable automation platform that standardizes how business applications are designed, built, deployed, and maintained across Google Workspace. The platform will support internal productivity, client operations, sales workflows, document generation, approvals, reporting, and future AI-assisted automations.

The long-term vision is to provide:

- A unified repository for Google Apps Script SPAs and Workspace automation projects.
- Shared standards for authentication, data access, routing, services, utilities, and UI foundations.
- Reusable modules that reduce duplicated engineering effort across applications.
- Clear documentation and templates for consistent delivery.
- A maintainable architecture suitable for enterprise growth and cross-team collaboration.

## Architecture Overview

The platform follows clean architecture principles by separating application-specific concerns from shared foundations and reusable modules.

- **Applications** live in `apps/` and represent standalone Google Apps Script SPAs or business tools.
- **Core platform foundations** live in `core/` and will define cross-cutting capabilities such as authentication, database access, routing, services, utilities, and UI primitives.
- **Shared resources** live in `shared/` and are intended for common constants, contracts, configuration patterns, or cross-application references.
- **Reusable feature modules** live in `modules/` and are reserved for independently maintainable automation capabilities.
- **Templates** live in `templates/` and will support repeatable project setup, Apps Script manifests, deployment documentation, and implementation standards.
- **Documentation** lives in `docs/` and captures architecture decisions, engineering processes, and operational guidance.
- **Assets** live in `assets/` and centralize static resources such as brand references, diagrams, and exported design artifacts.
- **Scripts** live in `scripts/` and are reserved for repository tooling, validation, build helpers, and deployment automation.

## Folder Structure

```text
core/
  auth/
  database/
  routing/
  services/
  utilities/
  ui/
apps/
  dashboard/
  crm/
  proposal/
  invoice/
  contract/
  approval-workflow/
  client-portal/
shared/
modules/
templates/
docs/
assets/
scripts/
```

## Development Workflow

1. **Plan the capability** before implementation and identify whether it belongs in an application, core foundation, shared resource, or reusable module.
2. **Document architecture decisions** in `docs/` when introducing major patterns, integrations, deployment processes, or platform conventions.
3. **Keep application code isolated** inside the relevant `apps/<application>/` directory.
4. **Promote reusable behavior intentionally** into `core/`, `shared/`, or `modules/` only after the abstraction is stable and broadly useful.
5. **Review Apps Script deployment impact** before changing manifests, triggers, scopes, or integrations.
6. **Validate changes locally** with the repository tooling that will be added under `scripts/`.
7. **Use pull requests** for all platform changes so architecture, security, and maintainability can be reviewed.

## Coding Standards

Future implementation work should follow these standards:

- Prefer small, focused files with clear responsibilities.
- Separate business rules from platform infrastructure.
- Avoid duplicating logic across applications.
- Keep Google Workspace service integrations behind well-defined service boundaries.
- Use explicit naming for functions, modules, configuration, and deployment artifacts.
- Document public module contracts and application setup requirements.
- Treat Apps Script scopes, triggers, and external integrations as security-sensitive changes.
- Avoid committing secrets, credentials, generated build output, or environment-specific configuration.

## Naming Convention

- Use lowercase kebab-case for directories: `approval-workflow`, `client-portal`.
- Use descriptive module names that reflect business or platform capabilities.
- Use consistent Google Apps Script project naming in the format `studionline-<app-or-module-name>` when projects are created.
- Use clear documentation filenames such as `architecture.md`, `deployment.md`, and `security.md`.
- Reserve generic names such as `utils` or `helpers` for narrowly scoped local use; prefer domain-specific names whenever possible.

## Roadmap

- Establish Apps Script project templates and deployment conventions.
- Define platform architecture decision records and documentation standards.
- Introduce shared authentication, authorization, and session-management patterns.
- Define database access patterns for Google Sheets, Drive, and future external data stores.
- Standardize SPA routing, layouts, and UI composition guidelines.
- Add reusable automation modules for proposals, invoices, contracts, approvals, and CRM operations.
- Add CI validation, linting, formatting, and release workflows.
- Create operational runbooks for Workspace permissions, Apps Script quotas, and production support.

## Contribution Guidelines

- Keep changes aligned with the platform architecture and folder responsibilities.
- Do not introduce application logic into scaffolding or documentation-only directories.
- Include documentation updates with architectural or workflow changes.
- Keep pull requests focused and easy to review.
- Describe Apps Script scopes, triggers, external services, and data-access changes clearly in pull requests.
- Follow established naming conventions and coding standards.
- Seek architectural review before adding new top-level directories or cross-cutting platform abstractions.
