import type { AssetFormat } from '../domain/enums.js';

export interface LoadZkoDialogResult {
    path: string;
    fileName: string;
}

export interface ImportFileDialogResult {
    path: string;
    fileName: string;
    format: AssetFormat;
}
