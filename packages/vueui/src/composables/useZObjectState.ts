import { computed } from 'vue';

/**
 * Find a ZObject in the tree by refId (node id in scene tree = refId).
 * Uses minimal shape compatible with ide-core ZObjectLike (no index signature).
 */
interface ZObjectLike {
  refId: string;
  children?: ZObjectLike[];
}

export function findZObjectById(
  root: ZObjectLike | undefined | null,
  refId: string
): ZObjectLike | null {
  if (!root) return null;
  if (root.refId === refId) return root;
  for (const child of root.children ?? []) {
    const found = findZObjectById(child, refId);
    if (found) return found;
  }
  return null;
}

export function useZObjectState(
  root: () => ZObjectLike | undefined | null,
  activeNode: () => string | null
) {
  const selectedZObject = computed(() => {
    const r = root();
    const nodeId = activeNode();
    if (!nodeId || !r) return null;
    return findZObjectById(r, nodeId);
  });
  return { selectedZObject };
}
