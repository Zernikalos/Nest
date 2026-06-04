/**
 * Asset conversion workflow: convert-to-ZKO state and async port integration.
 */
import type { AssetConversionInput, AssetConversionResult } from '../domain/types.js';
import type { AssetConversionPort } from '../ports/index.js';
import { DomainEditorBase, type DomainCommitHandler } from './DomainEditorBase.js';
import type { ProjectEditor } from './project.js';

export interface AssetConversionState {
    isConverting: boolean;
    conversionError: string | null;
    lastResult: AssetConversionResult | null;
    projectPersistWarning: string | null;
}

export interface AssetConversionViewModel extends AssetConversionState {}

const initialState: AssetConversionState = {
    isConverting: false,
    conversionError: null,
    lastResult: null,
    projectPersistWarning: null,
};

export class AssetConversionEditor extends DomainEditorBase<AssetConversionState> {
    constructor(
        onCommit: DomainCommitHandler,
        private readonly conversionPort: AssetConversionPort | null,
        private readonly project: ProjectEditor
    ) {
        super(initialState, onCommit);
    }

    setProjectPersistWarning(message: string | null): void {
        this.patch((d) => {
            d.projectPersistWarning = message;
        });
    }

    async convert(input: AssetConversionInput): Promise<AssetConversionResult | null> {
        if (!this.conversionPort) {
            throw new Error('Asset conversion port not available');
        }
        this.patch((d) => {
            d.isConverting = true;
            d.conversionError = null;
            d.projectPersistWarning = null;
        });
        try {
            const result = await this.conversionPort.convertToZko(input);
            this.patch((d) => {
                d.lastResult = result;
                d.isConverting = false;
                d.conversionError = null;
            });
            const path = this.project.getPath();
            if (path && result) {
                try {
                    await this.project.addAsset({
                        path: input.path,
                        fileName: input.fileName,
                        format: input.format,
                    });
                } catch (e) {
                    const detail = e instanceof Error ? e.message : String(e);
                    this.patch((d) => {
                        d.projectPersistWarning = `Could not save asset to project: ${detail}`;
                    });
                }
            }
            return result;
        } catch (e) {
            const message = e instanceof Error ? e.message : 'Unknown error occurred';
            this.patch((d) => {
                d.conversionError = message;
                d.isConverting = false;
            });
            throw e;
        }
    }
}
