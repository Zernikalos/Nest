import type { AssetConversionData } from '@/types/project';
import { useEditorStore, useEditorSlice } from '@ide-core/vue';

/**
 * Triggers asset-to-ZKO conversion via the editor store (slice-only subscription).
 */
export function useAssetToZko() {
  const editor = useEditorStore();
  const conversionViewModel = useEditorSlice('assets');

  async function convertAssetToZko(data: AssetConversionData) {
    return editor.convertAsset(data);
  }

  return {
    convertAssetToZko,
    conversionViewModel,
  };
}
