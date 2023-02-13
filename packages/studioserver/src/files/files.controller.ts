import {Controller, Get, Post} from '@nestjs/common';
import {FilesService} from "./files.service";

@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Get()
    getHello(): number {
        return this.filesService.createPathExpose("SheetJS")
    }

    @Post("expose")
    public expose(path: string) {
        return this.filesService.createPathExpose(path)
    }
}
