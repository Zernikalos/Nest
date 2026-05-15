import { inject, ref, onMounted, onUnmounted } from 'vue';
import type { AssetConversionData } from '@/types/project';
import { RUNTIME_KEY } from '@/composables/useIdeCore';
import type { EditorRuntime } from '@ide-core';

/**
 * Composable to trigger asset-to-ZKO conversion via the runtime.
 */
export function useAssetToZko() {
  const runtime = inject<EditorRuntime | null>(RUNTIME_KEY, null);

  const conversionViewModel = ref(
    runtime
      ? runtime.assetConversion.getViewModel()
      : {
          isConverting: false,
          conversionError: null,
          lastResult: null,
          projectPersistWarning: null,
        }
  );

  let unsub: (() => void) | null = null;
  onMounted(() => {
    if (runtime) {
      unsub = runtime.assetConversion.subscribe(() => {
        conversionViewModel.value = runtime.assetConversion.getViewModel();
      });
      conversionViewModel.value = runtime.assetConversion.getViewModel();
    }
  });
  onUnmounted(() => {
    unsub?.();
  });

  async function convertAssetToZko(data: AssetConversionData) {
    if (!runtime) throw new Error('Runtime not available');
    return runtime.assetConversion.convert(data);
  }

  return {
    convertAssetToZko,
    conversionViewModel,
  };
}
