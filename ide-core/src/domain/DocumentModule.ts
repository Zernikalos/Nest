/**
 * Document module: state and intents for open documents (URIs) and the active document.
 * Synced with the scene tree: opening a node opens a document with uri zobject://nodeId.
 * Used for tab bars and active editor content; dirty/save are tracked here but I/O is platform-specific.
 */
import { produce } from 'immer';
import type { RuntimeEffect, RuntimeIntent } from '../contracts/index.js';
import { createStore } from '../kernel/createStore.js';

/** Intent type constants for the document reducer. */
export const OPEN_DOCUMENT = 'document/OPEN_DOCUMENT';
export const CLOSE_DOCUMENT = 'document/CLOSE_DOCUMENT';
export const SET_ACTIVE_DOCUMENT = 'document/SET_ACTIVE_DOCUMENT';
export const SET_DOCUMENT_DIRTY = 'document/SET_DOCUMENT_DIRTY';
export const SET_DOCUMENT_VIEW_STATE = 'document/SET_DOCUMENT_VIEW_STATE';
export const RESTORE_DOCUMENTS = 'document/RESTORE_DOCUMENTS';

/** Single document entry: uri, optional title, dirty flag, optional view state. */
export interface DocumentRecord {
    uri: string;
    title?: string;
    dirty: boolean;
    viewState?: unknown;
}

/** Internal state: documents by URI, order, and active URI. */
export interface DocumentState {
    byUri: Record<string, DocumentRecord>;
    order: string[];
    activeUri: string | null;
}

const initialState: DocumentState = {
    byUri: {},
    order: [],
    activeUri: null,
};

function reducer(
    state: DocumentState,
    intent: RuntimeIntent
): { state: DocumentState; effects: RuntimeEffect[] } {
    switch (intent.type) {
        case RESTORE_DOCUMENTS: {
            const payload = intent.payload as {
                documents: DocumentRecord[];
                activeUri: string | null;
            };
            const byUri: Record<string, DocumentRecord> = {};
            const order: string[] = [];
            for (const doc of payload.documents) {
                byUri[doc.uri] = doc;
                order.push(doc.uri);
            }
            const activeUri = payload.activeUri && byUri[payload.activeUri] ? payload.activeUri : null;
            return { state: { byUri, order, activeUri }, effects: [] };
        }
        case OPEN_DOCUMENT: {
            const payload = intent.payload as { uri: string; title?: string; viewState?: unknown };
            return {
                state: produce(state, (d) => {
                    const existing = d.byUri[payload.uri];
                    d.byUri[payload.uri] = {
                        uri: payload.uri,
                        title: payload.title ?? existing?.title,
                        dirty: existing?.dirty ?? false,
                        viewState: payload.viewState ?? existing?.viewState,
                    };
                    if (!d.order.includes(payload.uri)) {
                        d.order.push(payload.uri);
                    }
                    d.activeUri = payload.uri;
                }),
                effects: [],
            };
        }
        case CLOSE_DOCUMENT: {
            const payload = intent.payload as { uri: string };
            if (!state.byUri[payload.uri]) {
                return { state, effects: [] };
            }
            return {
                state: produce(state, (d) => {
                    delete d.byUri[payload.uri];
                    d.order = d.order.filter((uri) => uri !== payload.uri);
                    if (d.activeUri === payload.uri) {
                        d.activeUri = d.order.length > 0 ? d.order[d.order.length - 1] : null;
                    }
                }),
                effects: [],
            };
        }
        case SET_ACTIVE_DOCUMENT: {
            const payload = intent.payload as { uri: string | null };
            if (payload.uri !== null && !state.byUri[payload.uri]) {
                return { state, effects: [] };
            }
            return {
                state: produce(state, (d) => {
                    d.activeUri = payload.uri;
                }),
                effects: [],
            };
        }
        case SET_DOCUMENT_DIRTY: {
            const payload = intent.payload as { uri: string; dirty: boolean };
            const doc = state.byUri[payload.uri];
            if (!doc) {
                return { state, effects: [] };
            }
            return {
                state: produce(state, (d) => {
                    if (d.byUri[payload.uri]) d.byUri[payload.uri].dirty = payload.dirty;
                }),
                effects: [],
            };
        }
        case SET_DOCUMENT_VIEW_STATE: {
            const payload = intent.payload as { uri: string; viewState?: unknown };
            const doc = state.byUri[payload.uri];
            if (!doc) {
                return { state, effects: [] };
            }
            return {
                state: produce(state, (d) => {
                    if (d.byUri[payload.uri]) d.byUri[payload.uri].viewState = payload.viewState;
                }),
                effects: [],
            };
        }
        default:
            return { state, effects: [] };
    }
}

export function createDocumentStore(
    onEffects?: (effects: RuntimeEffect[]) => void
): ReturnType<typeof createStore<DocumentState>> {
    return createStore(initialState, reducer, onEffects);
}

/** View model for documents: active URI and list of opened documents in order. */
export interface DocumentViewModel {
    activeUri: string | null;
    openedDocuments: DocumentRecord[];
}

/** Builds the view model from current state. */
export function getDocumentViewModel(state: DocumentState): DocumentViewModel {
    return {
        activeUri: state.activeUri,
        openedDocuments: state.order
            .map((uri) => state.byUri[uri])
            .filter((doc): doc is DocumentRecord => doc !== undefined),
    };
}
