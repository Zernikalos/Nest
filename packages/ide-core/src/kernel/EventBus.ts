/**
 * Typed event bus for runtime communication.
 * No DOM EventTarget; pure in-memory pub/sub. Use for cross-module events without coupling.
 */

type Listener<T> = (payload: T) => void;

export class EventBus {
    private listeners = new Map<string, Set<Listener<unknown>>>();

    /**
     * Subscribe to an event. Returns an unsubscribe function.
     */
    on<T>(event: string, listener: Listener<T>): () => void {
        const set = this.listeners.get(event) ?? new Set();
        set.add(listener as Listener<unknown>);
        this.listeners.set(event, set);

        return () => {
            set.delete(listener as Listener<unknown>);
            if (set.size === 0) this.listeners.delete(event);
        };
    }

    /** Emit an event to all subscribers. */
    emit<T>(event: string, payload: T): void {
        const set = this.listeners.get(event);
        if (set) {
            for (const listener of set) {
                listener(payload);
            }
        }
    }

    /** Remove all subscriptions. */
    dispose(): void {
        this.listeners.clear();
    }
}
