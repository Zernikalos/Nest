/**
 * Evaluates context keys for command enablement and UI state.
 * Keys are strings (e.g. "editorHasSelection", "projectOpen"); values are set by the runtime or adapters.
 * Expressions support: "key", "!key", "key == value".
 */

export class ContextKeyService {
    private context = new Map<string, unknown>();

    set(key: string, value: unknown): void {
        this.context.set(key, value);
    }

    get(key: string): unknown {
        return this.context.get(key);
    }

    /** Returns true if the key is strictly true or the string "true". */
    getBool(key: string): boolean {
        const v = this.context.get(key);
        return v === true || v === 'true';
    }

    /** Returns the string value if the key holds a string; otherwise undefined. */
    getString(key: string): string | undefined {
        const v = this.context.get(key);
        return typeof v === 'string' ? v : undefined;
    }

    /**
     * Evaluate a simple expression: "key" (getBool), "!key" (negated), or "key == value" (strict equality).
     */
    evaluate(expr: string): boolean {
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
