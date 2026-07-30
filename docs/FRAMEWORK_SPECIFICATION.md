# STUDIONLINE Framework Specification

## Purpose
This specification defines the permanent engineering foundation for the STUDIONLINE ecosystem. The repository is the workspace for reusable Google Apps Script platforms, internal products, starter templates, reusable modules, and isolated client applications.

## Governance Principles
- All reusable assets belong in this repository.
- Client-specific logic must remain isolated from reusable framework modules.
- Products must remain independently deployable and independently versioned.
- Framework modules must never depend on client projects.
- Architecture is considered stable after this specification and future work should prioritize implementation over structural redesign.
- Major structural changes require production evidence, documented tradeoffs, and versioned migration guidance.


## Layered Architecture

The STUDIONLINE Framework is organized as a reusable, modular Google Apps Script engineering platform rather than a single application. Every product, starter template, internal tool, and client application must depend on framework contracts instead of duplicating implementation details.

### Application Layer
Owns product-specific composition: pages, feature orchestration, product configuration, and workflow assembly. It may call Business Layer services and framework public interfaces, but it must not bypass them to manipulate persistence or infrastructure directly.

### Business Layer
Contains domain use cases, policies, workflow rules, approval rules, proposal rules, invoice rules, and client-specific business decisions. Business modules translate user intent into validated operations and call Core Layer contracts for shared platform behavior.

### Core Layer
Provides framework primitives that are reused across applications: authentication, authorization, routing, configuration, validation, CRUD contracts, database abstractions, logging contracts, caching contracts, and Google service adapters. Core code must be stable, versioned, tested, and independent from client applications.

### Shared Layer
Contains cross-product constants, DTO definitions, type conventions, schema metadata, shared copy, reusable UI configuration models, and documentation-owned contracts. Shared assets must be implementation-neutral and safe to import from any product.

### Infrastructure Layer
Wraps external systems such as Google Sheets, Properties Service, Cache Service, Drive, Gmail, Calendar, UrlFetch, future SQL stores, and future Firestore stores. Infrastructure modules implement Core interfaces and must not contain business rules.

### Template Layer
Provides starter structures for new applications, products, and client projects. Templates demonstrate recommended composition without becoming a dependency of the framework runtime.

### Utility Layer
Provides small deterministic helpers for dates, strings, object transformation, IDs, guards, normalization, and formatting. Utilities must have no product awareness and no hidden infrastructure side effects.

## Dependency Direction
Dependencies flow inward and downward from specific to reusable: Application -> Business -> Core -> Infrastructure contracts and Utility/Shared assets. Client projects may depend on framework modules, but framework modules must never depend on client projects. Infrastructure implementations are selected through configuration and dependency injection patterns, not hard-coded from business workflows.

## Module Isolation
Each module owns one responsibility, exposes documented public interfaces, and hides internal helpers. Cross-module calls must use public contracts. Shared state is forbidden unless mediated by session, configuration, cache, or database abstractions. Module folders should remain independently testable and replaceable.

## Scalability and Maintainability
The workspace must support hundreds of Google Apps Script applications by enforcing stable contracts, consistent naming, clear versioning, isolated client logic, and reusable infrastructure adapters. New products should be created by composing existing modules and adding only product-specific business rules.


## Repository Scope
The repository may contain framework modules, internal STUDIONLINE products, Google Apps Script starter templates, documentation, project scaffolds, test utilities, and client applications under the approved project hierarchy.

## Compatibility Targets
The framework must support Google Apps Script web apps, container-bound scripts, standalone scripts, HTML service applications, spreadsheet-backed applications, Drive-backed document workflows, and future database-backed services.

## Public Contract Rule
A module is reusable only when its purpose, dependencies, public interfaces, extension points, and compatibility expectations are documented. Undocumented implementation details are not stable contracts.
