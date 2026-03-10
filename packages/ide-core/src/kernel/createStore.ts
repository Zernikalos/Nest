import type { RuntimeIntent, RuntimeEffect, RuntimeStore } from '../contracts/index.js';

export type Reducer<S> = (state: S, intent: RuntimeIntent) => { state: S; effects: RuntimeEffect[] };

/**
 * Creates a RuntimeStore with a reducer and optional effect executor.
 */
export function createStore<S>(
    initialState: S,
    reducer: Reducer<S>,
    onEffects?: (effects: RuntimeEffect[]) => void
): RuntimeStore<S> {
    let state = initialState;
    const listeners = new Set<() => void>();

    function getState(): S {
        return state;
    }

    function dispatch(intent: RuntimeIntent): RuntimeEffect[] {
        const { state: nextState, effects } = reducer(state, intent);
        state = nextState;
        onEffects?.(effects);
        for (const listener of listeners) {
            listener();
        }
        return effects;
    }

    function subscribe(listener: () => void): () => void {
        listeners.add(listener);
        return () => listeners.delete(listener);
    }

    return { getState, dispatch, subscribe };
}
