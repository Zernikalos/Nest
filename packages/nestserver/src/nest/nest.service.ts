import os from "os";
import { Injectable } from '@nestjs/common';
import {ConfigService} from "@nestjs/config";

@Injectable()
export class NestService {

    constructor(private configService: ConfigService) {
    }

    getInfoEncoded(): string {
        const json = JSON.stringify(this.getInfo())
        return Buffer.from(json).toString("base64")
    }

    getInfo(): { ip: string[], port: number } {
        return {
            ip: this.getInternalIp(),
            port: this.getPort()
        }
    }

    private getInternalIp(): string[] {
        return Object.values(os.networkInterfaces()).flat()
            .filter(networkInterface => networkInterface.family === 'IPv4' && !networkInterface.internal)
            .map(networkInterface => networkInterface.address)
    }

    private getPort(): number {
        return this.configService.get<number>('port')
    }

}
