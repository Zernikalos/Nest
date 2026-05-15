/**
 * Scene tree module: state and intents for the hierarchy of scene nodes (e.g. ZObjects).
 * Tracks selection, focus, and expansion. Open tabs are owned by DocumentModule.
 */
import { produce, enableMapSet } from 'immer';

enableMapSet();
import type { RuntimeIntent, RuntimeEffect } from '../contracts/index.js';
import { createStore } from '../kernel/createStore.js';
import type { TreeNode } from './types.js';
import { findNodeById } from './sceneTreeUtils.js';
import type { DocumentState } from './DocumentModule.js';
import { documentUriToNodeId, isZObjectDocumentUri } from './documentUri.js';

export const SELECT_NODES = 'sceneTree/SELECT_NODES';
export const SET_TREE = 'sceneTree/SET_TREE';
export const TOGGLE_NODE_EXPANDED = 'sceneTree/TOGGLE_NODE_EXPANDED';
export const SET_FOCUSED_NODE = 'sceneTree/SET_FOCUSED_NODE';

export interface SceneTreeState {
    tree: TreeNode[];
    selectedIds: string[];
    activeNode: string | null;
    expandedNodeIds: string[];
    focusedNodeId: string | null;
}

const initialState: SceneTreeState = {
    tree: [],
    selectedIds: [],
    activeNode: null,
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

export interface SceneTreeViewModel {
    tree: TreeNode[];
    selectedIds: string[];
    activeNode: string | null;
    openedNodes: TreeNode[];
    expandedNodeIds: string[];
    focusedNodeId: string | null;
}

/**
 * Builds the view model from scene tree state. When documents are provided,
 * openedNodes and activeNode are derived from the document store (canonical tabs).
 */
export function getSceneTreeViewModel(
    state: SceneTreeState,
    documents?: DocumentState
): SceneTreeViewModel {
    if (documents) {
        const openedNodes = documents.order
            .filter(isZObjectDocumentUri)
            .map((uri) => documentUriToNodeId(uri))
            .filter((id): id is string => id !== null)
            .map((id) => findNodeById(state.tree, id))
            .filter((n): n is TreeNode => n !== undefined);

        const activeFromDoc = documents.activeUri
            ? documentUriToNodeId(documents.activeUri)
            : null;

        return {
            tree: state.tree,
            selectedIds: state.selectedIds,
            activeNode: activeFromDoc ?? state.activeNode,
            openedNodes,
            expandedNodeIds: [...state.expandedNodeIds],
            focusedNodeId: state.focusedNodeId,
        };
    }

    return {
        tree: state.tree,
        selectedIds: state.selectedIds,
        activeNode: state.activeNode,
        openedNodes: [],
        expandedNodeIds: [...state.expandedNodeIds],
        focusedNodeId: state.focusedNodeId,
    };
}
