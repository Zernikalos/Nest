<script setup lang="ts">
import { computed } from 'vue';
import { cn } from '@/lib/utils';

const props = withDefaults(
  defineProps<{
    label: string;
    value?: string;
    hasError?: boolean;
    errorMessages?: string | string[];
    class?: string;
  }>(),
  { value: '', hasError: false, errorMessages: () => [], class: '' }
);

const errorArray = computed(() =>
  Array.isArray(props.errorMessages)
    ? props.errorMessages
    : props.errorMessages
      ? [props.errorMessages]
      : []
);
</script>

<template>
  <div class="space-y-1.5">
    <div class="flex items-center justify-between gap-4">
      <span class="text-sm font-medium text-base-foreground">{{ label }}</span>
      <span
        :class="
          cn(
            'text-sm font-mono px-2 py-1 rounded border min-h-[2rem] flex items-center justify-end',
            hasError
              ? 'border-error text-error bg-error/10'
              : 'border-base-300 text-base-foreground bg-base-200',
            props.class
          )
        "
      >
        <slot>{{ value }}</slot>
      </span>
    </div>
    <div
      v-if="hasError && errorArray.length"
      class="mt-2 p-3 rounded-md bg-error/10 border border-error text-error text-sm"
    >
      <p v-for="(msg, i) in errorArray" :key="i" class="mb-1 last:mb-0">
        {{ msg }}
      </p>
    </div>
  </div>
</template>
