import type { AssetFormat } from '../common/domain/enums.js';
import type {
    ImportFileDialogResult,
    LoadZkoDialogResult,
} from '../common/host/dialogTypes.js';
import type { HostDialogsPort } from '../common/host/hostDialogsPort.js';
import { HostDialogIpcChannel } from './hostDialogIpc.js';

export type HostDialogInvoke = (
    channel: HostDialogIpcChannel,
    ...args: unknown[]
) => Promise<unknown>;

/**
 * Renderer-side HostDialogsPort backed by ipcRenderer.invoke (preload).
 */
export function createHostDialogsPreloadBridge(invoke: HostDialogInvoke): HostDialogsPort {
    return {
        loadZko: () => invoke(HostDialogIpcChannel.LoadZko) as Promise<LoadZkoDialogResult | null>,
        importFile: (format: AssetFormat) =>
            invoke(HostDialogIpcChannel.ImportFile, format) as Promise<ImportFileDialogResult | null>,
        openProject: () => invoke(HostDialogIpcChannel.OpenProject) as Promise<string | null>,
        saveProject: (projectName: string) =>
            invoke(HostDialogIpcChannel.SaveProject, projectName) as Promise<string | null>,
        saveBundledScene: (fileData: Uint8Array) =>
            invoke(HostDialogIpcChannel.SaveBundledScene, fileData) as Promise<void>,
    };
}
