import type { AssetFormat } from '@ide-core';
import { HostPlatform } from '@ide-core/vue';
import type { MenuContextSnapshot } from '@ide-core/vue';

export type { MenuContextSnapshot };
export { HostPlatform };

export interface ElectronSubscription {
    off: () => void;
}

declare global {
    interface Window {
        NativeZernikalos?: {
            getApiBaseUrl?: () => Promise<string>;
            getPlatform?: () => HostPlatform;
            onExecuteCommand?: (
                callback: (ev: unknown, data: { commandId: string; payload?: unknown }) => void
            ) => ElectronSubscription;
            handleWindowMaximizedChanged?: (
                callback: (ev: unknown, maximized: boolean) => void
            ) => ElectronSubscription;
            sendMenuContext?: (context: MenuContextSnapshot) => void;
            windowMinimize?: () => Promise<void>;
            windowMaximize?: () => Promise<void>;
            windowClose?: () => Promise<void>;
            windowIsMaximized?: () => Promise<boolean>;
            windowSetBackgroundColor?: (color: string) => Promise<void>;
            loadZko?: () => Promise<{ path: string; fileName: string } | null>;
            importFile?: (
                format: AssetFormat
            ) => Promise<{ path: string; fileName: string; format: AssetFormat } | null>;
            openProject?: () => Promise<string | null | undefined>;
            saveProject?: (projectName: string) => Promise<string | null | undefined>;
            saveBundledScene?: (fileData: Uint8Array) => Promise<void>;
            storageGet?: (key: string) => Promise<string | null>;
            storageSet?: (key: string, value: string) => Promise<void>;
            storageDelete?: (key: string) => Promise<void>;
            getAppSettings?: () => Promise<import('@app-settings').AppSettings>;
            patchAppSettings?: (
                partial: Partial<import('@app-settings').AppSettings>
            ) => Promise<import('@app-settings').AppSettings>;
        };
    }
}

export {};
