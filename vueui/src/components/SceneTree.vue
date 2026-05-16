<script setup lang="ts">
import { computed } from 'vue';
import type { TreeNode } from '@ide-core';
import { useEditorStore, useEditorSlice } from '@ide-core/vue';
import SceneTreeNode from './SceneTreeNode.vue';

const editor = useEditorStore();
const scene = useEditorSlice('scene');

const tree = computed(() => scene.value.tree);
const selectedIds = computed(() => scene.value.selectedIds);

function onNodeClick(node: TreeNode) {
  const ids = selectedIds.value.includes(node.id)
    ? selectedIds.value
    : [node.id];
  editor.selectNodes(ids);
}

function onNodeDoubleClick(node: TreeNode) {
  editor.openZObject(node.id);
}
</script>

<template>
  <div class="scene-tree island-radius">
    <div class="scene-tree__header text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1 px-1">Scene Tree</div>
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
  padding: 4px;
  border-radius: var(--island-radius);
}
.scene-tree__list {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
