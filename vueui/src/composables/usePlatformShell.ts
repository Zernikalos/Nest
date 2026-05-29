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

  /** Whether to render the custom in-renderer title bar (any Electron platform). */
  const showCustomChrome = computed(() => isElectron.value);

  /** Whether to render the in-renderer menu bar inside the title bar (Windows/Linux only). */
  const showInRendererMenuBar = computed(() => isElectron.value && !isMac.value);

  /** Whether to render the HTML min/max/close buttons (Windows/Linux only; Mac uses native traffic lights). */
  const showWindowControlButtons = computed(() => isElectron.value && !isMac.value);

  /** Whether the title bar must reserve space for the native macOS traffic lights. */
  const reservesTrafficLightSpace = computed(() => isMac.value);

  return {
    platform,
    isElectron,
    isMac,
    showCustomChrome,
    showInRendererMenuBar,
    showWindowControlButtons,
    reservesTrafficLightSpace,
  };
}

export type { ImportFileFormat };
