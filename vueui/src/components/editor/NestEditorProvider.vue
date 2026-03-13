<script setup lang="ts">
import { provide, watch, computed, onMounted, onUnmounted, inject, ref } from 'vue';
import type { ZObjectLike, WidgetContribution } from '@ide-core';
import { useIdeCore } from '@/composables/useIdeCore';
import { useZObjectState } from '@/composables/useZObjectState';
import { NEST_EDITOR_KEY } from '@/composables/useNestEditor';
import { RUNTIME_KEY } from '@/composables/useIdeCore';
import type { EditorRuntime } from '@ide-core';
import type { ZkResultExtended } from '@/types/project';

const runtime = inject<EditorRuntime | null>(RUNTIME_KEY, null);

const conversionViewModel = ref({
  isConverting: false,
  conversionError: null as string | null,
  lastResult: null as ZkResultExtended | null,
});

let unsubConversion: (() => void) | null = null;
onMounted(() => {
  if (runtime) {
    unsubConversion = runtime.subscribeAssetConversion(() => {
      conversionViewModel.value = runtime.getAssetConversionViewModel();
    });
    conversionViewModel.value = runtime.getAssetConversionViewModel();
  }
});
onUnmounted(() => {
  unsubConversion?.();
});

const {
  viewModel,
  handleSelect,
  handleTabChange,
  handleTabClose,
  setTreeFromRoot,
  registerWidget,
  unregisterWidget,
  openWidget,
} = useIdeCore();

const SCENE_TREE_WIDGET_ID = 'scene-tree';

const sceneTreeContribution: WidgetContribution = {
  id: SCENE_TREE_WIDGET_ID,
  title: 'Scene Tree',
  defaultArea: 'left',
  closable: false,
  createController() {
    return {
      serializeState: () => ({}),
      restoreState: () => {},
      getViewModel: () => ({}),
      handleIntent: () => [],
    };
  },
};

onMounted(() => {
  registerWidget(sceneTreeContribution);
  openWidget(SCENE_TREE_WIDGET_ID, 'left');
});

onUnmounted(() => {
  unregisterWidget(SCENE_TREE_WIDGET_ID);
});

const root = computed(() => {
  const zk = conversionViewModel.value.lastResult?.zko as { root?: ZObjectLike } | undefined;
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

async function regenerateZko(): Promise<ZkResultExtended | null> {
  return conversionViewModel.value.lastResult;
}

const context = {
  tree: computed(() => viewModel.value.tree),
  selectedIds: computed(() => viewModel.value.selectedIds),
  openedNodes: computed(() => viewModel.value.openedNodes),
  activeNode: computed(() => viewModel.value.activeNode),
  handleSelect,
  handleTabChange,
  handleTabClose,
  zkResult: computed(() => conversionViewModel.value.lastResult),
  selectedZObject,
  regenerateZko,
  notifyChange,
};

provide(NEST_EDITOR_KEY, context);
</script>

<template>
  <slot />
</template>
