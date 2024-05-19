import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import {ValidationPipe} from "@nestjs/common"
import configuration from "./config/configuration";
import {WsAdapter} from "@nestjs/platform-ws";

export async function nestServerBootstrap() {
    const app = await NestFactory.create(AppModule)

    app.enableCors()
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        transformOptions: {
            enableImplicitConversion: true
        },
    }))

    app.useWebSocketAdapter(new WsAdapter(app));

    await app.listen(configuration().port)

    const appModule = app.get(AppModule)
    return {
        app: appModule
    }
}

//nestServerBootstrap()
