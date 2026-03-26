import { inject } from 'vue';

export type ElectronApi = {
  isElectron: boolean;
  onLoadZko: (cb: (data: unknown) => void) => void;
  onImportFile: (cb: (data: unknown) => void) => void;
  onBundleScene: (cb: () => void) => void;
  onCreateProject: (cb: () => void) => void;
  onOpenProject: (cb: (data: { filePath: string }) => void) => void;
  offLoadZko: () => void;
  offImportFile: () => void;
  offBundleScene: () => void;
  offCreateProject: () => void;
  offOpenProject: () => void;
};

export const ELECTRON_KEY = Symbol('electron') as symbol;

export function useElectronEvents(): ElectronApi {
  const api = inject<{ value: ElectronApi }>('electron');
  if (!api?.value) {
    return {
      isElectron: false,
      onLoadZko: () => {},
      onImportFile: () => {},
      onBundleScene: () => {},
      onCreateProject: () => {},
      onOpenProject: () => {},
      offLoadZko: () => {},
      offImportFile: () => {},
      offBundleScene: () => {},
      offCreateProject: () => {},
      offOpenProject: () => {},
    };
  }
  return api.value;
}
