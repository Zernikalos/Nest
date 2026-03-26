<script setup lang="ts">
import { DialogTitle as DialogTitlePrimitive } from 'radix-vue';
import { cn } from '@/lib/utils';

defineProps<{ class?: string }>();
</script>

<template>
  <DialogTitlePrimitive
    :class="
      cn(
        'text-lg font-semibold leading-none tracking-tight text-base-foreground',
        $props.class
      )
    "
  >
    <slot />
  </DialogTitlePrimitive>
</template>
