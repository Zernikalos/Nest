<script setup lang="ts">
import type { TreeNode } from '@zstudio/ide-core';
import SceneTreeNode from './SceneTreeNode.vue';

const props = defineProps<{
  node: TreeNode;
  selectedIds: string[];
}>();

const emit = defineEmits<{
  select: [node: TreeNode];
}>();

function onClick(node: TreeNode) {
  emit('select', node);
}
</script>

<template>
  <li class="scene-tree-node">
    <div
      class="scene-tree-node__row"
      :class="{ 'scene-tree-node__row--selected': props.selectedIds.includes(node.id) }"
      @click="onClick(props.node)"
    >
      <span class="scene-tree-node__icon" v-if="props.node.iconType">{{ props.node.iconType }}</span>
      <span class="scene-tree-node__label">{{ props.node.label }}</span>
    </div>
    <ul v-if="props.node.children?.length" class="scene-tree-node__children">
      <SceneTreeNode
        v-for="child in props.node.children"
        :key="child.id"
        :node="child"
        :selected-ids="props.selectedIds"
        @select="(node) => emit('select', node)"
      />
    </ul>
  </li>
</template>

<style scoped>
.scene-tree-node {
  list-style: none;
  margin: 0;
  padding-left: 12px;
}
.scene-tree-node__row {
  padding: 4px 8px;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 6px;
}
.scene-tree-node__row:hover {
  background: #eee;
}
.scene-tree-node__row--selected {
  background: #ddd;
}
.scene-tree-node__icon {
  font-size: 12px;
  opacity: 0.8;
}
.scene-tree-node__label {
  flex: 1;
}
.scene-tree-node__children {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
