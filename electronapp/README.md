# Zernikalos Nest — Electron main process

## Custom window chrome (Windows / Linux)

On **Windows** and **Linux**, the app uses a **frameless** `BrowserWindow` (`frame: false`). The title bar, app menu, logo, and window controls are rendered in a single **vueui** bar (`AppTitleBar`).

On **macOS**, the system window frame and native application menu are kept.

### IPC (renderer via preload)

| Channel | Purpose |
|---------|---------|
| `window:minimize` / `window:maximize` / `window:close` | Window controls |
| `window:isMaximized` | Maximized state for title bar icon |
| `window:maximized-changed` | Event pushed to renderer |
| `window:setBackgroundColor` | Sync frameless background with UI theme |
| `menu:loadZko` / `menu:importFile` / `menu:openProject` | File dialogs for in-renderer menu |
| `IDE_IPC_CHANNELS.menuContext` (`ide:menuContext`) | Sync native application menu enablement (main no-ops on non-native platforms) |
| `IDE_IPC_CHANNELS.executeCommand` (`ide:executeCommand`) | Main → renderer: execute a `commandId` with optional payload |

Channel constants are defined in `@ide-core/electron` (`IDE_IPC_CHANNELS`).

### Menu commands

Command IDs live in **ide-core** (`@ide-core`: `APP_MENU_MANIFEST`, `commandIds.ts`). The renderer executes them via `CommandService`; the native macOS menu emits `menu:command` on `mainBus` (`eventemitter3`, see `src/events/mainBus.ts`) and the main process forwards them to the renderer via `IDE_IPC_CHANNELS.executeCommand`.

Import rule: use `@ide-core` and `@ide-core/electron` only — not deep paths under `ide-core/src/`.
