<script setup lang="ts">
defineOptions({ name: 'EditorFormView' });
import { computed } from 'vue';
import { useNestEditor } from '@/composables/useNestEditor';
import FormZObject from '@/components/editor/FormZObject.vue';
import EditorEmptyState from '@/components/editor/EditorEmptyState.vue';
import ScrollArea from '@/components/ui/ScrollArea.vue';
import type { ZObjectFormShape } from '@/components/editor/CommonFieldsForm.vue';

const editor = useNestEditor();

const selectedObject = computed(() => editor?.selectedZObject?.value as ZObjectFormShape | undefined);
</script>

<template>
  <div class="editor-form-view">
    <template v-if="!editor">
      <EditorEmptyState title="Editor context not available." />
    </template>
    <template v-else-if="!editor.zkResult">
      <EditorEmptyState
        title="Import a project to start editing"
        description="Import a 3D file from the file menu"
      />
    </template>
    <template v-else-if="!(editor.tree?.value?.length)">
      <EditorEmptyState
        title="No objects found in project"
        description="The project appears to be empty"
      />
    </template>
    <template v-else-if="!selectedObject">
      <EditorEmptyState
        title="Select a node to open form"
        description="Choose an object from the tree to edit its properties"
      />
    </template>
    <template v-else>
      <ScrollArea class="editor-form-scroll h-full">
        <div class="editor-form-content">
          <FormZObject v-if="selectedObject" :z-object="selectedObject" />
        </div>
      </ScrollArea>
    </template>
  </div>
</template>

<style scoped>
.editor-form-view {
  padding: 1rem;
  height: 100%;
  min-height: 0;
}
.editor-form-scroll {
  height: 100%;
}
.editor-form-content {
  padding: 1rem 0;
}
</style>
