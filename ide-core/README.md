# @zstudio/ide-core

Framework-agnostic IDE runtime for Zernikalos Studio V2.

## Layout

| Path | Role | Entry |
|------|------|--------|
| `src/common/` | Domain, runtime, ports, menu (no UI framework) | `@ide-core` |
| `src/vue/` | Pinia store + composables | `@ide-core/vue` |
| `src/electron/` | Main/preload IPC contracts (no `electron` import) | `@ide-core/electron` |
| `src/browser/` | Renderer host port types + no-op factory | `@ide-core/browser` |

## Import boundaries

| Consumer | Allowed entries |
|----------|-----------------|
| `electronapp` | `@ide-core`, `@ide-core/electron` |
| `vueui` | `@ide-core`, `@ide-core/vue`, `@ide-core/browser`, `@ide-core/electron` (types only if needed) |

Do not import `ide-core/src/...` internal paths.

## Principles

- **Common has no UI framework imports**
- **Serializable view models** via `getSnapshot()` / `getSlice()`
- **Domain editors**: Zustand (vanilla) + Immer via `DomainEditorBase`

## Host dialogs and menu

- **`HostDialogsPort`** (`common/host/hostDialogsPort.ts`) — unified file/system dialog API
- **`HostDialogIpcChannel`** + **`createHostDialogsPreloadBridge`** (`@ide-core/electron`) — IPC protocol and preload bridge
- **`APP_MENU_MANIFEST`** — single menu tree; use **`resolveMenuManifest`** and **`activateMenuItem`** for platform adapters

## Usage (core)

```ts
import { createEditorRuntime } from '@ide-core';

const runtime = createEditorRuntime({ storage });
runtime.subscribeSlice('scene', () => { /* refresh */ });
const scene = runtime.getSlice('scene');
runtime.scene.selectNodes(['node-id']);
```

## Usage (Vue)

```ts
import { createEditorRuntime } from '@ide-core';
import {
  provideEditorRuntime,
  installEditorStore,
  useEditorStore,
  useEditorSlice,
} from '@ide-core/vue';
```

## Usage (Electron main)

```ts
import { CommandId } from '@ide-core';
import { IdeIpcChannel, HostDialogIpcChannel, DEFAULT_MENU_CONTEXT } from '@ide-core/electron';
```

## Usage (browser host)

```ts
import { createNoOpHostPort, type HostPort, type HostDialogsPort } from '@ide-core/browser';
```

## Tests

```bash
pnpm exec jest --config ide-core/jest.config.js
```

Tests run without DOM or Electron (common layer only).
