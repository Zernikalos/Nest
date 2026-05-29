/** Coalesces store updates into a single onChange notification per tick. */
export class EditorChangeNotifier {
    private readonly listeners = new Set<() => void>();
    private notifyScheduled = false;

    onChange(listener: () => void): () => void {
        this.listeners.add(listener);
        return () => this.listeners.delete(listener);
    }

    notify(): void {
        if (this.notifyScheduled) return;
        this.notifyScheduled = true;
        queueMicrotask(() => {
            this.notifyScheduled = false;
            for (const listener of this.listeners) {
                listener();
            }
        });
    }
}
