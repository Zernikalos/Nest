/**
 * Framework-agnostic runtime contracts for IDE V2.
 * No React, Vue, Svelte, or DOM imports.
 *
 * Adapters use EditorRuntime snapshots and domain editor methods; they never hold canonical state.
 */

export type { RuntimeEffect } from './runtimeEffect.js';
export type { EditorSnapshot } from './snapshot.js';
export type { SubscribableEditor } from './store.js';
export type { WidgetRuntimeContext } from './widgetRuntimeContext.js';
export type { WidgetContribution } from './widgetContribution.js';
export type { WidgetController } from './widgetController.js';
