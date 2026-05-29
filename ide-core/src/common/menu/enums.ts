import type { AssetFormat } from '../domain/enums.js';

/** File menu command ids (shared by renderer menu and Electron native menu). */
export enum CommandId {
    FILE_LOAD_ZKO = 'file.loadZko',
    FILE_IMPORT_FILE = 'file.importFile',
    FILE_BUNDLE_SCENE = 'file.bundleScene',
    FILE_CREATE_PROJECT = 'file.createProject',
    FILE_OPEN_PROJECT = 'file.openProject',
    EDIT_COPY = 'edit.copy',
    EDIT_CUT = 'edit.cut',
    EDIT_PASTE = 'edit.paste',
    EDIT_SELECT_ALL = 'edit.selectAll',
}

/** Clipboard / window role handled by the shell, not CommandService. */
export enum MenuItemRole {
    Copy = 'copy',
    Cut = 'cut',
    Paste = 'paste',
    SelectAll = 'selectAll',
    Quit = 'quit',
    Close = 'close',
}

export enum MenuItemKind {
    Separator = 'separator',
}

/** Payload passed to executeCommand for file import. */
export interface ImportFileCommandPayload {
    format: AssetFormat;
}
