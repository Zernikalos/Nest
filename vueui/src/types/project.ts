/**
 * Minimal project types for API responses and store state.
 * Matches the shape returned by the nestserver projects API.
 */

export interface IInputAsset {
  id: string;
  path: string;
  fileName: string;
  format: 'obj' | 'gltf' | 'fbx' | 'collada';
  importedAt: string;
}

export interface Project {
  name: string;
  version: string;
  createdAt: string;
  lastModified: string;
  zkBuilderVersion?: string;
  assets?: IInputAsset[];
}

export interface CreateProjectDTO {
  name: string;
  filePath: string;
}

export interface AssetConversionData {
  path: string;
  fileName: string;
  format: 'obj' | 'gltf' | 'fbx' | 'collada';
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
