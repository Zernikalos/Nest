/**
 * Factory for the editor runtime. Framework-agnostic; used by React and Vue adapters.
 */
import type { TreeNode, ZObjectLike } from './domain/types.js';
import type { StoragePort } from './ports/index.js';
import type { SessionData } from './services/SessionService.js';
import type { CommandHandler } from './services/CommandService.js';
import { createSceneTreeStore, getSceneTreeViewModel } from './domain/SceneTreeModule.js';
import { createWorkbenchStore, getWorkbenchViewModel } from './domain/WorkbenchModule.js';
import { convertZObjectToTreeNode } from './domain/sceneTreeUtils.js';
import { SessionService } from './services/SessionService.js';
import { CommandService } from './services/CommandService.js';
import { ContextKeyService } from './services/ContextKeyService.js';

export interface EditorRuntimePorts {
    storage?: StoragePort;
}

export type EditorRuntime = ReturnType<typeof createEditorRuntime>;

export function createEditorRuntime(ports?: EditorRuntimePorts) {
    const sceneTreeStore = createSceneTreeStore();
    const workbenchStore = createWorkbenchStore();
    const commandService = new CommandService();
    const contextKeyService = new ContextKeyService();
    const sessionService = ports?.storage ? new SessionService(ports.storage) : null;

    return {
        executeCommand: (id: string, payload?: unknown) => commandService.execute(id, payload),
        registerCommand: (id: string, handler: CommandHandler) =>
            commandService.register(id, handler),
        hasCommand: (id: string) => commandService.has(id),
        contextKey: {
            set: (key: string, value: unknown) => contextKeyService.set(key, value),
            get: (key: string) => contextKeyService.get(key),
            getBool: (key: string) => contextKeyService.getBool(key),
            evaluate: (expr: string) => contextKeyService.evaluate(expr),
        },
        getSceneTreeState: () => sceneTreeStore.getState(),
        getSceneTreeViewModel: () => getSceneTreeViewModel(sceneTreeStore.getState()),
        subscribeSceneTree: (listener: () => void) => sceneTreeStore.subscribe(listener),
        dispatchSceneTree: (intent: { type: string; payload?: unknown }) =>
            sceneTreeStore.dispatch(intent),
        setTreeFromRoot: (root: ZObjectLike | undefined) => {
            if (root) {
                const tree: TreeNode[] = [convertZObjectToTreeNode(root)];
                sceneTreeStore.dispatch({ type: 'sceneTree/SET_TREE', payload: { tree } });
            } else {
                sceneTreeStore.dispatch({ type: 'sceneTree/SET_TREE', payload: { tree: [] } });
            }
        },
        getWorkbenchViewModel: () => getWorkbenchViewModel(workbenchStore.getState()),
        subscribeWorkbench: (listener: () => void) => workbenchStore.subscribe(listener),
        dispatchWorkbench: (intent: { type: string; payload?: unknown }) =>
            workbenchStore.dispatch(intent),
        sessionSave: async (): Promise<void> => {
            if (!sessionService) return;
            const state = sceneTreeStore.getState();
            await sessionService.save({
                sceneTree: {
                    openedNodeIds: Array.from(state.openedNodeIds),
                    activeNode: state.activeNode,
                },
            });
        },
        sessionRestore: async (): Promise<SessionData | null> => {
            if (!sessionService) return null;
            return sessionService.restore();
        },
    };
}
