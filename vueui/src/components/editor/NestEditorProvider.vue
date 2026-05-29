<script setup lang="ts">
import { provide, watch, computed, onMounted, onUnmounted } from 'vue';
import { WorkbenchArea, type ZObjectLike, type IInputAsset } from '@ide-core';
import { nodeIdToDocumentUri } from '@ide-core';
import { useEditorStore, useEditorSlice } from '@ide-core/vue';
import { useZObjectState } from '@/composables/useZObjectState';
import { NEST_EDITOR_KEY } from '@/composables/useNestEditor';
import type { ZkResultExtended } from '@/types/project';
import Button from '@/components/ui/Button.vue';

const editor = useEditorStore();
const projectSnapshot = useEditorSlice('project');
const conversionViewModel = useEditorSlice('assets');
const sceneSnapshot = useEditorSlice('scene');

const SCENE_TREE_WIDGET_ID = 'scene-tree';

const rehydrateAttemptedForPath = { value: null as string | null };

function pickNewestAsset(assets: IInputAsset[]): IInputAsset {
  return assets.reduce((best, a) => (a.importedAt > best.importedAt ? a : best));
}

async function tryRehydrateFromLastAsset() {
  const projectVm = projectSnapshot.value;
  const convVm = conversionViewModel.value;
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
    await editor.convertAsset({
      path: asset.path,
      fileName: asset.fileName,
      format: asset.format,
    });
  } catch {
    // conversionError is set on the asset conversion editor
  }
}

function dismissProjectPersistWarning() {
  editor.setProjectPersistWarning(null);
}

onMounted(() => {
  editor.setupSceneTreePanel(SCENE_TREE_WIDGET_ID, WorkbenchArea.Left);
  void tryRehydrateFromLastAsset();
});

onUnmounted(() => {
  editor.unregisterWorkbenchWidget(SCENE_TREE_WIDGET_ID);
});

watch(
  () => projectSnapshot.value.projectFilePath,
  (path) => {
    if (!path) {
      rehydrateAttemptedForPath.value = null;
    }
  }
);

watch(
  [projectSnapshot, conversionViewModel],
  () => {
    void tryRehydrateFromLastAsset();
  },
  { deep: true }
);

const root = computed(() => {
  const zk = conversionViewModel.value.lastResult?.zko as { root?: ZObjectLike } | undefined;
  return zk?.root;
});

watch(
  root,
  (r) => {
    editor.setTreeFromRoot(r);
  },
  { immediate: true }
);

const { selectedZObject } = useZObjectState(
  () => root.value ?? null,
  () => sceneSnapshot.value.activeNode
);

function notifyChange() {
  editor.setTreeFromRoot(root.value);
}

async function regenerateZko(): Promise<ZkResultExtended | null> {
  return conversionViewModel.value.lastResult as ZkResultExtended | null;
}

const context = {
  tree: computed(() => sceneSnapshot.value.tree),
  selectedIds: computed(() => sceneSnapshot.value.selectedIds),
  openedNodes: computed(() => sceneSnapshot.value.openedNodes),
  activeNode: computed(() => sceneSnapshot.value.activeNode),
  handleSelect: (ids: string[]) => editor.selectNodes(ids),
  handleTabChange: (nodeId: string) => editor.openZObject(nodeId),
  handleTabClose: (nodeId: string) => {
    editor.closeDocument(nodeIdToDocumentUri(nodeId));
  },
  zkResult: computed(() => conversionViewModel.value.lastResult as ZkResultExtended | null),
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
