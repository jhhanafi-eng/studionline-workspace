# Deployment Guide

## Environments
- Development: rapid iteration, local or test script IDs, debug logging permitted.
- Testing: release candidates, representative data, controlled validation.
- Production: stable deployments, restricted access, audit logging, rollback plan.

## Google Apps Script Deployment
Each deployed application must document script ID, deployment ID, version, owner, environment, required scopes, and rollback target. Production changes require version tags and release notes.

## Rollback
Rollback plans identify the previous stable deployment, data compatibility concerns, and manual recovery steps.

## Versioning
Framework, template, and application versions follow Semantic Versioning and must be recorded in changelogs.
