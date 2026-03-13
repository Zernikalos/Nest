# IDE V3 Proposals — Architecture Improvements

## Purpose

V3 proposals build on the V2 direction (framework-agnostic ide-core, ports, intents/effects, widgets) and add structural improvements inspired by how platforms like Eclipse Theia achieve extensibility and clear separation between frontend and backend.

The goal is a better architecture without rewriting the product: same concepts (runtime, ports, view models), but with dependency injection, contribution points, and composition by modules so that the IDE is easier to extend and the boundary between frontend and backend is explicit.

## Documents

- `architecture-improvements.md` — DI container, contribution points, composition by modules
- `frontend-backend-boundary.md` — RPC layer, services as the glue between renderer and Electron/Nest

## Scope

V3 is evolutionary: it suggests improvements that align the codebase with patterns that scale (multiple extensions, multiple renderers, clear process boundary). It does not replace the V2 north star; it refines how we get there.

## Relationship to V2

- **V2** defined: ide-core, ports, contracts, migration from UI-owned logic.
- **V3** adds: how the runtime is composed (DI), how features plug in (contributions), and how frontend and backend relate (services over RPC). Implementations can be phased after or in parallel with V2 milestones.
