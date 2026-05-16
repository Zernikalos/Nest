import { findNodeById } from '../domain/sceneTreeUtils.js';
import { documentUriToNodeId, nodeIdToDocumentUri } from '../domain/documentUri.js';
import type { DocumentsEditor } from '../editor/documents.js';
import type { SceneTreeEditor } from '../editor/sceneTree.js';

/**
 * Single place for scene tree ↔ document orchestration.
 * Documents own tabs; scene selection stays in sync for zobject:// editors.
 */
export class EditorOrchestrator {
    constructor(
        private readonly scene: SceneTreeEditor,
        private readonly documents: DocumentsEditor
    ) {}

    onSceneSelectionChanged(ids: string[]): void {
        const nodeId = ids[ids.length - 1];
        if (nodeId) {
            this.openZObject(nodeId);
        }
    }

    onDocumentOpened(_uri: string): void {
        this.syncSceneFromActiveDocument();
    }

    onActiveDocumentChanged(_uri: string | null): void {
        this.syncSceneFromActiveDocument();
    }

    onDocumentClosed(uri: string): void {
        const nodeId = documentUriToNodeId(uri);
        if (!nodeId) return;
        const scene = this.scene.getState();
        const activeFromDocs = this.documents.getState().activeUri;
        const activeNodeId = activeFromDocs
            ? documentUriToNodeId(activeFromDocs)
            : scene.activeNode;
        if (scene.activeNode === nodeId || activeNodeId === nodeId) {
            const docs = this.documents.getState();
            const nextUri = docs.activeUri;
            const nextNodeId = nextUri ? documentUriToNodeId(nextUri) : null;
            this.scene.setSelection(nextNodeId ? [nextNodeId] : []);
        }
    }

    openZObject(nodeId: string, title?: string): void {
        const node = findNodeById(this.scene.getState().tree, nodeId);
        const uri = nodeIdToDocumentUri(nodeId);
        this.documents.open(uri, title ?? node?.label ?? nodeId);
    }

    private syncSceneFromActiveDocument(): void {
        const activeUri = this.documents.getState().activeUri;
        const nodeId = activeUri ? documentUriToNodeId(activeUri) : null;
        if (nodeId) {
            this.scene.setSelection([nodeId]);
        }
    }
}
