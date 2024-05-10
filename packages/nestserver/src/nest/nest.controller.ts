import {Controller, Get} from '@nestjs/common';
import {NestService} from "./nest.service";

@Controller('nest')
export class NestController {

    constructor(private readonly nestService: NestService) {
    }

    @Get("alive")
    isAlive(): boolean {
        return true;
    }

    @Get("info")
    info(): { ip: string[], port: number } {
        return this.nestService.getInfo()
    }

    @Get("key")
    key(): string {
        return this.nestService.getInfoEncoded()
    }

}
