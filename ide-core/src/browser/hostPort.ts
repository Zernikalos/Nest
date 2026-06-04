import type { AssetFormat } from '../common/domain/enums.js';
import type { MenuContextSnapshot } from '../common/host/menuContext.js';
import type { HostPlatform } from './hostEnums.js';

export type { MenuContextSnapshot };
export { HostPlatform } from './hostEnums.js';

/**
 * Platform port for host-specific APIs (dialogs, menu context, navigation, window chrome).
 * Injected by the app; web and Electron provide different implementations.
 */
export interface HostPort {
    showSaveProjectDialog?(projectName: string): Promise<string | null>;
    showOpenProjectDialog?(): Promise<string | null>;
    /** macOS only: sync native application menu enablement. */
    sendMenuContext?(context: MenuContextSnapshot): void;
    navigate?(path: string): void;
    getPlatform?(): HostPlatform;
    minimizeWindow?(): void;
    maximizeWindow?(): void;
    closeWindow?(): void;
    isWindowMaximized?(): Promise<boolean>;
    onWindowMaximizedChanged?(callback: (maximized: boolean) => void): () => void;
    menuLoadZko?(): Promise<{ path: string; fileName: string } | null>;
    menuImportFile?(
        format: AssetFormat
    ): Promise<{ path: string; fileName: string; format: AssetFormat } | null>;
}
