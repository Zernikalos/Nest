import { DynamicModule, Module } from '@nestjs/common';
import { SettingsService } from './settings.service';
import { SettingsRepository } from './settings.repository';

export interface SettingsOptions {
    settingsPath: string;
}

@Module({})
export class SettingsModule {
    static register(options: SettingsOptions): DynamicModule {
        return {
            module: SettingsModule,
            providers: [
                {
                    provide: SettingsRepository,
                    useFactory: () => new SettingsRepository(options.settingsPath),
                },
                SettingsService,
            ],
            exports: [SettingsService],
        };
    }
} 