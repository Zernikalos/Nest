import { DynamicModule, Logger, Module } from '@nestjs/common'
import * as path from 'path'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { FilesModule } from './files/files.module'
import { NestModule } from './nest/nest.module'
import configuration from "./config/configuration"
import { ConfigModule } from "@nestjs/config"
import { ZdebuggerModule } from './zdebugger/zdebugger.module'
import { BridgeModule } from './bridge/bridge.module'
import { TypeOrmModule } from "@nestjs/typeorm"

interface DbOptions {
    dbPath: string
}

@Module({})
export class AppModule {

    private static readonly logger = new Logger(AppModule.name)

    static register(options: DbOptions): DynamicModule {
        this.logger.log(`Registering AppModule with DB path: ${options.dbPath}`)
        return {
            module: AppModule,
            imports: [
                TypeOrmModule.forRoot({
                    type: 'sqlite',
                    database: options.dbPath,
                    synchronize: true, // TODO: Set to false in production
                    entities: [path.join(__dirname, '**', '*.entity{.ts,.js}')]
                }),
                ConfigModule.forRoot({load: [configuration]}),
                FilesModule,
                NestModule,
                ZdebuggerModule,
                BridgeModule
            ],
            controllers: [AppController],
            providers: [AppService]
        }
    }
}
