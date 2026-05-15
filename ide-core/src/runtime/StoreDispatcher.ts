import type { RuntimeEffect, RuntimeIntent, RuntimeStore } from '../contracts/index.js';
import type { EffectCaller } from './EffectCaller.js';
import { sessionPersistEffect } from '../contracts/effects.js';

/**
 * Dispatches intents to a store and runs effects through EffectCaller.
 */
export class StoreDispatcher {
    constructor(readonly effectCaller: EffectCaller) {}

    dispatch<S>(store: RuntimeStore<S>, intent: RuntimeIntent): RuntimeEffect[] {
        const effects = store.dispatch(intent);
        const allEffects = [...effects, sessionPersistEffect()];
        void this.effectCaller.run(allEffects);
        return effects;
    }
}
