/**
 * Open documents (URIs), active tab, dirty state. Synced with scene tree via EditorOrchestrator.
 */
import type { EditorOrchestrator } from '../runtime/EditorOrchestrator.js';
import { DomainEditorBase, type DomainCommitHandler } from './DomainEditorBase.js';

export interface DocumentRecord {
    uri: string;
    title?: string;
    dirty: boolean;
    viewState?: unknown;
}

export interface DocumentState {
    byUri: Record<string, DocumentRecord>;
    order: string[];
    activeUri: string | null;
}

export interface DocumentViewModel {
    activeUri: string | null;
    openedDocuments: DocumentRecord[];
}

const initialState: DocumentState = {
    byUri: {},
    order: [],
    activeUri: null,
};

export function getDocumentViewModel(state: DocumentState): DocumentViewModel {
    return {
        activeUri: state.activeUri,
        openedDocuments: state.order
            .map((uri) => state.byUri[uri])
            .filter((doc): doc is DocumentRecord => doc !== undefined),
    };
}

export class DocumentsEditor extends DomainEditorBase<DocumentState> {
    constructor(
        onCommit: DomainCommitHandler,
        private readonly getOrchestrator: () => EditorOrchestrator
    ) {
        super(initialState, onCommit);
    }

    open(uri: string, title?: string, viewState?: unknown): void {
        this.patch((d) => {
            const existing = d.byUri[uri];
            d.byUri[uri] = {
                uri,
                title: title ?? existing?.title,
                dirty: existing?.dirty ?? false,
                viewState: viewState ?? existing?.viewState,
            };
            if (!d.order.includes(uri)) {
                d.order.push(uri);
            }
            d.activeUri = uri;
        });
        this.getOrchestrator().onDocumentOpened(uri);
    }

    openZObject(nodeId: string, title?: string): void {
        this.open(`zobject://${nodeId}`, title);
    }

    close(uri: string): void {
        if (!this.getState().byUri[uri]) return;
        this.patch((d) => {
            delete d.byUri[uri];
            d.order = d.order.filter((u) => u !== uri);
            if (d.activeUri === uri) {
                d.activeUri = d.order.length > 0 ? d.order[d.order.length - 1] : null;
            }
        });
        this.getOrchestrator().onDocumentClosed(uri);
    }

    setActive(uri: string | null): void {
        if (uri !== null && !this.getState().byUri[uri]) return;
        this.patch((d) => {
            d.activeUri = uri;
        });
        this.getOrchestrator().onActiveDocumentChanged(uri);
    }

    setDirty(uri: string, dirty: boolean): void {
        if (!this.getState().byUri[uri]) return;
        this.patch((d) => {
            if (d.byUri[uri]) d.byUri[uri].dirty = dirty;
        });
    }

    setViewState(uri: string, viewState?: unknown): void {
        if (!this.getState().byUri[uri]) return;
        this.patch((d) => {
            if (d.byUri[uri]) d.byUri[uri].viewState = viewState;
        });
    }

    restore(documents: DocumentRecord[], activeUri: string | null): void {
        this.patchSilent((d) => {
            const byUri: Record<string, DocumentRecord> = {};
            const order: string[] = [];
            for (const doc of documents) {
                byUri[doc.uri] = doc;
                order.push(doc.uri);
            }
            d.byUri = byUri;
            d.order = order;
            d.activeUri = activeUri && byUri[activeUri] ? activeUri : null;
        });
    }
}
