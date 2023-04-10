import {Body, Controller, Get, Inject, Param, Post, StreamableFile} from "@nestjs/common"
import { FilesService } from "./files.service"

interface PathExposeDTO {
    path: string
}

interface FileRequestDTO {
  exposeId: string
  fileName: string
  // path?: string
}

@Controller("files")
export class FilesController {
  constructor (@Inject(FilesService) private readonly filesService: FilesService) {}

    @Post("expose")
  public expose (@Body() fileExpose: PathExposeDTO) {
    return this.filesService.createPathExpose(fileExpose.path)
  }

    @Get("/:exposeId/:fileName")
    getFile (@Param() params: FileRequestDTO): StreamableFile {
      return this.filesService.getFile(parseInt(params.exposeId), params.fileName)
    }
}
