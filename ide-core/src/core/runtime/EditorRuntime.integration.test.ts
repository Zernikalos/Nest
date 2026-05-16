import { createEditorRuntime } from './createEditorRuntime';
import type { TreeNode } from '../domain/types';

describe('EditorRuntime integration', () => {
    const tree: TreeNode[] = [{ id: 'n1', label: 'Node', children: [] }];

    it('scene selection opens document and updates view models', () => {
        const runtime = createEditorRuntime();
        runtime.scene.setTreeFromRoot(tree);
        runtime.scene.selectNodes(['n1']);

        const snapshot = runtime.getSnapshot();
        expect(snapshot.documents.activeUri).toBe('zobject://n1');
        expect(snapshot.scene.openedNodes).toHaveLength(1);
        expect(snapshot.scene.openedNodes[0].id).toBe('n1');
    });

    it('documents.openZObject is sugar for opening editors', () => {
        const runtime = createEditorRuntime();
        runtime.scene.setTreeFromRoot(tree);
        runtime.documents.openZObject('n1', 'My Node');
        expect(runtime.getSnapshot().documents.openedDocuments[0].title).toBe('My Node');
    });

    it('getSnapshot aggregates all domains', () => {
        const runtime = createEditorRuntime();
        runtime.scene.setTreeFromRoot(tree);
        runtime.documents.openZObject('n1');

        const snapshot = runtime.getSnapshot();
        expect(snapshot.documents.activeUri).toBe('zobject://n1');
        expect(snapshot.scene.openedNodes[0].id).toBe('n1');
        expect(snapshot.workbench).toBeDefined();
        expect(snapshot.project.isProjectOpen).toBe(false);
    });

    it('onChange fires after domain mutation', async () => {
        const runtime = createEditorRuntime();
        let changeCount = 0;
        runtime.onChange(() => {
            changeCount += 1;
        });

        runtime.scene.setTreeFromRoot(tree);
        await Promise.resolve();
        expect(changeCount).toBeGreaterThanOrEqual(1);

        const before = changeCount;
        runtime.documents.openZObject('n1');
        await Promise.resolve();
        expect(changeCount).toBeGreaterThan(before);
    });
});
