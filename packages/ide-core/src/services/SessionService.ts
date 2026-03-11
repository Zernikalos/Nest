import type { StoragePort } from '../ports/index.js';

/**
 * Shape of the persisted session. Stored as JSON via StoragePort.
 * Used to restore scene tree, workbench layout, and open documents after reload.
 */
export interface SessionData {
    sceneTree: {
        openedNodeIds: string[];
        activeNode: string | null;
        selectedIds?: string[];
        expandedNodeIds?: string[];
    };
    workbench?: {
        activeWidgetId: string | null;
        openWidgetIds: string[];
        panelSizes?: Record<string, number[]>;
    };
    documents?: {
        activeUri: string | null;
        opened: {
            uri: string;
            title?: string;
            dirty: boolean;
            viewState?: unknown;
        }[];
    };
}

const SESSION_KEY = 'ide-session';

/**
 * Persists and restores IDE session state (scene tree, workbench, documents) via a StoragePort.
 * The runtime uses this when a storage port is provided; debounced save is triggered on state changes.
 */
export class SessionService {
    constructor(private readonly storage: StoragePort) {}

    /** Persist the given session snapshot. Overwrites any previous session for this key. */
    async save(data: SessionData): Promise<void> {
        await this.storage.set(SESSION_KEY, JSON.stringify(data));
    }

    /** Restore the last saved session, or null if missing or invalid. */
    async restore(): Promise<SessionData | null> {
        const raw = await this.storage.get(SESSION_KEY);
        if (!raw) return null;
        try {
            const parsed = JSON.parse(raw) as SessionData;
            if (
                parsed &&
                typeof parsed === 'object' &&
                parsed.sceneTree &&
                Array.isArray(parsed.sceneTree.openedNodeIds) &&
                (parsed.sceneTree.activeNode === null || typeof parsed.sceneTree.activeNode === 'string')
            ) {
                return parsed;
            }
        } catch {
            // Invalid JSON or shape
        }
        return null;
    }
}
