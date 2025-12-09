import { Router, Request, Response } from 'express';
import { FilesService } from '../services/files.service';
import logger from '../utils/logger';

interface PathExposeDTO {
    path: string;
}

interface FileRequestParams {
    exposeId: string;
    fileName: string;
}

export function createFilesRoutes(filesService: FilesService): Router {
    const router = Router();

    router.post('/expose', (req: Request<{}, number, PathExposeDTO>, res: Response) => {
        try {
            const { path } = req.body;
            logger.debug(`Path expose request: ${path}`);
            if (!path) {
                logger.warn('Attempt to expose path without providing path parameter');
                return res.status(400).json({ error: 'Path is required' });
            }
            const exposeId = filesService.createPathExpose(path);
            logger.info(`Path exposed successfully: ${path} -> ID: ${exposeId}`);
            res.json(exposeId);
        } catch (error) {
            logger.error('Error exposing path:', error);
            res.status(500).json({ error: 'Failed to expose path' });
        }
    });

    router.get('/:exposeId/:fileName', (req: Request<FileRequestParams>, res: Response) => {
        try {
            const { exposeId, fileName } = req.params;
            logger.debug(`File request: exposeId=${exposeId}, fileName=${fileName}`);
            const exposeIdNumber = parseInt(exposeId, 10);
            
            if (isNaN(exposeIdNumber)) {
                logger.warn(`Attempt to access with invalid exposeId: ${exposeId}`);
                return res.status(400).json({ error: 'Invalid exposeId' });
            }

            const fileStream = filesService.getFile(exposeIdNumber, fileName);
            logger.info(`Serving file: ${fileName} (exposeId: ${exposeIdNumber})`);
            
            fileStream.on('error', (error) => {
                logger.error(`Error reading file ${fileName} (exposeId: ${exposeIdNumber}):`, error);
                res.status(404).json({ error: 'File not found' });
            });

            fileStream.pipe(res);
        } catch (error: unknown) {
            if (error instanceof Error && error.message === 'Path not being exposed') {
                logger.warn(`Attempt to access non-exposed path: exposeId=${req.params.exposeId}`);
                return res.status(404).json({ error: error.message });
            }
            logger.error('Unexpected error getting file:', error);
            res.status(500).json({ error: 'Failed to get file' });
        }
    });

    return router;
}