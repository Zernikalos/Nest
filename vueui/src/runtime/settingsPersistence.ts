import type { AppSettings } from '@app-settings';
import { DEFAULT_APP_SETTINGS, mergeWithDefaults } from '@app-settings';
import {
  isElectronAppSettingsAvailable,
  loadAppSettings,
  patchAppSettings,
} from '@/runtime/appSettingsAdapter';

const LOCAL_STORAGE_KEY = 'zernikalos-app-settings';

function loadFromLocalStorage(): AppSettings {
  if (typeof window === 'undefined') {
    return mergeWithDefaults(DEFAULT_APP_SETTINGS);
  }
  try {
    const stored = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (stored) {
      return mergeWithDefaults(JSON.parse(stored) as Partial<AppSettings>);
    }
  } catch {
    console.warn(`Failed to load settings from "${LOCAL_STORAGE_KEY}"`);
  }
  return mergeWithDefaults(DEFAULT_APP_SETTINGS);
}

function saveToLocalStorage(partial: Partial<AppSettings>): void {
  if (typeof window === 'undefined') return;
  try {
    const current = loadFromLocalStorage();
    const merged = mergeWithDefaults({ ...current, ...partial });
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(merged));
  } catch {
    console.warn(`Failed to save settings to "${LOCAL_STORAGE_KEY}"`);
  }
}

export async function loadSettings(): Promise<AppSettings> {
  if (isElectronAppSettingsAvailable()) {
    try {
      return await loadAppSettings();
    } catch {
      console.warn('Failed to load settings from Electron IPC');
    }
  }
  return loadFromLocalStorage();
}

export async function saveSettings(partial: Partial<AppSettings>): Promise<void> {
  if (isElectronAppSettingsAvailable()) {
    try {
      await patchAppSettings(partial);
    } catch (error) {
      console.error('Failed to save settings via IPC', error);
    }
    return;
  }
  saveToLocalStorage(partial);
}
