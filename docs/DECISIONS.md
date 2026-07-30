# STUDIONLINE Engineering Decision Log

## Purpose

This document records important engineering decisions for the STUDIONLINE workspace. Each decision should explain what was decided, why it was decided, and what consequences the decision has for future work.

## Decision Format

Future decisions should use the following format:

```text
## YYYY-MM-DD: Decision Title

Status: Proposed | Accepted | Superseded

Decision:
Context:
Rationale:
Consequences:
```

## 2026-07-30: Use GitHub as the Engineering Workspace

Status: Accepted

Decision: STUDIONLINE will use GitHub as the official engineering workspace for source files, documentation, templates, and project history.

Context: STUDIONLINE needs a durable place to manage internal products, reusable frameworks, client projects, documentation, and AI-assisted development work.

Rationale: GitHub provides version control, collaboration workflows, pull requests, change history, and a reliable foundation for engineering governance.

Consequences: Engineering work should be committed with meaningful history. Documentation should live with the repository. Major changes should be reviewable through pull requests or equivalent review processes.

## 2026-07-30: Use Google Apps Script as a Strategic Platform

Status: Accepted

Decision: STUDIONLINE will use Google Apps Script as a primary platform for Google Workspace automation, internal tools, client systems, and lightweight business applications.

Context: STUDIONLINE works with business workflows that often depend on Google Sheets, Docs, Drive, Forms, Gmail, Calendar, and related Workspace services.

Rationale: Google Apps Script provides direct integration with Google Workspace, fast deployment, accessible hosting for web apps, and practical automation capabilities for business operations.

Consequences: Repository standards should prioritize Apps Script-compatible JavaScript, clear deployment documentation, permissions awareness, and maintainable structures for script-based applications.

## 2026-07-30: Prefer SPA Architecture for User-Facing Apps Script Web Apps

Status: Accepted

Decision: STUDIONLINE will generally prefer single-page application architecture for user-facing Apps Script web apps.

Context: Many Apps Script applications need responsive interfaces that interact with server-side functions and Google Workspace data.

Rationale: SPA architecture provides a better user experience, reduces unnecessary page reloads, and creates a clear boundary between frontend actions and backend Apps Script functions.

Consequences: Apps should usually load a primary `Index.html` shell and call backend functions through explicit API-style methods. This approach should remain lightweight and should not require heavy frontend frameworks unless specifically approved.

## 2026-07-30: Use Reusable Modules

Status: Accepted

Decision: STUDIONLINE will encourage reusable modules for shared utilities, stable framework functions, and common Apps Script patterns.

Context: Internal products and client projects often need similar capabilities such as configuration, data access, logging, validation, formatting, and Google Workspace service wrappers.

Rationale: Reusable modules reduce duplication, improve reliability, and make future project creation faster.

Consequences: Reusable code should be separated from project-specific business logic. Stable framework-level modules belong in `/core`, while narrower reusable helpers belong in `/shared`.

## 2026-07-30: Separate Products and Client Projects

Status: Accepted

Decision: STUDIONLINE will separate internally owned products from client-specific projects.

Context: Internal products and client projects have different ownership, confidentiality, deployment, maintenance, and reuse requirements.

Rationale: Clear separation prevents accidental coupling, protects client-specific business logic, and makes it easier to maintain internal product roadmaps.

Consequences: Future product work should live under `/products`, and client-specific implementations should live under `/clients` when those folders are introduced.

## 2026-07-30: Use Starter Templates

Status: Accepted

Decision: STUDIONLINE will use starter templates to create consistent new projects.

Context: Repeated project setup can produce inconsistent file structures and documentation gaps when every project starts from scratch.

Rationale: Starter templates make approved architecture patterns easy to reuse and help developers and AI assistants start from known-good structures.

Consequences: Templates should be stored under `/templates` when introduced. New projects should start from the simplest template that satisfies the expected scope.

## 2026-07-30: Support AI-Assisted Development

Status: Accepted

Decision: STUDIONLINE will support AI-assisted development while maintaining human-readable architecture and governance.

Context: AI assistants can accelerate documentation, scaffolding, refactoring, and implementation, but they require clear repository context to avoid inconsistent or speculative changes.

Rationale: Documented AI context improves reliability, reduces repeated explanation, and helps different assistants follow the same engineering standards.

Consequences: AI assistants should read repository documentation before making changes, avoid speculative application logic, preserve architecture boundaries, and clearly document assumptions.
