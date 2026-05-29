/**
 * Minimal store contract for domain editors (Zustand subscribe + getState).
 */
export interface SubscribableEditor<S> {
    getState(): S;
    subscribe(listener: () => void): () => void;
}
