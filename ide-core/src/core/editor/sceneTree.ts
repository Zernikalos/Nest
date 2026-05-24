/**
 * Scene hierarchy: selection, expansion, tree data. Tab sync via EditorOrchestrator.
 */
import { enableMapSet } from 'immer';

enableMapSet();
import type { TreeNode, ZObjectLike } from '../domain/types.js';
import { convertZObjectToTreeNode, findNodeById } from '../domain/sceneTreeUtils.js';
import { documentUriToNodeId, isZObjectDocumentUri } from '../domain/documentUri.js';
import type { EditorOrchestrator } from '../runtime/EditorOrchestrator.js';
import { DomainEditorBase, type DomainCommitHandler } from './DomainEditorBase.js';
import type { DocumentState } from './documents.js';

export interface SceneTreeState {
    tree: TreeNode[];
    selectedIds: string[];
    activeNode: string | null;
    expandedNodeIds: string[];
    focusedNodeId: string | null;
}

export interface SceneTreeViewModel {
    tree: TreeNode[];
    selectedIds: string[];
    activeNode: string | null;
    openedNodes: TreeNode[];
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

export class SceneTreeEditor extends DomainEditorBase<SceneTreeState> {
    private onTreeSet: (() => void) | null = null;

    constructor(
        onCommit: DomainCommitHandler,
        private readonly getOrchestrator: () => EditorOrchestrator
    ) {
        super(initialState, onCommit);
    }

    setOnTreeSet(callback: () => void): void {
        this.onTreeSet = callback;
    }

    /** Updates selection without firing scene→document orchestration. */
    setSelection(selectedIds: string[]): void {
        const lastId = selectedIds[selectedIds.length - 1];
        const activeNode = lastId ?? null;
        this.patchSilent((d) => {
            d.selectedIds = selectedIds;
            d.activeNode = activeNode;
            d.focusedNodeId = activeNode;
        });
    }

    selectNodes(ids: string[]): void {
        const lastId = ids[ids.length - 1];
        const activeNode = lastId ?? null;
        this.patch((d) => {
            d.selectedIds = ids;
            d.activeNode = activeNode;
            d.focusedNodeId = activeNode;
        });
        this.getOrchestrator().onSceneSelectionChanged(ids);
    }

    setTreeFromRoot(root: TreeNode[] | ZObjectLike | undefined): void {
        const tree =
            root === undefined
                ? []
                : Array.isArray(root)
                  ? root
                  : [convertZObjectToTreeNode(root)];
        this.patch((d) => {
            d.tree = tree;
        });
        this.onTreeSet?.();
    }

    toggleExpanded(nodeId: string): void {
        this.patch((d) => {
            if (d.expandedNodeIds.includes(nodeId)) {
                d.expandedNodeIds = d.expandedNodeIds.filter((id) => id !== nodeId);
            } else {
                d.expandedNodeIds = [...d.expandedNodeIds, nodeId];
            }
        });
    }

    /** Expands a node if collapsed; silent (for session restore). */
    ensureExpanded(nodeId: string): void {
        if (this.getState().expandedNodeIds.includes(nodeId)) return;
        this.patchSilent((d) => {
            d.expandedNodeIds = [...d.expandedNodeIds, nodeId];
        });
    }

    setFocusedNode(nodeId: string | null): void {
        this.patch((d) => {
            d.focusedNodeId = nodeId;
        });
    }
}
