# Zernikalos Studio IDE V2 - North Star

## One-line Vision

Build a headless IDE runtime where editor behavior lives outside UI frameworks, and UI frameworks only render projections of runtime state.

## Why this exists

Current editor evolution is constrained by UI-level coupling:

- feature logic tied to React component lifecycle
- view concerns mixed with editor behavior
- difficult future migration to Vue/Svelte without rewriting logic

V2 solves this by making the IDE core the source of truth.

## Final Shape

When V2 is complete:

1. IDE behavior is implemented in runtime modules with zero React imports.
2. React/Vue/Svelte adapters can render the same runtime.
3. Widgets are runtime contributions, not UI components.
4. Commands, context keys, layout, documents, and session persistence are runtime concerns.
5. Electron integration is a platform adapter, not a place where editor behavior lives.

## Strategic Principles

1. Runtime-first
   Every behavior that defines the editor must exist in runtime, not in UI components.

2. UI is projection
   UI receives view models and sends intents. UI must not own canonical editor state.

3. Stable contracts over convenience
   Strong typed contracts between runtime and adapters are preferred over framework shortcuts.

4. Portable core
   Runtime can run in tests without DOM and without Electron.

5. Explicit effects
   IO and side effects are described and executed through adapters/services.

## Non-goals

- no external plugin marketplace in V2
- no giant meta-framework
- no heavy dependency injection framework

## Success Criteria

V2 is successful only if all are true:

1. A full editor vertical (tree + selection + tabs + document open/save) runs with a runtime-only test harness.
2. React adapter (`reactui`) is thin and stateless regarding core behavior.
3. No runtime package imports React, Vue, or DOM APIs.

A secondary adapter (Vue or Svelte) is deferred; the architecture must allow it later without redesign.

