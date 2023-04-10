import { NestFactory } from "@nestjs/core"
import { AppModule } from "./app.module"
import { INestApplication, ValidationPipe } from "@nestjs/common"
import * as process from "process";

let app: INestApplication

export async function studioServerBootstrap () {
  app = await NestFactory.create(AppModule)

  app.enableCors()
  app.useGlobalPipes(new ValidationPipe({
    transform: true,
    transformOptions: {
      enableImplicitConversion: true
    }
  }))

  await app.listen(3000)
}

export async function stopServer () {
  await app.close()
}
