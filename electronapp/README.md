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
| `ide:menuContext` | **macOS only** — rebuild native menu when `projectOpen` changes |

### Menu commands

Command IDs live in **ide-core** (`APP_MENU_MANIFEST`, `commandIds.ts`). The renderer executes them via `CommandService`; macOS native menu still forwards over `RendererMenuEvents` IPC.
