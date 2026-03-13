/**
 * Scene tree module: state and intents for the hierarchy of scene nodes (e.g. ZObjects).
 * Tracks selection, active node, opened "tabs", and expanded state. Used by the runtime and synced with documents.
 * Uses plain arrays (not Set) so Immer works without the MapSet plugin across all bundle setups.
 */
import { produce, enableMapSet } from 'immer';

// Ensure MapSet plugin is loaded (state.tree can contain Map/Set from external data; must run before first produce).
enableMapSet();
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
    openedNodeIds: string[];
    expandedNodeIds: string[];
    focusedNodeId: string | null;
}

const initialState: SceneTreeState = {
    tree: [],
    selectedIds: [],
    activeNode: null,
    openedNodeIds: [],
    expandedNodeIds: [],
    focusedNodeId: null,
};

function reducer(
    state: SceneTreeState,
    intent: RuntimeIntent
): { state: SceneTreeState; effects: RuntimeEffect[] } {
    switch (intent.type) {
        case SET_TREE: {
            const tree = (intent.payload as { tree: TreeNode[] }).tree;
            return { state: produce(state, (d) => { d.tree = tree; }), effects: [] };
        }
        case SELECT_NODES: {
            const selectedIds = intent.payload as string[];
            const lastId = selectedIds[selectedIds.length - 1];
            const activeNode = lastId ?? null;
            return {
                state: produce(state, (d) => {
                    d.selectedIds = selectedIds;
                    d.activeNode = activeNode;
                    d.focusedNodeId = activeNode;
                    if (activeNode && !d.openedNodeIds.includes(activeNode)) {
                        d.openedNodeIds = [...d.openedNodeIds, activeNode];
                    }
                }),
                effects: [],
            };
        }
        case OPEN_TAB: {
            const nodeId = intent.payload as string;
            return {
                state: produce(state, (d) => {
                    if (!d.openedNodeIds.includes(nodeId)) {
                        d.openedNodeIds = [...d.openedNodeIds, nodeId];
                    }
                    d.activeNode = nodeId;
                }),
                effects: [],
            };
        }
        case CLOSE_TAB: {
            const nodeId = intent.payload as string;
            return {
                state: produce(state, (d) => {
                    d.openedNodeIds = d.openedNodeIds.filter((id) => id !== nodeId);
                    if (d.activeNode === nodeId) {
                        d.activeNode = d.openedNodeIds.length > 0 ? d.openedNodeIds[0] : null;
                        d.focusedNodeId = d.activeNode;
                    }
                }),
                effects: [],
            };
        }
        case SET_ACTIVE_TAB: {
            const nodeId = intent.payload as string;
            return {
                state: produce(state, (d) => {
                    d.activeNode = nodeId;
                    d.focusedNodeId = nodeId;
                }),
                effects: [],
            };
        }
        case TOGGLE_NODE_EXPANDED: {
            const nodeId = intent.payload as string;
            return {
                state: produce(state, (d) => {
                    if (d.expandedNodeIds.includes(nodeId)) {
                        d.expandedNodeIds = d.expandedNodeIds.filter((id) => id !== nodeId);
                    } else {
                        d.expandedNodeIds = [...d.expandedNodeIds, nodeId];
                    }
                }),
                effects: [],
            };
        }
        case SET_FOCUSED_NODE: {
            const nodeId = (intent.payload as string) ?? null;
            return { state: produce(state, (d) => { d.focusedNodeId = nodeId; }), effects: [] };
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
    const openedNodes = state.openedNodeIds
        .map((id) => findNodeById(state.tree, id))
        .filter((n): n is TreeNode => n !== undefined);
    return {
        tree: state.tree,
        selectedIds: state.selectedIds,
        activeNode: state.activeNode,
        openedNodes,
        expandedNodeIds: [...state.expandedNodeIds],
        focusedNodeId: state.focusedNodeId,
    };
}
