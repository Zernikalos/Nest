<script setup lang="ts">
import { computed } from 'vue';
import {
  SelectRoot,
  SelectTrigger,
  SelectValue,
  SelectPortal,
  SelectContent,
  SelectViewport,
  SelectItem,
  SelectItemIndicator,
  SelectItemText,
  SelectScrollUpButton,
  SelectScrollDownButton,
} from 'radix-vue';
import { ChevronDown, ChevronUp, Check } from '@lucide/vue';
import { cn } from '@/lib/utils';

const props = withDefaults(
  defineProps<{
    modelValue?: string;
    class?: string;
    placeholder?: string;
    disabled?: boolean;
  }>(),
  { placeholder: 'Select option', disabled: false }
);

const emit = defineEmits<{
  'update:modelValue': [value: string];
}>();

const model = computed({
  get: () => props.modelValue ?? '',
  set: (v: string) => emit('update:modelValue', v),
});
</script>

<template>
  <SelectRoot v-model="model" :disabled="props.disabled">
    <SelectTrigger
      :class="
        cn(
          'border border-base-300 data-[placeholder]:text-muted-foreground flex w-fit items-center justify-between gap-2 rounded-md bg-transparent px-3 py-2 text-sm shadow-xs transition-colors outline-none focus-visible:ring-[3px] focus-visible:ring-primary/50 disabled:cursor-not-allowed disabled:opacity-50 h-9',
          props.class
        )
      "
    >
      <SelectValue :placeholder="props.placeholder" />
      <ChevronDown class="size-4 opacity-50" />
    </SelectTrigger>
    <SelectPortal>
      <SelectContent
        :class="
          cn(
            'bg-base-100 text-base-foreground relative z-50 max-h-60 min-w-[8rem] overflow-hidden rounded-md border border-base-300 shadow-lg',
            props.class
          )
        "
        :side-offset="4"
        position="popper"
      >
        <SelectScrollUpButton
          class="flex cursor-default items-center justify-center py-1"
        >
          <ChevronUp class="size-4" />
        </SelectScrollUpButton>
        <SelectViewport class="p-1">
          <slot />
        </SelectViewport>
        <SelectScrollDownButton
          class="flex cursor-default items-center justify-center py-1"
        >
          <ChevronDown class="size-4" />
        </SelectScrollDownButton>
      </SelectContent>
    </SelectPortal>
  </SelectRoot>
</template>
