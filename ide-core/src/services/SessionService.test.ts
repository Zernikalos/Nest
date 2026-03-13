import { SessionService } from './SessionService.js';
import { MockStoragePort } from '../ports/MockStoragePort.js';

describe('SessionService', () => {
    it('saves and restores session data', async () => {
        const storage = new MockStoragePort();
        const service = new SessionService(storage);

        const data = {
            sceneTree: {
                openedNodeIds: ['node1', 'node2'],
                activeNode: 'node2',
            },
        };

        await service.save(data);
        const restored = await service.restore();

        expect(restored).toEqual(data);
    });

    it('returns null when no session exists', async () => {
        const storage = new MockStoragePort();
        const service = new SessionService(storage);

        expect(await service.restore()).toBeNull();
    });

    it('returns null for invalid stored data', async () => {
        const storage = new MockStoragePort();
        await storage.set('ide-session', 'invalid-json');
        const service = new SessionService(storage);

        expect(await service.restore()).toBeNull();
    });
});
