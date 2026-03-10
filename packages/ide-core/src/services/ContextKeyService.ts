/**
 * Evaluates context keys for command enablement.
 * Keys are strings like "editorHasSelection", "editorFocus", etc.
 */

export class ContextKeyService {
    private context = new Map<string, unknown>();

    set(key: string, value: unknown): void {
        this.context.set(key, value);
    }

    get(key: string): unknown {
        return this.context.get(key);
    }

    getBool(key: string): boolean {
        const v = this.context.get(key);
        return v === true || v === 'true';
    }

    getString(key: string): string | undefined {
        const v = this.context.get(key);
        return typeof v === 'string' ? v : undefined;
    }

    evaluate(expr: string): boolean {
        // Simple expression: "key" or "!key" or "key == value"
        const trimmed = expr.trim();
        if (trimmed.startsWith('!')) {
            return !this.getBool(trimmed.slice(1));
        }
        if (trimmed.includes('==')) {
            const [key, val] = trimmed.split('==').map((s) => s.trim());
            return this.context.get(key) === val;
        }
        return this.getBool(trimmed);
    }

    clear(): void {
        this.context.clear();
    }
}
