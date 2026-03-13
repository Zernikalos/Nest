/**
 * DocumentService - in-memory registry of open documents by URI.
 * URI-based; dirty/save and file I/O are delegated to the platform adapter.
 * This service is exported for potential use; the runtime uses DocumentModule store for documents.
 */

export interface DocumentDescriptor {
    uri: string;
    title?: string;
    dirty: boolean;
    viewState?: unknown;
}

export class DocumentService {
    private documents = new Map<string, DocumentDescriptor>();
    private order: string[] = [];
    private activeUri: string | null = null;

    getActiveDocument(): DocumentDescriptor | null {
        return this.activeUri ? this.documents.get(this.activeUri) ?? null : null;
    }

    getOpenedDocuments(): DocumentDescriptor[] {
        return this.order
            .map((uri) => this.documents.get(uri))
            .filter((doc): doc is DocumentDescriptor => doc !== undefined);
    }

    openDocument(uri: string, options?: { title?: string; dirty?: boolean; viewState?: unknown }): void {
        const existing = this.documents.get(uri);
        this.documents.set(uri, {
            uri,
            title: options?.title ?? existing?.title,
            dirty: options?.dirty ?? existing?.dirty ?? false,
            viewState: options?.viewState ?? existing?.viewState,
        });
        if (!this.order.includes(uri)) {
            this.order.push(uri);
        }
        this.activeUri = uri;
    }

    closeDocument(uri: string): void {
        if (!this.documents.has(uri)) {
            return;
        }
        this.documents.delete(uri);
        this.order = this.order.filter((entry) => entry !== uri);
        if (this.activeUri === uri) {
            this.activeUri = this.order.length > 0 ? this.order[this.order.length - 1] : null;
        }
    }

    setActiveDocument(uri: string | null, dirty = false): void {
        if (uri === null) {
            this.activeUri = null;
            return;
        }
        if (!this.documents.has(uri)) {
            this.openDocument(uri, { dirty });
            return;
        }
        this.activeUri = uri;
    }

    clearActiveDocument(): void {
        this.activeUri = null;
    }

    setDirty(dirty: boolean): void {
        if (this.activeUri) {
            const doc = this.documents.get(this.activeUri);
            if (doc) {
                this.documents.set(this.activeUri, { ...doc, dirty });
            }
        }
    }

    setViewState(uri: string, viewState: unknown): void {
        const doc = this.documents.get(uri);
        if (doc) {
            this.documents.set(uri, { ...doc, viewState });
        }
    }
}
