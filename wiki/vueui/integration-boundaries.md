# Vue UI Integration Boundaries

## Why Boundaries Matter

`vueui` sits between three different worlds:

- the framework-agnostic editor runtime
- the product shell and navigation system
- host services such as Electron and backend APIs

Most architectural drift happens when these concerns leak into each other.

## Boundary 1: `vueui` and `ide-core`

`vueui` should treat `ide-core` as the canonical editor engine.

Good responsibilities for `vueui`:

- subscribe to runtime view models
- dispatch intents based on user interaction
- render widget/document/tree state
- provide framework-specific dependency injection

Responsibilities that should stay out of `vueui` when possible:

- duplicating scene tree state in Pinia
- implementing document lifecycle rules
- making Vue Router the only source of editor state

## Boundary 2: `vueui` and Electron

Electron APIs are environment-specific and should remain in the adapter layer, not in `ide-core`.

Current examples in the package include:

- Electron providers/components
- host-facing event composables
- renderer-side type definitions for native APIs

The architectural goal is straightforward: `vueui` may know how to call the host, but `ide-core` common/runtime must not import Electron.

Host contracts live in ide-core entries:

- `@ide-core/browser` — `HostPort`, `MenuContextSnapshot`, `createNoOpHostPort`
- `@ide-core/electron` — `IDE_IPC_CHANNELS`, `ExecuteCommandMessage` (used by electronapp main/preload)

`vueui` re-exports `HostPort` from `@ide-core/browser` via `src/types/hostPort.ts` and keeps Vue-only `HOST_PORT_KEY` locally.

## ide-core import matrix

| Package | Allowed `@ide-core/*` entries |
|---------|------------------------------|
| `vueui` | `@ide-core`, `@ide-core/vue`, `@ide-core/browser` |
| `electronapp` | `@ide-core`, `@ide-core/electron` (not `@ide-core/vue`) |

## Boundary 3: `vueui` and Backend APIs

Backend communication belongs in `src/lib/` clients and in composables that orchestrate requests.

Typical responsibilities:

- `projectApi.ts` for project-oriented operations
- `fileApi.ts` for file-related requests
- `httpClient.ts` for common transport configuration

Vue components should avoid embedding request logic directly unless the interaction is trivial.

## Practical Rule Set

- If the logic is about editor state transitions, prefer `ide-core`
- If the logic is about page navigation or visual composition, keep it in `vueui`
- If the logic is about a platform capability, keep it in a host adapter
- If the logic is about remote I/O, keep it in API clients/composables

## Outcome

When these boundaries are preserved, `vueui` stays thin enough to evolve independently, while `ide-core` remains portable across Vue, React, or future renderer shells.
