import { Module } from '@nestjs/common'
import { ZDebuggerGateway } from './zdebugger.gateway'
import { ZdebuggerService } from './zdebugger.service'
import {BridgeModule} from "../bridge/bridge.module"

@Module({
  controllers: [],
  providers: [ZdebuggerService, ZDebuggerGateway],
  imports: [BridgeModule]
})
export class ZdebuggerModule {}
