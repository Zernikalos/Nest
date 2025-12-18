import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as fs from 'fs/promises';
import {merge, isEmpty} from 'lodash';

export interface AppSettings {
    windowSize?: {
        width: number;
        height: number;
    };
    theme?: string;
    font?: string;
}

@Injectable()
export class SettingsRepository {
    private readonly logger = new Logger(SettingsRepository.name);
    private settings: AppSettings = {};

    constructor(
        private readonly configService: ConfigService
    ) {

    }

    async loadSettings(): Promise<AppSettings> {
        const settingsPath = this.configService.get<string>('settingsPath');
        this.logger.log(`Settings file path: ${settingsPath}`);
        try {
            const data = await fs.readFile(settingsPath, 'utf-8');
            this.settings = JSON.parse(data);
            this.logger.log('Settings loaded successfully');
        } catch (error) {
            this.logger.warn('Settings file not found or invalid, using defaults');
            this.settings = {};
        }
        return this.settings;
    }

    async saveSettings(settings: AppSettings): Promise<void> {
        const settingsPath = this.configService.get<string>('settingsPath');
        try {
            // Ensure directory exists
            // const dir = path.dirname(settingsPath);
            // await fs.mkdir(dir, { recursive: true });
            
            // Save settings
            await fs.writeFile(settingsPath, JSON.stringify(settings, null, 2));
            this.settings = settings;
        } catch (error) {
            this.logger.error('Failed to save settings', error);
            throw error;
        }
    }

    async getSettings(): Promise<AppSettings> {
        if (isEmpty(this.settings)) {
            await this.loadSettings();
        }
        return this.settings;
    }

    async updateSettings(partialSettings: Partial<AppSettings>): Promise<AppSettings> {
        const currentSettings = await this.getSettings();
        const updatedSettings = merge({}, currentSettings, partialSettings);
        await this.saveSettings(updatedSettings);
        return updatedSettings;
    }
} 