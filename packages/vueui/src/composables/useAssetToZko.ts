import { zkConvert, zkExport } from '@zernikalos/zkbuilder';
import { getFileUrl } from '@/lib/fileApi';
import { useZkoStore } from '@/stores/zkoStore';
import { useProject } from '@/composables/useProject';
import type { AssetConversionData, ZkResultExtended } from '@/types/project';

/**
 * Composable to convert an asset (gltf, obj, fbx, collada) to ZKO,
 * update the zko store, and optionally add the asset to the current project.
 */
export function useAssetToZko() {
  const zkoStore = useZkoStore();
  const { addAssetToProject, isProjectOpen } = useProject();

  async function convertAssetToZko(data: AssetConversionData): Promise<ZkResultExtended> {
    zkoStore.setConverting(true);
    zkoStore.setError(null);

    try {
      const fileUrl = await getFileUrl({
        path: data.path,
        fileName: data.fileName,
      });

      const result = await zkConvert(
        { filePath: fileUrl, format: data.format },
        { exportOptions: { format: 'object' } }
      );

      const proto = (await zkExport(result.zko, { format: 'proto' })) as Uint8Array;
      const extendedResult: ZkResultExtended = { ...result, proto };

      zkoStore.setZkResult(extendedResult);
      zkoStore.setConverting(false);

      if (isProjectOpen.value) {
        try {
          await addAssetToProject({
            path: data.path,
            fileName: data.fileName,
            format: data.format,
          });
        } catch {
          // Do not fail the conversion if saving asset fails
        }
      }

      return extendedResult;
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error occurred';
      zkoStore.setError(message);
      zkoStore.setConverting(false);
      throw error;
    }
  }

  return { convertAssetToZko };
}
