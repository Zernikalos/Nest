import * as fs from 'fs/promises';
import * as path from 'path';
import { merge } from 'lodash';

export interface AppSettings {
    windowSize?: {
        width: number;
        height: number;
    };
    theme?: string;
}

export class SettingsRepository {
    private readonly settingsFilePath: string;
    private settings: AppSettings = {};

    constructor(settingsPath: string) {
        this.settingsFilePath = path.join(settingsPath, 'app-settings.json');
        console.log(`Settings file path: ${this.settingsFilePath}`);
    }

    async loadSettings(): Promise<AppSettings> {
        try {
            const data = await fs.readFile(this.settingsFilePath, 'utf-8');
            this.settings = JSON.parse(data);
            console.log('Settings loaded successfully');
        } catch (error) {
            console.warn('Settings file not found or invalid, using defaults');
            this.settings = {};
        }
        return this.settings;
    }

    async saveSettings(settings: AppSettings): Promise<void> {
        try {
            // Ensure directory exists
            const dir = path.dirname(this.settingsFilePath);
            await fs.mkdir(dir, { recursive: true });
            
            // Save settings
            await fs.writeFile(this.settingsFilePath, JSON.stringify(settings, null, 2));
            this.settings = settings;
        } catch (error) {
            console.error('Failed to save settings', error);
            throw error;
        }
    }

    async getSettings(): Promise<AppSettings> {
        if (Object.keys(this.settings).length === 0) {
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