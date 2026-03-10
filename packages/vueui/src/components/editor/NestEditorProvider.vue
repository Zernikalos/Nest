<script setup lang="ts">
import { provide, watch, onMounted, onUnmounted, computed, ref } from 'vue';
import { OPEN_TAB, SET_ACTIVE_TAB } from '@zstudio/ide-core';
import type { ZObjectLike } from '@zstudio/ide-core';
import { useZkoStore } from '@/stores/zkoStore';
import { useIdeCore } from '@/composables/useIdeCore';
import { useZObjectState } from '@/composables/useZObjectState';
import { NEST_EDITOR_KEY } from '@/composables/useNestEditor';
import type { ZkResultExtended } from '@/types/project';

const zkoStore = useZkoStore();
const {
  viewModel,
  handleSelect,
  handleTabChange,
  handleTabClose,
  setTreeFromRoot,
  sessionSave,
  sessionRestore,
  dispatchSceneTree,
  getSceneTreeState,
} = useIdeCore();

const root = computed(() => {
  const zk = zkoStore.zkResult?.zko as { root?: ZObjectLike } | undefined;
  return zk?.root;
});

watch(
  root,
  (r) => {
    setTreeFromRoot(r);
  },
  { immediate: true }
);

const { selectedZObject } = useZObjectState(
  () => root.value ?? null,
  () => viewModel.value.activeNode
);

function notifyChange() {
  setTreeFromRoot(root.value);
}

const restoreAttempted = ref(false);
onMounted(() => {
  const r = root.value;
  const treeLen = viewModel.value.tree.length;
  if (r && treeLen > 0 && sessionRestore && dispatchSceneTree && getSceneTreeState && !restoreAttempted.value) {
    restoreAttempted.value = true;
    sessionRestore().then((data) => {
      if (data?.sceneTree) {
        const { openedNodeIds, activeNode } = data.sceneTree;
        const state = getSceneTreeState();
        const treeIds = new Set<string>();
        const collect = (nodes: { id: string; children?: unknown[] }[]) => {
          for (const node of nodes) {
            treeIds.add(node.id);
            if (node.children) collect(node.children as { id: string; children?: unknown[] }[]);
          }
        };
        collect(state.tree);
        const validIds = openedNodeIds.filter((id: string) => treeIds.has(id));
        for (const id of validIds) {
          dispatchSceneTree({ type: OPEN_TAB, payload: id });
        }
        if (activeNode && treeIds.has(activeNode)) {
          dispatchSceneTree({ type: SET_ACTIVE_TAB, payload: activeNode });
        }
      }
    });
  }
  if (!r) {
    restoreAttempted.value = false;
  }
});

onUnmounted(() => {
  sessionSave?.();
});

async function regenerateZko(): Promise<ZkResultExtended | null> {
  return zkoStore.zkResult;
}

const context = {
  tree: computed(() => viewModel.value.tree),
  selectedIds: computed(() => viewModel.value.selectedIds),
  handleSelect,
  handleTabChange,
  handleTabClose,
  zkResult: computed(() => zkoStore.zkResult),
  selectedZObject,
  regenerateZko,
  notifyChange,
};

provide(NEST_EDITOR_KEY, context);
</script>

<template>
  <slot />
</template>
