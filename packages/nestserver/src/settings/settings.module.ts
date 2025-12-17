import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsRepository } from './settings.repository';

@Module({
    providers: [SettingsRepository, SettingsService],
    exports: [SettingsService],
})
export class SettingsModule {} 