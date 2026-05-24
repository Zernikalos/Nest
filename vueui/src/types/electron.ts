import type { ImportFileFormat } from '@ide-core';

export type ElectronSubscription = { off: () => void };

export interface MenuContextSnapshot {
  projectOpen: boolean;
}

export type ElectronPlatform = 'darwin' | 'win32' | 'linux';

declare global {
  interface Window {
    NativeZernikalos?: {
      getApiBaseUrl?: () => Promise<string>;
      getPlatform?: () => ElectronPlatform;
      handleLoadZko?: (callback: (ev: unknown, data: unknown) => void) => ElectronSubscription;
      handleShowImport?: (callback: (ev: unknown, data: unknown) => void) => ElectronSubscription;
      handleBundleScene?: (callback: (ev: unknown, data: unknown) => void) => ElectronSubscription;
      handleCreateProject?: (callback: (ev: unknown) => void) => ElectronSubscription;
      handleOpenProject?: (callback: (ev: unknown, data: { filePath: string }) => void) => ElectronSubscription;
      handleWindowMaximizedChanged?: (
        callback: (ev: unknown, maximized: boolean) => void
      ) => ElectronSubscription;
      sendMenuContext?: (context: MenuContextSnapshot) => void;
      windowMinimize?: () => Promise<void>;
      windowMaximize?: () => Promise<void>;
      windowClose?: () => Promise<void>;
      windowIsMaximized?: () => Promise<boolean>;
      windowSetBackgroundColor?: (color: string) => Promise<void>;
      menuLoadZko?: () => Promise<{ path: string; fileName: string } | null>;
      menuImportFile?: (
        format: ImportFileFormat
      ) => Promise<{ path: string; fileName: string; format: ImportFileFormat } | null>;
      actionSaveFile?: (fileData: Uint8Array) => Promise<void>;
      showSaveProjectDialog?: (projectName: string) => Promise<string | null | undefined>;
      showOpenProjectDialog?: () => Promise<string | null | undefined>;
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
