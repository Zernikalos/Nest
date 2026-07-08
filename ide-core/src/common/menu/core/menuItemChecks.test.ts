import { CommandId } from '../commandId.js';
import { MenuItemKind } from './menuItemKind.js';
import { MenuItemRole } from './menuItemRole.js';
import {
    hasMenuItemCommand,
    hasMenuItemRole,
    hasMenuItemSubmenuChildren,
    isMenuItemCommand,
    isMenuItemRole,
    isMenuItemSeparator,
    isMenuItemSubmenu,
    isShellRole,
    isWindowCloseRole,
} from './menuItemChecks.js';
import type { MenuItemDescriptor } from './menuItemDescriptor.js';
import type { ResolvedMenuItem } from './resolvedMenuItem.js';

describe('menuItemChecks', () => {
    const separator: MenuItemDescriptor = {
        id: 'sep',
        label: '',
        kind: MenuItemKind.Separator,
    };

    const command: MenuItemDescriptor = {
        id: 'cmd',
        label: 'Command',
        commandId: CommandId.FILE_OPEN_PROJECT,
    };

    const submenu: MenuItemDescriptor = {
        id: 'sub',
        label: 'Sub',
        submenu: [command],
    };

    const roleItem: MenuItemDescriptor = {
        id: 'role',
        label: 'Copy',
        role: MenuItemRole.Copy,
    };

    it('detects descriptor shapes', () => {
        expect(isMenuItemSeparator(separator)).toBe(true);
        expect(isMenuItemSubmenu(submenu)).toBe(true);
        expect(hasMenuItemSubmenuChildren(submenu)).toBe(true);
        expect(hasMenuItemRole(roleItem)).toBe(true);
        expect(isMenuItemRole(roleItem)).toBe(true);
        expect(hasMenuItemCommand(command)).toBe(true);
        expect(isMenuItemCommand(command)).toBe(true);
    });

    it('detects resolved shapes', () => {
        const resolvedSeparator: ResolvedMenuItem = {
            id: 'sep',
            label: '',
            kind: MenuItemKind.Separator,
            enabled: false,
        };
        const resolvedSubmenu: ResolvedMenuItem = {
            id: 'sub',
            label: 'Sub',
            kind: MenuItemKind.Submenu,
            enabled: true,
            children: [],
        };

        expect(isMenuItemSeparator(resolvedSeparator)).toBe(true);
        expect(isMenuItemSubmenu(resolvedSubmenu)).toBe(true);
        expect(
            isMenuItemRole({ id: 'r', label: 'R', kind: MenuItemKind.Role, enabled: true }),
        ).toBe(true);
        expect(
            isMenuItemCommand({ id: 'c', label: 'C', kind: MenuItemKind.Command, enabled: true }),
        ).toBe(true);
    });

    it('detects shell and window-close roles', () => {
        expect(isShellRole(MenuItemRole.Copy)).toBe(true);
        expect(isShellRole(MenuItemRole.Quit)).toBe(true);
        expect(isWindowCloseRole(MenuItemRole.Quit)).toBe(true);
        expect(isWindowCloseRole(MenuItemRole.Close)).toBe(true);
        expect(isWindowCloseRole(MenuItemRole.Copy)).toBe(false);
    });
});
