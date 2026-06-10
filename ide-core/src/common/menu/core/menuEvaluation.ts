/**
 * Evaluates a menu `when` expression against a flat context key map.
 * Supports the same subset as ContextKeyService: "key", "!key", "key == value".
 */
export function evaluateMenuWhen(
    when: string | undefined,
    contextKeys: Readonly<Record<string, unknown>>,
): boolean {
    if (!when) return true;

    const trimmed = when.trim();
    if (trimmed.startsWith('!')) {
        return !getBool(contextKeys, trimmed.slice(1));
    }
    if (trimmed.includes('==')) {
        const [key, val] = trimmed.split('==').map((s) => s.trim());
        return contextKeys[key] === val;
    }
    return getBool(contextKeys, trimmed);
}

function getBool(contextKeys: Readonly<Record<string, unknown>>, key: string): boolean {
    const value = contextKeys[key];
    return value === true || value === 'true';
}
