# Workbench System Architecture (Future)

## Overview

This document outlines the design for a minimal internal editor core ("Theia-lite") that enables building the UI as pluggable blocks (Lego-style), reducing maintenance costs.

## Context & Problem Statement

The current editor suffers from:
- **UI state loss**: Navigation destroys component state
- **Destructive navigation**: Switching views unmounts and remounts components
- **Tight coupling**: Views are tightly coupled, slowing engine and tool development

## Goals

### Primary Objective

Design and implement a minimal internal editor core with the following principles:

1. **Single persistent Workbench**: No screen navigation
2. **Dockable panels/widgets**: With their own state and persistence
3. **Decoupled command system**: Menus, shortcuts, actions
4. **Document/Editor system**: Open resources (scenes, assets, text)
5. **Modular architecture**: Features register themselves, no tight coupling

This core should only cover what's strictly necessary to eliminate current UI pain points.

### Non-Goals

- ❌ External plugin system
- ❌ Reusable framework outside this project
- ❌ Heavy DI or meta-programming dependencies
- ❌ Complete editor rewrite: migration must be incremental
- ✅ Keep Electron + React as base technology
- ✅ 3D viewport (canvas) must live outside React render cycle

## Core Concepts

### 1. Workbench

A single container that manages:

- **Areas**: `left`, `right`, `bottom`, `center`
- **Tabs/Panels**: Dockable widgets
- **Layout persistence**: Between sessions

**Proposed API:**

```typescript
interface Workbench {
    registerWidgetFactory(type: string, factory: WidgetFactory): void
    openWidget(id: string, area: WorkbenchArea): void
    closeWidget(id: string): void
    serializeLayout(): WorkbenchLayout
    restoreLayout(layout: WorkbenchLayout): void
}

type WorkbenchArea = 'left' | 'right' | 'bottom' | 'center'
```

### 2. Widget (Panel)

A widget represents a panel/tab in the editor (Scene Tree, Inspector, Viewport, etc.).

**Requirements:**

- Stable `id`
- **Lifecycle hooks**:
  - `onActivate()`: Called when widget becomes active
  - `onDeactivate()`: Called when widget becomes inactive
- **Rendering**: React component
- **State management**: Internal state per widget
- **Persistence**: Serialize/restore state (tree expansion, filters, etc.)

**Important**: Widget UI state should NOT live in global stores.

```typescript
interface Widget {
    id: string
    title: string
    component: React.ComponentType<WidgetProps>
    area: WorkbenchArea
    onActivate?: () => void
    onDeactivate?: () => void
    serializeState?: () => unknown
    restoreState?: (state: unknown) => void
}
```

### 3. Command System

Decoupled action system:

**Command Definition:**
```typescript
interface Command {
    id: string
    title: string
    run: (args?: unknown) => void | Promise<void>
    isEnabled?: (context: Context) => boolean
}
```

**Features:**
- Command registration
- Execution by ID
- Association with:
  - Menus
  - Keyboard shortcuts

**Example Commands:**
- `"scene.save"`
- `"viewport.frameSelection"`
- `"editor.undo"`

### 4. Context Keys

Minimal context system for enabling/disabling commands.

**Simple keys:**
```typescript
interface Context {
    viewportFocus: boolean
    editorFocus: boolean
    selectionType: string | null
    readOnly: boolean
}
```

**Expression evaluation:**
- Simple boolean expressions:
  - `viewportFocus && !readOnly`
  - `selectionType == "ZObject"`
- No need for complex expressions

### 5. Document System

Model for opening resources in central tabs.

**Document Interface:**
```typescript
interface Document {
    uri: string  // Not just filesystem paths
    dirty: boolean
    save: () => Promise<void>
    serializeSession: () => DocumentSession
}

interface DocumentSession {
    uri: string
    viewState?: unknown
    selection?: unknown
}
```

**Features:**
- Register `EditorFactory` by type
- Open documents in center area
- Session restoration on restart

**Document Types:**
- Scene (`.zko`)
- Material graph
- Text/JSON
- Shaders

### 6. Persistence

Simple storage system (local filesystem) for:

- Workbench layout
- Session (open documents)
- Individual widget state

**Storage Strategy:**
- Persistence per widget/document, not a global blob
- Simple key-value storage
- Electron store or localStorage-based

## Modular Architecture

Each editor feature should be declared as a module that registers with the core.

**Module Interface:**
```typescript
interface EditorModule {
    registerWidgets: (workbench: Workbench) => void
    registerCommands: (registry: CommandRegistry) => void
    registerMenus: (menuBuilder: MenuBuilder) => void
    registerShortcuts: (shortcutRegistry: ShortcutRegistry) => void
    registerDocumentTypes: (documentRegistry: DocumentRegistry) => void
}
```

**Example Modules:**
- `SceneTreeModule`
- `InspectorModule`
- `ViewportModule`
- `AssetBrowserModule`

## Incremental Migration Strategy

The implementation must:

### Coexistence
- Work alongside current code
- Allow migrating existing views gradually
- Avoid massive refactors

### Priority Order

1. **Workbench**: Core container
2. **Widget lifecycle + persistence**: Base for everything
3. **Command system**: Decoupling
4. **Document system**: Resource management

## Implementation Phases

### Phase 1: Basic Workbench (2-3 weeks)
- Create `WorkbenchProvider` (wrapper over current `EditorLayout`)
- Define areas: `left`, `right`, `bottom`, `center`
- Migrate TreeView to `sceneTree` widget in `left` area
- Keep `center` area for current documents
- Basic registration system: `registerWidget()`

**Immediate benefit**: Base structure without breaking anything.

### Phase 2: Layout Persistence (1 week)
- Simple Storage API (localStorage/Electron store)
- Serialize `ResizablePanelGroup` positions
- Restore layout on startup

**Immediate benefit**: Layout persists between sessions.

### Phase 3: Widget Lifecycle + State (2 weeks)
- Widget interface: `id`, `component`, `area`, `onActivate`, `onDeactivate`
- Per-widget state in Zustand: `widgets[widgetId].state`
- Serialize/restore widget state
- Migrate TreeView expand/collapse to widget state

**Immediate benefit**: State preserved per widget.

### Phase 4: Basic Command System (2 weeks)
- `CommandRegistry`: `registerCommand(id, command)`
- `executeCommand(id)` function
- Integrate with existing Electron menus
- Basic shortcuts (Cmd+S, etc.)

**Immediate benefit**: Decoupled commands.

### Phase 5: Context Keys (1-2 weeks)
- `ContextService`: `setContext(key, value)`
- `Command.isEnabled(context)` evaluation
- Simple expressions: `"viewportFocus && !readOnly"`

**Immediate benefit**: Commands enabled based on context.

### Phase 6: Document System (3-4 weeks)
- Document interface: `uri`, `dirty`, `save()`, `serialize()`
- `EditorFactory` by type (`.zko`, `.json`, etc.)
- Document tabs in `center` area
- Session restore for open documents

**Immediate benefit**: Robust document system.

## Critical Considerations

### 1. 3D Viewport Outside React

The canvas must remain outside React's render cycle. The widget should be a wrapper that only mounts the canvas:

```typescript
function ViewportWidget() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    
    useEffect(() => {
        if (canvasRef.current) {
            // Initialize 3D viewport directly on canvas
            // DO NOT use React to render 3D
        }
    }, []);
    
    return <canvas ref={canvasRef} />;
}
```

### 2. Incremental Migration

**Coexistence strategy:**

```typescript
// Phase 1: WorkbenchProvider wraps current EditorPage
<WorkbenchProvider>
    {/* Current code continues to work */}
    <EditorLayout />
</WorkbenchProvider>

// Phase 2: Gradual migration
<WorkbenchProvider>
    <WorkbenchArea area="left">
        <SceneTreeWidget /> {/* Migrated */}
    </WorkbenchArea>
    <WorkbenchArea area="center">
        <EditorLayout /> {/* Still legacy */}
    </WorkbenchArea>
</WorkbenchProvider>
```

### 3. Complexity vs. Benefit

**Golden Rule**: If a part doesn't clearly reduce the mental cost of the editor, it shouldn't be implemented.

**Avoid:**
- Complex DI
- Meta-programming
- External plugin systems

**Implement:**
- Simple registration
- Clear interfaces
- Basic persistence

## Current Foundation

### Existing Pieces

✅ **KeepAliveRouter**: Component state preservation (solid base)
✅ **EditorLayout**: `ResizablePanelGroup` (base for docking)
✅ **Modular architecture**: Hooks (`NestEditorProvider`, specialized hooks)
✅ **Zustand**: Local state (easy to extend)
✅ **Electron**: Integrated (menus, persistence)

### What's Missing

| Concept | Current State | Gap |
|---------|--------------|-----|
| Persistent Workbench | Static 2-panel layout | Need dynamic areas (left/right/bottom/center) + persistence |
| Dockable widgets | Hardcoded components | Need factory registration + lifecycle + per-widget state |
| Command system | Only basic Electron menus | Need central registration + context keys + shortcuts |
| Document system | Simple tabs in EditorTopBar | Need URI system + dirty tracking + session restore |
| Persistence | None | Need storage system for layout + widgets + documents |

## Expected Outcomes

After implementation:

✅ **Switching tools doesn't unmount UI**: Components stay mounted
✅ **Visual state automatically preserved**: Layout and widget state persist
✅ **Adding new panel/editor**: Just register it, no manual wiring
✅ **Developer focus**: Can focus on engine and tools, not UI plumbing

## Implementation Style

- **Explicit, readable code**: No meta-magic
- **Clear interfaces**: Well-defined contracts
- **Avoid premature abstractions**: Build what's needed, when needed
- **Think like "minimal internal platform"**: Not a product

## Effort Estimation

- **Phases 1-3**: 5-6 weeks (immediate visible value)
- **Phases 4-6**: 6-8 weeks (complete functionality)
- **Total**: 11-14 weeks with incremental migration

## Related Documentation

- [Architecture Overview](../architecture-overview.md) - Current system architecture
- [Editor Page](../pages/editor-page.md) - Current editor implementation
- [KeepAliveRouter](../keepaliverouter/README.md) - Component state preservation
- [Coding Standards](../coding-standards.md) - Code style and patterns

## Notes

- This is a **future** design document, not yet implemented
- Implementation should follow incremental migration strategy
- All code must follow project coding standards (English, named exports, TypeScript)
- Consider this a living document: update as design evolves

