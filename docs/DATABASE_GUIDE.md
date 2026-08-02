# Database Guide

## Google Sheets
Google Sheets is the default tabular store for lightweight applications. Access must go through database abstractions that define schemas, primary keys, validation rules, and batch operations.

## Properties Service
Use Properties Service for environment configuration, deployment flags, secrets references, and small state values. Do not use it for relational records or large datasets.

## Cache Service
Use Cache Service for short-lived derived data, lookup maps, and quota reduction. Cached values must be rebuildable from durable stores.

## Drive
Use Drive for generated documents, assets, exports, templates, and client deliverables. Store Drive IDs in database records rather than relying on names.

## Future SQL Compatibility
Database contracts must separate queries and persistence intent from Google Sheets implementation details so SQL adapters can later implement the same repository interfaces.

## Future Firestore Compatibility
Record models should use stable IDs, schema metadata, and serialization boundaries so document-oriented storage can be introduced without rewriting business workflows.
