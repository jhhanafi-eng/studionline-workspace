# Component Library

The component library defines reusable UI composition contracts for Google Apps Script web apps. It documents components but does not prescribe implementation code.

## Components
- Layout shell: page frame, responsive regions, and application chrome.
- Sidebar: primary navigation, collapsed state, active route display.
- Header: product identity, actions, account state, and breadcrumbs.
- Footer: secondary links, version metadata, and legal text.
- Cards: summary metrics, grouped content, and dashboard sections.
- Forms: labels, inputs, validation messages, actions, and disabled states.
- Tables: headers, filters, sorting, pagination, empty states, and row actions.
- Charts: KPI visualization, legends, accessible summaries, and no-data states.
- Modal: focused confirmations, forms, and blocking decisions.
- Toast and notifications: transient and persistent user feedback.

## Rules
Components must be theme-aware, accessible, responsive, and consistent across products. Product-specific variants extend the documented component contracts rather than creating incompatible patterns.
