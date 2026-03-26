<script setup lang="ts">
import {
  SelectItem as RadixSelectItem,
  SelectItemIndicator,
  SelectItemText,
} from 'radix-vue';
import { Check } from 'lucide-vue-next';
import { cn } from '@/lib/utils';

const props = defineProps<{
  value: string;
  class?: string;
  disabled?: boolean;
}>();
</script>

<template>
  <RadixSelectItem
    :value="props.value"
    :disabled="props.disabled"
    :class="
      cn(
        'relative flex w-full cursor-default select-none items-center gap-2 rounded-sm py-1.5 pr-8 pl-2 text-sm outline-none focus:bg-base-200 focus:text-base-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50',
        props.class
      )
    "
  >
    <span
      class="absolute right-2 flex size-3.5 items-center justify-center"
    >
      <SelectItemIndicator>
        <Check class="size-4" />
      </SelectItemIndicator>
    </span>
    <SelectItemText>
      <slot>{{ props.value }}</slot>
    </SelectItemText>
  </RadixSelectItem>
</template>
