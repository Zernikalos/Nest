import { watch } from 'vue';
import { useAppearanceStore } from '@/stores/appearanceStore';
import { getThemeInfo } from '@/lib/themes';
import { usePlatformShell } from '@/composables/usePlatformShell';

const LIGHT_BG = '#ffffff';
const DARK_BG = '#171717';

/**
 * Keeps Electron frameless window background in sync with the active UI theme.
 */
export function useWindowBackgroundSync() {
  const appearance = useAppearanceStore();
  const { showCustomChrome } = usePlatformShell();

  watch(
    () => appearance.theme,
    (theme) => {
      if (!showCustomChrome.value) return;
      const api = window.NativeZernikalos;
      if (!api?.windowSetBackgroundColor) return;
      const isDark = getThemeInfo(theme).isDarkTheme;
      void api.windowSetBackgroundColor(isDark ? DARK_BG : LIGHT_BG);
    },
    { immediate: true }
  );
}
