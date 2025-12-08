import { Observable, Subject } from 'rxjs';

export class BridgeService {
    private nestSubject: Subject<string | Uint8Array>;
    private devicesSubject: Subject<string | Uint8Array>;

    constructor() {
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
        this.nestSubject.next(message);
    }

    sendToDevices(message: string | Uint8Array) {
        this.devicesSubject.next(message);
    }
}