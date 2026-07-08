import type { MenuItemConstructorOptions } from 'electron';
import {
    MenuItemRole,
    hasMenuItemActivation,
    hasMenuItemRoleActivation,
    hasMenuItemSubmenuChildren,
    isMenuItemSeparator,
} from '@ide-core';
import type { MenuActivation, ResolvedMenuGroup, ResolvedMenuItem } from '@ide-core';
import { ExitMenuRole, getPlatformProfile } from '../platform/platformProfile';

const EDIT_ACCELERATORS: Partial<Record<MenuItemRole, string>> = {
    [MenuItemRole.Copy]: 'CmdOrCtrl+C',
    [MenuItemRole.Cut]: 'CmdOrCtrl+X',
    [MenuItemRole.Paste]: 'CmdOrCtrl+V',
    [MenuItemRole.SelectAll]: 'CmdOrCtrl+A',
};

function toElectronRole(role: MenuItemRole): MenuItemConstructorOptions['role'] {
    switch (role) {
        case MenuItemRole.Copy:
            return 'copy';
        case MenuItemRole.Cut:
            return 'cut';
        case MenuItemRole.Paste:
            return 'paste';
        case MenuItemRole.SelectAll:
            return 'selectAll';
        case MenuItemRole.Quit:
            return getPlatformProfile().exitMenuRole === ExitMenuRole.Close ? 'close' : 'quit';
        case MenuItemRole.Close:
            return 'close';
        default:
            return undefined;
    }
}

function buildItem(
    item: ResolvedMenuItem,
    onActivate: (activation: MenuActivation) => void,
): MenuItemConstructorOptions {
    if (isMenuItemSeparator(item)) {
        return { type: 'separator' };
    }

    if (hasMenuItemSubmenuChildren(item)) {
        return {
            label: item.label,
            enabled: item.enabled,
            submenu: item.children.map((child) => buildItem(child, onActivate)),
        };
    }

    if (hasMenuItemRoleActivation(item)) {
        const electronRole = toElectronRole(item.activation.role);
        if (electronRole) {
            return {
                label: item.label,
                role: electronRole,
                accelerator: EDIT_ACCELERATORS[item.activation.role],
            };
        }
    }

    return {
        label: item.label,
        enabled: item.enabled,
        click: () => {
            if (hasMenuItemActivation(item)) {
                onActivate(item.activation);
            }
        },
    };
}

export function buildElectronMenuFromResolved(
    groups: ResolvedMenuGroup[],
    onActivate: (activation: MenuActivation) => void,
): MenuItemConstructorOptions[] {
    return groups.map((group) => ({
        label: group.label,
        submenu: group.items.map((item) => buildItem(item, onActivate)),
    }));
}
