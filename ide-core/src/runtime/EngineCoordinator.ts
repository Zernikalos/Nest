import type { RuntimeStore } from '../contracts/index.js';
import {
    SET_ERROR as ENGINE_SESSION_SET_ERROR,
    SET_STATUS as ENGINE_SESSION_SET_STATUS,
    type EngineSessionState,
} from '../domain/EngineSessionModule.js';
import type { EngineSessionPort } from '../ports/index.js';
import type { StoreDispatcher } from './StoreDispatcher.js';

export class EngineCoordinator {
    constructor(
        private readonly engineSessionStore: RuntimeStore<EngineSessionState>,
        private readonly engineSessionPort: EngineSessionPort | null,
        private readonly dispatcher: StoreDispatcher,
        private readonly getProjectPath: () => string | null
    ) {}

    async start(): Promise<void> {
        if (!this.engineSessionPort) return;
        this.dispatcher.dispatch(this.engineSessionStore, {
            type: ENGINE_SESSION_SET_STATUS,
            payload: 'starting',
        });
        try {
            await this.engineSessionPort.startEngineSession({
                projectPath: this.getProjectPath() ?? undefined,
            });
            this.dispatcher.dispatch(this.engineSessionStore, {
                type: ENGINE_SESSION_SET_STATUS,
                payload: 'running',
            });
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            this.dispatcher.dispatch(this.engineSessionStore, {
                type: ENGINE_SESSION_SET_ERROR,
                payload: message,
            });
            throw e;
        }
    }

    async stop(): Promise<void> {
        if (!this.engineSessionPort) return;
        this.dispatcher.dispatch(this.engineSessionStore, {
            type: ENGINE_SESSION_SET_STATUS,
            payload: 'stopping',
        });
        try {
            await this.engineSessionPort.stopEngineSession();
            this.dispatcher.dispatch(this.engineSessionStore, {
                type: ENGINE_SESSION_SET_STATUS,
                payload: 'idle',
            });
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            this.dispatcher.dispatch(this.engineSessionStore, {
                type: ENGINE_SESSION_SET_ERROR,
                payload: message,
            });
            throw e;
        }
    }

    async restart(): Promise<void> {
        if (!this.engineSessionPort) return;
        this.dispatcher.dispatch(this.engineSessionStore, {
            type: ENGINE_SESSION_SET_STATUS,
            payload: 'stopping',
        });
        try {
            await this.engineSessionPort.restartEngineSession();
            this.dispatcher.dispatch(this.engineSessionStore, {
                type: ENGINE_SESSION_SET_STATUS,
                payload: 'running',
            });
        } catch (e) {
            const message = e instanceof Error ? e.message : String(e);
            this.dispatcher.dispatch(this.engineSessionStore, {
                type: ENGINE_SESSION_SET_ERROR,
                payload: message,
            });
            throw e;
        }
    }
}
