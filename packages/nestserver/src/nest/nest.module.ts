import { Module } from '@nestjs/common';
import { NestController } from './nest.controller';
import { NestService } from './nest.service';
import {ConfigModule} from "@nestjs/config";

@Module({
  controllers: [NestController],
  providers: [NestService],
  imports: [ConfigModule]
})
export class NestModule {}
