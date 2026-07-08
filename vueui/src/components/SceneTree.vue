<script setup lang="ts">
import { computed, nextTick, ref } from 'vue';
import { onKeyStroke, useFocusWithin } from '@vueuse/core';
import type { TreeNode } from '@ide-core';
import { useEditorStore, useEditorSlice } from '@ide-core/vue';
import SceneTreeNode from './SceneTreeNode.vue';

const editor = useEditorStore();
const scene = useEditorSlice('scene');
const treeRoot = ref<HTMLElement | null>(null);
const { focused: treeHasFocus } = useFocusWithin(treeRoot);

const tree = computed(() => scene.value.tree);
const selectedIds = computed(() => scene.value.selectedIds);
const expandedNodeIds = computed(() => scene.value.expandedNodeIds);
const activeNodeId = computed(() => (
  scene.value.focusedNodeId
  ?? selectedIds.value[0]
  ?? visibleNodes.value[0]?.node.id
  ?? null
));

interface VisibleNode {
  node: TreeNode;
  parent: TreeNode | null;
}

function nodeHasChildren(node: TreeNode): boolean {
  return Boolean(node.children?.length);
}

function isExpanded(node: TreeNode): boolean {
  return expandedNodeIds.value.includes(node.id);
}

function collectVisibleNodes(
  nodes: TreeNode[],
  parent: TreeNode | null = null,
  result: VisibleNode[] = []
): VisibleNode[] {
  for (const node of nodes) {
    result.push({ node, parent });
    if (node.children?.length && isExpanded(node)) {
      collectVisibleNodes(node.children, node, result);
    }
  }
  return result;
}

const visibleNodes = computed(() => collectVisibleNodes(tree.value));

function onNodeClick(node: TreeNode) {
  const ids = selectedIds.value.includes(node.id)
    ? selectedIds.value
    : [node.id];
  editor.selectNodes(ids);
  focusRow(node.id);
}

function onNodeDoubleClick(node: TreeNode) {
  editor.openZObject(node.id);
}

function onNodeToggle(node: TreeNode) {
  editor.toggleExpanded(node.id);
}

function focusRow(nodeId: string): void {
  void nextTick(() => {
    document.getElementById(`scene-tree-node-${nodeId}`)?.focus();
  });
}

function focusNode(node: TreeNode | undefined): void {
  if (!node) return;
  editor.selectNodes([node.id]);
  focusRow(node.id);
}

function findVisibleNode(nodeId: string): VisibleNode | undefined {
  return visibleNodes.value.find((entry) => entry.node.id === nodeId);
}

function getKeyboardNode(): TreeNode | undefined {
  const activeElement = document.activeElement;
  const activeRow = activeElement instanceof HTMLElement
    ? activeElement.closest<HTMLElement>('[data-scene-tree-node-id]')
    : null;
  const activeRowId = activeRow && treeRoot.value?.contains(activeRow)
    ? activeRow.dataset.sceneTreeNodeId
    : undefined;
  const nodeId = activeRowId ?? activeNodeId.value;

  return nodeId
    ? findVisibleNode(nodeId)?.node
    : visibleNodes.value[0]?.node;
}

function onTreeKeyStroke(event: KeyboardEvent) {
  if (!treeHasFocus.value) return;

  const node = getKeyboardNode();
  if (!node) return;

  const entries = visibleNodes.value;
  const index = entries.findIndex((entry) => entry.node.id === node.id);

  switch (event.key) {
    case 'ArrowDown':
      event.preventDefault();
      focusNode(entries[Math.min(index + 1, entries.length - 1)]?.node);
      break;
    case 'ArrowUp':
      event.preventDefault();
      focusNode(entries[Math.max(index - 1, 0)]?.node);
      break;
    case 'ArrowRight':
      event.preventDefault();
      if (nodeHasChildren(node) && !isExpanded(node)) {
        editor.toggleExpanded(node.id);
      } else {
        focusNode(node.children?.[0]);
      }
      break;
    case 'ArrowLeft':
      event.preventDefault();
      if (nodeHasChildren(node) && isExpanded(node)) {
        editor.toggleExpanded(node.id);
      } else {
        focusNode(findVisibleNode(node.id)?.parent ?? undefined);
      }
      break;
    case 'Home':
      event.preventDefault();
      focusNode(entries[0]?.node);
      break;
    case 'End':
      event.preventDefault();
      focusNode(entries[entries.length - 1]?.node);
      break;
    case 'Enter':
      event.preventDefault();
      editor.openZObject(node.id);
      break;
    case ' ':
      event.preventDefault();
      if (nodeHasChildren(node)) {
        editor.toggleExpanded(node.id);
      } else {
        focusNode(node);
      }
      break;
  }
}

onKeyStroke(
  ['ArrowDown', 'ArrowUp', 'ArrowRight', 'ArrowLeft', 'Home', 'End', 'Enter', ' '],
  onTreeKeyStroke,
  { target: treeRoot, passive: false }
);
</script>

<template>
  <div ref="treeRoot" class="scene-tree island-radius">
    <div class="scene-tree__header text-xs uppercase tracking-wider font-semibold text-muted-foreground mb-1 px-1">Scene Tree</div>
    <ul class="scene-tree__list" role="tree">
      <SceneTreeNode
        v-for="node in tree"
        :key="node.id"
        :node="node"
        :selected-ids="selectedIds"
        :expanded-node-ids="expandedNodeIds"
        :active-node-id="activeNodeId"
        @select="onNodeClick"
        @open="onNodeDoubleClick"
        @toggle="onNodeToggle"
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
