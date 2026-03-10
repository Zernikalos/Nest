<script setup lang="ts">
defineOptions({ name: 'EditorCodeView' });
import { computed } from 'vue';
import { useNestEditor } from '@/composables/useNestEditor';
import { useAppearanceStore } from '@/stores/appearanceStore';
import { sanitizeEditableObject } from '@/utils/sanitizeEditableObject';
import MonacoEditor from '@/components/MonacoEditor/MonacoEditor.vue';

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
      <div class="empty-state">Editor context not available.</div>
    </template>
    <template v-else-if="!hasData">
      <div class="empty-state">
        <span class="empty-state__title">No data available to display</span>
        <p class="empty-state__desc">Load a project and select a node to view JSON.</p>
      </div>
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
.editor-code-content {
  height: 100%;
  overflow: hidden;
}
</style>
