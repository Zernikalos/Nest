import type { RuntimeIntent, RuntimeEffect } from '../contracts/index.js';
import { createStore } from '../kernel/createStore.js';
import type { TreeNode } from './types.js';
import { findNodeById } from './sceneTreeUtils.js';

export const SELECT_NODES = 'sceneTree/SELECT_NODES';
export const OPEN_TAB = 'sceneTree/OPEN_TAB';
export const CLOSE_TAB = 'sceneTree/CLOSE_TAB';
export const SET_ACTIVE_TAB = 'sceneTree/SET_ACTIVE_TAB';
export const SET_TREE = 'sceneTree/SET_TREE';

export interface SceneTreeState {
    tree: TreeNode[];
    selectedIds: string[];
    activeNode: string | null;
    openedNodeIds: Set<string>;
}

const initialState: SceneTreeState = {
    tree: [],
    selectedIds: [],
    activeNode: null,
    openedNodeIds: new Set(),
};

function reducer(
    state: SceneTreeState,
    intent: RuntimeIntent
): { state: SceneTreeState; effects: RuntimeEffect[] } {
    switch (intent.type) {
        case SET_TREE: {
            const tree = (intent.payload as { tree: TreeNode[] }).tree;
            return { state: { ...state, tree }, effects: [] };
        }
        case SELECT_NODES: {
            const selectedIds = intent.payload as string[];
            const lastId = selectedIds[selectedIds.length - 1];
            const activeNode = lastId ?? null;
            return { state: { ...state, selectedIds, activeNode }, effects: [] };
        }
        case OPEN_TAB: {
            const nodeId = intent.payload as string;
            const openedNodeIds = new Set(state.openedNodeIds);
            openedNodeIds.add(nodeId);
            return {
                state: { ...state, openedNodeIds, activeNode: nodeId },
                effects: [],
            };
        }
        case CLOSE_TAB: {
            const nodeId = intent.payload as string;
            const openedNodeIds = new Set(state.openedNodeIds);
            openedNodeIds.delete(nodeId);
            let activeNode = state.activeNode;
            if (activeNode === nodeId) {
                const remaining = Array.from(openedNodeIds).filter((id) => id !== nodeId);
                activeNode = remaining.length > 0 ? remaining[0] : null;
            }
            return { state: { ...state, openedNodeIds, activeNode }, effects: [] };
        }
        case SET_ACTIVE_TAB: {
            const nodeId = intent.payload as string;
            return { state: { ...state, activeNode: nodeId }, effects: [] };
        }
        default:
            return { state, effects: [] };
    }
}

export function createSceneTreeStore(
    onEffects?: (effects: RuntimeEffect[]) => void
): ReturnType<typeof createStore<SceneTreeState>> {
    return createStore(initialState, reducer, onEffects);
}

export interface SceneTreeViewModel {
    tree: TreeNode[];
    selectedIds: string[];
    activeNode: string | null;
    openedNodes: TreeNode[];
}

export function getSceneTreeViewModel(state: SceneTreeState): SceneTreeViewModel {
    const openedNodes = Array.from(state.openedNodeIds)
        .map((id) => findNodeById(state.tree, id))
        .filter((n): n is TreeNode => n !== undefined);
    return {
        tree: state.tree,
        selectedIds: state.selectedIds,
        activeNode: state.activeNode,
        openedNodes,
    };
}
