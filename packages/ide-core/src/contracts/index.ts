/**
 * Framework-agnostic runtime contracts for IDE V2.
 * No React, Vue, Svelte, or DOM imports.
 */

export interface RuntimeIntent {
    type: string;
    payload?: unknown;
}

export interface RuntimeEffect {
    type: string;
    payload?: unknown;
}

export interface RuntimeStore<S> {
    getState(): S;
    dispatch(intent: RuntimeIntent): RuntimeEffect[];
    subscribe(listener: () => void): () => void;
}

export interface WidgetRuntimeContext {
    /** Resolve a widget contribution by id */
    getWidget(id: string): WidgetContribution | undefined;
}

export interface WidgetContribution {
    id: string;
    title: string;
    defaultArea: 'left' | 'right' | 'bottom' | 'center';
    closable: boolean;
    createController(ctx: WidgetRuntimeContext): WidgetController;
}

export interface WidgetController {
    onMount?(): void;
    onActivate?(): void;
    onDeactivate?(): void;
    onDispose?(): void;
    serializeState(): unknown;
    restoreState(raw: unknown): void;
    getViewModel(): unknown;
    handleIntent(intent: RuntimeIntent): RuntimeEffect[];
}
