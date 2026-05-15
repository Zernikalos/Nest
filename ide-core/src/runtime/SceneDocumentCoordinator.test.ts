import { createSceneTreeStore, SELECT_NODES, SET_TREE } from '../domain/SceneTreeModule';
import { createDocumentStore, CLOSE_DOCUMENT } from '../domain/DocumentModule';
import { EffectCaller } from './EffectCaller';
import { StoreDispatcher } from './StoreDispatcher';
import { SceneDocumentCoordinator } from './SceneDocumentCoordinator';
import { SESSION_PERSIST } from '../contracts/effects';
import type { TreeNode } from '../domain/types';

describe('SceneDocumentCoordinator', () => {
    const tree: TreeNode[] = [
        { id: 'a', label: 'A', children: [] },
        { id: 'b', label: 'B', children: [] },
    ];

    function createCoordinator() {
        const sceneTreeStore = createSceneTreeStore();
        const documentStore = createDocumentStore();
        const effectCaller = new EffectCaller();
        const persistScheduled: unknown[] = [];
        effectCaller.register(SESSION_PERSIST, () => {
            persistScheduled.push(true);
        });
        const dispatcher = new StoreDispatcher(effectCaller);
        const coordinator = new SceneDocumentCoordinator(
            sceneTreeStore,
            documentStore,
            dispatcher
        );
        sceneTreeStore.dispatch({ type: SET_TREE, payload: { tree } });
        return { sceneTreeStore, documentStore, coordinator, persistScheduled };
    }

    it('SELECT_NODES opens zobject document', () => {
        const { documentStore, coordinator } = createCoordinator();
        coordinator.dispatchScene({ type: SELECT_NODES, payload: ['a'] });
        const docs = documentStore.getState();
        expect(docs.activeUri).toBe('zobject://a');
        expect(docs.order).toContain('zobject://a');
    });

    it('openZObject syncs scene selection', () => {
        const { sceneTreeStore, coordinator } = createCoordinator();
        coordinator.openZObject('b', 'B');
        expect(sceneTreeStore.getState().selectedIds).toEqual(['b']);
        expect(sceneTreeStore.getState().activeNode).toBe('b');
    });

    it('close document updates scene when active node closed', () => {
        const { sceneTreeStore, documentStore, coordinator } = createCoordinator();
        coordinator.openZObject('a');
        coordinator.openZObject('b');
        coordinator.dispatchDocument({
            type: CLOSE_DOCUMENT,
            payload: { uri: 'zobject://b' },
        });
        expect(documentStore.getState().activeUri).toBe('zobject://a');
        expect(sceneTreeStore.getState().activeNode).toBe('a');
    });
});
