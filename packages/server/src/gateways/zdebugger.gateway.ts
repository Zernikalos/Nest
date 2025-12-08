import * as http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { Subscription } from 'rxjs';
import { BridgeService } from '../services/bridge.service';

interface LogsMessage {
    event: string;
    data: unknown;
}

export class ZDebuggerGateway {
    private server: WebSocketServer;
    private bridgeService: BridgeService;
    private subscription: Subscription | null = null;

    constructor(httpServer: http.Server, bridgeService: BridgeService) {
        this.bridgeService = bridgeService;
        
        this.server = new WebSocketServer({
            server: httpServer,
            path: '/zdebugger'
        });

        this.server.on('connection', (ws: WebSocket) => {
            console.log('New ZDebugger connection');

            ws.on('message', (message: Buffer) => {
                try {
                    const data = JSON.parse(message.toString());
                    this.handleMessage(ws, data);
                } catch (error) {
                    console.error('Error parsing message:', error);
                }
            });

            ws.on('error', (error) => {
                console.error('WebSocket error:', error);
            });

            ws.on('close', () => {
                console.log('ZDebugger connection closed');
            });
        });

        // Subscribe to bridge service messages
        this.subscription = this.bridgeService.debuggerObservable.subscribe((message) => {
            this.sendToAllClients(message);
        });
    }

    private handleMessage(ws: WebSocket, data: { event?: string; data?: unknown }) {
        if (data.event === 'logs' || data.event === 'stats') {
            const message: LogsMessage = {
                event: data.event,
                data: data.data
            };
            this.bridgeService.sendToNest(JSON.stringify(message));
        }
    }

    private sendToAllClients(message: string | Uint8Array) {
        this.server.clients.forEach((client) => {
            if (client.readyState === WebSocket.OPEN) {
                client.send(message);
            }
        });
    }

    close() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.server.close();
    }
}