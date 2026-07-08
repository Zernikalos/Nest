import type { BrowserWindow } from 'electron';
import type { AssetFormat, ImportFileDialogResult, LoadZkoDialogResult } from '@ide-core';
import { loadZkoDialog } from '../dialogs/loadZkoDialog';
import { importFileDialog } from '../dialogs/importFileDialog';
import { openProjectDialog } from '../dialogs/openProjectDialog';
import _ from 'lodash';

export async function runLoadZkoDialog(
    browserWindow: BrowserWindow,
): Promise<LoadZkoDialogResult | null> {
    const pathInfo = await loadZkoDialog(browserWindow);
    if (_.isNil(pathInfo)) return null;
    return {
        path: pathInfo.parsedPath.dir,
        fileName: pathInfo.parsedPath.base,
    };
}

export async function runImportFileDialog(
    browserWindow: BrowserWindow,
    format: AssetFormat,
): Promise<ImportFileDialogResult | null> {
    const pathInfo = await importFileDialog(browserWindow, format);
    if (_.isNil(pathInfo)) return null;
    return {
        path: pathInfo.parsedPath.dir,
        fileName: pathInfo.parsedPath.base,
        format,
    };
}

export async function runOpenProjectDialog(
    browserWindow: BrowserWindow,
): Promise<string | null> {
    const pathInfo = await openProjectDialog(browserWindow);
    return pathInfo?.filePath ?? null;
}
