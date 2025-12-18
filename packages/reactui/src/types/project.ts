import type { ZkConvertResult } from '@zernikalos/zkbuilder'
import type { InputFileFormat } from '@zernikalos/zkbuilder'
import { zkExport } from '@zernikalos/zkbuilder'

export interface AssetConversionData {
    path: string
    fileName: string
    format: InputFileFormat
}

// Legacy type alias for backwards compatibility
export type FileImportData = AssetConversionData

export interface ZkResultExtended extends ZkConvertResult {
    proto: Uint8Array
}

export interface InputAsset {
    id: string
    path: string
    fileName: string
    format: InputFileFormat
    importedAt: string
}

export async function regenerateZko(zkResult: ZkResultExtended): Promise<ZkResultExtended> {
    const proto = await zkExport(zkResult.zko, { format: "proto" }) as Uint8Array
    return {
        ...zkResult,
        proto
    }
}

// Legacy function alias for backwards compatibility (used in NestEditorContext)
export const rebuildZkResult = regenerateZko

