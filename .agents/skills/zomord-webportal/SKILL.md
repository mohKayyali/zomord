---
name: zomord-webportal
description: Use this skill when working on the Zomord WebPortal frontend. It enforces the target frontend standard: feature-first structure, thin route pages, TypeScript by default, MUI, React Router, Redux Toolkit for feature state, Context for shell state, and Zod for form and schema validation.
---

# Zomord WebPortal Frontend

Use this skill for Zomord WebPortal frontend implementation, refactors, and reviews when the change should follow the target frontend standard.

## When To Apply

Apply this skill when you are:

- adding or refactoring WebPortal pages, layouts, or features
- moving page-local logic into better feature ownership
- introducing or reviewing frontend state boundaries
- adding or reorganizing validation schemas
- deciding where frontend code should live

## Default Frontend Standard

The target stack is:

- React 19
- Vite
- MUI 7
- React Router 7
- Redux Toolkit for domain and feature state
- Context API for app-wide shell state
- Zod for validation and schema parsing
- TypeScript for new work

## Structural Rules

- Keep `src/pages` thin and route-focused.
- Put domain-owned code under `src/features/<feature>`.
- Reserve `src/components` for UI reused across multiple features.
- Keep app-wide concerns in `src/context`, `src/store`, `src/styles`, and similar shared folders.
- Do not bury large mocks, validation logic, or business constants inside page files once a feature grows.

Read [references/standards.md](references/standards.md) when the change affects folder ownership or project structure.

## State Model

- Use local `useState` for temporary UI state.
- Use Context for app-wide shell concerns such as auth, current user, tenant, and global settings.
- Use Redux Toolkit for domain and feature state that spans screens, survives route changes, or coordinates async workflows.

Do not use Context as a substitute for complex feature state, and do not push one-off UI state into Redux.

## Validation

- Use Zod for forms and important frontend schemas where correctness matters.
- Keep feature-owned schemas close to the owning feature.
- Keep shared schemas in common folders only when they are truly cross-feature.

## Working Pattern

When applying this skill:

1. Start by locating the owning feature or shared app concern.
2. Keep route files and layouts thin.
3. Move domain logic, state, schemas, and data into the owning feature.
4. Use shared folders only when code is truly cross-feature or app-wide.
5. Prefer TypeScript for new files and substantial edits when conversion scope is reasonable.

## Review Checklist

- Is the code placed in the right folder based on ownership?
- Is temporary UI state local instead of global?
- Is cross-screen domain state in Redux Toolkit rather than Context?
- Is app shell state in Context rather than feature state containers?
- Are frontend validation patterns using Zod where appropriate?
- Has large page-local data or logic been moved closer to the owning feature?
