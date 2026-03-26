<script setup lang="ts">
defineOptions({ name: 'EditorViewerView' });
import { computed, watch } from 'vue';
import { useNestEditor } from '@/composables/useNestEditor';
import ZernikalosViewer from '@/components/ZernikalosViewer/ZernikalosViewer.vue';
import EditorEmptyState from '@/components/editor/EditorEmptyState.vue';

const editor = useNestEditor();

const hasScene = computed(() => editor?.zkResult?.value != null);

const sceneData = computed(() => editor?.zkResult?.value?.proto ?? null);

watch(
  () => editor?.zkResult?.value?.filePath,
  (filePath, oldPath) => {
    if (filePath && filePath !== oldPath && editor?.regenerateZko) {
      editor.regenerateZko();
    }
  }
);

function onViewerError(error: Error) {
  console.error('Zernikalos viewer error', { error });
}
</script>

<template>
  <div class="editor-viewer-view">
    <template v-if="!editor">
      <EditorEmptyState title="Editor context not available." />
    </template>
    <template v-else-if="!hasScene">
      <EditorEmptyState
        title="No scene loaded"
        description="Load a project to preview the 3D scene."
      />
    </template>
    <template v-else>
      <div class="viewer-wrapper">
        <ZernikalosViewer
          :scene-data="sceneData"
          width="100%"
          height="100%"
          @error="onViewerError"
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.editor-viewer-view {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.viewer-wrapper {
  flex: 1;
  min-height: 0;
  width: 100%;
  overflow: hidden;
}
</style>
