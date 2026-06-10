import { SceneTreeEditor, getSceneTreeViewModel } from './sceneTree.js';
import { createSceneDocumentsEditors } from '../runtime/createSceneDocumentsEditors.js';
import type { TreeNode } from '../domain/types.js';

describe('SceneTreeEditor', () => {
    it('initial state is empty', () => {
        const { scene: editor } = createSceneDocumentsEditors(() => {});
        const vm = getSceneTreeViewModel(editor.getState());
        expect(vm.tree).toEqual([]);
        expect(vm.selectedIds).toEqual([]);
        expect(vm.activeNode).toBeNull();
        expect(vm.openedNodes).toEqual([]);
        expect(vm.expandedNodeIds).toEqual([]);
        expect(vm.focusedNodeId).toBeNull();
    });

    it('setTreeFromRoot updates tree', () => {
        const { scene: editor } = createSceneDocumentsEditors(() => {});
        const tree: TreeNode[] = [
            { id: '1', label: 'Root', iconType: 'SCENE', children: [] },
        ];
        editor.setTreeFromRoot(tree);
        const vm = getSceneTreeViewModel(editor.getState());
        expect(vm.tree).toHaveLength(1);
        expect(vm.tree[0].id).toBe('1');
    });

    it('selectNodes updates selection and activeNode', () => {
        const { scene: editor } = createSceneDocumentsEditors(() => {});
        const tree: TreeNode[] = [
            { id: '1', label: 'Root', children: [{ id: '2', label: 'Child', children: [] }] },
        ];
        editor.setTreeFromRoot(tree);
        editor.selectNodes(['2']);
        const vm = getSceneTreeViewModel(editor.getState());
        expect(vm.selectedIds).toEqual(['2']);
        expect(vm.activeNode).toBe('2');
        expect(vm.focusedNodeId).toBe('2');
    });

    it('toggleExpanded opens and closes nodes', () => {
        const { scene: editor } = createSceneDocumentsEditors(() => {});

        editor.toggleExpanded('1');
        expect(getSceneTreeViewModel(editor.getState()).expandedNodeIds).toEqual(['1']);

        editor.toggleExpanded('1');
        expect(getSceneTreeViewModel(editor.getState()).expandedNodeIds).toEqual([]);
    });

    it('getSceneTreeViewModel derives openedNodes from documents', () => {
        const { scene, documents } = createSceneDocumentsEditors(() => {});
        const tree: TreeNode[] = [
            { id: '1', label: 'A', children: [] },
            { id: '2', label: 'B', children: [] },
        ];
        scene.setTreeFromRoot(tree);
        documents.open('zobject://1', 'A');
        documents.open('zobject://2', 'B');

        const vm = getSceneTreeViewModel(scene.getState(), documents.getState());
        expect(vm.openedNodes).toHaveLength(2);
        expect(vm.openedNodes[0].id).toBe('1');
        expect(vm.openedNodes[1].id).toBe('2');
        expect(vm.activeNode).toBe('2');
    });
});
