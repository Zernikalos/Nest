import {Logger, Module} from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { FilesModule } from './files/files.module';
import { NestModule } from './nest/nest.module';
import configuration from "./config/configuration";
import {ConfigModule} from "@nestjs/config";
import { ZdebuggerModule } from './zdebugger/zdebugger.module';
import { BridgeModule } from './bridge/bridge.module';

@Module({
    imports: [
        ConfigModule.forRoot({load: [configuration],}),
        FilesModule,
        NestModule,
        ZdebuggerModule,
        BridgeModule
    ],
    controllers: [AppController],
    providers: [AppService],
})
export class AppModule {

    private readonly logger = new Logger(AppModule.name);

}
