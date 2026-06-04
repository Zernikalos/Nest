# IDE Core

Framework-agnostic editor runtime for Zernikalos Studio (`@ide-core`).

## Purpose

- Canonical editor state (scene, documents, workbench, project, engine, assets)
- Serializable view models for renderers
- Commands, context keys, session persistence via ports

Not responsible for: Vue/DOM, Electron APIs, routing.

## Package structure

```text
ide-core/src/
  index.ts       → @ide-core (re-exports common)
  common/        → domain, runtime, ports, services (no Vue)
  vue/           → @ide-core/vue (Pinia + composables)
  electron/      → @ide-core/electron (IPC + menu context contracts)
  browser/       → @ide-core/browser (HostPort + createNoOpHostPort)
```

## Import matrix

| Consumer | Entries |
|----------|---------|
| `electronapp` | `@ide-core`, `@ide-core/electron` |
| `vueui` | `@ide-core`, `@ide-core/vue`, `@ide-core/browser` |

## Core idea

```text
UI calls editor methods → patch/onCommit → subscribeSlice / onChange → UI reads getSlice or Pinia store
```

## Proposals

- [IDE Core Vue-Centric Bridge](./ide-core-vue-centric.md) — historical context; current bridge is `@ide-core/vue`.

## Recommended reading

- [Architecture](./architecture.md)
- [Runtime API](./runtime-api.md)
