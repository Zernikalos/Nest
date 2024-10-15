import {defineStore} from "pinia";
import {webSocket, WebSocketSubject} from "rxjs/webSocket"
import {map, Observable} from "rxjs";
import {api} from "./httpClient";

class WebSocketHandler {

    private socketSubject?: WebSocketSubject<any>
    public _isConnected: boolean = false

    public get isConnected() {
        return !this.socketSubject?.closed && this._isConnected
    }

    send(data: Uint8Array | string) {
        this.socketSubject?.next(data);
    }

    connect(url: string): Observable<any> {
        if (!this.socketSubject || this.socketSubject.closed) {
            this.socketSubject = webSocket({
                url,
                binaryType: "arraybuffer",
                serializer(value) {
                    if (value instanceof ArrayBuffer) {
                        return value
                    } else {
                        return JSON.parse(value)
                    }
                },
                openObserver: {
                    next: () => {
                        this._isConnected = true
                    }
                },
                closeObserver: {
                    next: () => {
                        this._isConnected = false
                    }
                }
            })
        }
        return this.socketSubject.pipe(map(value => {
            this._isConnected = true
            return value
        }))
    }

}

export const useNestApiStore = defineStore("nestApiStore", () => {

    let socket: WebSocketHandler = new WebSocketHandler()

    /**
     * This function creates a websocket connection given the url
     *
     * @param {string} url - The URL of the websocket server to connect to
     *
     * @return {AsyncGenerator<Promise<{status: string, data?: any}>, void, unknown>} - An async generator that yields promises representing the connection status and received messages
     *. The returned promises resolve to objects containing the status and optional data.
     *
     */
    function connectNestWebSocket() {
        return socket.connect("ws://localhost:3002/nest")
    }

    function sendData(data: Uint8Array | string) {
        socket.send(data)
    }

    async function requestDebugKey(): Promise<string> {
        return (await api.get<string>("/nest/key")).data
    }

    return {
        connectNestWebSocket,
        sendData,
        requestDebugKey
    }

})