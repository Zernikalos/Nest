export type { MenuItemDescriptor } from './menuItemDescriptor.js';
export type { MenuGroupDescriptor } from './menuGroupDescriptor.js';
export type { MenuActivation } from './menuActivation.js';
export type { ResolvedMenuItem } from './resolvedMenuItem.js';
export type { ResolvedMenuGroup } from './resolvedMenuGroup.js';
export type { MenuItem } from './menuItemChecks.js';
export { MenuItemRole } from './menuItemRole.js';
export { MenuItemKind } from './menuItemKind.js';
export { evaluateMenuWhen } from './menuEvaluation.js';
export { resolveMenuManifest, menuContextToKeys } from './resolveMenuManifest.js';
export {
    activateMenuItem,
    isMenuItemEnabled,
    type MenuActivationDeps,
} from './activateMenuItem.js';
export {
    isMenuItemResolved,
    isMenuItemSeparator,
    isMenuItemSubmenu,
    isMenuItemRole,
    isMenuItemCommand,
    hasMenuItemSubmenuChildren,
    hasMenuItemRole,
    hasMenuItemCommand,
    hasMenuItemActivation,
    hasMenuItemRoleActivation,
    isShellRole,
    isWindowCloseRole,
    hasActivationCommand,
    hasActivationRole,
    isShellActivation,
} from './menuItemChecks.js';
