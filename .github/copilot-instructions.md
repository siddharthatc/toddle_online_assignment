<!-- .github/copilot-instructions.md -->
# Copilot / AI Agent Instructions — Course Builder App

Purpose: provide targeted, actionable context so an AI coding agent can be productive immediately in this repository.

Quick start (development)
- Install deps: `npm install`
- Run dev server: `npm run dev` (Vite — serves at http://localhost:5173)
- Build: `npm run build`
- Lint: `npm run lint` / `npm run lint:fix`

High-level architecture (what to know)
- Single-page React application bootstrapped with Vite. Entry: [src/main.jsx](src/main.jsx).
- `App` wraps the app in `react-dnd` provider: see [src/App.jsx](src/App.jsx).
- `CourseBuilder` is the orchestration component (state + UI): [src/components/modules/CourseBuilder.jsx].
  - Holds local component state for `modules` and `items` via `useState` — there is no backend or persistence in this repo.
  - Implements drag-and-drop and reordering logic using `react-dnd` (`accept: 'ITEM'`) and `useDrop` hooks.
  - Search/filter logic is implemented with `useMemo` and simple string matching (lowercased). See `filteredModules` / `filteredItems`.

Primary components and responsibilities
- `CourseBuilder` (src/components/modules/CourseBuilder.jsx): orchestrates modules, items, modals, DnD, and search.
- `ModuleCard`, `ModuleItem`: visual representation and drag/drop targets for modules/items.
- `ModuleModal`, `LinkModal`, `UploadModal`: create/edit flows for modules and items (modal pattern).
- `Header` (src/components/ui/Header.jsx): exposes `onAddClick(type)` and `onSearch` callbacks. `onAddClick` accepts: `module`, `link`, `upload`.

Project-specific conventions and patterns
- Local state-first: The app uses component-local `useState` for domain data; expect stateful logic inside `CourseBuilder` rather than a global store.
- Modal pattern: modals are controlled with `isOpen` + `onClose` + `onSave` props (see `ModuleModal`, `LinkModal`, `UploadModal`).
- Drag-and-drop types: items use a custom type string `'ITEM'` — match this when implementing DnD handlers.
- DOM id convention: modules are rendered with `id="module-{module.id}"` and some features scroll via `document.getElementById(...).scrollIntoView()`.
- CSS: simple global CSS files (`src/App.css`, `src/index.css`) — class names like `course-builder`, `builder-layout`, `course-outline` are used across components.

Build/lint/test/debug workflows (explicit)
- Dev server: `npm run dev` (Vite). If `npm run dev` fails, check Node version and run `npm install` first.
- Production build: `npm run build`; preview with `npm run preview`.
- Linting & formatting: `npm run lint`, `npm run lint:fix`, `npm run format`.
- Tests: No test runner configured (`"test"` script is a placeholder). Add Vitest/Jest if you introduce unit tests.

External dependencies to be aware of
- `react`, `react-dom` — core.
- `react-dnd` + `react-dnd-html5-backend` — drag-and-drop engine and backend.
- `vite` and `@vitejs/plugin-react` — dev server and build pipeline. See `vite.config.js`.

Actionable guidance for code changes
- When adding persistence, extend `CourseBuilder` (currently holds `modules`/`items`) or extract a small persistence module. If you add `localStorage` persistence, do it near the `useState` hooks and keep the same object shapes.
- Reordering logic: `reorderItems(moduleId, from, to)` and `reorderModules(from, to)` operate on array indices; tests or refactors should preserve index-based semantics.
- Add new DnD behaviors by reusing the existing `'ITEM'` type and the `useDrop` pattern already in `CourseBuilder` and `ModuleCard`.

Examples (copyable prompts for edits)
- "Add persistent save: persist `modules` and `items` to `localStorage` in `CourseBuilder` and rehydrate on mount. Keep shapes unchanged so existing modal save handlers still work." — see [src/components/modules/CourseBuilder.jsx].
- "Make outline sticky: style `.course-outline` in `src/App.css` and ensure it toggles via `showOutline = modules.length > 1`."

What an AI should NOT assume
- There is no backend API or database in this repo; do not add server integration without explicit instructions.
- No test harness exists; adding tests requires adding a test runner dependency.

Where to look for examples in the repo
- App entry: [src/main.jsx](src/main.jsx)
- DnD and orchestration: [src/components/modules/CourseBuilder.jsx](src/components/modules/CourseBuilder.jsx)
- Component folder: [src/components/modules](src/components/modules) and [src/components/ui](src/components/ui)
- Build scripts and tooling: [package.json](package.json)

If anything in this file is unclear or you want deeper examples (e.g., line-level references), tell me which area you'd like expanded (DnD, modal patterns, search, or build/test setup) and I will update this doc.
