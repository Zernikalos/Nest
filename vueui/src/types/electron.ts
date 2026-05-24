export type ElectronSubscription = { off: () => void };

export interface MenuContextSnapshot {
  projectOpen: boolean;
}

declare global {
  interface Window {
    NativeZernikalos?: {
      handleLoadZko?: (callback: (ev: unknown, data: unknown) => void) => ElectronSubscription;
      handleShowImport?: (callback: (ev: unknown, data: unknown) => void) => ElectronSubscription;
      handleBundleScene?: (callback: (ev: unknown, data: unknown) => void) => ElectronSubscription;
      handleCreateProject?: (callback: (ev: unknown) => void) => ElectronSubscription;
      handleOpenProject?: (callback: (ev: unknown, data: { filePath: string }) => void) => ElectronSubscription;
      sendMenuContext?: (context: MenuContextSnapshot) => void;
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
