/**
 * Engine session: preview/runtime lifecycle (idle, starting, running, stopping, failed).
 */
import { withDerived } from '../domain/viewProjection.js';
import type { EngineSessionPort } from '../ports/index.js';
import { DomainEditorBase, type DomainCommitHandler } from './DomainEditorBase.js';

export type EngineSessionStatus = 'idle' | 'starting' | 'running' | 'stopping' | 'failed';

export interface EngineSessionState {
    status: EngineSessionStatus;
    error: string | null;
}

export type EngineSessionViewModel = EngineSessionState & {
    isRunning: boolean;
    isBusy: boolean;
};

const initialState: EngineSessionState = {
    status: 'idle',
    error: null,
};

export function getEngineSessionViewModel(state: EngineSessionState): EngineSessionViewModel {
    return withDerived(state, (s) => ({
        isRunning: s.status === 'running',
        isBusy: s.status === 'starting' || s.status === 'stopping',
    }));
}

export class EngineEditor extends DomainEditorBase<EngineSessionState> {
    constructor(
        onCommit: DomainCommitHandler,
        private readonly port: EngineSessionPort | null,
        private readonly getProjectPath: () => string | null
    ) {
        super(initialState, onCommit);
    }

    async start(): Promise<void> {
        if (!this.port) return;
        this.patch((d) => {
            d.status = 'starting';
            d.error = null;
        });
        try {
            await this.port.startEngineSession({
                projectPath: this.getProjectPath() ?? undefined,
            });
            this.patch((d) => {
                d.status = 'running';
            });
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            this.patch((d) => {
                d.error = message;
                d.status = 'failed';
            });
            throw e;
        }
    }

    async stop(): Promise<void> {
        if (!this.port) return;
        this.patch((d) => {
            d.status = 'stopping';
        });
        try {
            await this.port.stopEngineSession();
            this.patch((d) => {
                d.status = 'idle';
            });
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            this.patch((d) => {
                d.error = message;
                d.status = 'failed';
            });
            throw e;
        }
    }

    async restart(): Promise<void> {
        if (!this.port) return;
        this.patch((d) => {
            d.status = 'stopping';
        });
        try {
            await this.port.restartEngineSession();
            this.patch((d) => {
                d.status = 'running';
            });
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            this.patch((d) => {
                d.error = message;
                d.status = 'failed';
            });
            throw e;
        }
    }
}
