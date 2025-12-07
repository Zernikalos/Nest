import { Router, Request, Response } from 'express';
import { FilesService } from '../services/files.service';

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
            if (!path) {
                return res.status(400).json({ error: 'Path is required' });
            }
            const exposeId = filesService.createPathExpose(path);
            res.json(exposeId);
        } catch (error) {
            res.status(500).json({ error: 'Failed to expose path' });
        }
    });

    router.get('/:exposeId/:fileName', (req: Request<FileRequestParams>, res: Response) => {
        try {
            const { exposeId, fileName } = req.params;
            const exposeIdNumber = parseInt(exposeId, 10);
            
            if (isNaN(exposeIdNumber)) {
                return res.status(400).json({ error: 'Invalid exposeId' });
            }

            const fileStream = filesService.getFile(exposeIdNumber, fileName);
            
            fileStream.on('error', (error) => {
                res.status(404).json({ error: 'File not found' });
            });

            fileStream.pipe(res);
        } catch (error: any) {
            if (error.message === 'Path not being exposed') {
                return res.status(404).json({ error: error.message });
            }
            res.status(500).json({ error: 'Failed to get file' });
        }
    });

    return router;
}