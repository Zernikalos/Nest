import { NestFactory } from '@nestjs/core'
import { AppModule } from './app.module'
import {ValidationPipe} from "@nestjs/common"

export async function studioServerBootstrap() {
    const app = await NestFactory.create(AppModule)

    app.enableCors()
    app.useGlobalPipes(new ValidationPipe({
        transform: true,
        transformOptions: {
            enableImplicitConversion: true
        },
    }))

    await app.listen(3000)
}
studioServerBootstrap()
