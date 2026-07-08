import { evaluateMenuWhen } from './menuEvaluation.js';
import { MenuItemKind } from './menuItemKind.js';
import {
    hasMenuItemRole,
    hasMenuItemSubmenuChildren,
    isMenuItemSeparator,
} from './menuItemChecks.js';
import type { ResolvedMenuGroup } from './resolvedMenuGroup.js';
import type { ResolvedMenuItem } from './resolvedMenuItem.js';
import type { MenuGroupDescriptor } from './menuGroupDescriptor.js';
import type { MenuItemDescriptor } from './menuItemDescriptor.js';

export function menuContextToKeys(context: { projectOpen: boolean }): Record<string, unknown> {
    return { projectOpen: context.projectOpen };
}

function resolveItem(
    item: MenuItemDescriptor,
    contextKeys: Readonly<Record<string, unknown>>,
): ResolvedMenuItem {
    if (isMenuItemSeparator(item)) {
        return {
            id: item.id,
            label: item.label,
            kind: MenuItemKind.Separator,
            enabled: false,
        };
    }

    const enabled = evaluateMenuWhen(item.when, contextKeys);

    if (hasMenuItemSubmenuChildren(item)) {
        return {
            id: item.id,
            label: item.label,
            kind: MenuItemKind.Submenu,
            enabled,
            children: item.submenu.map((child) => resolveItem(child, contextKeys)),
        };
    }

    if (hasMenuItemRole(item)) {
        return {
            id: item.id,
            label: item.label,
            kind: MenuItemKind.Role,
            enabled,
            activation: { role: item.role, commandId: item.commandId },
        };
    }

    return {
        id: item.id,
        label: item.label,
        kind: MenuItemKind.Command,
        enabled,
        activation: {
            commandId: item.commandId,
            payload: item.commandPayload,
        },
    };
}

export function resolveMenuManifest(
    manifest: MenuGroupDescriptor[],
    contextKeys: Readonly<Record<string, unknown>>,
): ResolvedMenuGroup[] {
    return manifest.map((group) => ({
        id: group.id,
        label: group.label,
        items: group.items.map((item) => resolveItem(item, contextKeys)),
    }));
}
