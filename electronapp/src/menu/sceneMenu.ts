import { CommandId } from '@ide-core';
import type { MenuContextSnapshot } from '@ide-core/electron';
import { emitMenuCommand } from './nativeMenuBus';

export function getSceneMenuTemplate(
    context: MenuContextSnapshot,
): Electron.MenuItemConstructorOptions {
    return {
        label: 'Scene',
        submenu: [
            {
                label: 'Bundle Scene',
                enabled: context.projectOpen,
                click: () => {
                    emitMenuCommand(CommandId.FILE_BUNDLE_SCENE);
                },
            },
        ],
    };
}
