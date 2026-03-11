/**
 * Serializable types for runtime view models.
 * No ReactNode or framework-specific types; icons are type identifiers (e.g. "SCENE") resolved by the renderer.
 */

/** Tree node shape used by the scene tree view model. Safe to serialize for session/store. */
export interface TreeNode {
    id: string;
    label: string;
    /** Object type for icon resolution (e.g. "SCENE", "MODEL", "GROUP") */
    iconType?: string;
    children?: TreeNode[];
    expanded?: boolean;
}

/** Minimal ZObject shape for conversion - compatible with zernikalos.objects.ZObject. */
export interface ZObjectLike {
    refId: string;
    name: string;
    type?: string;
    children?: ZObjectLike[];
}

/** Workbench panel area. Layout is defined by the runtime; the UI projects it. */
export type WorkbenchArea = 'left' | 'right' | 'bottom' | 'center';
