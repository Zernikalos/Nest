import { AssetFormat } from '../domain/enums.js';
import { CommandId } from './commandId.js';
import { MenuItemKind, MenuItemRole } from './core/index.js';
import type { MenuGroupDescriptor } from './core/index.js';

/**
 * Application menu structure for in-renderer menu bar (Windows/Linux).
 * macOS uses the native Electron menu built from the same command ids.
 */
export const APP_MENU_MANIFEST: MenuGroupDescriptor[] = [
    {
        id: 'file',
        label: 'File',
        items: [
            {
                id: 'file.newProject',
                label: 'New Project…',
                commandId: CommandId.FILE_CREATE_PROJECT,
            },
            {
                id: 'file.openProject',
                label: 'Open Project…',
                commandId: CommandId.FILE_OPEN_PROJECT,
            },
            { id: 'file.sep1', label: '', kind: MenuItemKind.Separator },
            {
                id: 'file.loadZko',
                label: 'Load Zko file',
                commandId: CommandId.FILE_LOAD_ZKO,
                when: 'projectOpen',
            },
            { id: 'file.sep2', label: '', kind: MenuItemKind.Separator },
            {
                id: 'file.import',
                label: 'Import file…',
                when: 'projectOpen',
                submenu: [
                    {
                        id: 'file.import.gltf',
                        label: 'Import GlTF (.gltf, .glb)',
                        commandId: CommandId.FILE_IMPORT_FILE,
                        commandPayload: { format: AssetFormat.Gltf },
                        when: 'projectOpen',
                    },
                    {
                        id: 'file.import.obj',
                        label: 'Import OBJ (.obj)',
                        commandId: CommandId.FILE_IMPORT_FILE,
                        commandPayload: { format: AssetFormat.Obj },
                        when: 'projectOpen',
                    },
                    {
                        id: 'file.import.fbx',
                        label: 'Import FBX (.fbx)',
                        commandId: CommandId.FILE_IMPORT_FILE,
                        commandPayload: { format: AssetFormat.Fbx },
                        when: 'projectOpen',
                    },
                    {
                        id: 'file.import.collada',
                        label: 'Import Collada (.dae)',
                        commandId: CommandId.FILE_IMPORT_FILE,
                        commandPayload: { format: AssetFormat.Collada },
                        when: 'projectOpen',
                    },
                ],
            },
            { id: 'file.sep3', label: '', kind: MenuItemKind.Separator },
            { id: 'file.quit', label: 'Exit', role: MenuItemRole.Quit },
        ],
    },
    {
        id: 'edit',
        label: 'Edit',
        items: [
            {
                id: 'edit.copy',
                label: 'Copy',
                role: MenuItemRole.Copy,
                commandId: CommandId.EDIT_COPY,
            },
            {
                id: 'edit.cut',
                label: 'Cut',
                role: MenuItemRole.Cut,
                commandId: CommandId.EDIT_CUT,
            },
            {
                id: 'edit.paste',
                label: 'Paste',
                role: MenuItemRole.Paste,
                commandId: CommandId.EDIT_PASTE,
            },
            {
                id: 'edit.selectAll',
                label: 'Select All',
                role: MenuItemRole.SelectAll,
                commandId: CommandId.EDIT_SELECT_ALL,
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
                commandId: CommandId.FILE_BUNDLE_SCENE,
                when: 'projectOpen',
            },
        ],
    },
];
