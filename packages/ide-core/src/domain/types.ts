/**
 * Serializable types for runtime view models.
 * No ReactNode - icons are type identifiers resolved by the renderer.
 */

export interface TreeNode {
    id: string;
    label: string;
    /** Object type for icon resolution (e.g. "SCENE", "MODEL", "GROUP") */
    iconType?: string;
    children?: TreeNode[];
    expanded?: boolean;
}

/** Minimal ZObject shape for conversion - compatible with zernikalos.objects.ZObject */
export interface ZObjectLike {
    refId: string;
    name: string;
    type?: string;
    children?: ZObjectLike[];
}
