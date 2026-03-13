import { inject, ref, onMounted, onUnmounted } from 'vue';
import type { AssetConversionData } from '@/types/project';
import { RUNTIME_KEY } from '@/composables/useIdeCore';
import type { EditorRuntime } from '@ide-core';

/**
 * Composable to trigger asset-to-ZKO conversion via the runtime.
 * Conversion state (isConverting, conversionError, lastResult) lives in ide-core;
 * use getAssetConversionViewModel() from useIdeCore or runtime for UI.
 */
export function useAssetToZko() {
  const runtime = inject<EditorRuntime | null>(RUNTIME_KEY, null);

  const conversionViewModel = ref(
    runtime
      ? runtime.getAssetConversionViewModel()
      : { isConverting: false, conversionError: null, lastResult: null }
  );

  let unsub: (() => void) | null = null;
  onMounted(() => {
    if (runtime) {
      unsub = runtime.subscribeAssetConversion(() => {
        conversionViewModel.value = runtime.getAssetConversionViewModel();
      });
      conversionViewModel.value = runtime.getAssetConversionViewModel();
    }
  });
  onUnmounted(() => {
    unsub?.();
  });

  async function convertAssetToZko(data: AssetConversionData) {
    if (!runtime) throw new Error('Runtime not available');
    return runtime.convertAsset(data);
  }

  return {
    convertAssetToZko,
    conversionViewModel,
  };
}
