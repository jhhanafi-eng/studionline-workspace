# STUDIONLINE Project Creation Guide

## Purpose

This guide explains how developers and AI assistants should create new projects in the STUDIONLINE engineering workspace. It is intended to prevent inconsistent structures, undocumented systems, and unnecessary architectural complexity.

## 1. Planning

Before creating files, define the project clearly.

Minimum planning questions:

- What business problem does the project solve?
- Who are the users?
- Is this an internal product, client project, reusable framework, or experiment?
- What Google Workspace services are involved?
- What data will the project read, write, or transform?
- What permissions will the project require?
- What are the expected maintenance responsibilities?
- What does success look like?

The planning phase should produce a short project summary before implementation begins.

## 2. Architecture

Select the simplest architecture that supports the expected project lifecycle.

Use the STUDIONLINE Google Apps Script architecture levels:

- **Level 1: Simple Apps** for small, focused utilities.
- **Level 2: Business Apps** for maintained business workflows.
- **Level 3: Workspace Platform** for complex systems, frameworks, or platform-level applications.

Avoid over-engineering early. A project may be upgraded later when complexity becomes real.

## 3. Folder Selection

Place the project in the correct repository area.

Recommended placement:

- `/products` for STUDIONLINE-owned products.
- `/clients` for client-specific implementations.
- `/templates` for starter templates.
- `/core` for stable framework-level reusable modules.
- `/shared` for reusable utilities and helper patterns.
- `/experiments` for prototypes and technical evaluations.
- `/docs` for permanent engineering documentation.

If the correct folder does not exist yet, create it only when the project requires it.

## 4. Starter Template Selection

Prefer an approved starter template when creating a new project.

Template selection should match architecture level:

- Level 1 template for simple Apps Script utilities.
- Level 2 template for business applications.
- Level 3 template for platforms and reusable systems.

A starter template should provide structure, not finished application logic. Developers and AI assistants should not fill templates with speculative features.

## 5. Documentation

Every maintained project should include project-level documentation.

Recommended project documentation includes:

- Project name and purpose
- Business owner or technical owner when known
- Architecture level
- Folder structure
- Google Workspace dependencies
- Required permissions
- Deployment instructions
- Testing checklist
- Maintenance notes
- Known risks or limitations

Documentation should be created at the beginning of the project and updated as decisions change.

## 6. Testing

Testing expectations depend on project complexity, but every project should have a validation plan.

Recommended testing areas:

- Rendering and page loading
- Server-side Apps Script functions
- Spreadsheet or data operations
- User permissions
- Trigger behavior
- Error handling
- Deployment configuration
- Critical business workflows

For Apps Script projects, manual validation may be necessary, but it should still be documented.

## 7. Deployment

Deployment should not be treated as an afterthought.

Before deployment, document:

- Deployment environment
- Script project ownership
- Required Apps Script services
- Required OAuth scopes
- Required installable triggers
- Required Google Sheets, Docs, Forms, Drive folders, or external services
- Production entry points
- Rollback or recovery procedure

Deploy only after the project has a clear owner, known dependencies, and a validation checklist.

## 8. Maintenance

Maintained projects should have an explicit maintenance model.

Maintenance should include:

- Updating documentation when behavior changes
- Recording architectural decisions when they affect future work
- Keeping reusable logic separate from project-specific logic
- Reviewing repeated code for possible extraction into `/shared` or `/core`
- Auditing permissions and dependencies periodically
- Maintaining deployment notes

## AI Assistant Workflow

AI assistants should follow this workflow when creating a project:

1. Read repository-level documentation before proposing structure.
2. Identify the project category and architecture level.
3. Select the appropriate folder and starter template.
4. Create only necessary files.
5. Avoid generating speculative application logic.
6. Add or update project documentation.
7. Explain assumptions clearly.
8. Recommend tests and deployment checks.
9. Avoid changing repository architecture unless explicitly instructed.

AI assistants should treat STUDIONLINE documentation as the source of truth.
