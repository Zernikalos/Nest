<script setup lang="ts">
import { computed } from 'vue';
import { useIdeCore } from '@/composables/useIdeCore';
import type { TreeNode } from '@zstudio/ide-core';
import SceneTreeNode from './SceneTreeNode.vue';

const { viewModel, handleSelect, handleTabChange } = useIdeCore();

const tree = computed(() => viewModel.value.tree);
const selectedIds = computed(() => viewModel.value.selectedIds);

function isSelected(id: string): boolean {
  return selectedIds.value.includes(id);
}

function onNodeClick(node: TreeNode) {
  const ids = selectedIds.value.includes(node.id)
    ? selectedIds.value
    : [node.id];
  handleSelect(ids);
}

function onNodeDoubleClick(node: TreeNode) {
  handleTabChange(node.id);
}
</script>

<template>
  <div class="scene-tree">
    <div class="scene-tree__header">Scene Tree</div>
    <ul class="scene-tree__list">
      <SceneTreeNode
        v-for="node in tree"
        :key="node.id"
        :node="node"
        :selected-ids="selectedIds"
        @select="onNodeClick"
        @open="onNodeDoubleClick"
      />
    </ul>
  </div>
</template>

<style scoped>
.scene-tree {
  font-family: system-ui, sans-serif;
  padding: 8px;
}
.scene-tree__header {
  font-weight: 600;
  margin-bottom: 8px;
}
.scene-tree__list {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
