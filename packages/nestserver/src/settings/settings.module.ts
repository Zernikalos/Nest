import { Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsRepository } from './settings.repository';
import { SettingsController } from './settings.controller';

@Module({
    controllers: [SettingsController],
    providers: [SettingsRepository, SettingsService],
    exports: [SettingsService],
})
export class SettingsModule {} 