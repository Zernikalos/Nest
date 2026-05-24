import { computed } from 'vue';
import type { ImportFileFormat } from '@ide-core';

export type ElectronPlatform = 'darwin' | 'win32' | 'linux' | 'web';

export function usePlatformShell() {
  const api = typeof window !== 'undefined' ? window.NativeZernikalos : undefined;

  const platform = computed<ElectronPlatform>(() => {
    if (!api?.getPlatform) return 'web';
    return api.getPlatform();
  });

  const isElectron = computed(() => platform.value !== 'web');

  const isMac = computed(() => platform.value === 'darwin');

  const showCustomChrome = computed(() => isElectron.value && !isMac.value);

  return {
    platform,
    isElectron,
    isMac,
    showCustomChrome,
  };
}

export type { ImportFileFormat };
