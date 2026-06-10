import { BrowserWindow, dialog } from 'electron';
import { AssetFormat } from '@ide-core';
import { cleanDialogReturnValue, PathInfo } from './cleanDialogReturnValue';
import { prepareWindowForDialog } from './prepareWindowForDialog';
import OpenDialogOptions = Electron.OpenDialogOptions;
import _ from 'lodash';

function buildFiltersFromFormat(format: AssetFormat) {
    switch (format) {
        case AssetFormat.Gltf:
            return { name: 'GLTF', extensions: ['gltf', 'glb'] };
        case AssetFormat.Obj:
            return { name: 'OBJ', extensions: ['obj'] };
        case AssetFormat.Fbx:
            return { name: 'FBX', extensions: ['fbx'] };
        case AssetFormat.Collada:
            return { name: 'Collada', extensions: ['dae'] };
        default:
            return { name: 'All Files', extensions: ['*'] };
    }
}

let lastPath: string | undefined = undefined;

export async function importFileDialog(
    browserWindow: BrowserWindow,
    format: AssetFormat,
): Promise<PathInfo | undefined> {
    const filter = buildFiltersFromFormat(format);
    const config: OpenDialogOptions = {
        title: 'Import file',
        buttonLabel: 'Import',
        filters: [filter, { name: 'All Files', extensions: ['*'] }],
        properties: ['openFile'],
    };
    if (!_.isNil(lastPath)) {
        config.defaultPath = lastPath;
    }

    await prepareWindowForDialog(browserWindow);
    const dialogReturnValue = await dialog.showOpenDialog(browserWindow, config);
    const cleanedValue = cleanDialogReturnValue(dialogReturnValue);
    if (cleanedValue) {
        lastPath = cleanedValue.filePath;
    }
    return cleanedValue;
}
