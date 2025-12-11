import { DynamicModule, Logger, Module } from '@nestjs/common'
import { FilesModule } from './files/files.module'
import { NestModule } from './nest/nest.module'
import configuration from "./config/configuration"
import { ConfigModule } from "@nestjs/config"
import { ZdebuggerModule } from './zdebugger/zdebugger.module'
import { BridgeModule } from './bridge/bridge.module'
import { SettingsModule } from './settings/settings.module'

interface AppOptions {
    dbPath: string;
    settingsPath: string;
}

@Module({})
export class AppModule {

    private static readonly logger = new Logger(AppModule.name)

    static register(options: AppOptions): DynamicModule {
        //this.logger.log(`Registering AppModule with DB path: ${options.dbPath} and settings path: ${options.settingsPath}`)
        return {
            module: AppModule,
            imports: [
                // TypeOrmModule.forRoot({
                //     type: 'sqlite',
                //     database: options.dbPath,
                //     synchronize: true, // TODO: Set to false in production
                //     entities: [path.join(__dirname, '**', '*.entity{.ts,.js}')]
                // }),
                ConfigModule.forRoot({
                    isGlobal: true, 
                    load: [() => ({
                        ...configuration(),
                        settingsPath: options.settingsPath
                    })]
                }),
                SettingsModule,
                FilesModule,
                NestModule,
                ZdebuggerModule,
                BridgeModule
            ],
        }
    }
}
