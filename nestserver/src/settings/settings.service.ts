import { Inject, Injectable, Logger } from '@nestjs/common';
import { SettingsRepository, AppSettings } from './settings.repository';
import * as _ from "lodash";

@Injectable()
export class SettingsService {
    private readonly logger = new Logger(SettingsService.name);

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
        await this.settingsRepository.updateSettings({ theme });
        this.logger.log(`Theme updated to ${theme}`);
    }

    async updateSettings(partialSettings: Partial<AppSettings>): Promise<AppSettings> {
        return await this.settingsRepository.updateSettings(partialSettings);
    }
} 