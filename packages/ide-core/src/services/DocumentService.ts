/**
 * DocumentService - stub for active document (ZKO) management.
 * URI-based; dirty/save delegated to platform.
 */

export interface DocumentDescriptor {
    uri: string;
    dirty: boolean;
}

export class DocumentService {
    private activeDocument: DocumentDescriptor | null = null;

    getActiveDocument(): DocumentDescriptor | null {
        return this.activeDocument;
    }

    setActiveDocument(uri: string, dirty = false): void {
        this.activeDocument = { uri, dirty };
    }

    clearActiveDocument(): void {
        this.activeDocument = null;
    }

    setDirty(dirty: boolean): void {
        if (this.activeDocument) {
            this.activeDocument = { ...this.activeDocument, dirty };
        }
    }
}
