import { EditorOrchestrator } from './EditorOrchestrator';
import { createSceneDocumentsEditors } from './createSceneDocumentsEditors';
import type { TreeNode } from '../domain/types';

describe('EditorOrchestrator', () => {
    const tree: TreeNode[] = [
        { id: 'a', label: 'A', children: [] },
        { id: 'b', label: 'B', children: [] },
    ];

    function createFixture() {
        const onCommit = () => {};
        const { scene, documents } = createSceneDocumentsEditors(onCommit);
        const orchestrator = new EditorOrchestrator(scene, documents);
        scene.setTreeFromRoot(tree);
        return { scene, documents, orchestrator };
    }

    it('selectNodes opens zobject document', () => {
        const { scene, documents } = createFixture();
        scene.selectNodes(['a']);
        const docs = documents.getState();
        expect(docs.activeUri).toBe('zobject://a');
        expect(docs.order).toContain('zobject://a');
    });

    it('openZObject syncs scene selection', () => {
        const { scene, orchestrator } = createFixture();
        orchestrator.openZObject('b', 'B');
        expect(scene.getState().selectedIds).toEqual(['b']);
        expect(scene.getState().activeNode).toBe('b');
    });

    it('close document updates scene when active node closed', () => {
        const { scene, documents, orchestrator } = createFixture();
        orchestrator.openZObject('a');
        orchestrator.openZObject('b');
        documents.close('zobject://b');
        expect(documents.getState().activeUri).toBe('zobject://a');
        expect(scene.getState().activeNode).toBe('a');
    });
});
