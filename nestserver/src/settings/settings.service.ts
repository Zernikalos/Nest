import { Injectable, Logger } from '@nestjs/common';
import { SettingsRepository, AppSettings } from './settings.repository';
import { AppearanceSettings, DEFAULT_APP_SETTINGS } from './app-settings';
import * as _ from 'lodash';

@Injectable()
export class SettingsService {
    private readonly logger = new Logger(SettingsService.name);

    constructor(private readonly settingsRepository: SettingsRepository) {}

    async getSettings(): Promise<AppSettings> {
        return await this.settingsRepository.getSettings();
    }

    async getWindowSize(): Promise<{ width: number; height: number }> {
        const settings = await this.settingsRepository.getSettings();
        if (_.isNil(settings.windowSize)) {
            return DEFAULT_APP_SETTINGS.windowSize!;
        }
        return settings.windowSize;
    }

    async setWindowSize(width: number, height: number): Promise<void> {
        await this.settingsRepository.updateSettings({ windowSize: { width, height } });
    }

    async getAppearance(): Promise<AppearanceSettings> {
        const settings = await this.settingsRepository.getSettings();
        if (_.isNil(settings.appearance)) {
            return DEFAULT_APP_SETTINGS.appearance!;
        }
        return settings.appearance;
    }

    async updateAppearance(partial: Partial<AppearanceSettings>): Promise<void> {
        const appearance = { ...(await this.getAppearance()), ...partial };
        await this.settingsRepository.updateSettings({ appearance });
        if (!_.isNil(partial.theme)) {
            this.logger.log(`Theme updated to ${partial.theme}`);
        }
        if (!_.isNil(partial.font)) {
            this.logger.log(`Font updated to ${partial.font}`);
        }
    }

    async getTheme(): Promise<string> {
        return (await this.getAppearance()).theme;
    }

    async setTheme(theme: string): Promise<void> {
        await this.updateAppearance({ theme });
    }

    async getFont(): Promise<string> {
        return (await this.getAppearance()).font;
    }

    async setFont(font: string): Promise<void> {
        await this.updateAppearance({ font });
    }

    async setLastProjectPath(filePath: string | undefined): Promise<void> {
        await this.settingsRepository.updateSettings({ lastProjectPath: filePath });
        if (filePath) {
            this.logger.log(`Last project path updated to ${filePath}`);
        }
    }

    async updateSettings(partialSettings: Partial<AppSettings>): Promise<AppSettings> {
        return await this.settingsRepository.updateSettings(partialSettings);
    }
}
