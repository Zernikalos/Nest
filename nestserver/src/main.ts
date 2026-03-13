import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import configuration from './config/configuration';
import { WsAdapter } from '@nestjs/platform-ws';
import * as path from 'path';
import * as fs from 'fs';
import { SettingsService } from './settings/settings.service';
import { ConfigService } from '@nestjs/config';
import getPort from 'get-port';

export { SettingsService };

export interface ZNestServer {
    settings: SettingsService;
    port: number;
}

export interface ServerOptions {
    dbPath: string;
    settingsPath: string;
}

/** Path where the Nest server writes its port in dev (standalone) so Electron can discover it. */
export const NEST_PORT_FILE = '.zernikalos-nest-port';

export async function nestServerBootstrap(options: ServerOptions): Promise<ZNestServer> {
    const app = await NestFactory.create(AppModule.register(options), {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    });

    const configService = app.get(ConfigService);
    const preferredPort = configService.get<number>('port');
    const port = await getPort({ port: preferredPort });

    app.enableCors();
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            transformOptions: {
                enableImplicitConversion: true,
            },
        }),
    );

    app.useWebSocketAdapter(new WsAdapter(app));

    const server = await app.listen(port);
    const actualPort = (server.address() as { port: number }).port;

    const settingsService = app.get(SettingsService);
    return {
        settings: settingsService,
        port: actualPort,
    };
}

if (configuration().shouldStartServer) {
    const defaultDbPath = path.join(__dirname, '..', 'db', 'nest-dev.sqlite');
    const defaultSettingsPath = path.join(__dirname, '..', 'db', 'settings');
    nestServerBootstrap({
        dbPath: defaultDbPath,
        settingsPath: defaultSettingsPath,
    }).then((nest) => {
        const portFile = path.join(process.cwd(), NEST_PORT_FILE);
        fs.writeFileSync(portFile, String(nest.port), 'utf8');
    });
}
