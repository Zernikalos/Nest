/**
 * Snapshot of runtime context keys sent from renderer to host
 * for dynamic menu enable/disable.
 */
export interface MenuContextSnapshot {
    projectOpen: boolean;
}

export const DEFAULT_MENU_CONTEXT: MenuContextSnapshot = {
    projectOpen: false,
};
