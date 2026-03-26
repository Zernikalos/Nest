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

/** Input asset format for project asset list (matches Nest API shape). */
export type AssetFormat = 'obj' | 'gltf' | 'fbx' | 'collada';

/** Input asset record as returned by project API. */
export interface IInputAsset {
    id: string;
    path: string;
    fileName: string;
    format: AssetFormat;
    importedAt: string;
}

/** Minimal project shape for runtime (matches Nest API response). */
export interface Project {
    name: string;
    version: string;
    createdAt: string;
    lastModified: string;
    zkBuilderVersion?: string;
    assets?: IInputAsset[];
}

/** Input for asset-to-ZKO conversion (path, fileName, format). */
export interface AssetConversionInput {
    path: string;
    fileName: string;
    format: AssetFormat;
}

/** Result of asset conversion (zko, proto, optional exported objects). */
export interface AssetConversionResult {
    zko: unknown;
    filePath: string;
    proto: Uint8Array;
    exported?: {
        objects: Array<{ refId: string; toJSON?: () => unknown; [key: string]: unknown }>;
    };
}
