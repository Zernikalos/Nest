import type { AssetConversionInput, AssetConversionResult } from '../domain/types.js';

/** Asset conversion from external format (gltf, obj, etc.) to ZKO. Implement via zkConvert/zkExport or backend. */
export interface AssetConversionPort {
    convertToZko(input: AssetConversionInput): Promise<AssetConversionResult>;
}
