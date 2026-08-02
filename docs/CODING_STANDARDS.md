# Coding Standards

## Naming and Organization
- Folders use lowercase kebab-case for applications, modules, and feature areas.
- Files use lowercase kebab-case with a clear responsibility name.
- Functions use lowerCamelCase and begin with a verb when they perform work.
- Variables use lowerCamelCase and describe business meaning, not storage mechanics.
- Constants use UPPER_SNAKE_CASE for immutable values.
- Public interfaces use stable names and must not be renamed without versioning impact review.

## Documentation Style
- Each module includes purpose, responsibilities, dependencies, public interfaces, extension strategy, and compatibility notes.
- JSDoc documents public functions, expected arguments, return values, errors, and side effects.
- Comments explain why a decision exists; code names should explain what the code does.

## Error Handling and Logging
- Validate inputs at public boundaries.
- Return structured results or throw documented framework errors consistently.
- Log operationally useful context without exposing secrets or personal data.
- Never swallow errors silently.

## Formatting and Responsibility
- Keep files focused on one primary responsibility.
- Split infrastructure access, business rules, and presentation composition into separate modules.
- Avoid duplicated logic; extract reusable behavior into Core, Shared, or Utility modules.
- Never put try/catch blocks around imports.

## Google Apps Script Best Practices
- Minimize calls to Google services inside loops.
- Batch reads and writes for Sheets and Drive operations.
- Use Properties Service for configuration and small environment state.
- Use Cache Service for short-lived derived values only.
- Avoid global mutable runtime state except documented constants and registries.
- Respect quotas and design long workflows to be resumable where necessary.
