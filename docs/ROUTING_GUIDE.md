# Routing Guide

Routing maps application state to views, permissions, navigation metadata, and controller actions. Routes must be declared in configuration and evaluated through the framework router.

## Standards
- Each route has an ID, path or state key, title, required permissions, layout region, and lifecycle hooks.
- Protected routes require authentication and authorization before data loading.
- Unknown routes resolve to a documented not-found state.
- Navigation, breadcrumbs, and page titles derive from route metadata.
