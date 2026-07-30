# Logging Guide

## Severity Levels
- Info: expected operational events.
- Warning: recoverable unexpected conditions or degraded behavior.
- Error: failed operation requiring correction or retry.
- Critical: system-level failure, data integrity risk, or security concern.
- Audit: user, permission, data export, approval, and administrative actions.
- Debug: temporary diagnostic detail for development and testing.

## Standards
Use structured messages with event name, module, correlation ID where available, actor, target resource, and safe context. Never log secrets, credentials, tokens, or unnecessary personal data. Errors must be actionable and aligned to documented error codes.
