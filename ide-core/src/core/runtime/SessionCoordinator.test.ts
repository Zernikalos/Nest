import { createEditorRuntime } from './createEditorRuntime';
import { MockStoragePort } from '../ports/MockStoragePort';
import type { TreeNode } from '../domain/types';

describe('SessionCoordinator', () => {
    const tree: TreeNode[] = [{ id: 'n1', label: 'Node', children: [] }];

    it('hydrates documents from persisted session', async () => {
        const storage = new MockStoragePort();
        const runtime = createEditorRuntime({ storage });
        runtime.scene.setTreeFromRoot(tree);
        runtime.documents.openZObject('n1');
        await runtime.session.save();

        const runtime2 = createEditorRuntime({ storage });
        runtime2.scene.setTreeFromRoot(tree);
        await runtime2.session.hydrate();

        expect(runtime2.documents.getState().activeUri).toBe('zobject://n1');
    });
});
