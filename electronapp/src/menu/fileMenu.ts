import type { MenuContextSnapshot } from '@ide-core/electron';
import { AssetFormat, CommandId } from '@ide-core';
import { emitMenuCommand } from './nativeMenuBus';
import { ExitMenuRole, getPlatformProfile } from '../platform/platformProfile';

export function getFileMenuTemplate(
    context: MenuContextSnapshot,
): Electron.MenuItemConstructorOptions {
    const projectOpen = context.projectOpen;
    const profile = getPlatformProfile();
    return {
        label: 'File',
        submenu: [
            {
                label: 'New Project...',
                enabled: true,
                click: () => {
                    emitMenuCommand(CommandId.FILE_CREATE_PROJECT);
                },
            },
            {
                label: 'Open Project...',
                enabled: true,
                click: () => {
                    emitMenuCommand(CommandId.FILE_OPEN_PROJECT);
                },
            },
            { type: 'separator' },
            {
                label: 'Load Zko file',
                enabled: projectOpen,
                click: () => {
                    emitMenuCommand(CommandId.FILE_LOAD_ZKO);
                },
            },
            { type: 'separator' },
            {
                label: 'Import file...',
                enabled: projectOpen,
                submenu: [
                    {
                        label: 'Import GlTF (.gltf, .glb)',
                        click: () => {
                            emitMenuCommand(CommandId.FILE_IMPORT_FILE, {
                                format: AssetFormat.Gltf,
                            });
                        },
                    },
                    {
                        label: 'Import OBJ (.obj)',
                        click: () => {
                            emitMenuCommand(CommandId.FILE_IMPORT_FILE, {
                                format: AssetFormat.Obj,
                            });
                        },
                    },
                    {
                        label: 'Import FBX (.fbx)',
                        click: () => {
                            emitMenuCommand(CommandId.FILE_IMPORT_FILE, {
                                format: AssetFormat.Fbx,
                            });
                        },
                    },
                    {
                        label: 'Import Collada (.dae)',
                        click: () => {
                            emitMenuCommand(CommandId.FILE_IMPORT_FILE, {
                                format: AssetFormat.Collada,
                            });
                        },
                    },
                ],
            },
            { type: 'separator' },
            profile.exitMenuRole === ExitMenuRole.Close
                ? { role: 'close' as const }
                : { role: 'quit' as const },
        ],
    };
}
