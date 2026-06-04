import { createEditorRuntime } from './createEditorRuntime';
import type { TreeNode } from '../domain/types';

describe('EditorRuntime store API', () => {
    const tree: TreeNode[] = [{ id: 'n1', label: 'Node', children: [] }];

    it('getSlice returns the same projection as getSnapshot', () => {
        const runtime = createEditorRuntime();
        runtime.scene.setTreeFromRoot(tree);
        runtime.documents.openZObject('n1');

        const snapshot = runtime.getSnapshot();
        expect(runtime.getSlice('assets')).toEqual(snapshot.assets);
        expect(runtime.getSlice('scene')).toEqual(snapshot.scene);
    });

    it('subscribeSlice(assets) does not fire when project-only state changes', async () => {
        const runtime = createEditorRuntime();
        let assetsCalls = 0;
        runtime.subscribeSlice('assets', () => {
            assetsCalls += 1;
        });

        // Mutate assets only
        runtime.assetConversion.setProjectPersistWarning('warn');
        await Promise.resolve();
        expect(assetsCalls).toBeGreaterThanOrEqual(1);

        const before = assetsCalls;
        runtime.context.set('testKey', true);
        await Promise.resolve();
        expect(assetsCalls).toBe(before);
    });

    it('subscribeSlice(scene) fires when documents change', async () => {
        const runtime = createEditorRuntime();
        runtime.scene.setTreeFromRoot(tree);
        let sceneCalls = 0;
        runtime.subscribeSlice('scene', () => {
            sceneCalls += 1;
        });

        const before = sceneCalls;
        runtime.documents.openZObject('n1');
        await Promise.resolve();
        expect(sceneCalls).toBeGreaterThan(before);
    });

    it('subscribe is an alias for onChange', async () => {
        const runtime = createEditorRuntime();
        let count = 0;
        runtime.subscribe(() => {
            count += 1;
        });
        runtime.scene.setTreeFromRoot(tree);
        await Promise.resolve();
        expect(count).toBeGreaterThanOrEqual(1);
    });
});
