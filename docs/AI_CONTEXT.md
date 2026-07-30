# STUDIONLINE AI Context

## Purpose

This document is the permanent context for AI assistants working in the STUDIONLINE engineering workspace. It defines repository identity, engineering expectations, architecture preferences, coding rules, documentation rules, and assistant-specific guidance.

AI assistants must treat this document as repository-level operating context.

## Repository Identity

This repository is the official engineering workspace for STUDIONLINE.

It supports:

- Google Apps Script applications
- Google Workspace automation
- Internal business systems
- Reusable frameworks
- Starter templates
- Client projects
- AI-assisted development workflows
- Long-term engineering documentation

This repository is not a random script collection. It is a structured engineering workspace.

## Engineering Philosophy

STUDIONLINE engineering values:

- Professional maintainability
- Clear architecture
- Reuse without premature abstraction
- Business-focused implementation
- Documentation-first decisions
- Minimal but scalable project structures
- Responsible AI-assisted development

AI assistants should optimize for long-term readability and operational reliability rather than short-term code generation speed.

## Architecture Philosophy

Architecture should be selected based on project complexity.

Preferred progression:

1. Start simple.
2. Separate responsibilities when complexity becomes real.
3. Promote repeated patterns into shared modules.
4. Promote stable cross-project foundations into core modules.
5. Document decisions before they become implicit assumptions.

Do not introduce large frameworks, unnecessary dependencies, or complex folder structures unless the project requires them.

## Preferred Coding Style

When code is created in future work, it should follow these preferences:

- Clear function names
- Small focused functions
- Explicit configuration
- Predictable file responsibilities
- Minimal hidden state
- Plain JavaScript compatible with Google Apps Script unless a project explicitly uses a build process
- Defensive handling of external data
- No speculative features
- No broad rewrites without justification

## SPA Philosophy

For user-facing Apps Script web apps, STUDIONLINE generally prefers single-page applications.

SPA behavior should include:

- One primary HTML shell
- Clear client-side user interactions
- Explicit backend calls through Apps Script APIs
- Avoidance of unnecessary full-page reloads
- Intentional UI state management

The SPA approach should remain simple and maintainable. It should not require heavy frontend frameworks unless explicitly approved for a project.

## Google Apps Script Philosophy

Google Apps Script is a strategic platform for STUDIONLINE because it integrates directly with Google Workspace and supports rapid business automation.

Apps Script projects should:

- Use the simplest approved architecture level
- Keep server-side responsibilities clear
- Use configuration files for environment-specific values
- Separate data access from UI code when complexity grows
- Document required services, scopes, triggers, and deployment steps
- Treat spreadsheet-backed systems as real data systems requiring careful structure

## Folder Responsibilities

AI assistants should respect the intended repository folder responsibilities:

- `/docs`: permanent engineering documentation
- `/templates`: approved starter templates
- `/core`: stable reusable framework modules
- `/shared`: reusable utilities and helper patterns
- `/products`: STUDIONLINE-owned products
- `/clients`: client-specific projects
- `/experiments`: prototypes and evaluations

Do not create new top-level folders unless they support the documented architecture or are explicitly requested.

## Coding Rules

AI assistants must follow these rules when generating or modifying code:

- Do not generate application logic when the task is documentation-only.
- Do not change existing architecture unless required by the task.
- Do not mix client-specific logic into reusable modules.
- Do not place secrets, credentials, tokens, or private keys in the repository.
- Do not create speculative abstractions.
- Do not hide important behavior in unclear helper functions.
- Do not rewrite unrelated files.
- Do not introduce dependencies without explaining why.
- Prefer clear Apps Script-compatible JavaScript for Apps Script projects.

## Documentation Rules

Documentation should be professional, durable, and useful for future maintainers.

Documentation should:

- Explain purpose and responsibility
- Identify architecture level when relevant
- Record decisions that affect future work
- Include deployment and testing guidance where applicable
- Avoid temporary chat-style language
- Avoid undocumented assumptions
- Be updated when architecture changes

## Preferred AI Workflow

AI assistants should use the following workflow:

1. Read relevant repository documentation.
2. Inspect existing structure before making changes.
3. Identify the smallest safe change.
4. Preserve existing architecture.
5. Create or update documentation before generating large code changes.
6. Run relevant checks when possible.
7. Summarize changes with file references.
8. Call out assumptions and follow-up recommendations.

## Rules for Codex

Codex should:

- Inspect repository files before editing.
- Follow repository documentation and any local agent instructions.
- Make focused patches.
- Avoid broad rewrites.
- Run available tests or checks after changes.
- Commit changes when instructed by the operating environment.
- Prepare pull request metadata when required by the workflow.

## Rules for ChatGPT

ChatGPT should:

- Treat repository documentation as authoritative context.
- Ask clarifying questions when project category or architecture level is unclear.
- Prefer plans, architecture notes, and maintainable guidance over large unrequested code blocks.
- Avoid inventing project structure that conflicts with this documentation.
- Clearly separate recommendations from confirmed repository facts.

## Rules for Gemini

Gemini should:

- Preserve documented architecture boundaries.
- Use simple, explicit implementation plans.
- Avoid introducing unnecessary framework assumptions.
- Keep Google Apps Script compatibility in mind.
- Document assumptions and dependency requirements.

## Rules for Claude

Claude should:

- Follow the same repository standards as other assistants.
- Prioritize maintainability and careful reasoning.
- Avoid over-expanding scope beyond the requested task.
- Keep documentation formal and long-lived.
- Respect folder responsibilities and architecture levels.

## Future Compatibility

This repository may evolve to include additional products, templates, frameworks, integrations, and AI workflows.

Future changes should remain compatible with the core principles in this document:

- Clear structure
- Reusable foundations
- Documentation-first engineering
- Responsible AI assistance
- Google Workspace alignment
- Scalable but simple architecture

If future technology choices change, update this document and record the decision in `docs/DECISIONS.md`.
