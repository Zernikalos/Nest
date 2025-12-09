import { SettingsRepository, AppSettings } from '../repositories/settings.repository';
import * as _ from "lodash";
import logger from '../utils/logger';

export class SettingsService {
    constructor(private readonly settingsRepository: SettingsRepository) {}

    async getSettings(): Promise<AppSettings> {
        return await this.settingsRepository.getSettings();
    }

    async getWindowSize(): Promise<{ width: number; height: number }> {
        const settings = await this.settingsRepository.getSettings();
        if (_.isNil(settings) || _.isNil(settings.windowSize)) {
            return { width: 1280, height: 720 };
        }
        return settings.windowSize;
    }

    async setWindowSize(width: number, height: number): Promise<void> {
        await this.settingsRepository.updateSettings({ windowSize: { width, height } });
    }

    async getTheme(): Promise<string | undefined> {
        const settings = await this.settingsRepository.getSettings();
        return settings.theme;
    }

    async setTheme(theme: string): Promise<void> {
        logger.info(`Updating theme to: ${theme}`);
        await this.settingsRepository.updateSettings({ theme });
    }

    async updateSettings(partialSettings: Partial<AppSettings>): Promise<AppSettings> {
        return await this.settingsRepository.updateSettings(partialSettings);
    }
}