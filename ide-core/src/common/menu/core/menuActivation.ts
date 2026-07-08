import type { CommandId } from '../commandId.js';
import type { MenuItemRole } from './menuItemRole.js';

export interface MenuActivation {
    commandId?: CommandId;
    payload?: unknown;
    role?: MenuItemRole;
}
