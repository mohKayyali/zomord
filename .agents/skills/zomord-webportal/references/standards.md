# Zomord WebPortal Frontend Standards Reference

## Purpose

Use this reference when working on the Zomord WebPortal frontend. The aim is a maintainable structure with clear ownership and low accidental complexity.

## Core Principles

- Prefer a feature-first structure.
- Keep required shared folders easy to discover.
- Use TypeScript for new work and major edits when practical.
- Avoid architecture-heavy patterns such as atomic design.
- Keep route files thin and move domain logic toward the owning feature.
- Do not leave important data, styles, or validation logic buried in page files once a feature grows.

## Recommended Stack

| Tool | Purpose |
|---|---|
| React 19 | UI framework |
| Vite | Dev server and bundling |
| MUI 7 | UI component system |
| React Router 7 | Routing |
| Redux Toolkit | Domain and feature state |
| Context API | App-wide shell state |
| Zod | Validation and schemas |
| ESLint | Code quality |
| TypeScript | Default language for new work |

## Target Project Structure

```text
webportal/
  src/
    pages/
    layouts/
    context/
    store/
    features/
      screening/
        components/
        state/
        schemas/
        data/
    components/
    hooks/
    data/
    utils/
    styles/
    App.tsx
    main.tsx
    index.css
```

## Folder Ownership Rules

- `src/pages`: route-level entry files only
- `src/layouts`: app shell and shared framing
- `src/context`: app-wide Context providers and hooks
- `src/store`: Redux store setup and typed helpers
- `src/features/<feature>`: feature-owned code
- `src/components`: cross-feature reusable UI only
- `src/hooks`: app-wide reusable hooks only
- `src/data`: global constants and lookup data only
- `src/utils`: generic helpers without feature ownership
- `src/styles`: theme, tokens, and shared style helpers

## Non-Negotiable Placement Rules

- Do not put large mock datasets inline in page files.
- Do not keep feature business constants in random pages.
- Do not add code to `src/components` unless it is reused across features.
- Do not put feature state in Context when Redux Toolkit is the better owner.
- Do not put one-off UI state in Redux.
- Do not introduce atomic design folders or naming.

## State Management Model

- `Context` = app-wide shell and wiring
- `Redux` = domain and feature state
- local `useState` = temporary UI state

Use local state for open and closed panels, selected tabs, temporary filter widgets, row expansion, and short-lived form drafts.

Use Context for auth session, current user, permissions, current tenant, app settings, and shell-wide wiring consumed by many screens.

Use Redux Toolkit for dashboard aggregates, feature workflows, selected records shared by multiple views, and multi-step feature flows.

## TypeScript Standard

TypeScript is the default for all new WebPortal work.

- Prefer `.ts` and `.tsx` for new files.
- When editing existing JavaScript files substantially, prefer converting them to TypeScript when the scope is manageable.
- Type route props, shared component props, Redux state, and Zod-validated forms and schemas.

## Validation Standard

- Use Zod for form input validation.
- Use Zod for important frontend schema validation.
- Keep feature-owned schemas in `src/features/<feature>/schemas`.
- Keep generic shared schemas only when they are truly cross-feature.

## Styling Standard

- Use MUI as the base UI system.
- Keep app-wide theme, tokens, and shared style helpers in `src/styles`.
- Use MUI `sx` for component-level styling.
- Keep `index.css` minimal for resets and global foundations only.
- Keep substantial feature-specific styling close to the owning feature.

## Feature Ownership Pattern

Use this shape when a feature grows beyond a very small page prototype:

```text
src/features/screening/
  components/
  state/
  schemas/
  data/
```

Feature mocks belong in the feature's `data/` folder, feature state in `state/`, and feature validation in `schemas/`.
