import {
    FILE_BUNDLE_SCENE,
    FILE_CREATE_PROJECT,
    FILE_IMPORT_FILE,
    FILE_LOAD_ZKO,
    FILE_OPEN_PROJECT,
    EDIT_COPY,
    EDIT_CUT,
    EDIT_PASTE,
    EDIT_SELECT_ALL,
} from './commandIds.js';
import type { MenuGroupDescriptor } from './types.js';

/**
 * Application menu structure for in-renderer menu bar (Windows/Linux).
 * macOS uses the native Electron menu built from the same command ids.
 */
export const APP_MENU_MANIFEST: MenuGroupDescriptor[] = [
    {
        id: 'file',
        label: 'File',
        items: [
            { id: 'file.newProject', label: 'New Project…', commandId: FILE_CREATE_PROJECT },
            { id: 'file.openProject', label: 'Open Project…', commandId: FILE_OPEN_PROJECT },
            { id: 'file.sep1', label: '', type: 'separator' },
            {
                id: 'file.loadZko',
                label: 'Load Zko file',
                commandId: FILE_LOAD_ZKO,
                when: 'projectOpen',
            },
            { id: 'file.sep2', label: '', type: 'separator' },
            {
                id: 'file.import',
                label: 'Import file…',
                when: 'projectOpen',
                submenu: [
                    {
                        id: 'file.import.gltf',
                        label: 'Import GlTF (.gltf, .glb)',
                        commandId: FILE_IMPORT_FILE,
                        commandPayload: { format: 'gltf' },
                        when: 'projectOpen',
                    },
                    {
                        id: 'file.import.obj',
                        label: 'Import OBJ (.obj)',
                        commandId: FILE_IMPORT_FILE,
                        commandPayload: { format: 'obj' },
                        when: 'projectOpen',
                    },
                    {
                        id: 'file.import.fbx',
                        label: 'Import FBX (.fbx)',
                        commandId: FILE_IMPORT_FILE,
                        commandPayload: { format: 'fbx' },
                        when: 'projectOpen',
                    },
                    {
                        id: 'file.import.collada',
                        label: 'Import Collada (.dae)',
                        commandId: FILE_IMPORT_FILE,
                        commandPayload: { format: 'collada' },
                        when: 'projectOpen',
                    },
                ],
            },
            { id: 'file.sep3', label: '', type: 'separator' },
            { id: 'file.quit', label: 'Exit', role: 'quit' },
        ],
    },
    {
        id: 'edit',
        label: 'Edit',
        items: [
            { id: 'edit.copy', label: 'Copy', role: 'copy', commandId: EDIT_COPY },
            { id: 'edit.cut', label: 'Cut', role: 'cut', commandId: EDIT_CUT },
            { id: 'edit.paste', label: 'Paste', role: 'paste', commandId: EDIT_PASTE },
            {
                id: 'edit.selectAll',
                label: 'Select All',
                role: 'selectAll',
                commandId: EDIT_SELECT_ALL,
            },
        ],
    },
    {
        id: 'scene',
        label: 'Scene',
        items: [
            {
                id: 'scene.bundle',
                label: 'Bundle Scene',
                commandId: FILE_BUNDLE_SCENE,
                when: 'projectOpen',
            },
        ],
    },
];
