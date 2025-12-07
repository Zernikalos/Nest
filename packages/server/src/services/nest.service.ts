import * as os from "node:os";

export class NestService {
    private port: number;

    constructor(port: number) {
        this.port = port;
    }

    getInfoEncoded(): string {
        const json = JSON.stringify(this.getInfo());
        return Buffer.from(json).toString("base64");
    }

    getInfo(): { ip: string[]; port: number } {
        return {
            ip: this.getInternalIp(),
            port: this.getPort()
        };
    }

    private getInternalIp(): string[] {
        return Object.values(os.networkInterfaces()).flat()
            .filter((networkInterface): networkInterface is os.NetworkInterfaceInfo => 
                networkInterface !== undefined && 
                networkInterface.family === 'IPv4' && 
                !networkInterface.internal)
            .map(networkInterface => networkInterface.address);
    }

    private getPort(): number {
        return this.port;
    }
}