/**
 * Platform port for host-specific APIs (dialogs, menu context, navigation).
 * Injected by the app; web and Electron provide different implementations.
 */
export interface MenuContextSnapshot {
  projectOpen: boolean;
}

export interface HostPort {
  showSaveProjectDialog?(projectName: string): Promise<string | null>;
  showOpenProjectDialog?(): Promise<string | null>;
  sendMenuContext?(context: MenuContextSnapshot): void;
  navigate?(path: string): void;
}

export const HOST_PORT_KEY = Symbol('hostPort') as symbol;

/** Key for injecting the preferences storage port (StoragePort with prefs prefix). */
export const PREFERENCES_PORT_KEY = Symbol('preferencesPort') as symbol;
