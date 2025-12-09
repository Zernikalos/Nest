import { Observable, Subject } from 'rxjs';
import logger from '../utils/logger';

export class BridgeService {
    private nestSubject: Subject<string | Uint8Array>;
    private devicesSubject: Subject<string | Uint8Array>;

    constructor() {
        logger.debug('Initializing BridgeService');
        this.nestSubject = new Subject<string | Uint8Array>();
        this.devicesSubject = new Subject<string | Uint8Array>();
    }

    get nestObservable(): Observable<string | Uint8Array> {
        return this.nestSubject.asObservable();
    }

    get debuggerObservable(): Observable<string | Uint8Array> {
        return this.devicesSubject.asObservable();
    }

    sendToNest(message: string | Uint8Array) {
        const size = typeof message === 'string' ? message.length : message.length;
        logger.debug(`Sending message to Nest (${typeof message === 'string' ? 'text' : 'binary'}, ${size} bytes)`);
        this.nestSubject.next(message);
    }

    sendToDevices(message: string | Uint8Array) {
        const size = typeof message === 'string' ? message.length : message.length;
        logger.debug(`Sending message to devices (${typeof message === 'string' ? 'text' : 'binary'}, ${size} bytes)`);
        this.devicesSubject.next(message);
    }
}