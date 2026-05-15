<script setup lang="ts">
import { provide, watch, computed, onMounted, onUnmounted, inject, ref } from 'vue';
import type { ZObjectLike, WidgetContribution, IInputAsset } from '@ide-core';
import { useIdeCore } from '@/composables/useIdeCore';
import { useZObjectState } from '@/composables/useZObjectState';
import { NEST_EDITOR_KEY } from '@/composables/useNestEditor';
import { RUNTIME_KEY } from '@/composables/useIdeCore';
import type { EditorRuntime } from '@ide-core';
import type { ZkResultExtended } from '@/types/project';
import Button from '@/components/ui/Button.vue';

const runtime = inject<EditorRuntime | null>(RUNTIME_KEY, null);

const conversionViewModel = ref({
  isConverting: false,
  conversionError: null as string | null,
  lastResult: null as ZkResultExtended | null,
  projectPersistWarning: null as string | null,
});

let unsubConversion: (() => void) | null = null;
let unsubProject: (() => void) | null = null;
const rehydrateAttemptedForPath = ref<string | null>(null);

function pickNewestAsset(assets: IInputAsset[]): IInputAsset {
  return assets.reduce((best, a) => (a.importedAt > best.importedAt ? a : best));
}

async function tryRehydrateFromLastAsset() {
  if (!runtime) return;
  const projectVm = runtime.project.getViewModel();
  const convVm = runtime.assetConversion.getViewModel();
  const path = projectVm.projectFilePath;
  if (!path) {
    rehydrateAttemptedForPath.value = null;
    return;
  }
  if (projectVm.isLoading) return;
  const assets = projectVm.project?.assets;
  if (!assets?.length || convVm.lastResult || convVm.isConverting) return;
  if (rehydrateAttemptedForPath.value === path) return;

  rehydrateAttemptedForPath.value = path;
  const asset = pickNewestAsset(assets);
  try {
    await runtime.assetConversion.convert({
      path: asset.path,
      fileName: asset.fileName,
      format: asset.format,
    });
  } catch {
    // conversionError is set on the asset conversion store
  }
}

function dismissProjectPersistWarning() {
  runtime?.assetConversion.setProjectPersistWarning(null);
}

onMounted(() => {
  if (runtime) {
    unsubProject = runtime.project.subscribe(() => {
      if (!runtime!.project.getPath()) {
        rehydrateAttemptedForPath.value = null;
      }
      void tryRehydrateFromLastAsset();
    });
    unsubConversion = runtime.assetConversion.subscribe(() => {
      conversionViewModel.value = runtime!.assetConversion.getViewModel();
      void tryRehydrateFromLastAsset();
    });
    conversionViewModel.value = runtime.assetConversion.getViewModel();
    void tryRehydrateFromLastAsset();
  }
});
onUnmounted(() => {
  unsubConversion?.();
  unsubProject?.();
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
  <div class="flex h-full min-h-0 flex-1 flex-col gap-2">
    <div
      v-if="conversionViewModel.projectPersistWarning"
      class="flex shrink-0 items-start justify-between gap-3 rounded-md border border-warning/40 bg-warning/10 px-3 py-2 text-sm text-base-foreground"
      role="status"
    >
      <p class="min-w-0 flex-1 leading-snug">
        {{ conversionViewModel.projectPersistWarning }}
      </p>
      <Button variant="outline" size="sm" type="button" @click="dismissProjectPersistWarning">
        Dismiss
      </Button>
    </div>
    <div class="flex min-h-0 flex-1 flex-col">
      <slot />
    </div>
  </div>
</template>
