/**
 * Engine session module: state and intents for engine/preview session lifecycle.
 * Tracks status (idle, starting, running, stopping, failed) and error.
 * Used by the runtime; UI adapters subscribe to the view model.
 */
import { produce } from 'immer';
import type { RuntimeIntent, RuntimeEffect } from '../contracts/index.js';
import { createStore } from '../kernel/createStore.js';

/** Engine session status. */
export type EngineSessionStatus = 'idle' | 'starting' | 'running' | 'stopping' | 'failed';

/** Intent type constants for the engine session reducer. */
export const SET_STATUS = 'engineSession/SET_STATUS';
export const SET_ERROR = 'engineSession/SET_ERROR';

/** Internal state for the engine session reducer. */
export interface EngineSessionState {
    status: EngineSessionStatus;
    error: string | null;
}

const initialState: EngineSessionState = {
    status: 'idle',
    error: null,
};

function reducer(
    state: EngineSessionState,
    intent: RuntimeIntent
): { state: EngineSessionState; effects: RuntimeEffect[] } {
    switch (intent.type) {
        case SET_STATUS: {
            const status = intent.payload as EngineSessionStatus;
            return {
                state: produce(state, (d) => {
                    d.status = status;
                    if (status !== 'failed') d.error = null;
                }),
                effects: [],
            };
        }
        case SET_ERROR: {
            const error = intent.payload as string | null;
            return {
                state: produce(state, (d) => {
                    d.error = error;
                    d.status = 'failed';
                }),
                effects: [],
            };
        }
        default:
            return { state, effects: [] };
    }
}

export function createEngineSessionStore(
    onEffects?: (effects: RuntimeEffect[]) => void
): ReturnType<typeof createStore<EngineSessionState>> {
    return createStore(initialState, reducer, onEffects);
}

/** View model derived from EngineSessionState for UI projection. */
export interface EngineSessionViewModel {
    status: EngineSessionStatus;
    error: string | null;
    isRunning: boolean;
    isBusy: boolean;
}

/** Builds the view model from current state. */
export function getEngineSessionViewModel(
    state: EngineSessionState
): EngineSessionViewModel {
    const isRunning = state.status === 'running';
    const isBusy = state.status === 'starting' || state.status === 'stopping';
    return {
        status: state.status,
        error: state.error,
        isRunning,
        isBusy,
    };
}
