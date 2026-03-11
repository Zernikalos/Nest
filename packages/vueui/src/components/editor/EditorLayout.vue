<script setup lang="ts">
import { computed } from 'vue';
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import SceneTree from '@/components/SceneTree.vue';
import ScrollArea from '@/components/ui/ScrollArea.vue';
import { useIdeCore } from '@/composables/useIdeCore';
import { getWidgetComponent } from '@/editor/widgetRegistry';

const LAYOUT_GROUP_ID = 'editor-main';

const { workbenchViewModel, onLayoutChange } = useIdeCore();

const leftWidgets = computed(() => workbenchViewModel.value.areas.left);
const panelSizes = computed(() => workbenchViewModel.value.panelSizes[LAYOUT_GROUP_ID]);
const leftSize = computed(() => (panelSizes.value?.[0] ?? 25));
const rightSize = computed(() => (panelSizes.value?.[1] ?? 75));

function handleResize(panes: { size: number }[]) {
  const sizes = panes?.map((p) => p.size);
  if (Array.isArray(sizes) && sizes.length >= 2) {
    onLayoutChange(LAYOUT_GROUP_ID, sizes);
  }
}
</script>

<template>
  <Splitpanes
    class="h-full resizable-editor"
    :horizontal="false"
    @resized="handleResize"
  >
    <Pane :size="leftSize" :min-size="15" :max-size="50" class="resizable-pane-tree">
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
    <Pane :size="rightSize" :min-size="30" class="resizable-pane-main flex flex-col min-w-0">
      <slot />
    </Pane>
  </Splitpanes>
</template>

<style scoped>
:deep(.splitpanes__splitter) {
  background-color: var(--base-300);
  width: 4px;
}
:deep(.splitpanes__splitter:hover) {
  background-color: var(--neutral, var(--base-300));
}
:deep(.splitpanes__pane) {
  overflow: hidden;
}
</style>
