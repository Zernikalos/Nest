# Migration To Monolitic

## Intent

This proposal restructures Zernikalos Studio into a more monolithic repository layout.

The goal is not to merge all runtime responsibilities into one code unit.
The goal is to remove unnecessary package-level fragmentation for the applications and build tooling that are effectively developed and released together.

## Status

This proposal is now mostly implemented.

Current repository state:

- `ide-core` lives at repository root
- `electronapp` lives at repository root
- `nestserver` lives at repository root
- `vueui` lives at repository root
- `reactui` remains under `packages/reactui`
- configuration is centralized under `config/`
- the root `package.json` is the operational manifest for the monolithic application

Remaining exception:

- `reactui` still keeps its own package manifest and workspace role

## Current Situation

Before the migration, the repository was organized as a workspace/lerna monorepo:

- `packages/electronapp`
- `packages/nestserver`
- `packages/ide-core`
- `packages/reactui`
- `packages/vueui`

At the same time, the root `package.json` already acts as the operational center for the repository:

- it owns shared scripts
- it already carries shared dependencies and release flows
- it orchestrates builds through workspace-aware commands

This creates a split model:

- logical ownership is already centralized at the root
- physical source layout is still distributed across package folders

For the Studio app, that distribution is now adding more indirection than value.

## Decision

Adopt a more monolithic source layout for Zernikalos Studio.

### Source Relocation

Move most package sources from `packages/*` into root-level application folders.

Target shape:

- `packages/electronapp/src` -> `electronapp/`
- `packages/nestserver/src` -> `nestserver/`
- `packages/ide-core/src` -> `ide-core/`
- `packages/vueui/src` -> `vueui/`

`reactui` remains excluded from this move and stays under `packages/reactui`.

### Configuration Relocation

Move tool-specific configuration files into dedicated root config folders.

Examples:

- `config/tsconfigs`
- `config/vite`
- `config/webpack`
- `config/electron`
- `config/nest`

The purpose is to stop scattering build/runtime configuration across each package root when the project is operated as one product.

## Why This Change

## 1. The repo is already centrally operated

The root package already behaves as the dependency and release aggregation point.
Keeping each internal app in a package folder provides limited practical isolation.

## 2. Package boundaries are not the same as architecture boundaries

We still want internal architectural boundaries:

- app shell
- server
- editor runtime
- UI renderer

But these boundaries do not need to be expressed as full workspace packages in every case.

## 3. Tooling becomes easier to reason about

A centralized `config/` layout makes it easier to answer:

- which tsconfig is canonical
- which bundler config is used for which target
- which Electron-specific settings are shared vs target-specific

It also creates a better place to define and reuse shared alias strategy across TypeScript, Vite, Webpack, Jest, and runtime tooling.

## 4. Refactors become more direct

Large cross-cutting Studio changes currently require jumping between package roots even when the code is versioned, built, and released together.
Flattening the layout reduces that friction.

## Non-Goals

- removing all architectural boundaries inside the codebase
- merging `reactui` into the monolithic layout in this first step
- deleting workspace support before the new layout is stable
- changing product behavior as part of the physical move

This proposal is about structure first, behavior second.

## Proposed Target Layout

```text
Zernikalos-Studio/
  package.json
  pnpm-workspace.yaml
  config/
    tsconfigs/
    vite/
    webpack/
    electron/
  electronapp/
    src/
  nestserver/
    src/
  ide-core/
    src/
  vueui/
    src/
  packages/
    reactui/
      src/
```

Notes:

- `reactui` stays where it is for now
- the root `package.json` is now the primary dependency owner
- configuration becomes explicitly centralized under `config/`

## Migration Rules

## 1. Move structure before rewriting logic

Do not mix this migration with feature work or architectural rewrites unless required to keep builds working.

## 2. Preserve import intent during the move

If an old package path maps to a new root folder, keep the naming and dependency direction understandable.
The migration should reduce folder nesting, not make ownership ambiguous.

Favor stable aliases over deep relative imports whenever the import crosses a domain boundary or depends on folder layout.

## 3. Centralize configs deliberately

Do not create one giant config file.
Prefer a small family of focused configs under `config/` with explicit names per target.

Examples:

- `config/webpack/electron-main.js`
- `config/vite/electron-preload.ts`
- `config/tsconfigs/tsconfig.electronapp.json`
- `config/tsconfigs/tsconfig.ide-core.json`

## 4. Keep `reactui` isolated temporarily

`reactui` is explicitly out of scope for the first migration wave.
This avoids coupling the structural move with the renderer migration already in flight in V2.

## 5. Standardize aliases before and during the move

Physical location should not be the public contract for internal imports.

Define and maintain a small stable alias set so folder moves do not force broad import rewrites.

Implemented direction:

- `@electronapp/*` -> Studio Electron application sources
- `@zstudio-server` -> compiled Nest server entry consumed by Electron
- `@ide-core` -> core runtime entry
- `@vueui/*` -> Vue renderer sources when needed

Local feature aliases are also acceptable where useful:

- `@/*` -> local `src/*` for the current app

Rules:

- avoid long `../../../` chains in application code
- avoid importing through physical `packages/*` paths
- keep alias definitions synchronized across TypeScript, bundlers, tests, and Node/Electron bootstrap code
- prefer one canonical alias mapping source under `config/tsconfigs` and derive the rest from it where practical

## Suggested Phases

## Phase 0 - Prepare

Deliverables:

- approve this document
- define final folder names at root
- define naming convention for files inside `config/`
- define canonical alias names and ownership
- identify scripts and imports that assume `packages/*`

## Phase 1 - Centralize configs

Deliverables:

- create `config/tsconfigs`
- create `config/vite`
- create `config/webpack`
- create `config/electron`
- create `config/nest`
- introduce shared alias mappings in the centralized configs
- move or duplicate configs there first

Exit criteria:

- builds can reference root-level config files without ambiguity
- aliases resolve consistently across build and dev flows

Status: implemented

## Phase 2 - Move non-React sources

Deliverables:

- move `electronapp`
- move `nestserver`
- move `ide-core`
- move `vueui`

Exit criteria:

- builds, scripts, and path resolution no longer depend on their previous `packages/*` source roots

Status: implemented for `ide-core`, `electronapp`, `nestserver`, and `vueui`

## Phase 3 - Normalize root scripts and dependencies

Deliverables:

- update root scripts to point to the new locations
- reduce package-local dependency declarations where they are no longer useful
- keep only the minimum metadata needed in leftover package manifests

Exit criteria:

- root package is the clear operational entry point

Status: largely implemented

Notes:

- local manifests for `ide-core`, `electronapp`, `nestserver`, and `vueui` have been removed
- `reactui` remains the only workspace package

## Phase 4 - Re-evaluate workspace usage

Questions to answer after the move:

- which folders still need to remain workspace packages
- whether `reactui` should continue isolated
- whether package manifests are still needed for the moved targets

Current outcome:

- full workspace usage has been removed for the migrated targets
- `reactui` remains as the only intentional workspace exception

## Risks

## 1. Build breakage from implicit relative paths

Current configs and scripts may assume local package roots.

Control:

- move configs first
- define aliases before moving sources
- update one target at a time

## 2. Alias drift between tools

TypeScript, Vite, Webpack, Jest, and Electron can diverge if aliases are copied manually.

Control:

- define one canonical alias source
- keep tool-specific adapters thin
- verify path resolution after each target move

## 3. Partial migration creates two conventions

For a period, some modules will live at root and others under `packages/`.

Control:

- document the exception clearly
- keep `reactui` as the only intentional exception

## 4. Confusing monolithic with unstructured

Flattening the repository can accidentally erase ownership signals.

Control:

- preserve top-level domains by folder
- keep explicit config namespaces under `config/`

## Expected Outcome

After this migration, Zernikalos Studio should behave like a centrally operated application repository with:

- one obvious operational root
- fewer artificial package boundaries
- clearer configuration ownership
- a smaller gap between real development flow and on-disk structure
