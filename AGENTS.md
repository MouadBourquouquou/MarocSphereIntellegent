# MarocSphere — Agent Context

## Stack & hard constraints
- Angular + TypeScript ONLY. No vanilla JavaScript, anywhere.
- Never use: `document.getElementById()`, `document.querySelector()`,
  `document.addEventListener()`, `onclick="..."`, or inline JS in templates.
- Use Angular idioms instead: Components, Services, Router, Signals or RxJS,
  Reactive Forms, `(event)` binding, `[property]` binding, structural directives
  (`*ngIf`, `*ngFor`, `@if`/`@for` if using new control flow).

## Preserve, don't redesign
- Keep existing UI, brand identity, colors, typography, layout, and animations.
- Reuse existing components where they already exist — extend, don't replace.
- Every button, nav item, modal, filter, and form must be fully wired up.
  Remove placeholder functionality as you find it, don't leave TODOs.

## Project structure
- Frontend root: `MarocSphere/MarocSphereIntellegent/frontend`
- Super Admin Dashboard (users CRUD, growth/destination charts) and the
  Admin Analytics Dashboard (originChart, categoryChart, auditor portal)
  live in separate folders — don't merge them.

## Known recurring pitfalls in this codebase
- Leftover `onclick="..."` attributes from the original vanilla-JS UI.
  When touching any template, check for these and convert to `(click)` binding.
- `iconify-icon` (lucide icon set) is a web component — Angular will throw
  NG8001 if it's used without registering `CUSTOM_ELEMENTS_SCHEMA` (or wrapping
  it properly). Check this whenever icons are involved.

## Workflow expectations
- After implementing a feature, run `ng build` (or `ng serve` + check console)
  before considering it done. Fix any NG8001/template errors before moving on.
- Favor small, reviewable diffs over touching many unrelated files at once.
