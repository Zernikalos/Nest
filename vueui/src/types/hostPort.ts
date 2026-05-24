/**
 * Platform port for host-specific APIs (dialogs, menu context, navigation, window chrome).
 * Injected by the app; web and Electron provide different implementations.
 */
export interface MenuContextSnapshot {
  projectOpen: boolean;
}

export type HostPlatform = 'darwin' | 'win32' | 'linux' | 'web';

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
    format: 'gltf' | 'obj' | 'fbx' | 'collada'
  ): Promise<{ path: string; fileName: string; format: string } | null>;
}

export const HOST_PORT_KEY = Symbol('hostPort') as symbol;
