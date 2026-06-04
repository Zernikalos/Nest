import { computed } from 'vue';
import { HostPlatform } from '@ide-core/browser';

export { HostPlatform };

export function usePlatformShell() {
    const api = typeof window !== 'undefined' ? window.NativeZernikalos : undefined;

    const platform = computed<HostPlatform>(() => {
        if (!api?.getPlatform) return HostPlatform.Web;
        return api.getPlatform();
    });

    const isElectron = computed(() => platform.value !== HostPlatform.Web);

    const isMac = computed(() => platform.value === HostPlatform.Darwin);

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
