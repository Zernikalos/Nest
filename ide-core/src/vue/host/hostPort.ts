import type { MenuContextSnapshot } from '../../common/host/menuContext.js';
import type { HostDialogsPort } from '../../common/host/hostDialogsPort.js';
import type { HostPlatform } from '../../common/host/enums.js';

export type { MenuContextSnapshot };
export type { HostDialogsPort } from '../../common/host/hostDialogsPort.js';
export type { LoadZkoDialogResult, ImportFileDialogResult } from '../../common/host/dialogTypes.js';
export { HostPlatform } from '../../common/host/enums.js';

/**
 * Platform port for host-specific APIs (dialogs, menu context, navigation, window chrome).
 * Injected by the app; web and Electron provide different implementations.
 */
export interface HostPort extends HostDialogsPort {
    /** macOS only: sync native application menu enablement. */
    sendMenuContext?(context: MenuContextSnapshot): void;
    navigate?(path: string): void;
    getPlatform?(): HostPlatform;
    minimizeWindow?(): void;
    maximizeWindow?(): void;
    closeWindow?(): void;
    isWindowMaximized?(): Promise<boolean>;
    onWindowMaximizedChanged?(callback: (maximized: boolean) => void): () => void;
}
