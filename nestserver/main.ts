import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import configuration from './config/configuration';
import { WsAdapter } from '@nestjs/platform-ws';
import * as path from 'path';

export async function nestServerBootstrap(dbPath: string) {
    const app = await NestFactory.create(AppModule.register({ dbPath }), {
        logger: ['error', 'warn', 'log', 'debug', 'verbose'],
    })

    const port = configuration().port

    app.enableCors()
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        transformOptions: {
            enableImplicitConversion: true,
        },
    }))

    app.useWebSocketAdapter(new WsAdapter(app));

    await app.listen(port)

    const appModule = app.get(AppModule)
    return {
        app: appModule
    }
}

if (configuration().shouldStartServer) {
    const defaultDbPath = path.join(__dirname, '..', 'db', 'nest-dev.sqlite')
    nestServerBootstrap(defaultDbPath)
}
