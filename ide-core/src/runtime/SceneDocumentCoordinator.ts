import type { RuntimeEffect, RuntimeStore } from '../contracts/index.js';
import type { SceneTreeIntent, DocumentIntent } from '../contracts/intents.js';
import {
    SELECT_NODES,
    type SceneTreeState,
} from '../domain/SceneTreeModule.js';
import {
    CLOSE_DOCUMENT,
    OPEN_DOCUMENT,
    SET_ACTIVE_DOCUMENT,
    type DocumentState,
} from '../domain/DocumentModule.js';
import { findNodeById } from '../domain/sceneTreeUtils.js';
import { documentUriToNodeId, nodeIdToDocumentUri } from '../domain/documentUri.js';
import type { StoreDispatcher } from './StoreDispatcher.js';

/**
 * Coordinates scene tree selection with the canonical document store.
 * Documents own tabs; scene tree reflects focus for zobject:// editors.
 */
export class SceneDocumentCoordinator {
    constructor(
        private readonly sceneTreeStore: RuntimeStore<SceneTreeState>,
        private readonly documentStore: RuntimeStore<DocumentState>,
        private readonly dispatcher: StoreDispatcher
    ) {}

    dispatchScene(intent: SceneTreeIntent): RuntimeEffect[] {
        const effects = this.dispatcher.dispatch(this.sceneTreeStore, intent);

        if (intent.type === SELECT_NODES) {
            const nodeId = intent.payload[intent.payload.length - 1];
            if (nodeId) {
                this.openZObject(nodeId);
            }
        }

        return effects;
    }

    dispatchDocument(intent: DocumentIntent): RuntimeEffect[] {
        const effects = this.dispatcher.dispatch(this.documentStore, intent);
        this.syncSceneFromDocuments(intent);
        return effects;
    }

    openZObject(nodeId: string, title?: string): RuntimeEffect[] {
        const node = findNodeById(this.sceneTreeStore.getState().tree, nodeId);
        return this.dispatchDocument({
            type: OPEN_DOCUMENT,
            payload: {
                uri: nodeIdToDocumentUri(nodeId),
                title: title ?? node?.label ?? nodeId,
            },
        });
    }

    close(uri: string): RuntimeEffect[] {
        return this.dispatchDocument({
            type: CLOSE_DOCUMENT,
            payload: { uri },
        });
    }

    setActive(uri: string | null): RuntimeEffect[] {
        return this.dispatchDocument({
            type: SET_ACTIVE_DOCUMENT,
            payload: { uri },
        });
    }

    private syncSceneFromDocuments(intent: DocumentIntent): void {
        if (
            intent.type === OPEN_DOCUMENT ||
            intent.type === SET_ACTIVE_DOCUMENT
        ) {
            const activeUri = this.documentStore.getState().activeUri;
            const nodeId = activeUri ? documentUriToNodeId(activeUri) : null;
            if (nodeId) {
                this.dispatcher.dispatch(this.sceneTreeStore, {
                    type: SELECT_NODES,
                    payload: [nodeId],
                });
            }
            return;
        }

        if (intent.type === CLOSE_DOCUMENT) {
            const nodeId = documentUriToNodeId(intent.payload.uri);
            if (!nodeId) return;
            const scene = this.sceneTreeStore.getState();
            if (scene.activeNode === nodeId) {
                const docs = this.documentStore.getState();
                const nextUri = docs.activeUri;
                const nextNodeId = nextUri ? documentUriToNodeId(nextUri) : null;
                this.dispatcher.dispatch(this.sceneTreeStore, {
                    type: SELECT_NODES,
                    payload: nextNodeId ? [nextNodeId] : [],
                });
            }
        }
    }
}
