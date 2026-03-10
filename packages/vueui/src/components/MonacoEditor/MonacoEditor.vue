<script setup lang="ts">
import { computed } from 'vue';
import { VueMonacoEditor } from '@guolao/vue-monaco-editor';
import { getThemeInfo } from '@/lib/themes';

const props = withDefaults(
  defineProps<{
    modelValue: string;
    language?: string;
    theme?: string;
    height?: string;
    readOnly?: boolean;
  }>(),
  {
    language: 'json',
    theme: 'default',
    height: '100%',
    readOnly: true,
  }
);

defineEmits<{ 'update:modelValue': [value: string] }>();

const monacoTheme = computed(() => {
  const info = getThemeInfo(props.theme);
  return info.isDarkTheme ? 'vs-dark' : 'vs';
});

const editorOptions = {
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  fontSize: 14,
  lineNumbers: 'on' as const,
  roundedSelection: false,
  automaticLayout: true,
  readOnly: props.readOnly,
};
</script>

<template>
  <VueMonacoEditor
    :value="modelValue"
    :language="language"
    :theme="monacoTheme"
    :height="height"
    :options="editorOptions"
    @change="(value: string | undefined) => $emit('update:modelValue', value ?? '')"
  >
    <template #default>Loading editor…</template>
  </VueMonacoEditor>
</template>
