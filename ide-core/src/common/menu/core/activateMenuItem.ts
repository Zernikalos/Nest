import type { CommandId } from '../commandId.js';
import { MenuItemRole } from './menuItemRole.js';
import {
    hasActivationCommand,
    hasMenuItemActivation,
    isMenuItemSeparator,
    isShellActivation,
    isWindowCloseRole,
} from './menuItemChecks.js';
import type { ResolvedMenuItem } from './resolvedMenuItem.js';
import type { MenuActivation } from './menuActivation.js';

export interface MenuActivationDeps {
    executeCommand: (commandId: CommandId, payload?: unknown) => void;
    closeWindow?: () => void;
    runEditRole?: (role: MenuItemRole) => void;
}

export function isMenuItemEnabled(item: ResolvedMenuItem): boolean {
    if (isMenuItemSeparator(item)) return false;
    return item.enabled;
}

export function activateMenuItem(item: ResolvedMenuItem, deps: MenuActivationDeps): void {
    if (!isMenuItemEnabled(item) || !hasMenuItemActivation(item)) return;
    runActivation(item.activation, deps);
}

function runActivation(activation: MenuActivation, deps: MenuActivationDeps): void {
    if (isShellActivation(activation)) {
        if (isWindowCloseRole(activation.role)) {
            deps.closeWindow?.();
            return;
        }
        deps.runEditRole?.(activation.role);
        if (hasActivationCommand(activation)) {
            deps.executeCommand(activation.commandId);
        }
        return;
    }

    if (hasActivationCommand(activation)) {
        deps.executeCommand(activation.commandId, activation.payload);
    }
}
