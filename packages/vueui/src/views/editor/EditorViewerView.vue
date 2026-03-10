<script setup lang="ts">
defineOptions({ name: 'EditorViewerView' });
import { computed, watch } from 'vue';
import { useNestEditor } from '@/composables/useNestEditor';
import ZernikalosViewer from '@/components/ZernikalosViewer/ZernikalosViewer.vue';

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
      <div class="empty-state">Editor context not available.</div>
    </template>
    <template v-else-if="!hasScene">
      <div class="empty-state">
        <span class="empty-state__title">No scene loaded</span>
        <p class="empty-state__desc">Load a project to preview the 3D scene.</p>
      </div>
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
  padding: 1rem;
  height: 100%;
}
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  text-align: center;
  color: #6b7280;
}
.empty-state__title {
  font-weight: 600;
}
.empty-state__desc {
  font-size: 0.875rem;
  margin-top: 0.5rem;
}
.viewer-wrapper {
  height: 100%;
  min-height: 200px;
}
</style>
