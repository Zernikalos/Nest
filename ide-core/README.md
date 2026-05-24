# @zstudio/ide-core

Framework-agnostic IDE runtime for Zernikalos Studio V2.

## Layout

| Path | Role | Imports |
|------|------|---------|
| `src/core/` | Domain, runtime, ports (no Vue) | `@ide-core` |
| `src/vue/` | Pinia store + composables | `@ide-core/vue` |

## Principles

- **Core has no UI framework imports** in `src/core`
- **Serializable view models** via `getSnapshot()` / `getSlice()`
- **Domain editors**: Zustand (vanilla) + Immer via `DomainEditorBase`

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

const runtime = createEditorRuntime({ storage });
provideEditorRuntime(runtime);
installEditorStore(pinia, runtime);

// In components:
const editor = useEditorStore();
editor.openZObject('node-id');

// Finer subscriptions in SFCs (fewer re-renders):
const assets = useEditorSlice('assets');
```

## Tests

```bash
pnpm exec jest --config ide-core/jest.config.js
```

Tests run without DOM or Electron (core only).
