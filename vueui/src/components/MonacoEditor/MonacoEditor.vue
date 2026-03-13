<script setup lang="ts">
import { computed } from 'vue';
import { VueMonacoEditor } from '@guolao/vue-monaco-editor';
import { getThemeInfo } from '@/lib/themes';
import oceanicNextTheme from './themes/oceanic-next.json';

const props = withDefaults(
  defineProps<{
    modelValue: string;
    language?: string;
    theme?: string;
    height?: string;
    readOnly?: boolean;
    options?: Record<string, unknown>;
  }>(),
  {
    language: 'json',
    theme: 'default',
    height: '100%',
    readOnly: true,
    options: () => ({}),
  }
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
  change: [value: string | undefined, event: unknown];
  validate: [markers: unknown];
  mount: [editor: unknown, monaco: unknown];
}>();

const monacoTheme = computed(() => {
  const themeMap: Record<string, string> = {
    default: 'vs',
    'default-dark': 'vs-dark',
    ocean: 'oceanic-next',
    forest: 'vs-dark',
    sunset: 'vs-dark',
    purple: 'vs-dark',
    rose: 'vs-dark',
  };

  const mapped = themeMap[props.theme];
  if (mapped) return mapped;

  const info = getThemeInfo(props.theme);
  return info.isDarkTheme ? 'vs-dark' : 'vs';
});

const editorOptions = computed(() => ({
  minimap: { enabled: false },
  scrollBeyondLastLine: false,
  fontSize: 14,
  lineNumbers: 'on' as const,
  roundedSelection: false,
  automaticLayout: true,
  readOnly: props.readOnly,
  ...(props.options ?? {}),
}));

const handleBeforeMount = (monaco: any) => {
  // Register custom themes for Monaco usage.
  monaco.editor.defineTheme('oceanic-next', oceanicNextTheme as any);
};

const handleChange = (value: string | undefined, event: unknown) => {
  emit('update:modelValue', value ?? '');
  emit('change', value, event);
};
</script>

<template>
  <VueMonacoEditor
    :value="modelValue"
    :language="language"
    :theme="monacoTheme"
    :height="height"
    :options="editorOptions"
    @beforeMount="handleBeforeMount"
    @mount="(editor, monaco) => emit('mount', editor, monaco)"
    @validate="(markers) => emit('validate', markers)"
    @change="handleChange"
  >
    <template #default>Loading editor…</template>
  </VueMonacoEditor>
</template>
