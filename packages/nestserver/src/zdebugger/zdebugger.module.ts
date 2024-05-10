import { Module } from '@nestjs/common';
import { ZdebuggerController } from './zdebugger.controller';
import { ZdebuggerService } from './zdebugger.service';

@Module({
  controllers: [ZdebuggerController],
  providers: [ZdebuggerService]
})
export class ZdebuggerModule {}
