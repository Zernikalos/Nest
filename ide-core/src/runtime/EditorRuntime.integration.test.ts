import { createEditorRuntime } from './createEditorRuntime';
import { SELECT_NODES, SET_TREE } from '../domain/SceneTreeModule';
import type { TreeNode } from '../domain/types';

describe('EditorRuntime integration', () => {
    const tree: TreeNode[] = [{ id: 'n1', label: 'Node', children: [] }];

    it('scene selection opens document and updates view models', () => {
        const runtime = createEditorRuntime();
        runtime.scene.dispatch({ type: SET_TREE, payload: { tree } });
        runtime.scene.dispatch({ type: SELECT_NODES, payload: ['n1'] });

        const docVm = runtime.documents.getViewModel();
        expect(docVm.activeUri).toBe('zobject://n1');

        const sceneVm = runtime.scene.getViewModel();
        expect(sceneVm.openedNodes).toHaveLength(1);
        expect(sceneVm.openedNodes[0].id).toBe('n1');
    });

    it('documents.openZObject is sugar for opening editors', () => {
        const runtime = createEditorRuntime();
        runtime.scene.dispatch({ type: SET_TREE, payload: { tree } });
        runtime.documents.openZObject('n1', 'My Node');
        expect(runtime.documents.getViewModel().openedDocuments[0].title).toBe('My Node');
    });
});
