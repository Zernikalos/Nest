# V3 Proposal: Menu and Host Integration Simplification

## Status

Draft. Follows the menu refactoring commit (command IDs, `APP_MENU_MANIFEST`, `HostPort`, `ide-core/common` layout).

## Context

The recent menu refactor established a solid direction:

- **`CommandId`** and **`CommandService`** as the single vocabulary for menu actions across renderer, IPC, and handlers.
- **`APP_MENU_MANIFEST`** in `@ide-core` for the in-renderer menu bar (Windows/Linux).
- **`HostPort`** (`@ide-core/browser`) to keep dialogs, window chrome, and menu context out of the runtime core.
- **Electron main** forwards native macOS menu actions via `mainBus` → `registerMenuCommandHandlers` → `ide:executeCommand`.

The architecture is workable, but several concerns are still duplicated or split across platforms. This document captures improvement options without requiring an immediate rewrite.

## Current Architecture (Summary)

```text
ide-core/common/menu/
  APP_MENU_MANIFEST, CommandId, MenuItemDescriptor

vueui/shell/menu/
  AppMenuBar → manifest → executeCommand (Win/Linux)

electronapp/menu/
  fileMenu.ts, sceneMenu.ts, editMenu.ts (macOS native, hand-built)

electronapp/
  registerMenuCommandHandlers → dialogs → ide:executeCommand (macOS)
  ipcMain menu:* → same dialog helpers (Win/Linux via HostPort)
```

### Command flow by platform

| Platform | Menu UI | Dialogs | Runtime |
|----------|---------|---------|---------|
| macOS | Native Electron template | Main process first (`menuActions`) | `ide:executeCommand` with payload |
| Win/Linux | `APP_MENU_MANIFEST` + Radix | Renderer → `HostPort` → IPC `menu:*` | `executeCommand` directly or after invoke |

Both paths end in `CommandService`, but **where** file dialogs run and **which** module owns the routing differ.

## Problem Areas

### 1. Duplicate menu tree definitions

`APP_MENU_MANIFEST` describes File / Edit / Scene declaratively. macOS still maintains parallel templates in `electronapp/src/menu/fileMenu.ts`, `sceneMenu.ts`, and `editMenu.ts` with the same labels, separators, import formats, and command IDs.

**Risk:** New menu items or import formats must be updated in two places; labels and ordering can drift (e.g. Edit submenu order differs between manifest and native `editMenu`).

### 2. Split dialog routing

Commands that need file pickers are handled differently:

- **macOS native:** `emitMenuCommand` → `registerMenuCommandHandlers` (switch on `CommandId`) → dialog → IPC with full payload.
- **Win/Linux in-renderer:** `executeCommand` → `useElectronProjectIntegration` (“if payload lacks `path`, call `HostPort.menuImportFile` / `menuLoadZko`”).

The underlying dialog code is shared (`menuActions.ts`), but the **decision table** (“which commands open dialogs in main?”) is duplicated between main and renderer handlers.

### 3. Verbose `HostPort` wiring

`vueui/src/App.vue` maps `window.NativeZernikalos` field-by-field into `createNoOpHostPort({ ... })`. Every new preload API requires manual mapping in the app root.

### 4. Transition leftovers

`ElectronProvider.vue` still exposes deprecated no-op listeners (`onLoadZko`, `onImportFile`, etc.) while the real path is `onExecuteCommand`. This adds noise for readers and LLMs.

### 5. Minor consistency gaps

- `useAppMenuBar.ts` uses string literals for roles (`'copy'`) instead of `MenuItemRole`.
- Edit items in the manifest declare `commandId`; macOS native Edit uses Electron `role` only (system clipboard), not `CommandService`.
- Docs reference `IDE_IPC_CHANNELS` in places; code uses `IdeIpcChannel`.

## Improvement Options

### Option A — Single manifest, dual adapters (recommended for menu structure)

**Idea:** Treat `APP_MENU_MANIFEST` as the only source of application command menus (File, Edit, Scene). Platform code only adds non-command chrome.

| Layer | Responsibility |
|-------|----------------|
| `ide-core/common/menu/` | Manifest, `CommandId`, `MenuItemDescriptor`, context `when` keys |
| `vueui/shell/menu/` | Existing Radix UI (unchanged consumer) |
| `electronapp/menu/manifestAdapter.ts` (new) | `manifest → Electron.MenuItemConstructorOptions`, resolve `when` → `enabled`, `click` → `emitMenuCommand` |
| `electronapp/menu/platformOverlay.ts` (new) | macOS app menu, View, Window, Help; frameless-only pieces |

**Effects:**

- One place to add import formats or file commands.
- `fileMenu.ts` / `sceneMenu.ts` can shrink or disappear; `editMenu.ts` may remain a thin native-role block or merge into manifest with a “native role only” flag.

**Effort:** Medium. Requires mapping `MenuItemRole` / separators to Electron roles and testing macOS enablement via `MenuContextSnapshot`.

---

### Option B1 — Renderer-centric dialogs (uniform HostPort path)

**Idea:** Native macOS menu clicks only emit `commandId` (+ minimal payload such as `format`). **Always** the renderer opens dialogs through `HostPort` (same as Win/Linux today).

**Remove or simplify:** `registerMenuCommandHandlers` dialog switch; main only forwards `{ commandId, payload }` when needed.

**Pros:** One routing model; handlers in `useElectronProjectIntegration` stay authoritative.

**Cons:** Extra IPC round-trip on macOS; native menu enablement still needs `sendMenuContext`.

---

### Option B2 — Main-centric dialogs (uniform main path)

**Idea:** All platforms (including in-renderer menu) send menu activation to main; main runs dialogs and always replies with `ide:executeCommand` and a complete payload.

**Pros:** Single dialog switch in main; renderer handlers become thin (no “if missing path, open dialog”).

**Cons:** More IPC for Win/Linux; in-renderer menu no longer calls `executeCommand` directly from UI (unless UI sends to main first).

---

### Option C — `createElectronHostPort` adapter

**Idea:** Replace manual mapping in `App.vue` with one factory:

```ts
// vueui/src/adapters/electronHostPort.ts (illustrative)
export function createElectronHostPort(
  api: Window['NativeZernikalos'] | undefined
): HostPort {
  return createNoOpHostPort({
    showOpenProjectDialog: api?.showOpenProjectDialog
      ? () => api.showOpenProjectDialog!().then((r) => r ?? null)
      : undefined,
    // ...remaining methods
  });
}
```

**Effects:** App root stays small; tests can mock one adapter; new preload methods live in one file.

**Effort:** Low.

---

### Option D — Cleanup transition code

**Idea:** Remove deprecated `ElectronProvider` listeners and narrow `useElectronEvents` to `isElectron`, `onExecuteCommand`, `offExecuteCommand`.

**Effort:** Low. Do after confirming no external consumers rely on old event names.

---

### Option E — Command → dialog registry (optional, pairs with B1 or B2)

**Idea:** Replace scattered `switch (commandId)` blocks with a declarative table in `electronapp`:

```ts
// Illustrative
const MENU_DIALOG_HANDLERS: Partial<Record<CommandId, DialogRunner>> = {
  [CommandId.FILE_IMPORT_FILE]: (win, payload) =>
    runImportFileDialog(win, payload.format),
  // ...
};
```

Used either only in main (B2) or only behind `HostPort` invokes (B1).

**Effort:** Low–medium; improves readability without changing UX.

## Target Structure (End State)

```text
ide-core/common/menu/     → manifest + CommandId + types
ide-core/browser/         → HostPort contract
ide-core/electron/        → IdeIpcChannel, MenuContextSnapshot, ExecuteCommandMessage

electronapp/menu/
  manifestAdapter.ts      → manifest → native template (Option A)
  platformOverlay.ts      → View / Window / Help / macOS app menu
  registerMenuCommandHandlers.ts  → optional; slim forwarder if B1

vueui/
  adapters/electronHostPort.ts    → Option C
  shell/menu/                     → manifest UI only
  composables/useElectronProjectIntegration.ts  → registerCommand + onExecuteCommand
```

**Principle:** Manifest and commands live in `ide-core`; platforms adapt presentation and I/O (dialogs, IPC, native roles)—not duplicate menu trees.

## Suggested Phasing

| Phase | Scope | Risk |
|-------|--------|------|
| **1** | Option C (`createElectronHostPort`) + Option D (remove deprecated Electron events) | Low |
| **2** | Option A (manifest → Electron adapter); keep current dialog routing | Medium |
| **3** | Pick B1 or B2 and Option E; align docs (`IdeIpcChannel`, electron README) | Medium |
| **4** | Optional: unify Edit menu behavior (manifest `commandId` vs native `role`) | Low |

Phases are independent where noted; Phase 1 can ship without committing to B1 vs B2.

## Non-Goals

- Replacing `CommandService` or moving menu logic into Pinia.
- Full Theia-style menu contribution points (see `architecture-improvements.md` for DI/contributions; this proposal is complementary).
- Changing product menu labels or shortcuts as part of structural work.

## Relationship to Other Docs

| Document | Relationship |
|----------|----------------|
| [ide-core/architecture.md](../../ide-core/architecture.md) | Ports and framework-agnostic core; this proposal refines **host/menu** boundaries. |
| [vueui/integration-boundaries.md](../../vueui/integration-boundaries.md) | HostPort and Electron stay in adapters; options here reinforce that split. |
| [electronapp README](../../../electronapp/README.md) | Operational IPC/menu flow; should be updated when B1/B2 is chosen. |
| [architecture-improvements.md](./architecture-improvements.md) | Future `CommandContribution` could register manifest entries; not required for Options A–D. |

## Open Questions

1. **B1 vs B2:** Is one extra IPC hop on macOS acceptable for a single mental model, or is main-first dialog UX a hard requirement?
2. **Edit menu:** Should Win/Linux and macOS both route edit actions through `CommandService`, or is native `role` sufficient for clipboard on all platforms?
3. **View / Window / Help:** Stay in `platformOverlay` permanently, or eventually move non-command items into a separate “shell manifest”?

## Summary

The menu refactor already centralized **command identity** and introduced **HostPort**. The highest-value next steps are **one menu manifest with platform adapters (Option A)** and **one dialog routing strategy (B1 or B2)**, with **low-cost wins** from HostPort factory extraction (C) and deprecated API removal (D).
