/**
 * Framework-agnostic runtime contracts for IDE V2.
 * No React, Vue, Svelte, or DOM imports.
 *
 * Adapters use EditorRuntime snapshots and domain editor methods; they never hold canonical state.
 */

import type { WorkbenchArea } from '../domain/enums.js';

/** Optional payload returned by command handlers for platform adapters. */
export interface RuntimeEffect {
    type: string;
    payload?: unknown;
}

export type { EditorSnapshot } from './snapshot.js';
export type { SubscribableEditor } from './store.js';

/** Context passed to a widget when its controller is created. */
export interface WidgetRuntimeContext {
    getWidget(id: string): WidgetContribution | undefined;
}

/** Registration descriptor for a workbench widget. */
export interface WidgetContribution {
    id: string;
    title: string;
    defaultArea: WorkbenchArea;
    closable: boolean;
    createController(ctx: WidgetRuntimeContext): WidgetController;
}

/** Controller for a single widget instance (lifecycle + optional panel view model). */
export interface WidgetController {
    onMount?(): void;
    onActivate?(): void;
    onDeactivate?(): void;
    onDispose?(): void;
    serializeState(): unknown;
    restoreState(raw: unknown): void;
    getViewModel(): unknown;
}
