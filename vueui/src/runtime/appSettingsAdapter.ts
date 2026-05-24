import type { AppSettings } from '@app-settings';

export function isElectronAppSettingsAvailable(): boolean {
  if (typeof window === 'undefined') return false;
  const api = window.NativeZernikalos;
  return Boolean(api?.getAppSettings && api?.patchAppSettings);
}

export async function loadAppSettings(): Promise<AppSettings> {
  const api = window.NativeZernikalos;
  if (!api?.getAppSettings) {
    throw new Error('Electron app settings API not available');
  }
  return api.getAppSettings();
}

export async function patchAppSettings(partial: Partial<AppSettings>): Promise<AppSettings> {
  const api = window.NativeZernikalos;
  if (!api?.patchAppSettings) {
    throw new Error('Electron app settings API not available');
  }
  return api.patchAppSettings(partial);
}
