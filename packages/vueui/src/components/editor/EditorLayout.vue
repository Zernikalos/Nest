<script setup lang="ts">
import { Splitpanes, Pane } from 'splitpanes';
import 'splitpanes/dist/splitpanes.css';
import SceneTree from '@/components/SceneTree.vue';
import ScrollArea from '@/components/ui/ScrollArea.vue';
</script>

<template>
  <Splitpanes class="h-full resizable-editor" :horizontal="false">
    <Pane :size="25" :min-size="15" :max-size="50" class="resizable-pane-tree">
      <ScrollArea class="h-full">
        <SceneTree />
      </ScrollArea>
    </Pane>
    <Pane :size="75" :min-size="30" class="resizable-pane-main flex flex-col min-w-0">
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
