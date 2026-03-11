/**
 * Scene tree module: state and intents for the hierarchy of scene nodes (e.g. ZObjects).
 * Tracks selection, active node, opened "tabs", and expanded state. Used by the runtime and synced with documents.
 */
import type { RuntimeIntent, RuntimeEffect } from '../contracts/index.js';
import { createStore } from '../kernel/createStore.js';
import type { TreeNode } from './types.js';
import { findNodeById } from './sceneTreeUtils.js';

/** Intent type constants for the scene tree reducer. */
export const SELECT_NODES = 'sceneTree/SELECT_NODES';
export const OPEN_TAB = 'sceneTree/OPEN_TAB';
export const CLOSE_TAB = 'sceneTree/CLOSE_TAB';
export const SET_ACTIVE_TAB = 'sceneTree/SET_ACTIVE_TAB';
export const SET_TREE = 'sceneTree/SET_TREE';
export const TOGGLE_NODE_EXPANDED = 'sceneTree/TOGGLE_NODE_EXPANDED';
export const SET_FOCUSED_NODE = 'sceneTree/SET_FOCUSED_NODE';

/** Internal state for the scene tree reducer. */
export interface SceneTreeState {
    tree: TreeNode[];
    selectedIds: string[];
    activeNode: string | null;
    openedNodeIds: Set<string>;
    expandedNodeIds: Set<string>;
    focusedNodeId: string | null;
}

const initialState: SceneTreeState = {
    tree: [],
    selectedIds: [],
    activeNode: null,
    openedNodeIds: new Set(),
    expandedNodeIds: new Set(),
    focusedNodeId: null,
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
            const openedNodeIds = new Set(state.openedNodeIds);
            if (activeNode) {
                openedNodeIds.add(activeNode);
            }
            return {
                state: {
                    ...state,
                    selectedIds,
                    activeNode,
                    focusedNodeId: activeNode,
                    openedNodeIds,
                },
                effects: [],
            };
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
            return {
                state: {
                    ...state,
                    openedNodeIds,
                    activeNode,
                    focusedNodeId: activeNode,
                },
                effects: [],
            };
        }
        case SET_ACTIVE_TAB: {
            const nodeId = intent.payload as string;
            return { state: { ...state, activeNode: nodeId, focusedNodeId: nodeId }, effects: [] };
        }
        case TOGGLE_NODE_EXPANDED: {
            const nodeId = intent.payload as string;
            const expandedNodeIds = new Set(state.expandedNodeIds);
            if (expandedNodeIds.has(nodeId)) {
                expandedNodeIds.delete(nodeId);
            } else {
                expandedNodeIds.add(nodeId);
            }
            return { state: { ...state, expandedNodeIds }, effects: [] };
        }
        case SET_FOCUSED_NODE: {
            const nodeId = (intent.payload as string) ?? null;
            return { state: { ...state, focusedNodeId: nodeId }, effects: [] };
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

/** View model derived from SceneTreeState for UI projection (tree, selection, opened nodes, expanded ids). */
export interface SceneTreeViewModel {
    tree: TreeNode[];
    selectedIds: string[];
    activeNode: string | null;
    openedNodes: TreeNode[];
    expandedNodeIds: string[];
    focusedNodeId: string | null;
}

/** Builds the view model from current state. Called by the runtime when the UI subscribes. */
export function getSceneTreeViewModel(state: SceneTreeState): SceneTreeViewModel {
    const openedNodes = Array.from(state.openedNodeIds)
        .map((id) => findNodeById(state.tree, id))
        .filter((n): n is TreeNode => n !== undefined);
    return {
        tree: state.tree,
        selectedIds: state.selectedIds,
        activeNode: state.activeNode,
        openedNodes,
        expandedNodeIds: Array.from(state.expandedNodeIds),
        focusedNodeId: state.focusedNodeId,
    };
}
