import { createStore } from './createStore';
import type { RuntimeIntent, RuntimeEffect } from '../contracts/index';

interface CounterState {
    count: number;
}

const reducer = (state: CounterState, intent: RuntimeIntent): { state: CounterState; effects: RuntimeEffect[] } => {
    if (intent.type === 'INCREMENT') {
        return { state: { count: state.count + 1 }, effects: [] };
    }
    if (intent.type === 'DECREMENT') {
        return { state: { count: state.count - 1 }, effects: [] };
    }
    return { state, effects: [] };
};

describe('createStore', () => {
    it('returns initial state', () => {
        const store = createStore<CounterState>({ count: 0 }, reducer);
        expect(store.getState()).toEqual({ count: 0 });
    });

    it('updates state on dispatch', () => {
        const store = createStore<CounterState>({ count: 0 }, reducer);
        store.dispatch({ type: 'INCREMENT' });
        expect(store.getState()).toEqual({ count: 1 });
        store.dispatch({ type: 'INCREMENT' });
        expect(store.getState()).toEqual({ count: 2 });
        store.dispatch({ type: 'DECREMENT' });
        expect(store.getState()).toEqual({ count: 1 });
    });

    it('notifies subscribers on dispatch', () => {
        const store = createStore<CounterState>({ count: 0 }, reducer);
        const listener = jest.fn();
        store.subscribe(listener);
        store.dispatch({ type: 'INCREMENT' });
        expect(listener).toHaveBeenCalledTimes(1);
        store.dispatch({ type: 'INCREMENT' });
        expect(listener).toHaveBeenCalledTimes(2);
    });

    it('unsubscribes correctly', () => {
        const store = createStore<CounterState>({ count: 0 }, reducer);
        const listener = jest.fn();
        const unsubscribe = store.subscribe(listener);
        store.dispatch({ type: 'INCREMENT' });
        unsubscribe();
        store.dispatch({ type: 'INCREMENT' });
        expect(listener).toHaveBeenCalledTimes(1);
    });
});
