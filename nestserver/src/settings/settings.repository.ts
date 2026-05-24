import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import * as path from 'path';
import { merge, isEmpty } from 'lodash';
import { AppSettings, mergeWithDefaults } from './app-settings';

export type {
    AppSettings,
    AppearanceSettings,
    GeneralSettings,
    WindowSizeSettings,
} from './app-settings';

@Injectable()
export class SettingsRepository {
    private readonly logger = new Logger(SettingsRepository.name);
    private settings: AppSettings = {};

    constructor(private readonly configService: ConfigService) {}

    async loadSettings(): Promise<AppSettings> {
        this.logger.log(`Settings file path: ${this.getSettingsPath()}`);
        try {
            const parsed = await this.readSettingsFromDisk();
            await this.bootstrapSettings(parsed);
            this.logger.log('Settings loaded successfully');
        } catch {
            this.logger.warn('Settings file not found or invalid, using defaults');
            await this.bootstrapSettings({});
        }
        return this.settings;
    }

    async saveSettings(settings: AppSettings): Promise<AppSettings> {
        try {
            return await this.persistSettings(settings);
        } catch (error) {
            this.logger.error('Failed to save settings', error);
            throw error;
        }
    }

    private getSettingsPath(): string {
        return this.configService.get<string>('settingsPath')!;
    }

    private async ensureSettingsDirectory(): Promise<void> {
        await fs.mkdir(path.dirname(this.getSettingsPath()), { recursive: true });
    }

    private async readSettingsFromDisk(): Promise<unknown> {
        const data = await fs.readFile(this.getSettingsPath(), 'utf-8');
        return JSON.parse(data) as unknown;
    }

    /** Normalize partial/loaded data and persist so the file always matches the schema. */
    private async bootstrapSettings(partial: unknown): Promise<void> {
        await this.persistSettings(partial);
    }

    private async persistSettings(partial: Partial<AppSettings> | unknown): Promise<AppSettings> {
        const normalized = mergeWithDefaults(partial);
        await this.writeSettingsToDisk(normalized);
        this.settings = normalized;
        return normalized;
    }

    private async writeSettingsToDisk(settings: AppSettings): Promise<void> {
        await this.ensureSettingsDirectory();
        await fs.writeFile(
            this.getSettingsPath(),
            JSON.stringify(settings, null, 2),
            'utf-8',
        );
    }

    async getSettings(): Promise<AppSettings> {
        if (isEmpty(this.settings)) {
            await this.loadSettings();
        }
        return this.settings;
    }

    async updateSettings(partialSettings: Partial<AppSettings>): Promise<AppSettings> {
        const currentSettings = await this.getSettings();
        const updatedSettings = mergeWithDefaults(merge({}, currentSettings, partialSettings));
        return this.saveSettings(updatedSettings);
    }
}
