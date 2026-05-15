<script setup lang="ts">
import { computed } from 'vue';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import SceneTree from '@/components/SceneTree.vue';
import ScrollArea from '@/components/ui/ScrollArea.vue';
import OpenNodesTabBar from '@/components/editor/OpenNodesTabBar.vue';
import { useIdeCore } from '@/composables/useIdeCore';
import { getWidgetComponent } from '@/editor/widgetRegistry';

const LAYOUT_GROUP_ID = 'editor-main';

const { workbenchViewModel, onLayoutChange } = useIdeCore();

const leftWidgets = computed(() => workbenchViewModel.value.areas.left);
const panelSizes = computed(() => workbenchViewModel.value.panelSizes[LAYOUT_GROUP_ID]);
const leftSize = computed(() => (panelSizes.value?.[0] ?? 25));
const rightSize = computed(() => (panelSizes.value?.[1] ?? 75));

function handleResize(payload: { panes?: { size: number }[] }) {
  const panesArray = payload?.panes;
  const sizes = Array.isArray(panesArray) ? panesArray.map((p) => p.size) : null;
  if (sizes && sizes.length >= 2) {
    onLayoutChange(LAYOUT_GROUP_ID, sizes);
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
        <template v-if="leftWidgets.length > 0">
          <component
            v-for="widget in leftWidgets"
            :key="widget.id"
            :is="getWidgetComponent(widget.id) ?? SceneTree"
          />
        </template>
        <SceneTree v-else />
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
/* Invisible splitter: the gap between islands is the drag handle (width from global --island-gap) */
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
/* Left island: round the right edge (next to the gap) */
.resizable-pane-island-left {
  border-radius: 0 var(--island-radius) var(--island-radius) 0;
}
/* Right island: round the left edge (next to the gap) */
.resizable-pane-island-right {
  border-radius: var(--island-radius) 0 0 var(--island-radius);
}
</style>
