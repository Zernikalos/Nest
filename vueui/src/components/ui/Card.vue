<script setup lang="ts">
import { cn } from '@/lib/utils';

defineProps<{ class?: string }>();
</script>

<template>
  <div
    data-slot="card"
    :class="
      cn(
        'bg-base-200 backdrop-blur-sm text-base-foreground flex flex-col gap-6 rounded-lg border border-base-300 py-6 shadow-sm',
        $props.class
      )
    "
  >
    <slot />
  </div>
</template>
