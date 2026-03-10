<script setup lang="ts">
import { Label } from 'radix-vue';
import { cn } from '@/lib/utils';

const props = defineProps<{ class?: string; for?: string }>();
</script>

<template>
  <Label
    data-slot="label"
    :class="
      cn(
        'flex items-center gap-2 text-sm leading-none font-medium select-none peer-disabled:cursor-not-allowed peer-disabled:opacity-50',
        props.class
      )
    "
    v-bind="$attrs"
  >
    <slot />
  </Label>
</template>
