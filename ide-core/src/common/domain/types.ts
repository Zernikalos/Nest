/**
 * Serializable types for runtime view models.
 * No ReactNode or framework-specific types; icons are type identifiers (e.g. "SCENE") resolved by the renderer.
 */

import type { AssetFormat, ZObjectType } from './enums.js';

export { AssetFormat, WorkbenchArea, ZObjectType } from './enums.js';

/** Tree node shape used by the scene tree view model. Safe to serialize for session/store. */
export interface TreeNode {
    id: string;
    label: string;
    /** Object type for icon resolution (e.g. SCENE, MODEL, GROUP). */
    iconType?: ZObjectType | string;
    children?: TreeNode[];
    expanded?: boolean;
}

/** Minimal ZObject shape for conversion - compatible with zernikalos.objects.ZObject. */
export interface ZObjectLike {
    refId: string;
    name: string;
    /** Plain string or Kotlin/JS enum-like `{ name: "MODEL" }` from deserialized ZKO. */
    type?: string | { name: string };
    children?: ZObjectLike[];
}

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
