import { createReadStream } from "fs";
import * as path from "path";
import { Readable } from "stream";
import { crc32 } from "../utils/crc32";

function pathToCrc32(filePath: string): number {
    return crc32(filePath);
}

export class FilesService {
    private pathMap: Map<number, string> = new Map<number, string>();

    public createPathExpose(filePath: string): number {
        const key = pathToCrc32(filePath);
        this.pathMap.set(key, filePath);
        return key;
    }

    public getFile(exposeId: number, fileName: string): Readable {
        if (!this.pathMap.has(exposeId)) {
            throw new Error("Path not being exposed");
        }
        const basePath = this.pathMap.get(exposeId)!;
        const filePath = path.resolve(basePath, fileName);
        const file = createReadStream(filePath);
        return file;
    }
}