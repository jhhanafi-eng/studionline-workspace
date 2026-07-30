# Authentication and Authorization Guide

## Users and Roles
Standard roles are Admin, Manager, Staff, Client, and Guest. Users may hold multiple permissions through a role assignment model.

## Authentication
Authentication identifies the user, resolves profile metadata, establishes a session, and exposes identity to application workflows through a session contract.

## Authorization
Authorization evaluates whether an authenticated user may perform an action. Permission checks belong at public workflow boundaries and before protected data access.

## Sessions
Sessions store identity, role claims, expiration, and minimal context. Session data must avoid sensitive secrets and must be invalidated on logout, expiration, or privilege changes.

## Flow
1. Resolve user identity.
2. Load user profile and role assignments.
3. Create or refresh session.
4. Authorize requested route or action.
5. Log audit-relevant access decisions.
