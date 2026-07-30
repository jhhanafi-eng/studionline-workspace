# STUDIONLINE Engineering Architecture

## Purpose

This document defines the long-term engineering architecture for the STUDIONLINE workspace. The repository is intended to support internal products, reusable frameworks, client projects, experiments, and delivery assets built primarily with Google Apps Script and Google Workspace technologies.

The goal is to keep the workspace professional, maintainable, reusable, and understandable for both human engineers and AI assistants.

## Engineering Philosophy

STUDIONLINE engineering is based on the following principles:

- **Clarity before cleverness**: Code, folders, and documentation should be easy to understand before they are optimized for abstraction.
- **Reusable foundations**: Shared utilities, templates, and conventions should reduce repeated work across projects.
- **Business-first architecture**: Engineering decisions should support reliable business workflows, automation, client delivery, and maintainable operations.
- **Small systems that can grow**: Projects should start with the simplest architecture that fits the current scope while leaving room for future modularization.
- **Documentation as infrastructure**: Engineering documentation is part of the product. It must be maintained with the same care as source code.
- **AI-compatible development**: Repository structure, naming, and documentation should make it safe and efficient for AI tools to assist without inventing architecture.

## Repository Architecture

This repository is the official engineering workspace for STUDIONLINE. It may contain multiple categories of work over time:

- Internal STUDIONLINE products
- Reusable Google Apps Script frameworks
- Starter templates
- Client projects
- Shared utilities
- Documentation
- Architecture decisions
- Deployment notes

The repository should avoid becoming a loose collection of unrelated scripts. Every project should have a clear location, purpose, owner, and documentation trail.

## Folder Responsibilities

The following folder responsibilities should guide future repository growth.

### `/docs`

Contains permanent engineering documentation, architecture standards, decision records, AI context, and project creation guidance.

Documents in this folder are considered authoritative unless superseded by a more specific document in a project folder.

### `/templates`

Reserved for starter templates and reusable project skeletons.

Templates should represent approved STUDIONLINE architecture patterns, not experimental structures. A template should include minimal working files, documentation placeholders, and clear usage guidance.

### `/core`

Reserved for reusable framework-level modules that are owned by STUDIONLINE and may be shared across multiple products or client projects.

Core modules should be stable, well-documented, and intentionally versioned or tracked through change history.

### `/shared`

Reserved for shared utilities, helper functions, configuration patterns, documentation fragments, and integration helpers that are reusable but not necessarily framework-level.

Shared modules should remain generic and should not contain client-specific business rules.

### `/products`

Reserved for STUDIONLINE-owned internal or commercial products.

Each product should have its own project folder, README, architecture notes, deployment information, and ownership information.

### `/clients`

Reserved for client-specific projects and implementations.

Client folders should isolate client business logic, credentials guidance, deployment notes, and project-specific documentation. Reusable code discovered in client projects should be extracted into `/shared`, `/core`, or `/templates` only after review.

### `/experiments`

Reserved for prototypes, proofs of concept, and technical evaluations.

Experimental work should not be treated as production-ready. If an experiment becomes reusable or production-grade, it should be promoted into the appropriate formal folder.

## Core Modules

Core modules are the foundation of reusable STUDIONLINE engineering. They should represent stable capabilities such as:

- Application bootstrapping
- Configuration loading
- Logging
- Error handling
- Data access abstractions
- Google Workspace service wrappers
- API response formatting
- Authentication and authorization patterns where applicable
- Deployment support utilities

Core modules must be designed for reuse across projects and should not depend on a single client, spreadsheet, or product workflow.

## Shared Modules

Shared modules are reusable assets that are helpful across projects but may be narrower than core framework components.

Examples include:

- Date and formatting helpers
- Spreadsheet utilities
- HTML include helpers
- Validation helpers
- Common UI fragments
- Reusable documentation snippets
- Integration helper patterns

Shared modules should remain portable and well-named. If a shared module becomes central to multiple products, it may be promoted into `/core`.

## Template Philosophy

Starter templates are the preferred way to create consistent new projects.

Templates should:

- Represent approved architecture levels
- Avoid unnecessary complexity
- Include only minimal application logic
- Include documentation placeholders
- Make deployment requirements explicit
- Support AI-assisted generation without encouraging uncontrolled code expansion

Templates are not final products. They are starting points that guide structure, naming, and lifecycle management.

## Application Lifecycle

A STUDIONLINE application should move through the following lifecycle:

1. **Planning**: Define business objective, stakeholders, users, data sources, and success criteria.
2. **Architecture selection**: Choose the simplest approved architecture level that supports the expected scope.
3. **Template selection**: Start from an approved template whenever possible.
4. **Implementation**: Build only the required features using documented standards.
5. **Review**: Validate structure, naming, maintainability, security, and deployment assumptions.
6. **Testing**: Test business flows, data handling, permissions, and failure cases.
7. **Deployment**: Deploy with documented versioning, ownership, and rollback expectations.
8. **Maintenance**: Track changes, defects, enhancements, and architectural decisions.
9. **Refactoring**: Promote repeated patterns into shared or core modules when justified.

## Long-Term Scalability

The workspace must scale across people, projects, and AI assistants. Long-term scalability depends on:

- Clear folder boundaries
- Stable documentation
- Reusable modules
- Small project-specific code surfaces
- Predictable naming conventions
- Consistent deployment notes
- Separation of product, client, and experimental work
- Avoidance of hidden business rules

Scalability should be achieved through disciplined modularity, not premature abstraction.

## Reusable Engineering Principles

All future engineering work should follow these reusable principles:

- Prefer approved templates over one-off structures.
- Keep business logic separate from shared utilities.
- Keep client-specific logic out of reusable modules.
- Document every project at the point of creation.
- Name files and functions according to their responsibility.
- Avoid broad dependencies between unrelated projects.
- Promote reuse only after a pattern is proven.
- Keep deployments reproducible.
- Treat AI output as draft work that requires architectural review.
