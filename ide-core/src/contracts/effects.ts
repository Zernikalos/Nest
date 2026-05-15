import type { RuntimeEffect } from './index.js';

/** Effect: request debounced session persistence. */
export const SESSION_PERSIST = 'session/persist';

/** Effect: sync context keys from runtime state. */
export const CONTEXT_SYNC = 'context/sync';

export function sessionPersistEffect(): RuntimeEffect {
    return { type: SESSION_PERSIST };
}

export function contextSyncEffect(): RuntimeEffect {
    return { type: CONTEXT_SYNC };
}
