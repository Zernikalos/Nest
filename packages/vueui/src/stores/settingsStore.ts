import { defineStore } from 'pinia';
import type { StoragePort } from '@zstudio/ide-core';

export interface GeneralFormData {
  confirmBeforeExit: boolean;
  reopenProjectsOnStartup: boolean;
  autoSaveInactivitySeconds: number;
  saveOnClose: 'always' | 'never' | 'ask';
}

export interface AppearanceFormData {
  font: string;
  theme: string;
}

export interface SettingsFormData {
  appearance: AppearanceFormData;
  general: GeneralFormData;
}

const STORAGE_KEY = 'zernikalos-settings';

let preferencesPort: StoragePort | null = null;

const defaultSettings: SettingsFormData = {
  appearance: {
    font: 'Rajdhani',
    theme: 'default',
  },
  general: {
    confirmBeforeExit: true,
    reopenProjectsOnStartup: false,
    autoSaveInactivitySeconds: 30,
    saveOnClose: 'ask',
  },
};

function validateSettings(value: unknown): value is SettingsFormData {
  if (!value || typeof value !== 'object') return false;
  const v = value as Record<string, unknown>;
  if (!v.appearance || typeof v.appearance !== 'object') return false;
  const app = v.appearance as Record<string, unknown>;
  if (typeof app.font !== 'string' || typeof app.theme !== 'string') return false;
  if (!v.general || typeof v.general !== 'object') return false;
  const gen = v.general as Record<string, unknown>;
  if (typeof gen.confirmBeforeExit !== 'boolean') return false;
  if (typeof gen.reopenProjectsOnStartup !== 'boolean') return false;
  if (typeof gen.autoSaveInactivitySeconds !== 'number') return false;
  if (!['always', 'never', 'ask'].includes(gen.saveOnClose as string)) return false;
  return true;
}

function loadSettings(): SettingsFormData {
  if (typeof window === 'undefined') return { ...defaultSettings };
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored) as unknown;
      if (validateSettings(parsed)) return parsed;
    }
  } catch {
    console.warn(`Failed to load settings from "${STORAGE_KEY}"`);
  }
  return { ...defaultSettings };
}

export const useSettingsStore = defineStore('settings', {
  state: (): SettingsFormData => loadSettings(),
  actions: {
    setPreferencesPort(port: StoragePort) {
      preferencesPort = port;
    },
    async hydrateFromPort() {
      if (!preferencesPort) return;
      try {
        const stored = await preferencesPort.get(STORAGE_KEY);
        if (stored) {
          const parsed = JSON.parse(stored) as unknown;
          if (validateSettings(parsed)) this.$patch(parsed);
        }
      } catch {
        console.warn(`Failed to load settings from port "${STORAGE_KEY}"`);
      }
    },
    updateGeneralSettings(general: Partial<GeneralFormData>) {
      this.general = { ...this.general, ...general };
      this.persist();
    },
    updateAppearanceSettings(appearance: Partial<AppearanceFormData>) {
      this.appearance = { ...this.appearance, ...appearance };
      this.persist();
    },
    persist() {
      if (typeof window === 'undefined') return;
      try {
        const data = JSON.stringify(this.$state);
        if (preferencesPort) {
          void preferencesPort.set(STORAGE_KEY, data);
        } else {
          localStorage.setItem(STORAGE_KEY, data);
        }
      } catch {
        console.warn(`Failed to save settings to "${STORAGE_KEY}"`);
      }
    },
    resetToDefaults() {
      this.$patch(defaultSettings);
      this.persist();
    },
  },
  getters: {
    getGeneralSettings: (state) => state.general,
    getAppearanceSettings: (state) => state.appearance,
  },
});
