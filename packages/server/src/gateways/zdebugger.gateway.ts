import * as http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { Subscription } from 'rxjs';
import { BridgeService } from '../services/bridge.service';
import logger from '../utils/logger';

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
        
        logger.info('Initializing ZDebugger Gateway at /zdebugger');
        this.server = new WebSocketServer({
            server: httpServer,
            path: '/zdebugger'
        });

        this.server.on('connection', (ws: WebSocket) => {
            const clientInfo = ws.protocol || 'unknown';
            logger.info(`New ZDebugger WebSocket connection from ${clientInfo}`);
            logger.debug(`Total ZDebugger connected clients: ${this.server.clients.size}`);

            ws.on('message', (message: Buffer) => {
                try {
                    const data = JSON.parse(message.toString());
                    logger.debug(`Message received in ZDebugger: ${data.event || 'unknown event'}`);
                    this.handleMessage(ws, data);
                } catch (error) {
                    logger.error('Error parsing message in ZDebugger:', error);
                }
            });

            ws.on('error', (error) => {
                logger.error('WebSocket ZDebugger error:', error);
            });

            ws.on('close', () => {
                logger.info('ZDebugger WebSocket connection closed');
                logger.debug(`Remaining ZDebugger connected clients: ${this.server.clients.size}`);
            });
        });

        // Subscribe to bridge service messages
        this.subscription = this.bridgeService.debuggerObservable.subscribe((message) => {
            this.sendToAllClients(message);
        });
    }

    private handleMessage(ws: WebSocket, data: { event?: string; data?: unknown }) {
        if (data.event === 'logs' || data.event === 'stats') {
            logger.debug(`Forwarding event ${data.event} from ZDebugger to Nest`);
            const message: LogsMessage = {
                event: data.event,
                data: data.data
            };
            this.bridgeService.sendToNest(JSON.stringify(message));
        } else {
            logger.warn(`Unknown event received in ZDebugger: ${data.event || 'no event'}`);
        }
    }

    private sendToAllClients(message: string | Uint8Array) {
        const clientCount = Array.from(this.server.clients).filter(
            client => client.readyState === WebSocket.OPEN
        ).length;
        
        if (clientCount > 0) {
            logger.debug(`Sending message to ${clientCount} ZDebugger client(s)`);
            this.server.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        }
    }

    close() {
        logger.info('Closing ZDebugger Gateway...');
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.server.close();
    }
}