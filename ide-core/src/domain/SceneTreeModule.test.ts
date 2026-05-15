import {
    createSceneTreeStore,
    getSceneTreeViewModel,
    SELECT_NODES,
    SET_TREE,
} from './SceneTreeModule';
import { createDocumentStore } from './DocumentModule';
import { OPEN_DOCUMENT } from './DocumentModule';
import { convertZObjectToTreeNode } from './sceneTreeUtils';
import type { TreeNode } from './types';

describe('SceneTreeModule', () => {
    it('initial state is empty', () => {
        const store = createSceneTreeStore();
        const vm = getSceneTreeViewModel(store.getState());
        expect(vm.tree).toEqual([]);
        expect(vm.selectedIds).toEqual([]);
        expect(vm.activeNode).toBeNull();
        expect(vm.openedNodes).toEqual([]);
        expect(vm.expandedNodeIds).toEqual([]);
        expect(vm.focusedNodeId).toBeNull();
    });

    it('SET_TREE updates tree', () => {
        const store = createSceneTreeStore();
        const tree: TreeNode[] = [
            { id: '1', label: 'Root', iconType: 'SCENE', children: [] },
        ];
        store.dispatch({ type: SET_TREE, payload: { tree } });
        const vm = getSceneTreeViewModel(store.getState());
        expect(vm.tree).toHaveLength(1);
        expect(vm.tree[0].id).toBe('1');
    });

    it('SELECT_NODES updates selection and activeNode', () => {
        const store = createSceneTreeStore();
        const tree: TreeNode[] = [
            { id: '1', label: 'Root', children: [{ id: '2', label: 'Child', children: [] }] },
        ];
        store.dispatch({ type: SET_TREE, payload: { tree } });
        store.dispatch({ type: SELECT_NODES, payload: ['2'] });
        const vm = getSceneTreeViewModel(store.getState());
        expect(vm.selectedIds).toEqual(['2']);
        expect(vm.activeNode).toBe('2');
        expect(vm.openedNodes).toEqual([]);
        expect(vm.focusedNodeId).toBe('2');
    });

    it('getSceneTreeViewModel derives openedNodes from documents', () => {
        const sceneStore = createSceneTreeStore();
        const docStore = createDocumentStore();
        const tree: TreeNode[] = [
            { id: '1', label: 'A', children: [] },
            { id: '2', label: 'B', children: [] },
        ];
        sceneStore.dispatch({ type: SET_TREE, payload: { tree } });
        docStore.dispatch({
            type: OPEN_DOCUMENT,
            payload: { uri: 'zobject://1', title: 'A' },
        });
        docStore.dispatch({
            type: OPEN_DOCUMENT,
            payload: { uri: 'zobject://2', title: 'B' },
        });

        const vm = getSceneTreeViewModel(sceneStore.getState(), docStore.getState());
        expect(vm.openedNodes).toHaveLength(2);
        expect(vm.openedNodes[0].id).toBe('1');
        expect(vm.openedNodes[1].id).toBe('2');
        expect(vm.activeNode).toBe('2');
    });
});

describe('convertZObjectToTreeNode', () => {
    it('converts ZObject-like to TreeNode', () => {
        const zobj = {
            refId: 'root',
            name: 'Scene',
            type: 'SCENE',
            children: [
                { refId: 'c1', name: 'Model', type: 'MODEL', children: [] },
            ],
        };
        const node = convertZObjectToTreeNode(zobj);
        expect(node.id).toBe('root');
        expect(node.label).toBe('Scene');
        expect(node.iconType).toBe('SCENE');
        expect(node.children).toHaveLength(1);
        expect(node.children![0].id).toBe('c1');
    });

    it('normalizes Kotlin-style enum type objects to icon strings', () => {
        const zobj = {
            refId: 'm1',
            name: 'Fox',
            type: { name: 'MODEL' },
            children: [],
        };
        const node = convertZObjectToTreeNode(zobj);
        expect(node.iconType).toBe('MODEL');
    });
});
