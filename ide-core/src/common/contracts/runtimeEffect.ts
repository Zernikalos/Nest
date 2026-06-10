/** Optional payload returned by command handlers for platform adapters. */
export interface RuntimeEffect {
    type: string;
    payload?: unknown;
}
