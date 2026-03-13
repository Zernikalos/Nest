/**
 * Asset conversion module: state and intents for convert-to-ZKO workflow.
 * Tracks converting flag, error, and last result. Used by the runtime; UI adapters subscribe to the view model.
 */
import { produce } from 'immer';
import type { RuntimeIntent, RuntimeEffect } from '../contracts/index.js';
import { createStore } from '../kernel/createStore.js';
import type { AssetConversionResult } from './types.js';

/** Intent type constants for the asset conversion reducer. */
export const START_CONVERSION = 'assetConversion/START_CONVERSION';
export const SET_CONVERSION_RESULT = 'assetConversion/SET_CONVERSION_RESULT';
export const SET_CONVERSION_ERROR = 'assetConversion/SET_CONVERSION_ERROR';

/** Internal state for the asset conversion reducer. */
export interface AssetConversionState {
    isConverting: boolean;
    conversionError: string | null;
    lastResult: AssetConversionResult | null;
}

const initialState: AssetConversionState = {
    isConverting: false,
    conversionError: null,
    lastResult: null,
};

function reducer(
    state: AssetConversionState,
    intent: RuntimeIntent
): { state: AssetConversionState; effects: RuntimeEffect[] } {
    switch (intent.type) {
        case START_CONVERSION: {
            return {
                state: produce(state, (d) => {
                    d.isConverting = true;
                    d.conversionError = null;
                }),
                effects: [],
            };
        }
        case SET_CONVERSION_RESULT: {
            const result = intent.payload as AssetConversionResult | null;
            return {
                state: produce(state, (d) => {
                    d.lastResult = result;
                    d.isConverting = false;
                    d.conversionError = null;
                }),
                effects: [],
            };
        }
        case SET_CONVERSION_ERROR: {
            const message = intent.payload as string | null;
            return {
                state: produce(state, (d) => {
                    d.conversionError = message;
                    d.isConverting = false;
                }),
                effects: [],
            };
        }
        default:
            return { state, effects: [] };
    }
}

export function createAssetConversionStore(
    onEffects?: (effects: RuntimeEffect[]) => void
): ReturnType<typeof createStore<AssetConversionState>> {
    return createStore(initialState, reducer, onEffects);
}

/** View model derived from AssetConversionState for UI projection. */
export interface AssetConversionViewModel {
    isConverting: boolean;
    conversionError: string | null;
    lastResult: AssetConversionResult | null;
}

/** Builds the view model from current state. */
export function getAssetConversionViewModel(
    state: AssetConversionState
): AssetConversionViewModel {
    return {
        isConverting: state.isConverting,
        conversionError: state.conversionError,
        lastResult: state.lastResult,
    };
}
