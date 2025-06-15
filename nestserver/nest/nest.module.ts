import { Module } from '@nestjs/common';
import { NestController } from './nest.controller';
import { NestService } from './nest.service';
import {ConfigModule} from "@nestjs/config";
import {NestGateway} from "./nest.gateway";
import {BridgeModule} from "../bridge/bridge.module";

@Module({
  controllers: [NestController],
  providers: [NestService, NestGateway],
  imports: [ConfigModule, BridgeModule]
})
export class NestModule {}
