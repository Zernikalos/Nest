import type { BrowserWindow } from 'electron';
import type { AssetFormat, HostDialogsPort } from '@ide-core';
import { createProjectDialog } from '../dialogs/createProjectDialog';
import { bundleSceneDialog } from '../dialogs/bundleSceneDialog';
import {
    runImportFileDialog,
    runLoadZkoDialog,
    runOpenProjectDialog,
} from './dialogRunners';
import * as fs from 'node:fs/promises';
import _ from 'lodash';

/**
 * Main-process HostDialogsPort backed by native Electron dialogs.
 * Callable directly from main or via registerHostDialogIpcHandlers.
 */
export function createElectronDialogHost(
    getBrowserWindow: () => BrowserWindow | undefined,
): HostDialogsPort {
    return {
        loadZko: async () => {
            const win = getBrowserWindow();
            if (!win) return null;
            return runLoadZkoDialog(win);
        },
        importFile: async (format: AssetFormat) => {
            const win = getBrowserWindow();
            if (!win) return null;
            return runImportFileDialog(win, format);
        },
        openProject: async () => {
            const win = getBrowserWindow();
            if (!win) return null;
            return runOpenProjectDialog(win);
        },
        saveProject: async (projectName: string) => {
            const win = getBrowserWindow();
            if (!win) return null;
            const pathInfo = await createProjectDialog(win, projectName);
            return pathInfo?.filePath ?? null;
        },
        saveBundledScene: async (fileData: Uint8Array) => {
            const win = getBrowserWindow();
            if (!win) return;
            const pathInfo = await bundleSceneDialog(win);
            if (_.isNil(pathInfo)) return;
            try {
                await fs.writeFile(pathInfo.filePath, fileData);
            } catch (e) {
                console.log(`Unable to write file to ${pathInfo.filePath}. Error: ${e}`);
            }
        },
    };
}
