# IDE V2 ADR - Non-negotiables

## Status

Proposed for approval as project-level architecture constraints.

## ADR-001: Runtime cannot import UI frameworks

Decision:

- package `ide-core` must never import React/Vue/Svelte/DOM APIs.

Reason:

- guarantees portability and framework independence.

## ADR-002: Runtime owns canonical editor state

Decision:

- canonical state for layout, selection, tabs, documents, and command context lives in runtime only.

Reason:

- avoids split-brain behavior and drift between UI and core.

## ADR-003: UI communicates via intents only

Decision:

- UI adapters can dispatch intents and read selectors/view models.
- UI adapters cannot implement core editor business rules.

Reason:

- keeps adapters thin and replaceable.

## ADR-004: IO goes through ports

Decision:

- runtime cannot call Electron IPC, filesystem, or browser APIs directly.
- runtime depends on abstract ports provided by platform adapters.

Reason:

- testability and environment independence.

## ADR-005: No ReactNode (or framework objects) in runtime contracts

Decision:

- runtime contracts expose serializable data only.
- visual mapping (icons/components) is renderer concern.

Reason:

- prevents hidden coupling and enables cross-framework rendering.

## ADR-006: Vertical migrations must fully cut over

Decision:

- each migration vertical must remove old logic from UI after runtime cutover.

Reason:

- prevents long-lived dual implementations.

## ADR-007: Runtime-first testing

Decision:

- new editor behavior must include runtime unit/integration tests without UI.

Reason:

- ensures behavior is independent of framework lifecycle.

