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
      showSaveProjectDialog?: (projectName: string) => Promise<string | null | undefined>;
      showOpenProjectDialog?: () => Promise<string | null | undefined>;
    };
  }
}
