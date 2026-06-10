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
| `host:dialog:*` (`HostDialogIpcChannel`) | File dialogs via `HostDialogsPort` |
| `IdeIpcChannel.MenuContext` (`ide:menuContext`) | Sync native application menu enablement (main no-ops on non-native platforms) |
| `IdeIpcChannel.ExecuteCommand` (`ide:executeCommand`) | Main → renderer: execute a `commandId` with optional payload |

Channel constants are defined in `@ide-core/electron` (`IdeIpcChannel`, `HostDialogIpcChannel`).

### Host dialogs

Main implements `HostDialogsPort` in `src/host/electronDialogHost.ts`. Preload exposes the same API via `createHostDialogsPreloadBridge` from `@ide-core/electron`.

### Menu commands

Command IDs and menu structure live in **ide-core** (`APP_MENU_MANIFEST`, `CommandId`). macOS builds the native menu from `resolveMenuManifest` + `manifestAdapter.ts`; Win/Linux use `AppMenuBar` in vueui.

Native macOS menu clicks call `emitMenuCommand` in `menuCommandForward.ts`, which forwards to the renderer via `IdeIpcChannel.ExecuteCommand` (B1 routing: dialogs run in renderer via `HostPort`).

Import rule: use `@ide-core` and `@ide-core/electron` only — not deep paths under `ide-core/src/`.
