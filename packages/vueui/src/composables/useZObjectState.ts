import { computed } from 'vue';
import { findZObjectById } from '@zstudio/ide-core';
import type { ZObjectLike } from '@zstudio/ide-core';

/**
 * Resolve the selected ZObject from the scene tree root and active node id.
 * Uses findZObjectById from ide-core for framework-agnostic tree lookup.
 */
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
