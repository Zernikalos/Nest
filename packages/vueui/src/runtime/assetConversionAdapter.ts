import type { AssetConversionPort, AssetConversionResult } from '@zstudio/ide-core';
import { zkConvert, zkExport } from '@zernikalos/zkbuilder';
import { getFileUrl } from '@/lib/fileApi';

/**
 * Asset conversion port implementation using zkConvert/zkExport (ZKBuilder).
 * Used when creating the editor runtime so conversion state lives in ide-core.
 */
export function createAssetConversionPort(): AssetConversionPort {
  return {
    async convertToZko(input): Promise<AssetConversionResult> {
      const fileUrl = await getFileUrl({
        path: input.path,
        fileName: input.fileName,
      });

      const result = await zkConvert(
        { filePath: fileUrl, format: input.format },
        { exportOptions: { format: 'object' } }
      );

      const proto = (await zkExport(result.zko, { format: 'proto' })) as Uint8Array;

      const exported = (result as { exported?: { objects: Array<{ refId: string; toJSON?: () => unknown; [key: string]: unknown }> } }).exported;

      return {
        zko: result.zko,
        filePath: result.filePath ?? input.path,
        proto,
        exported,
      };
    },
  };
}
