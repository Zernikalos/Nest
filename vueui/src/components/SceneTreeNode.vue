<script setup lang="ts">
import { computed } from 'vue';
import { ChevronRight } from '@lucide/vue';
import type { TreeNode } from '@ide-core';
import SceneTreeNode from './SceneTreeNode.vue';
import ObjectTypeIcon from '@/components/editor/ObjectTypeIcon.vue';

const props = defineProps<{
  node: TreeNode;
  selectedIds: string[];
  expandedNodeIds: string[];
  activeNodeId: string | null;
}>();

const emit = defineEmits<{
  select: [node: TreeNode];
  open: [node: TreeNode];
  toggle: [node: TreeNode];
}>();

function onClick(node: TreeNode) {
  emit('select', node);
}

function onDoubleClick(node: TreeNode) {
  if (node.children?.length) {
    emit('toggle', node);
  } else {
    emit('open', node);
  }
}

function onToggle(node: TreeNode, event?: MouseEvent) {
  if (event && event.detail > 1) return;
  emit('toggle', node);
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
const hasChildren = computed(() => Boolean(props.node.children?.length));
const isExpanded = computed(() => props.expandedNodeIds.includes(props.node.id));
const isActive = computed(() => props.activeNodeId === props.node.id);
</script>

<template>
  <li class="scene-tree-node">
    <div
      :id="`scene-tree-node-${props.node.id}`"
      class="scene-tree-node__row"
      :class="{
        'scene-tree-node__row--selected': props.selectedIds.includes(node.id),
        'scene-tree-node__row--active': isActive,
      }"
      role="treeitem"
      :aria-selected="props.selectedIds.includes(node.id)"
      :aria-expanded="hasChildren ? isExpanded : undefined"
      :data-scene-tree-node-id="props.node.id"
      :tabindex="isActive ? 0 : -1"
      @click="onClick(props.node)"
      @dblclick="onDoubleClick(props.node)"
    >
      <button
        v-if="hasChildren"
        type="button"
        class="scene-tree-node__toggle"
        :class="{ 'scene-tree-node__toggle--expanded': isExpanded }"
        :aria-label="isExpanded ? `Collapse ${props.node.label}` : `Expand ${props.node.label}`"
        :aria-expanded="isExpanded"
        @click.stop="onToggle(props.node, $event)"
        @dblclick.stop
      >
        <ChevronRight :size="14" />
      </button>
      <span v-else class="scene-tree-node__toggle-spacer" aria-hidden="true"></span>
      <ObjectTypeIcon
        :type="iconType"
        :size="14"
        class="scene-tree-node__icon"
      />
      <span class="scene-tree-node__label">{{ props.node.label }}</span>
    </div>
    <ul v-if="hasChildren && isExpanded" class="scene-tree-node__children">
      <SceneTreeNode
        v-for="child in props.node.children"
        :key="child.id"
        :node="child"
        :selected-ids="props.selectedIds"
        :expanded-node-ids="props.expandedNodeIds"
        :active-node-id="props.activeNodeId"
        @select="(node) => emit('select', node)"
        @open="(node) => emit('open', node)"
        @toggle="(node) => emit('toggle', node)"
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
  user-select: none;
}
.scene-tree-node__toggle,
.scene-tree-node__toggle-spacer {
  width: 16px;
  height: 16px;
  flex: 0 0 16px;
}
.scene-tree-node__toggle {
  border: 0;
  padding: 0;
  border-radius: 4px;
  color: var(--muted-foreground);
  background: transparent;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}
.scene-tree-node__toggle:hover {
  background: var(--base-200);
  color: var(--base-foreground);
}
.scene-tree-node__toggle svg {
  transition: transform 120ms ease;
}
.scene-tree-node__toggle--expanded svg {
  transform: rotate(90deg);
}
.scene-tree-node__row:hover {
  background: var(--base-300);
}
.scene-tree-node__row:focus {
  outline: none;
}
.scene-tree-node__row--selected {
  background: var(--base-300);
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
