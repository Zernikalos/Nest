import { Router } from 'express';
import { createNestRoutes } from './nest.routes';
import { createFilesRoutes } from './files.routes';
import { NestService } from '../services/nest.service';
import { FilesService } from '../services/files.service';
import logger from '../utils/logger';

export function createRoutes(nestService: NestService, filesService: FilesService): Router {
    const router = Router();

    logger.debug('Registering routes: /nest, /files');
    router.use('/nest', createNestRoutes(nestService));
    router.use('/files', createFilesRoutes(filesService));

    return router;
}