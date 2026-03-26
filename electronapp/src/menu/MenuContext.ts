/**
 * Snapshot of runtime context keys sent from renderer to main
 * for dynamic menu enable/disable (Phase 4).
 */
export interface MenuContextSnapshot {
    projectOpen: boolean;
}

export const DEFAULT_MENU_CONTEXT: MenuContextSnapshot = {
    projectOpen: false,
};
