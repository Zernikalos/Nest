import { shallowRef, onScopeDispose, computed, type ComputedRef } from 'vue';
import type { EditorSnapshot } from '../core/contracts/snapshot.js';
import type { EditorSnapshotKey } from '../core/runtime/EditorRuntime.js';
import { useEditorRuntime } from './useEditorRuntime.js';

/**
 * Reactive projection of one snapshot slice (fine-grained subscribe).
 * Returns a computed ref so templates and scripts share the same API.
 */
export function useEditorSlice<K extends EditorSnapshotKey>(
    key: K
): ComputedRef<EditorSnapshot[K]> {
    const runtime = useEditorRuntime();
    const slice = shallowRef(runtime.getSlice(key));
    onScopeDispose(
        runtime.subscribeSlice(key, () => {
            slice.value = runtime.getSlice(key);
        })
    );
    return computed(() => slice.value);
}
