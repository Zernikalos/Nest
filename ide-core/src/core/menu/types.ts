import type { ImportFileFormat } from './commandIds.js';

/** Clipboard / window role handled by the shell, not CommandService. */
export type MenuItemRole =
    | 'copy'
    | 'cut'
    | 'paste'
    | 'selectAll'
    | 'quit'
    | 'close';

export interface MenuItemDescriptor {
    id: string;
    label: string;
    /** Command executed via CommandService when the item is activated. */
    commandId?: string;
    /** Payload passed to executeCommand (e.g. import format). */
    commandPayload?: { format: ImportFileFormat };
    /** Shell role for clipboard / app exit (no commandId). */
    role?: MenuItemRole;
    /** ContextKeyService expression; omit for always enabled. */
    when?: string;
    type?: 'separator';
    submenu?: MenuItemDescriptor[];
}

export interface MenuGroupDescriptor {
    id: string;
    label: string;
    items: MenuItemDescriptor[];
}
