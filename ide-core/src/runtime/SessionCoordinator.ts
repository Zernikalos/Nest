import type { RuntimeStore } from '../contracts/index.js';
import {
    RESTORE_DOCUMENTS,
    type DocumentRecord,
    type DocumentState,
} from '../domain/DocumentModule.js';
import {
    SELECT_NODES,
    TOGGLE_NODE_EXPANDED,
    type SceneTreeState,
} from '../domain/SceneTreeModule.js';
import {
    ACTIVATE_WIDGET,
    OPEN_WIDGET,
    SET_PANEL_SIZES,
    type WorkbenchState,
} from '../domain/WorkbenchModule.js';
import type { SessionData } from '../services/SessionService.js';
import { SessionService } from '../services/SessionService.js';
import { nodeIdToDocumentUri } from '../domain/documentUri.js';
import type { StoreDispatcher } from './StoreDispatcher.js';
import type { SceneDocumentCoordinator } from './SceneDocumentCoordinator.js';

function collectTreeIds(nodes: { id: string; children?: unknown[] }[]): Set<string> {
    const ids = new Set<string>();
    const collect = (currentNodes: { id: string; children?: unknown[] }[]) => {
        for (const node of currentNodes) {
            ids.add(node.id);
            if (node.children) {
                collect(node.children as { id: string; children?: unknown[] }[]);
            }
        }
    };
    collect(nodes);
    return ids;
}

/** Normalizes legacy session snapshots (openedNodeIds) into document records. */
export function migrateSessionData(data: SessionData): SessionData {
    const legacyOpened = data.sceneTree.openedNodeIds ?? [];
    const hasDocuments =
        data.documents &&
        (data.documents.opened.length > 0 || data.documents.activeUri !== null);

    if (hasDocuments || legacyOpened.length === 0) {
        return data;
    }

    const opened: DocumentRecord[] = legacyOpened.map((nodeId) => ({
        uri: nodeIdToDocumentUri(nodeId),
        title: nodeId,
        dirty: false,
    }));
    const activeUri = data.sceneTree.activeNode
        ? nodeIdToDocumentUri(data.sceneTree.activeNode)
        : opened.length > 0
          ? opened[opened.length - 1].uri
          : null;

    return {
        ...data,
        documents: { opened, activeUri },
    };
}

export class SessionCoordinator {
    private sessionHydrated = false;
    private hydrationPromise: Promise<void> | null = null;
    private persistTimer: ReturnType<typeof setTimeout> | null = null;

    constructor(
        private readonly sessionService: SessionService | null,
        private readonly sceneTreeStore: RuntimeStore<SceneTreeState>,
        private readonly workbenchStore: RuntimeStore<WorkbenchState>,
        private readonly documentStore: RuntimeStore<DocumentState>,
        private readonly dispatcher: StoreDispatcher,
        private readonly sceneDocuments: SceneDocumentCoordinator
    ) {}

    scheduleSave(): void {
        if (!this.sessionService) return;
        if (this.persistTimer) clearTimeout(this.persistTimer);
        this.persistTimer = setTimeout(() => {
            void this.saveSnapshot();
        }, 250);
    }

    applySession(raw: SessionData): void {
        const data = migrateSessionData(raw);
        const state = this.sceneTreeStore.getState();
        const treeIds = collectTreeIds(state.tree);

        const selectedIds = (data.sceneTree.selectedIds ?? []).filter((id) => treeIds.has(id));
        if (selectedIds.length > 0) {
            this.dispatcher.dispatch(this.sceneTreeStore, {
                type: SELECT_NODES,
                payload: selectedIds,
            });
        }

        const expanded = (data.sceneTree.expandedNodeIds ?? []).filter((id) => treeIds.has(id));
        const alreadyExpanded = new Set(this.sceneTreeStore.getState().expandedNodeIds);
        for (const id of expanded) {
            if (!alreadyExpanded.has(id)) {
                this.dispatcher.dispatch(this.sceneTreeStore, {
                    type: TOGGLE_NODE_EXPANDED,
                    payload: id,
                });
            }
        }

        if (data.workbench) {
            if (data.workbench.panelSizes) {
                for (const [groupId, sizes] of Object.entries(data.workbench.panelSizes)) {
                    this.dispatcher.dispatch(this.workbenchStore, {
                        type: SET_PANEL_SIZES,
                        payload: { groupId, sizes },
                    });
                }
            }
            for (const widgetId of data.workbench.openWidgetIds) {
                this.dispatcher.dispatch(this.workbenchStore, {
                    type: OPEN_WIDGET,
                    payload: { id: widgetId },
                });
            }
            if (data.workbench.activeWidgetId) {
                this.dispatcher.dispatch(this.workbenchStore, {
                    type: ACTIVATE_WIDGET,
                    payload: { id: data.workbench.activeWidgetId },
                });
            }
        }

        if (data.documents) {
            const validDocs = data.documents.opened.filter((doc) => {
                const nodeId = doc.uri.startsWith('zobject://')
                    ? doc.uri.slice('zobject://'.length)
                    : null;
                return nodeId === null || treeIds.has(nodeId);
            });
            const activeUri =
                data.documents.activeUri &&
                validDocs.some((d) => d.uri === data.documents!.activeUri)
                    ? data.documents.activeUri
                    : validDocs.length > 0
                      ? validDocs[validDocs.length - 1].uri
                      : null;

            this.sceneDocuments.dispatchDocument({
                type: RESTORE_DOCUMENTS,
                payload: { documents: validDocs, activeUri },
            });
        }
    }

    async hydrate(): Promise<void> {
        if (!this.sessionService || this.sessionHydrated) return;
        if (this.hydrationPromise) return this.hydrationPromise;
        this.hydrationPromise = (async () => {
            const data = await this.sessionService!.restore();
            if (data) {
                this.applySession(data);
            }
            this.sessionHydrated = true;
        })();
        await this.hydrationPromise;
    }

    async saveSnapshot(): Promise<void> {
        if (!this.sessionService) return;
        const scene = this.sceneTreeStore.getState();
        const workbench = this.workbenchStore.getState();
        const documents = this.documentStore.getState();
        await this.sessionService.save({
            sceneTree: {
                selectedIds: scene.selectedIds,
                expandedNodeIds: scene.expandedNodeIds,
                activeNode: scene.activeNode,
            },
            workbench: {
                activeWidgetId: workbench.activeWidgetId,
                openWidgetIds: Object.keys(workbench.widgetAreaById),
                panelSizes: workbench.panelSizes,
            },
            documents: {
                activeUri: documents.activeUri,
                opened: documents.order
                    .map((uri) => documents.byUri[uri])
                    .filter((doc): doc is DocumentRecord => doc !== undefined),
            },
        });
    }

    async restore(): Promise<SessionData | null> {
        if (!this.sessionService) return null;
        const data = await this.sessionService.restore();
        if (data) {
            this.applySession(data);
        }
        this.sessionHydrated = true;
        return data;
    }

    markHydrated(): void {
        this.sessionHydrated = true;
    }
}
