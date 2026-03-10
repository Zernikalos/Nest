import type { StoragePort } from '../ports/index.js';

export interface SessionData {
    sceneTree: {
        openedNodeIds: string[];
        activeNode: string | null;
    };
}

const SESSION_KEY = 'ide-session';

export class SessionService {
    constructor(private readonly storage: StoragePort) {}

    async save(data: SessionData): Promise<void> {
        await this.storage.set(SESSION_KEY, JSON.stringify(data));
    }

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
                (parsed.sceneTree.activeNode === null ||
                    typeof parsed.sceneTree.activeNode === 'string')
            ) {
                return parsed;
            }
        } catch {
            // Invalid JSON or shape
        }
        return null;
    }
}
