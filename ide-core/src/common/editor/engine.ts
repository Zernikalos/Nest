/**
 * Engine session: preview/runtime lifecycle (idle, starting, running, stopping, failed).
 */
import { withDerived } from '../domain/viewProjection.js';
import type { EngineSessionPort } from '../ports/index.js';
import { DomainEditorBase, type DomainCommitHandler } from './DomainEditorBase.js';

export enum EngineSessionStatus {
    Idle = 'idle',
    Starting = 'starting',
    Running = 'running',
    Stopping = 'stopping',
    Failed = 'failed',
}

export interface EngineSessionState {
    status: EngineSessionStatus;
    error: string | null;
}

export interface EngineSessionViewModel extends EngineSessionState {
    isRunning: boolean;
    isBusy: boolean;
}

const initialState: EngineSessionState = {
    status: EngineSessionStatus.Idle,
    error: null,
};

export function getEngineSessionViewModel(state: EngineSessionState): EngineSessionViewModel {
    return withDerived(state, (s) => ({
        isRunning: s.status === EngineSessionStatus.Running,
        isBusy:
            s.status === EngineSessionStatus.Starting ||
            s.status === EngineSessionStatus.Stopping,
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
            d.status = EngineSessionStatus.Starting;
            d.error = null;
        });
        try {
            await this.port.startEngineSession({
                projectPath: this.getProjectPath() ?? undefined,
            });
            this.patch((d) => {
                d.status = EngineSessionStatus.Running;
            });
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            this.patch((d) => {
                d.error = message;
                d.status = EngineSessionStatus.Failed;
            });
            throw e;
        }
    }

    async stop(): Promise<void> {
        if (!this.port) return;
        this.patch((d) => {
            d.status = EngineSessionStatus.Stopping;
        });
        try {
            await this.port.stopEngineSession();
            this.patch((d) => {
                d.status = EngineSessionStatus.Idle;
            });
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            this.patch((d) => {
                d.error = message;
                d.status = EngineSessionStatus.Failed;
            });
            throw e;
        }
    }

    async restart(): Promise<void> {
        if (!this.port) return;
        this.patch((d) => {
            d.status = EngineSessionStatus.Stopping;
        });
        try {
            await this.port.restartEngineSession();
            this.patch((d) => {
                d.status = EngineSessionStatus.Running;
            });
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            this.patch((d) => {
                d.error = message;
                d.status = EngineSessionStatus.Failed;
            });
            throw e;
        }
    }
}
