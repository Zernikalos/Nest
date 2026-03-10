import {
    createSceneTreeStore,
    getSceneTreeViewModel,
    SELECT_NODES,
    OPEN_TAB,
    CLOSE_TAB,
    SET_TREE,
} from './SceneTreeModule';
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
    });

    it('OPEN_TAB adds to opened nodes', () => {
        const store = createSceneTreeStore();
        const tree: TreeNode[] = [
            { id: '1', label: 'Root', children: [] },
        ];
        store.dispatch({ type: SET_TREE, payload: { tree } });
        store.dispatch({ type: OPEN_TAB, payload: '1' });
        const vm = getSceneTreeViewModel(store.getState());
        expect(vm.openedNodes).toHaveLength(1);
        expect(vm.openedNodes[0].id).toBe('1');
        expect(vm.activeNode).toBe('1');
    });

    it('CLOSE_TAB removes from opened and updates active', () => {
        const store = createSceneTreeStore();
        const tree: TreeNode[] = [
            { id: '1', label: 'A', children: [] },
            { id: '2', label: 'B', children: [] },
        ];
        store.dispatch({ type: SET_TREE, payload: { tree } });
        store.dispatch({ type: OPEN_TAB, payload: '1' });
        store.dispatch({ type: OPEN_TAB, payload: '2' });
        store.dispatch({ type: CLOSE_TAB, payload: '2' });
        const vm = getSceneTreeViewModel(store.getState());
        expect(vm.openedNodes).toHaveLength(1);
        expect(vm.activeNode).toBe('1');
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
});
