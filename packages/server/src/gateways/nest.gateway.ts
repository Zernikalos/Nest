import * as http from 'http';
import { WebSocketServer, WebSocket } from 'ws';
import { Subscription } from 'rxjs';
import { BridgeService } from '../services/bridge.service';
import logger from '../utils/logger';

export class NestGateway {
    private server: WebSocketServer;
    private bridgeService: BridgeService;
    private subscription: Subscription | null = null;

    constructor(httpServer: http.Server, bridgeService: BridgeService) {
        this.bridgeService = bridgeService;
        
        logger.info('Initializing Nest Gateway at /nest');
        this.server = new WebSocketServer({
            server: httpServer,
            path: '/nest'
        });

        this.server.on('connection', (ws: WebSocket) => {
            const clientInfo = ws.protocol || 'unknown';
            logger.info(`New Nest WebSocket connection from ${clientInfo}`);
            logger.debug(`Total connected clients: ${this.server.clients.size}`);
            
            ws.on('message', (message: Buffer) => {
                if (typeof message === 'string') {
                    logger.debug('Text message received in Nest gateway');
                    // Handle string messages if needed
                }
                if (Buffer.isBuffer(message) && message.length > 0) {
                    logger.debug(`Binary message received in Nest gateway (${message.length} bytes)`);
                    this.handleBinaryMessage(message);
                }
            });

            ws.on('error', (error) => {
                logger.error('WebSocket Nest error:', error);
            });

            ws.on('close', () => {
                logger.info('Nest WebSocket connection closed');
                logger.debug(`Remaining connected clients: ${this.server.clients.size}`);
            });
        });

        // Subscribe to bridge service messages
        this.subscription = this.bridgeService.nestObservable.subscribe((message) => {
            this.sendToAllClients(message);
        });
    }

    private sendToAllClients(message: string | Uint8Array) {
        const clientCount = Array.from(this.server.clients).filter(
            client => client.readyState === WebSocket.OPEN
        ).length;
        
        if (clientCount > 0) {
            logger.debug(`Sending message to ${clientCount} Nest client(s)`);
            this.server.clients.forEach((client) => {
                if (client.readyState === WebSocket.OPEN) {
                    client.send(message);
                }
            });
        }
    }

    private handleBinaryMessage(message: Buffer) {
        logger.debug('Forwarding binary message to devices through BridgeService');
        this.bridgeService.sendToDevices(message);
    }

    close() {
        logger.info('Closing Nest Gateway...');
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
        this.server.close();
    }
}