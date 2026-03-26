# IDE Core Architecture

## Overview

`ide-core` is the editor engine for Zernikalos Studio V2. It is designed to be portable across UI frameworks by keeping state, domain logic, and extension contracts free of framework dependencies.

The package centers around `createEditorRuntime()`, which composes several domain stores and services into a single public runtime API.

## Architectural Principles

### 1. Framework Agnostic

No React, Vue, Svelte, Electron, or DOM imports belong in the package.

### 2. Canonical State in the Runtime

Scene tree, documents, workbench layout, commands, and context keys live in the runtime so that renderers do not need to reimplement those rules.

### 3. Serializable View Models

Renderers consume plain data. The runtime does not return framework components or renderer-specific objects.

### 4. Intents and Effects

State changes happen through explicit intents. Effects can be produced as runtime responses when adapters need to react to side effects.

## Main Subsystems

### Contracts

`src/contracts/index.ts` defines the runtime boundary:

- `RuntimeIntent`
- `RuntimeEffect`
- `RuntimeStore`
- `WidgetContribution`
- `WidgetController`

These contracts make the runtime extensible without binding it to a specific renderer.

### Kernel

The kernel contains low-level primitives such as:

- `EventBus`
- `createStore`

These utilities support predictable state updates and subscriptions.

### Domain Modules

The domain layer is split by responsibility:

- `SceneTreeModule` for tree structure, selection, focus, expansion, and tab-adjacent interactions
- `DocumentModule` for opened documents, active document, dirty state, and view state
- `WorkbenchModule` for widget layout, area placement, activation, and panel sizing

The modules are coordinated inside `createEditorRuntime()` rather than exposing framework-specific behavior.

### Services

Core services include:

- `CommandService` for command registration and execution
- `ContextKeyService` for context-dependent behavior
- `SessionService` for persistence and restoration of runtime state
- `DocumentService` for document-oriented helpers

### Ports

Ports define how the runtime interacts with the outside world while staying decoupled:

- `StoragePort`
- `FileSystemPort`
- `IpcPort`
- `KeymapPort`
- `TelemetryPort`

Only the interface belongs in `ide-core`; implementations belong in adapters or hosts.

## Composition Root

`src/createEditorRuntime.ts` is the composition root. It:

- creates scene tree, document, and workbench stores
- wires cross-module synchronization
- exposes subscriptions and view model getters
- registers widgets and commands
- manages workspace-level information
- coordinates session save/restore

This file is the best place to understand how separate modules become one coherent editor runtime.

## Intended Relationship with UI Packages

Packages such as `reactui` and `vueui` should:

- instantiate the runtime
- subscribe to runtime outputs
- dispatch intents
- provide host-specific ports

They should not fork the domain logic that already exists here.
