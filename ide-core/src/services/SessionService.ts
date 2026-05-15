import { z } from 'zod';
import type { StoragePort } from '../ports/index.js';

/**
 * Zod schema for the persisted session. Validates shape when restoring from storage.
 * Stored as JSON via StoragePort; used to restore scene tree, workbench layout, and open documents.
 */
const SessionDataSchema = z.object({
    sceneTree: z.object({
        /** @deprecated Legacy tab list; migrated to documents on restore. */
        openedNodeIds: z.array(z.string()).optional(),
        activeNode: z.string().nullable().optional(),
        selectedIds: z.array(z.string()).optional(),
        expandedNodeIds: z.array(z.string()).optional(),
    }),
    workbench: z
        .object({
            activeWidgetId: z.string().nullable(),
            openWidgetIds: z.array(z.string()),
            panelSizes: z.record(z.string(), z.array(z.number())).optional(),
        })
        .optional(),
    documents: z
        .object({
            activeUri: z.string().nullable(),
            opened: z.array(
                z.object({
                    uri: z.string(),
                    title: z.string().optional(),
                    dirty: z.boolean(),
                    viewState: z.unknown().optional(),
                })
            ),
        })
        .optional(),
});

/** Shape of the persisted session. Inferred from schema; use for typing when building session snapshots. */
export type SessionData = z.infer<typeof SessionDataSchema>;

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

    /** Restore the last saved session, or null if missing or invalid. Uses Zod for validation. */
    async restore(): Promise<SessionData | null> {
        const raw = await this.storage.get(SESSION_KEY);
        if (!raw) return null;
        try {
            const parsed = JSON.parse(raw) as unknown;
            const result = SessionDataSchema.safeParse(parsed);
            return result.success ? result.data : null;
        } catch {
            return null;
        }
    }
}
