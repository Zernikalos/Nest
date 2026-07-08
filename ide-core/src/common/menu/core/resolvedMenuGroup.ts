import type { ResolvedMenuItem } from './resolvedMenuItem.js';

export interface ResolvedMenuGroup {
    id: string;
    label: string;
    items: ResolvedMenuItem[];
}
