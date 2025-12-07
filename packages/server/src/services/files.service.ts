import * as CRC32 from "crc-32";
import { createReadStream } from "fs";
import * as path from "path";
import { Readable } from "stream";

function pathToCrc32(filePath: string): number {
    const crc32Value = CRC32.str(filePath);
    return crc32Value < 0 ? crc32Value >>> 0 : crc32Value;
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