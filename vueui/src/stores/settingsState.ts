import cloneDeep from 'lodash/cloneDeep';
import type { AppSettings, AppearanceSettings, GeneralSettings } from '@app-settings';
import { mergeWithDefaults } from '@app-settings';

export type GeneralFormData = GeneralSettings;
export type AppearanceFormData = AppearanceSettings;

export interface SettingsState {
  appearance: AppearanceFormData;
  general: GeneralFormData;
  lastProjectPath?: string;
}

export function fromAppSettings(settings: AppSettings): SettingsState {
  const merged = mergeWithDefaults(settings);
  return {
    appearance: merged.appearance!,
    general: merged.general!,
    lastProjectPath: merged.lastProjectPath,
  };
}

/** Plain object for IPC structured clone (Pinia/Vue proxies are not cloneable). */
export function toPersistedPatch(state: SettingsState): Partial<AppSettings> {
  return cloneDeep({
    appearance: state.appearance,
    general: state.general,
    lastProjectPath: state.lastProjectPath,
  });
}
