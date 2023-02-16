import {Body, Controller, Get, Param, Post, StreamableFile} from '@nestjs/common';
import {FilesService} from "./files.service";

interface PathExposeDTO {
    path: string
}

class FileRequestDTO {
    exposeId: string
    fileName: string
    // path?: string
}


@Controller('files')
export class FilesController {
    constructor(private readonly filesService: FilesService) {}

    @Post("expose")
    public expose(@Body() fileExpose: PathExposeDTO) {
        return this.filesService.createPathExpose(fileExpose.path)
    }

    @Get("/:exposeId/:fileName")
    getFile(@Param() params: FileRequestDTO): StreamableFile {
        return this.filesService.getFile(parseInt(params.exposeId), params.fileName)
    }
}
