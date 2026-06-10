import type { AssetFormat } from '../domain/enums.js';
import type { ImportFileDialogResult, LoadZkoDialogResult } from './dialogTypes.js';

/**
 * Host file/system dialogs shared by Electron main, preload bridge, and renderer HostPort.
 */
export interface HostDialogsPort {
    loadZko(): Promise<LoadZkoDialogResult | null>;
    importFile(format: AssetFormat): Promise<ImportFileDialogResult | null>;
    openProject(): Promise<string | null>;
    saveProject(projectName: string): Promise<string | null>;
    saveBundledScene(fileData: Uint8Array): Promise<void>;
}
