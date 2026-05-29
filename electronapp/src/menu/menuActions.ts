import type { BrowserWindow } from 'electron';
import { AssetFormat } from '@ide-core';
import { loadZkoDialog } from '../dialogs/loadZkoDialog';
import { importFileDialog } from '../dialogs/importFileDialog';
import { openProjectDialog } from '../dialogs/openProjectDialog';
import _ from 'lodash';

export interface MenuActionLoadZkoResult {
    path: string;
    fileName: string;
}

export interface MenuActionImportResult {
    path: string;
    fileName: string;
    format: AssetFormat;
}

export async function runLoadZkoDialog(
    browserWindow: BrowserWindow,
): Promise<MenuActionLoadZkoResult | null> {
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
): Promise<MenuActionImportResult | null> {
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
