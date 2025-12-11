import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import configuration from './config/configuration';
import { WsAdapter } from '@nestjs/platform-ws';
import * as path from 'path';
import {SettingsService} from "./settings/settings.service";
import { ConfigService } from '@nestjs/config';

export { SettingsService }

export interface ZNestServer {
    settings: SettingsService
}

export interface ServerOptions {
    dbPath: string;
    settingsPath: string;
}

export async function nestServerBootstrap(options: ServerOptions): Promise<ZNestServer> {
    const app = await NestFactory.create(AppModule.register(options), {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    })

    const configService = app.get(ConfigService)

    const port = configService.get<number>('port')

    app.enableCors()
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }))

    app.useWebSocketAdapter(new WsAdapter(app));

    await app.listen(port)

    // const appModule = app.get(AppModule)
    const settingsService = app.get(SettingsService)
    return {
        settings: settingsService
    }
}

if (configuration().shouldStartServer) {
    const defaultDbPath = path.join(__dirname, '..', 'db', 'nest-dev.sqlite')
    const defaultSettingsPath = path.join(__dirname, '..', 'db', 'settings')
    nestServerBootstrap({
        dbPath: defaultDbPath,
        settingsPath: defaultSettingsPath
    })
}
