<script setup lang="ts">
import { computed } from 'vue';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import ScrollArea from '@/components/ui/ScrollArea.vue';
import OpenNodesTabBar from '@/components/editor/OpenNodesTabBar.vue';
import WorkbenchWidgetHost from '@/components/editor/WorkbenchWidgetHost.vue';
import { useEditorStore, useEditorSlice } from '@ide-core/vue';
const LAYOUT_GROUP_ID = 'editor-main';

const editor = useEditorStore();
const workbench = useEditorSlice('workbench');

const leftWidgets = computed(() => workbench.value.areas.left);
const panelSizes = computed(() => workbench.value.panelSizes[LAYOUT_GROUP_ID]);
const leftSize = computed(() => panelSizes.value?.[0] ?? 25);
const rightSize = computed(() => panelSizes.value?.[1] ?? 75);

function handleResize(payload: { panes?: { size: number }[] }) {
  const panesArray = payload?.panes;
  const sizes = Array.isArray(panesArray) ? panesArray.map((p) => p.size) : null;
  if (sizes && sizes.length >= 2) {
    editor.setPanelSizes(LAYOUT_GROUP_ID, sizes);
  }
}
</script>

<template>
  <Splitpanes
    class="h-full resizable-editor splitpanes-islands"
    :horizontal="false"
    @resized="handleResize"
  >
    <Pane :size="leftSize" :min-size="0" :max-size="100" class="resizable-pane-tree resizable-pane-island-left bg-base-200">
      <ScrollArea class="h-full">
        <WorkbenchWidgetHost
          v-for="widget in leftWidgets"
          :key="widget.id"
          :widget-id="widget.id"
        />
      </ScrollArea>
    </Pane>
    <Pane :size="rightSize" :min-size="0" :max-size="100" class="resizable-pane-main resizable-pane-island-right">
      <div class="flex h-full min-h-0 min-w-0 flex-col overflow-hidden">
        <OpenNodesTabBar />
        <div class="min-h-0 flex-1 overflow-hidden">
          <slot />
        </div>
      </div>
    </Pane>
  </Splitpanes>
</template>

<style scoped>
:deep(.splitpanes__splitter) {
  background: transparent;
  width: var(--island-gap);
  cursor: col-resize;
}
:deep(.splitpanes__splitter:hover) {
  background: transparent;
}
:deep(.splitpanes__pane) {
  overflow: hidden;
}
.resizable-pane-island-left {
  border-radius: 0 var(--island-radius) var(--island-radius) 0;
}
.resizable-pane-island-right {
  border-radius: var(--island-radius) 0 0 var(--island-radius);
}
</style>
