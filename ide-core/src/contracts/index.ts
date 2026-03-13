/**
 * Framework-agnostic runtime contracts for IDE V2.
 * No React, Vue, Svelte, or DOM imports.
 *
 * These types define the boundary between the IDE runtime and UI adapters.
 * Adapters dispatch intents and subscribe to state; they never hold canonical editor state.
 */

/** Message sent to the runtime to request a state change or side effect. */
export interface RuntimeIntent {
    type: string;
    payload?: unknown;
}

/** Message produced by the runtime as a result of handling an intent (e.g. for platform adapters). */
export interface RuntimeEffect {
    type: string;
    payload?: unknown;
}

/** Minimal store contract: get state, dispatch intents, subscribe to changes. */
export interface RuntimeStore<S> {
    getState(): S;
    dispatch(intent: RuntimeIntent): RuntimeEffect[];
    subscribe(listener: () => void): () => void;
}

/** Context passed to a widget when its controller is created. Used to resolve other widgets or services. */
export interface WidgetRuntimeContext {
    /** Resolve a widget contribution by id */
    getWidget(id: string): WidgetContribution | undefined;
}

/** Registration descriptor for a workbench widget. The runtime owns lifecycle; the UI renders by id. */
export interface WidgetContribution {
    id: string;
    title: string;
    defaultArea: 'left' | 'right' | 'bottom' | 'center';
    closable: boolean;
    createController(ctx: WidgetRuntimeContext): WidgetController;
}

/** Controller for a single widget instance. Handles lifecycle and persistence; getViewModel() feeds the UI. */
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
