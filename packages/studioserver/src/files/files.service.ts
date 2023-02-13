import { Injectable } from '@nestjs/common'
import * as CRC32 from "crc-32"

@Injectable()
export class FilesService {

    public createPathExpose(path: string): number {
        const crc32Value = CRC32.str(path)
        return crc32Value < 0 ? crc32Value >>> 0 : crc32Value
    }
}
