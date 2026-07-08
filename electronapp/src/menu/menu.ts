import { Menu } from 'electron';
import {
    APP_MENU_MANIFEST,
    resolveMenuManifest,
    menuContextToKeys,
    type MenuActivation,
} from '@ide-core';
import { DEFAULT_MENU_CONTEXT, type MenuContextSnapshot } from '@ide-core/electron';
import { getPlatformProfile, MenuPresentation } from '../platform/platformProfile';
import { buildElectronMenuFromResolved } from './manifestAdapter';
import { buildMacAppMenu, buildShellMenuSuffix } from './platformOverlay';
import { emitMenuCommand } from './menuCommandForward';

export function createMenu(context: MenuContextSnapshot = DEFAULT_MENU_CONTEXT): Electron.Menu {
    const ctx = context ?? DEFAULT_MENU_CONTEXT;
    const profile = getPlatformProfile();
    const contextKeys = menuContextToKeys(ctx);
    const resolved = resolveMenuManifest(APP_MENU_MANIFEST, contextKeys);

    const onActivate = (activation: MenuActivation) => {
        if (!activation.commandId) return;
        emitMenuCommand(activation.commandId, activation.payload);
    };

    const appMenuGroups = buildElectronMenuFromResolved(resolved, onActivate);
    const macAppMenu = buildMacAppMenu();
    const template = [
        ...(macAppMenu ? [macAppMenu] : []),
        ...appMenuGroups,
        ...buildShellMenuSuffix(),
    ];

    const menu = Menu.buildFromTemplate(template);
    if (profile.menuPresentation === MenuPresentation.Native) {
        Menu.setApplicationMenu(menu);
    } else {
        Menu.setApplicationMenu(null);
    }
    return menu;
}

/** Clears native menu on platforms that use in-renderer chrome. */
export function clearApplicationMenu(): void {
    if (getPlatformProfile().menuPresentation !== MenuPresentation.Native) {
        Menu.setApplicationMenu(null);
    }
}
