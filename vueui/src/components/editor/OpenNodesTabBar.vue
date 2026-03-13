<script setup lang="ts">
defineOptions({ name: 'OpenNodesTabBar' });
import { computed } from 'vue';
import { useNestEditor } from '@/composables/useNestEditor';
import { cn } from '@/lib/utils';

const editor = useNestEditor();

const openedNodes = computed(() => editor?.openedNodes?.value ?? []);
const activeNode = computed(() => editor?.activeNode?.value ?? null);

function onTabClick(nodeId: string) {
  editor?.handleTabChange(nodeId);
}

function onClose(e: Event, nodeId: string) {
  e.stopPropagation();
  editor?.handleTabClose(nodeId);
}
</script>

<template>
  <div
    v-if="editor && openedNodes.length > 0"
    class="open-nodes-tab-bar flex items-center gap-0.5 border-b border-base-300 bg-base-200 px-1 pt-1 min-h-8 flex-shrink-0 island-radius-t"
  >
    <div
      v-for="node in openedNodes"
      :key="node.id"
      role="tab"
      tabindex="0"
      :class="cn(
        'open-node-tab group inline-flex items-center gap-1.5 island-radius-t px-3 py-1.5 text-sm font-normal transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary border-b-2',
        activeNode === node.id
          ? 'bg-base-100 text-base-foreground shadow border-primary'
          : 'text-muted-foreground hover:bg-base-300 hover:text-base-foreground border-transparent'
      )"
      @click="onTabClick(node.id)"
      @keydown.enter.prevent="onTabClick(node.id)"
      @keydown.space.prevent="onTabClick(node.id)"
    >
      <span class="truncate max-w-[120px]">
        {{ node.label }}
      </span>
      <button
        type="button"
        class="open-node-tab-close rounded p-0.5 hover:bg-base-300 focus-visible:outline-none focus-visible:ring-1 opacity-0 group-hover:opacity-100 transition-opacity"
        :aria-label="`Close ${node.label}`"
        @click="onClose($event, node.id)"
      >
        <span class="inline-block w-3.5 h-3.5 leading-none text-muted-foreground hover:text-base-foreground">×</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.open-nodes-tab-bar {
  flex-shrink: 0;
}
.open-node-tab:hover .open-node-tab-close {
  opacity: 1;
}
</style>
