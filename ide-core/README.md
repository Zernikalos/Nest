# @zstudio/ide-core

Framework-agnostic IDE runtime for Zernikalos Studio V2.

## Principles

- **No UI framework imports**: No React, Vue, Svelte, or DOM APIs
- **Serializable view models**: Runtime outputs data only; icons/components resolved by renderers
- **Intent/effect model**: UI dispatches intents; runtime updates state and produces effects

## Contents

- **Contracts**: RuntimeIntent, RuntimeEffect, RuntimeStore, WidgetContribution
- **Kernel**: EventBus, createStore
- **Ports**: StoragePort, FileSystemPort, IpcPort, KeymapPort (interfaces)
- **Services**: CommandService, ContextKeyService, DocumentService
- **Domain**: SceneTree module (tree, selection, tabs)

## Usage

```ts
import {
  createSceneTreeStore,
  getSceneTreeViewModel,
  convertZObjectToTreeNode,
  SELECT_NODES,
  OPEN_TAB,
  CLOSE_TAB,
} from '@zstudio/ide-core';
```

## Tests

```bash
pnpm test
```

Tests run without DOM or Electron.
