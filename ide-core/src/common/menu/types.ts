import type { AssetFormat } from '../domain/enums.js';
import type { CommandId, MenuItemRole, MenuItemKind } from './enums.js';

export interface MenuItemDescriptor {
    id: string;
    label: string;
    /** Command executed via CommandService when the item is activated. */
    commandId?: CommandId;
    /** Payload passed to executeCommand (e.g. import format). */
    commandPayload?: { format: AssetFormat };
    /** Shell role for clipboard / app exit (no commandId). */
    role?: MenuItemRole;
    /** ContextKeyService expression; omit for always enabled. */
    when?: string;
    type?: MenuItemKind.Separator;
    submenu?: MenuItemDescriptor[];
}

export interface MenuGroupDescriptor {
    id: string;
    label: string;
    items: MenuItemDescriptor[];
}
