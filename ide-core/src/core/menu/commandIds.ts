/** File menu command ids (shared by renderer menu and Electron native menu). */
export const FILE_LOAD_ZKO = 'file.loadZko';
export const FILE_IMPORT_FILE = 'file.importFile';
export const FILE_BUNDLE_SCENE = 'file.bundleScene';
export const FILE_CREATE_PROJECT = 'file.createProject';
export const FILE_OPEN_PROJECT = 'file.openProject';

/** Edit menu roles handled in the renderer shell (clipboard). */
export const EDIT_COPY = 'edit.copy';
export const EDIT_CUT = 'edit.cut';
export const EDIT_PASTE = 'edit.paste';
export const EDIT_SELECT_ALL = 'edit.selectAll';

export type ImportFileFormat = 'gltf' | 'obj' | 'fbx' | 'collada';
