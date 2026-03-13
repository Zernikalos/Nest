<script setup lang="ts">
import { computed } from 'vue';
import type { TreeNode } from '@zstudio/ide-core';
import SceneTreeNode from './SceneTreeNode.vue';
import ObjectTypeIcon from '@/components/editor/ObjectTypeIcon.vue';

const props = defineProps<{
  node: TreeNode;
  selectedIds: string[];
}>();

const emit = defineEmits<{
  select: [node: TreeNode];
  open: [node: TreeNode];
}>();

function onClick(node: TreeNode) {
  emit('select', node);
}

function onDoubleClick(node: TreeNode) {
  emit('open', node);
}

/** Normalize iconType to string (handles Ref-like objects or plain strings from reactive state). */
function normalizeIconType(value: unknown): string {
  if (typeof value === 'string') return value;
  if (value != null && typeof value === 'object' && 'value' in value) {
    return String((value as { value: unknown }).value);
  }
  return value != null ? String(value) : '';
}

const iconType = computed(() => normalizeIconType(props.node.iconType));
</script>

<template>
  <li class="scene-tree-node">
    <div
      class="scene-tree-node__row"
      :class="{ 'scene-tree-node__row--selected': props.selectedIds.includes(node.id) }"
      @click="onClick(props.node)"
      @dblclick="onDoubleClick(props.node)"
    >
      <ObjectTypeIcon
        :type="iconType"
        :size="14"
        class="scene-tree-node__icon"
      />
      <span class="scene-tree-node__label">{{ props.node.label }}</span>
    </div>
    <ul v-if="props.node.children?.length" class="scene-tree-node__children">
      <SceneTreeNode
        v-for="child in props.node.children"
        :key="child.id"
        :node="child"
        :selected-ids="props.selectedIds"
        @select="(node) => emit('select', node)"
        @open="(node) => emit('open', node)"
      />
    </ul>
  </li>
</template>

<style scoped>
.scene-tree-node {
  list-style: none;
  margin: 0;
  padding-left: 8px;
}
.scene-tree-node__row {
  padding: 2px 6px;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  gap: 4px;
}
.scene-tree-node__row:hover {
  background: var(--base-300);
}
.scene-tree-node__row--selected {
  background: var(--base-300);
  border-left: 2px solid var(--primary);
  padding-left: 4px;
}
.scene-tree-node__row--selected:hover {
  background: var(--base-300);
}
.scene-tree-node__icon {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  color: var(--muted-foreground);
}
.scene-tree-node__label {
  flex: 1;
  color: var(--base-foreground);
}
.scene-tree-node__children {
  list-style: none;
  margin: 0;
  padding: 0;
}
</style>
