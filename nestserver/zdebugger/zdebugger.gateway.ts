import {MessageBody, OnGatewayInit, SubscribeMessage, WebSocketGateway} from "@nestjs/websockets";
import {Server} from "ws";
import {BridgeService} from "../bridge/bridge.service";

@WebSocketGateway({ path: 'zdebugger', transports: ['websocket'] })
export class ZDebuggerGateway implements OnGatewayInit {

    private server!: Server

    constructor(private readonly bridgeService: BridgeService) {
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
