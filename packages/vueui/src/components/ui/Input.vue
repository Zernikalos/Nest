<script setup lang="ts">
import { cn } from '@/lib/utils';

const props = defineProps<{
  class?: string;
  type?: string;
  modelValue?: string | number;
}>();

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

function onInput(event: Event) {
  const target = event.target as HTMLInputElement | null;
  emit('update:modelValue', target?.value ?? '');
}
</script>

<template>
  <input
    :type="props.type ?? 'text'"
    :value="props.modelValue"
    @input="onInput"
    data-slot="input"
    :class="
      cn(
        'flex h-9 w-full min-w-0 rounded-md border border-base-300 bg-transparent px-3 py-1 text-base shadow-xs transition-[color,box-shadow] outline-none disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50 md:text-sm',
        'focus-visible:border-primary focus-visible:ring-primary/50 focus-visible:ring-[3px]',
        'placeholder:text-neutral hover:bg-base-200/50 focus:bg-base-100',
        props.class
      )
    "
    v-bind="$attrs"
  />
</template>
