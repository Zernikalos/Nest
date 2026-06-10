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
