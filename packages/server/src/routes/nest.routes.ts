import { Router, Request, Response } from 'express';
import { NestService } from '../services/nest.service';

export function createNestRoutes(nestService: NestService): Router {
    const router = Router();

    router.get('/ping', (req: Request, res: Response) => {
        res.send('pong');
    });

    router.get('/info', (req: Request, res: Response) => {
        const info = nestService.getInfo();
        res.json(info);
    });

    router.get('/key', (req: Request, res: Response) => {
        const key = nestService.getInfoEncoded();
        res.send(key);
    });

    return router;
}