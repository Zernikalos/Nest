import { Router, Request, Response } from 'express';
import { NestService } from '../services/nest.service';
import logger from '../utils/logger';

export function createNestRoutes(nestService: NestService): Router {
    const router = Router();

    router.get('/ping', (req: Request, res: Response) => {
        logger.debug('Ping received at /nest/ping');
        res.send('pong');
    });

    router.get('/info', (req: Request, res: Response) => {
        logger.debug('Server info request at /nest/info');
        const info = nestService.getInfo();
        logger.debug(`Server info sent: ${JSON.stringify(info)}`);
        res.json(info);
    });

    router.get('/key', (req: Request, res: Response) => {
        logger.debug('Encoded key request at /nest/key');
        const key = nestService.getInfoEncoded();
        res.send(key);
    });

    return router;
}