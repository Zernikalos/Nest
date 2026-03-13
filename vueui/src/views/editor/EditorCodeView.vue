<script setup lang="ts">
defineOptions({ name: 'EditorCodeView' });
import { computed } from 'vue';
import { useNestEditor } from '@/composables/useNestEditor';
import { useAppearanceStore } from '@/stores/appearanceStore';
import { sanitizeEditableObject } from '@/utils/sanitizeEditableObject';
import MonacoEditor from '@/components/MonacoEditor/MonacoEditor.vue';
import EditorEmptyState from '@/components/editor/EditorEmptyState.vue';

const editor = useNestEditor();
const appearance = useAppearanceStore();

const editableObject = computed(() => {
  const zk = editor?.zkResult?.value;
  const selected = editor?.selectedZObject?.value;
  if (!zk || !selected || typeof (selected as { refId?: string }).refId !== 'string') return null;
  return sanitizeEditableObject(zk, selected as { refId: string });
});

const codeValue = computed(() => {
  const obj = editableObject.value;
  if (obj == null) return '';
  return JSON.stringify(obj, null, 2);
});

const hasData = computed(() => editableObject.value != null);
</script>

<template>
  <div class="editor-code-view">
    <template v-if="!editor">
      <EditorEmptyState title="Editor context not available." />
    </template>
    <template v-else-if="!hasData">
      <EditorEmptyState
        title="No data available to display"
        description="Load a project and select a node to view JSON."
      />
    </template>
    <template v-else>
      <div class="editor-code-content">
        <MonacoEditor
          :model-value="codeValue"
          language="json"
          :theme="appearance.theme"
          height="100%"
          read-only
        />
      </div>
    </template>
  </div>
</template>

<style scoped>
.editor-code-view {
  height: 100%;
  min-height: 0;
  display: flex;
  flex-direction: column;
}
.editor-code-content {
  flex: 1;
  min-height: 0;
  overflow: hidden;
  background: var(--base-100);
}
/* Remove extra margins from Monaco container so theme and layout are consistent */
.editor-code-content :deep(.monaco-editor) {
  padding: 0;
}
.editor-code-content :deep(.overflowing-hidden) {
  padding: 0;
}
</style>
