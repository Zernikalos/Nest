import { Controller, Get, Patch, Body } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { AppSettings } from './settings.repository';

@Controller('settings')
export class SettingsController {
    constructor(private readonly settingsService: SettingsService) {}

    @Get()
    async getSettings(): Promise<AppSettings> {
        return await this.settingsService.getSettings();
    }

    @Patch()
    async updateSettings(@Body() partialSettings: Partial<AppSettings>): Promise<AppSettings> {
        return await this.settingsService.updateSettings(partialSettings);
    }
}

