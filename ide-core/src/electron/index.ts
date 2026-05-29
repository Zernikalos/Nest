/**
 * @zstudio/ide-core — Electron main/preload host contracts (no `electron` imports).
 */
export { IdeIpcChannel } from './ipcChannels.js';
export type { ExecuteCommandMessage } from './executeCommand.js';
export {
    DEFAULT_MENU_CONTEXT,
    type MenuContextSnapshot,
} from '../common/host/menuContext.js';
