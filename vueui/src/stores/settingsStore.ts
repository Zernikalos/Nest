import { ref } from 'vue';
import { defineStore } from 'pinia';
import cloneDeep from 'lodash/cloneDeep';
import merge from 'lodash/merge';
import { DEFAULT_APP_SETTINGS } from '@app-settings';
import { loadSettings, saveSettings } from '@/runtime/settingsPersistence';
import {
  fromAppSettings,
  toPersistedPatch,
  type AppearanceFormData,
  type GeneralFormData,
  type SettingsState,
} from '@/stores/settingsState';

export type { AppearanceFormData, GeneralFormData, SettingsState };

type PersistedSettingsPatch = {
  appearance?: Partial<AppearanceFormData>;
  general?: Partial<GeneralFormData>;
  lastProjectPath?: string;
};

export const useSettingsStore = defineStore('settings', () => {
  const initial = fromAppSettings(DEFAULT_APP_SETTINGS);

  const appearance = ref(initial.appearance);
  const general = ref(initial.general);
  const lastProjectPath = ref<string | undefined>(initial.lastProjectPath);

  function snapshot(): SettingsState {
    return {
      appearance: appearance.value,
      general: general.value,
      lastProjectPath: lastProjectPath.value,
    };
  }

  function applyState(state: SettingsState) {
    appearance.value = state.appearance;
    general.value = state.general;
    lastProjectPath.value = state.lastProjectPath;
  }

  async function hydrate() {
    applyState(fromAppSettings(await loadSettings()));
  }

  function patchSettings(partial: PersistedSettingsPatch) {
    if (partial.appearance) {
      appearance.value = merge({}, appearance.value, cloneDeep(partial.appearance));
    }
    if (partial.general) {
      general.value = merge({}, general.value, cloneDeep(partial.general));
    }
    if ('lastProjectPath' in partial) {
      lastProjectPath.value = partial.lastProjectPath;
    }
    void persist();
  }

  async function setLastProjectPath(filePath: string | undefined) {
    lastProjectPath.value = filePath;
    await persist();
  }

  function resetToDefaults() {
    applyState(fromAppSettings(DEFAULT_APP_SETTINGS));
    void persist();
  }

  async function persist() {
    if (typeof window === 'undefined') return;
    await saveSettings(toPersistedPatch(snapshot()));
  }

  return {
    appearance,
    general,
    lastProjectPath,
    hydrate,
    patchSettings,
    setLastProjectPath,
    resetToDefaults,
  };
});
