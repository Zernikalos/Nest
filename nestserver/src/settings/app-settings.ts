import { merge } from 'lodash';

export interface WindowSizeSettings {
    width: number;
    height: number;
}

export interface AppearanceSettings {
    theme: string;
    font: string;
}

export interface GeneralSettings {
    confirmBeforeExit: boolean;
    reopenProjectsOnStartup: boolean;
    autoSaveInactivitySeconds: number;
    saveOnClose: 'always' | 'never' | 'ask';
}

export interface AppSettings {
    windowSize?: WindowSizeSettings;
    appearance?: AppearanceSettings;
    general?: GeneralSettings;
    lastProjectPath?: string;
}

export const DEFAULT_APP_SETTINGS: AppSettings = {
    windowSize: { width: 1280, height: 720 },
    appearance: {
        theme: 'default',
        font: 'Rajdhani',
    },
    general: {
        confirmBeforeExit: true,
        reopenProjectsOnStartup: true,
        autoSaveInactivitySeconds: 30,
        saveOnClose: 'ask',
    },
};

export function mergeWithDefaults(partial: Partial<AppSettings> | unknown): AppSettings {
    if (!partial || typeof partial !== 'object') {
        return merge({}, DEFAULT_APP_SETTINGS);
    }
    return merge({}, DEFAULT_APP_SETTINGS, partial) as AppSettings;
}
