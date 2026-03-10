/**
 * Removes dataArray from an object tree (and nested objects/arrays).
 * Plain JS implementation to avoid lodash in vueui.
 */
function removeDataArrayRecursively<T>(obj: T): T {
  if (obj === null || obj === undefined) {
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => removeDataArrayRecursively(item)) as T;
  }

  if (typeof obj === 'object') {
    const result = {} as Record<string, unknown>;
    for (const [key, value] of Object.entries(obj)) {
      if (key === 'dataArray') continue;
      (result as Record<string, unknown>)[key] = removeDataArrayRecursively(value);
    }
    return result as T;
  }

  return obj;
}

function createEditableCopy(obj: { toJSON?: () => unknown; [key: string]: unknown }): unknown {
  if (!obj) return null;
  const raw = typeof obj.toJSON === 'function' ? obj.toJSON() : obj;
  return removeDataArrayRecursively(
    typeof raw === 'object' && raw !== null ? JSON.parse(JSON.stringify(raw)) : raw
  );
}

/**
 * Returns a JSON-serializable object for the selected ZObject (no dataArray),
 * or null if zkResult.exported.objects / selectedZObject are missing.
 */
export function sanitizeEditableObject(
  zkResult: { exported?: { objects?: Array<{ refId: string; toJSON?: () => unknown; [key: string]: unknown }> } } | null | undefined,
  selectedZObject: { refId: string } | null | undefined
): unknown {
  if (!zkResult?.exported?.objects || !selectedZObject) {
    return null;
  }

  const matchingObject = zkResult.exported.objects.find(
    (obj: { refId: string }) => obj.refId === selectedZObject.refId
  );

  if (!matchingObject) {
    return null;
  }

  return createEditableCopy(matchingObject);
}
