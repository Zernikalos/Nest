import {MessageBody, OnGatewayInit, SubscribeMessage, WebSocketGateway} from "@nestjs/websockets";
import { Inject, Injectable, OnModuleInit } from "@nestjs/common";
import {Server} from "ws";
import {BridgeService} from "../bridge/bridge.service";

@Injectable()
@WebSocketGateway({ path: 'zdebugger', transports: ['websocket'] })
export class ZDebuggerGateway implements OnGatewayInit, OnModuleInit {

    private server!: Server

    constructor(@Inject(BridgeService) private readonly bridgeService: BridgeService) {
    }

    onModuleInit() {
        if (!this.bridgeService) {
            throw new Error('BridgeService is not injected')
        }
        this.bridgeService.debuggerObservable.subscribe(message => {
            this.sendToAllClients(message)
        })
    }

    afterInit(server: Server): any {
        this.server = server
    }

    @SubscribeMessage("logs")
    handleLogsEvents(@MessageBody() data: string) {
        const message = {
            event: "logs",
            data
        }
        this.bridgeService.sendToNest(JSON.stringify(message))
    }

    @SubscribeMessage("stats")
    handleStatsEvents(@MessageBody() data: any) {
        const message = {
            event: "stats",
            data
        }
        this.bridgeService.sendToNest(JSON.stringify(message))
    }

    private sendToAllClients(message: string) {
        this.server.clients
            .forEach(client => client.send(message))
    }

}
