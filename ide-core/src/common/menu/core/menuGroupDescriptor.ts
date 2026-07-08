import type { MenuItemDescriptor } from './menuItemDescriptor.js';

export interface MenuGroupDescriptor {
    id: string;
    label: string;
    items: MenuItemDescriptor[];
}
