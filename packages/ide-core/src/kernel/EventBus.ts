/**
 * Typed event bus for runtime communication.
 * No DOM EventTarget - pure in-memory pub/sub.
 */

type Listener<T> = (payload: T) => void;

export class EventBus {
    private listeners = new Map<string, Set<Listener<unknown>>>();

    on<T>(event: string, listener: Listener<T>): () => void {
        const set = this.listeners.get(event) ?? new Set();
        set.add(listener as Listener<unknown>);
        this.listeners.set(event, set);

        return () => {
            set.delete(listener as Listener<unknown>);
            if (set.size === 0) this.listeners.delete(event);
        };
    }

    emit<T>(event: string, payload: T): void {
        const set = this.listeners.get(event);
        if (set) {
            for (const listener of set) {
                listener(payload);
            }
        }
    }

    dispose(): void {
        this.listeners.clear();
    }
}
