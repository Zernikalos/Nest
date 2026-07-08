import type { CommandId } from '../commandId.js';
import type { MenuItemKind } from './menuItemKind.js';
import type { MenuItemRole } from './menuItemRole.js';

export interface MenuItemDescriptor {
    id: string;
    label: string;
    /** Command executed via CommandService when the item is activated. */
    commandId?: CommandId;
    /** Payload passed to executeCommand (e.g. import format). */
    commandPayload?: unknown;
    /** Shell role for clipboard / app exit (no commandId). */
    role?: MenuItemRole;
    /** ContextKeyService expression; omit for always enabled. */
    when?: string;
    /** Explicit kind; only separators set this in the manifest (others are inferred). */
    kind?: MenuItemKind;
    submenu?: MenuItemDescriptor[];
}
