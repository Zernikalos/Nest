/**
 * Typed event bus for runtime communication.
 * Uses eventemitter3 under the hood; pure in-memory pub/sub for cross-module events without coupling.
 */

import { EventEmitter } from 'eventemitter3';

type Listener<T> = (payload: T) => void;

export class EventBus {
    private emitter = new EventEmitter();

    /**
     * Subscribe to an event. Returns an unsubscribe function.
     */
    on<T>(event: string, listener: Listener<T>): () => void {
        this.emitter.on(event, listener as (payload: unknown) => void);
        return () => this.emitter.off(event, listener as (payload: unknown) => void);
    }

    /** Emit an event to all subscribers. */
    emit<T>(event: string, payload: T): void {
        this.emitter.emit(event, payload);
    }

    /** Remove all subscriptions. */
    dispose(): void {
        this.emitter.removeAllListeners();
    }
}
