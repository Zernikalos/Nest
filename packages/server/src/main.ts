import express, { Express } from 'express';
import * as http from 'http';
import cors from 'cors';
import * as path from 'path';
import configuration from './configuration/configuration';
import { BridgeService } from './services/bridge.service';
import { FilesService } from './services/files.service';
import { NestService } from './services/nest.service';
import { SettingsService } from './services/settings.service';
import { SettingsRepository } from './repositories/settings.repository';
import { createRoutes } from './routes';
import { NestGateway } from './gateways/nest.gateway';
import { ZDebuggerGateway } from './gateways/zdebugger.gateway';
import logger from './utils/logger';

export { SettingsService };

export interface ZNestServer {
    settings: SettingsService;
    gateways: {
        nest: NestGateway;
        zdebugger: ZDebuggerGateway;
    };
}

export interface ServerOptions {
    dbPath: string;
    settingsPath: string;
}

export async function serverBootstrap(options: ServerOptions): Promise<ZNestServer> {
    logger.info('Configuring server...');
    const app: Express = express();
    const config = configuration();
    const port = config.port;

    // Middlewares
    logger.debug('Configuring middlewares (CORS, JSON parser)');
    app.use(cors());
    app.use(express.json());
    
    // HTTP Request logging middleware
    app.use((req, res, next) => {
        const start = Date.now();
        logger.debug(`${req.method} ${req.path} - Start`);
        
        res.on('finish', () => {
            const duration = Date.now() - start;
            const level = res.statusCode >= 400 ? 'warn' : 'debug';
            logger[level](`${req.method} ${req.path} - ${res.statusCode} - ${duration}ms`);
        });
        
        next();
    });

    // Create services
    logger.debug('Initializing services...');
    const bridgeService = new BridgeService();
    const filesService = new FilesService();
    const nestService = new NestService(port);
    const settingsRepository = new SettingsRepository(options.settingsPath);
    const settingsService = new SettingsService(settingsRepository);

    // Setup routes
    logger.debug('Configuring HTTP routes');
    app.use(createRoutes(nestService, filesService));

    // Create HTTP server
    const httpServer = http.createServer(app);

    // Setup WebSocket gateways
    logger.debug('Configuring WebSocket gateways...');
    const nestGateway = new NestGateway(httpServer, bridgeService);
    const zdebuggerGateway = new ZDebuggerGateway(httpServer, bridgeService);

    // Start server
    await new Promise<void>((resolve) => {
        httpServer.listen(port, () => {
            logger.info(`🚀 Server started successfully on port ${port}`);
            logger.info(`📡 WebSocket Nest Gateway available at /nest`);
            logger.info(`🔧 WebSocket ZDebugger Gateway available at /zdebugger`);
            resolve();
        });
    });

    return {
        settings: settingsService,
        gateways: {
            nest: nestGateway,
            zdebugger: zdebuggerGateway
        }
    };
}

if (configuration().shouldStartServer) {
    const defaultDbPath = path.join(__dirname, '..', 'db', 'nest-dev.sqlite');
    const defaultSettingsPath = path.join(__dirname, '..', 'db', 'settings');
    logger.info('Starting server...');
    logger.debug(`Database path: ${defaultDbPath}`);
    logger.debug(`Settings path: ${defaultSettingsPath}`);
    serverBootstrap({
        dbPath: defaultDbPath,
        settingsPath: defaultSettingsPath
    }).catch((error) => {
        logger.error('Fatal error starting server:', error);
        process.exit(1);
    });
}