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

export { SettingsService };

export interface ZNestServer {
    settings: SettingsService;
}

export interface ServerOptions {
    dbPath: string;
    settingsPath: string;
}

export async function serverBootstrap(options: ServerOptions): Promise<ZNestServer> {
    const app: Express = express();
    const config = configuration();
    const port = config.port;

    // Middlewares
    app.use(cors());
    app.use(express.json());

    // Create services
    const bridgeService = new BridgeService();
    const filesService = new FilesService();
    const nestService = new NestService(port);
    const settingsRepository = new SettingsRepository(options.settingsPath);
    const settingsService = new SettingsService(settingsRepository);

    // Setup routes
    app.use(createRoutes(nestService, filesService));

    // Create HTTP server
    const httpServer = http.createServer(app);

    // Setup WebSocket gateways
    const nestGateway = new NestGateway(httpServer, bridgeService);
    const zdebuggerGateway = new ZDebuggerGateway(httpServer, bridgeService);

    // Start server
    await new Promise<void>((resolve) => {
        httpServer.listen(port, () => {
            console.log(`Server listening on port ${port}`);
            resolve();
        });
    });

    return {
        settings: settingsService
    };
}

if (configuration().shouldStartServer) {
    const defaultDbPath = path.join(__dirname, '..', 'db', 'nest-dev.sqlite');
    const defaultSettingsPath = path.join(__dirname, '..', 'db', 'settings');
    serverBootstrap({
        dbPath: defaultDbPath,
        settingsPath: defaultSettingsPath
    }).catch((error) => {
        console.error('Failed to start server:', error);
        process.exit(1);
    });
}