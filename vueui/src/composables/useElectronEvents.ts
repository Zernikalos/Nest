import { inject } from 'vue';

export type ElectronApi = {
  isElectron: boolean;
  onExecuteCommand: (cb: (data: { commandId: string; payload?: unknown }) => void) => void;
  offExecuteCommand: () => void;
};

export const ELECTRON_KEY = Symbol('electron') as symbol;

export function useElectronEvents(): ElectronApi {
  const api = inject<{ value: ElectronApi }>('electron');
  if (!api?.value) {
    return {
      isElectron: false,
      onExecuteCommand: () => {},
      offExecuteCommand: () => {},
    };
  }
  return api.value;
}
