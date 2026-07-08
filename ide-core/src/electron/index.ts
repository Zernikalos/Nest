/**
 * @zstudio/ide-core — Electron main/preload host contracts (no `electron` imports).
 */
export { IdeIpcChannel } from './ipcChannels.js';
export type { ExecuteCommandMessage } from './executeCommand.js';
export { HostDialogIpcChannel } from './hostDialogIpc.js';
export { createHostDialogsPreloadBridge } from './createHostDialogsPreloadBridge.js';
export type { HostDialogInvoke } from './createHostDialogsPreloadBridge.js';
export type { HostDialogsPort } from '../common/host/hostDialogsPort.js';
export type { LoadZkoDialogResult, ImportFileDialogResult } from '../common/host/dialogTypes.js';
export {
    DEFAULT_MENU_CONTEXT,
    type MenuContextSnapshot,
} from '../common/host/menuContext.js';
