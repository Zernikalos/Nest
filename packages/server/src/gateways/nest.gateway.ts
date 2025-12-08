import * as http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { Subscription } from 'rxjs';
import { BridgeService } from '../services/bridge.service';

export class NestGateway {
    private server: WebSocketServer;
    private bridgeService: BridgeService;
    private subscription: Subscription | null = null;

    constructor(httpServer: http.Server, bridgeService: BridgeService) {
        this.bridgeService = bridgeService;
        
        this.server = new WebSocketServer({
            server: httpServer,
            path: '/nest'
        });

        this.server.on('connection', (ws: WebSocket) => {
            console.log('New Nest connection');
            
            ws.on('message', (message: Buffer) => {
                if (typeof message === 'string') {
                    // Handle string messages if needed
                }
                if (Buffer.isBuffer(message) && message.length > 0) {
                    this.handleBinaryMessage(message);
                }
            });

            ws.on('error', (error) => {
                console.error('WebSocket error:', error);
            });

            ws.on('close', () => {
                console.log('Nest connection closed');
            });
        });

        // Subscribe to bridge service messages
        this.subscription = this.bridgeService.nestObservable.subscribe((message) => {
            this.sendToAllClients(message);
        });
    }

    private sendToAllClients(message: string | Uint8Array) {
        this.server.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }

    private handleBinaryMessage(message: Buffer) {
        this.bridgeService.sendToDevices(message);
    }

    close() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.server.close();
    }
}