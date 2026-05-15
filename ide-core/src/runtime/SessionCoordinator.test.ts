import { migrateSessionData } from './SessionCoordinator';
import type { SessionData } from '../services/SessionService';

describe('migrateSessionData', () => {
    it('migrates legacy openedNodeIds to documents', () => {
        const legacy: SessionData = {
            sceneTree: {
                openedNodeIds: ['node1', 'node2'],
                activeNode: 'node2',
            },
        };
        const migrated = migrateSessionData(legacy);
        expect(migrated.documents?.opened).toHaveLength(2);
        expect(migrated.documents?.opened[0].uri).toBe('zobject://node1');
        expect(migrated.documents?.activeUri).toBe('zobject://node2');
    });

    it('keeps documents when already present', () => {
        const data: SessionData = {
            sceneTree: { openedNodeIds: ['node1'], activeNode: 'node1' },
            documents: {
                activeUri: 'file:///test',
                opened: [{ uri: 'file:///test', dirty: false }],
            },
        };
        expect(migrateSessionData(data)).toEqual(data);
    });
});
