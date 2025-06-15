import { Injectable } from "@nestjs/common"
import {Observable, Subject} from "rxjs"

@Injectable()
export class BridgeService {

    private nestSubject: Subject<any>
    private devicesSubject: Subject<any>

    constructor() {
        this.nestSubject = new Subject<any>()
        this.devicesSubject = new Subject<any>()
    }

    get nestObservable(): Observable<any> {
        return this.nestSubject.asObservable()
    }

    get debuggerObservable(): Observable<any> {
        return this.devicesSubject.asObservable()
    }

    sendToNest(message: string | Uint8Array) {
        this.nestSubject.next(message)
    }

    sendToDevices(message: string | Uint8Array) {
        this.devicesSubject.next(message)
    }
}
