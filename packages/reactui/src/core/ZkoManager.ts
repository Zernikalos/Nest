import { zkConvert, zkExport } from '@zernikalos/zkbuilder'
import { getFileUrl } from '@/lib/fileApi'
import { regenerateZko as regenerateZkoUtil } from '@/types/project'
import type { AssetConversionData, ZkResultExtended } from '@/types/project'

export class ZkoManager {
    private static instance: ZkoManager | null = null

    private constructor() {}

    static getInstance(): ZkoManager {
        if (!ZkoManager.instance) {
            ZkoManager.instance = new ZkoManager()
        }
        return ZkoManager.instance
    }

    async convertAssetToZko(data: AssetConversionData): Promise<ZkResultExtended> {
        // Step 1: Get file URL
        const fileUrl = await getFileUrl({
            path: data.path,
            fileName: data.fileName
        })
        
        // Step 2: Convert asset to ZKO
        const result = await zkConvert(
            { filePath: fileUrl, format: data.format },
            { exportOptions: { format: "object" } }
        )
        const proto = await zkExport(result.zko, { format: "proto" }) as Uint8Array
        const extendedResult: ZkResultExtended = { ...result, proto }
        
        return extendedResult
    }

    async regenerateZko(zkResult: ZkResultExtended): Promise<ZkResultExtended> {
        return regenerateZkoUtil(zkResult)
    }

    async bundleScene(zkResult: ZkResultExtended): Promise<Uint8Array> {
        return await zkExport(zkResult.zko, { format: "proto" }) as Uint8Array
    }
}

