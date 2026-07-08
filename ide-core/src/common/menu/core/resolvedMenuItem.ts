import type { MenuActivation } from './menuActivation.js';
import type { MenuItemKind } from './menuItemKind.js';

export interface ResolvedMenuItem {
    id: string;
    label: string;
    kind: MenuItemKind;
    enabled: boolean;
    children?: ResolvedMenuItem[];
    activation?: MenuActivation;
}
