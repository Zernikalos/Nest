import {
    OnGatewayConnection,
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer
} from "@nestjs/websockets"
import * as ws from "ws"
import {BridgeService} from "../bridge/bridge.service"

@WebSocketGateway({ path: 'nest', transports: ['websocket'] })
export class NestGateway implements OnGatewayConnection, OnGatewayInit {

    constructor(private bridgeService: BridgeService) {
        this.bridgeService.nestObservable.subscribe(message => {
            this.sendToAllClients(message)
        })
    }

    @WebSocketServer()
    private server: ws.WebSocketServer

    afterInit(server: ws.WebSocket): any {
        this.server = server as any as ws.WebSocketServer
        server.on("connection", (ws) => {
            ws.on("message", (message) => {
                if (typeof message === "string") {

                }
                if (Buffer.isBuffer(message) && message.length > 0) {
                    this.handleBinaryMessage(message)
                }
            })
        })
    }

    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    handleConnection(client: ws.WebSocket): any {
        console.log("New Nest connection");
    }

    private sendToAllClients(message: string) {
        this.server.clients
            .forEach(client => {
                client.send(message)
            })
    }

    private handleBinaryMessage(message: Buffer) {
        this.bridgeService.sendToDevices(message)
    }

}