/**
 * Project types shared with ide-core (Nest API shape).
 */
export type {
    AssetFormat,
    AssetConversionInput,
    AssetConversionResult,
    IInputAsset,
    Project,
} from '@ide-core';

/** Alias used by vueui composables for asset conversion requests. */
export type AssetConversionData = import('@ide-core').AssetConversionInput;

export interface CreateProjectDTO {
    name: string;
    filePath: string;
}

/**
 * Minimal ZkResult shape for zkoStore (editor phase will extend).
 */
export interface ZkResultExtended {
    zko: unknown;
    filePath: string;
    proto: Uint8Array;
    /** Exported objects from conversion (for Code tab editable JSON). */
    exported?: {
        objects: Array<{ refId: string; toJSON?: () => unknown; [key: string]: unknown }>;
    };
}
