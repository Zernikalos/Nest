import { includes, isNil } from 'lodash';
import type { CommandId } from '../commandId.js';
import { MenuItemKind } from './menuItemKind.js';
import { MenuItemRole } from './menuItemRole.js';
import type { MenuActivation } from './menuActivation.js';
import type { MenuItemDescriptor } from './menuItemDescriptor.js';
import type { ResolvedMenuItem } from './resolvedMenuItem.js';

export type MenuItem = MenuItemDescriptor | ResolvedMenuItem;

const SHELL_ROLES: MenuItemRole[] = [
    MenuItemRole.Copy,
    MenuItemRole.Cut,
    MenuItemRole.Paste,
    MenuItemRole.SelectAll,
    MenuItemRole.Quit,
    MenuItemRole.Close,
];

export function isMenuItemResolved(item: MenuItem): item is ResolvedMenuItem {
    return 'enabled' in item;
}

export function isMenuItemSeparator(item: MenuItem): boolean {
    return item.kind === MenuItemKind.Separator;
}

export function isMenuItemSubmenu(item: MenuItem): boolean {
    if (isMenuItemResolved(item)) return item.kind === MenuItemKind.Submenu;
    return (item.submenu?.length ?? 0) > 0;
}

export function isMenuItemRole(item: MenuItem): boolean {
    if (isMenuItemResolved(item)) return item.kind === MenuItemKind.Role;
    return !isNil(item.role);
}

export function isMenuItemCommand(item: MenuItem): boolean {
    if (isMenuItemResolved(item)) return item.kind === MenuItemKind.Command;
    return !isNil(item.commandId);
}

export function hasMenuItemSubmenuChildren(
    item: MenuItem,
): item is
    | (MenuItemDescriptor & { submenu: MenuItemDescriptor[] })
    | (ResolvedMenuItem & { children: ResolvedMenuItem[] }) {
    if (isMenuItemResolved(item)) {
        return item.kind === MenuItemKind.Submenu && (item.children?.length ?? 0) > 0;
    }
    return (item.submenu?.length ?? 0) > 0;
}

export function hasMenuItemRole(
    item: MenuItem,
): item is
    | (MenuItemDescriptor & { role: MenuItemRole })
    | (ResolvedMenuItem & {
          kind: MenuItemKind.Role;
          activation: MenuActivation & { role: MenuItemRole };
      }) {
    if (isMenuItemResolved(item)) {
        return item.kind === MenuItemKind.Role && !isNil(item.activation) && hasActivationRole(item.activation);
    }
    return !isNil(item.role);
}

export function hasMenuItemCommand(
    item: MenuItem,
): item is
    | (MenuItemDescriptor & { commandId: CommandId })
    | (ResolvedMenuItem & {
          kind: MenuItemKind.Command;
          activation: MenuActivation & { commandId: CommandId };
      }) {
    if (isMenuItemResolved(item)) {
        return (
            item.kind === MenuItemKind.Command &&
            !isNil(item.activation) &&
            hasActivationCommand(item.activation)
        );
    }
    return !isNil(item.commandId);
}

export function isMenuItemShellRole(item: MenuItemDescriptor): item is MenuItemDescriptor & {
    role: MenuItemRole;
} {
    return hasMenuItemRole(item) && isShellRole(item.role);
}

export function hasMenuItemActivation(
    item: MenuItem,
): item is ResolvedMenuItem & { activation: MenuActivation } {
    return isMenuItemResolved(item) && !isNil(item.activation);
}

export function hasMenuItemRoleActivation(
    item: MenuItem,
): item is ResolvedMenuItem & { activation: MenuActivation & { role: MenuItemRole } } {
    return hasMenuItemActivation(item) && hasActivationRole(item.activation);
}

export function isShellRole(role: MenuItemRole): boolean {
    return includes(SHELL_ROLES, role);
}

export function isWindowCloseRole(role: MenuItemRole): boolean {
    return role === MenuItemRole.Quit || role === MenuItemRole.Close;
}

export function hasActivationCommand(
    activation: MenuActivation,
): activation is MenuActivation & { commandId: CommandId } {
    return !isNil(activation.commandId);
}

export function hasActivationRole(
    activation: MenuActivation,
): activation is MenuActivation & { role: MenuItemRole } {
    return !isNil(activation.role);
}

export function isShellActivation(
    activation: MenuActivation,
): activation is MenuActivation & { role: MenuItemRole } {
    return hasActivationRole(activation) && isShellRole(activation.role);
}
