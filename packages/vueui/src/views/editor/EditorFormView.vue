<script setup lang="ts">
defineOptions({ name: 'EditorFormView' });
import { computed } from 'vue';
import { useNestEditor } from '@/composables/useNestEditor';
import FormZObject from '@/components/editor/FormZObject.vue';
import type { ZObjectFormShape } from '@/components/editor/CommonFieldsForm.vue';

const editor = useNestEditor();

const selectedObject = computed(() => editor?.selectedZObject?.value as ZObjectFormShape | undefined);
</script>

<template>
  <div class="editor-form-view">
    <template v-if="!editor">
      <div class="empty-state">Editor context not available.</div>
    </template>
    <template v-else-if="!editor.zkResult">
      <div class="empty-state">
        <span class="empty-state__title">Import a project to start editing</span>
        <p class="empty-state__desc">Import a 3D file from the file menu</p>
      </div>
    </template>
    <template v-else-if="!(editor.tree?.value?.length)">
      <div class="empty-state">
        <span class="empty-state__title">No objects found in project</span>
        <p class="empty-state__desc">The project appears to be empty</p>
      </div>
    </template>
    <template v-else-if="!selectedObject">
      <div class="empty-state">
        <span class="empty-state__title">Select a node to open form</span>
        <p class="empty-state__desc">Choose an object from the tree to edit its properties</p>
      </div>
    </template>
    <template v-else>
      <div class="editor-form-content">
        <FormZObject v-if="selectedObject" :z-object="selectedObject" />
      </div>
    </template>
  </div>
</template>

<style scoped>
.editor-form-view {
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
.editor-form-content {
  padding: 1rem 0;
}
.muted {
  font-size: 0.875rem;
  color: #6b7280;
}
</style>
