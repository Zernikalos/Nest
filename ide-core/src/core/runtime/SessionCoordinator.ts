import type { SessionData } from '../services/SessionService.js';
import { SessionService } from '../services/SessionService.js';
import type { DocumentsEditor, DocumentRecord } from '../editor/documents.js';
import type { SceneTreeEditor } from '../editor/sceneTree.js';
import type { WorkbenchEditor } from '../editor/workbench.js';

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

export class SessionCoordinator {
    private sessionHydrated = false;
    private hydrationPromise: Promise<void> | null = null;
    private persistTimer: ReturnType<typeof setTimeout> | null = null;

    constructor(
        private readonly sessionService: SessionService | null,
        private readonly scene: SceneTreeEditor,
        private readonly workbench: WorkbenchEditor,
        private readonly documents: DocumentsEditor,
        private readonly onCommit: () => void
    ) {}

    scheduleSave(): void {
        if (!this.sessionService) return;
        if (this.persistTimer) clearTimeout(this.persistTimer);
        this.persistTimer = setTimeout(() => {
            void this.saveSnapshot();
        }, 250);
    }

    applySession(data: SessionData): void {
        const state = this.scene.getState();
        const treeIds = collectTreeIds(state.tree);

        const selectedIds = (data.sceneTree.selectedIds ?? []).filter((id) => treeIds.has(id));
        if (selectedIds.length > 0) {
            this.scene.setSelection(selectedIds);
        }

        const expanded = (data.sceneTree.expandedNodeIds ?? []).filter((id) => treeIds.has(id));
        for (const id of expanded) {
            this.scene.ensureExpanded(id);
        }

        if (data.workbench) {
            this.workbench.restoreFromSession({
                panelSizes: data.workbench.panelSizes,
                openWidgetIds: data.workbench.openWidgetIds,
                activeWidgetId: data.workbench.activeWidgetId,
            });
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

            this.documents.restore(validDocs, activeUri);
        }

        this.onCommit();
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
        const scene = this.scene.getState();
        const workbench = this.workbench.getState();
        const documents = this.documents.getState();
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
