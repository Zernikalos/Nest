import { createReadStream } from "fs";
import * as path from "path";
import { Readable } from "stream";
import { crc32 } from "../utils/crc32";
import logger from "../utils/logger";

function pathToCrc32(filePath: string): number {
    return crc32(filePath);
}

export class FilesService {
    private pathMap: Map<number, string> = new Map<number, string>();

    public createPathExpose(filePath: string): number {
        const key = pathToCrc32(filePath);
        this.pathMap.set(key, filePath);
        logger.debug(`Path added to expose map: ${filePath} (ID: ${key})`);
        logger.debug(`Total exposed paths: ${this.pathMap.size}`);
        return key;
    }

    public getFile(exposeId: number, fileName: string): Readable {
        if (!this.pathMap.has(exposeId)) {
            logger.warn(`Attempt to access non-exposed path (exposeId: ${exposeId})`);
            throw new Error("Path not being exposed");
        }
        const basePath = this.pathMap.get(exposeId)!;
        const filePath = path.resolve(basePath, fileName);
        logger.debug(`Resolving file: ${fileName} from base path: ${basePath}`);
        logger.debug(`Full file path: ${filePath}`);
        const file = createReadStream(filePath);
        return file;
    }
}