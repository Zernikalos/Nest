<script setup lang="ts">
withDefaults(
  defineProps<{
    title: string;
    description: string;
    showActions?: boolean;
  }>(),
  { showActions: true }
);
</script>

<template>
  <div class="h-full flex flex-col flex-1">
    <div class="flex-1 overflow-y-auto space-y-6">
      <div>
        <h2 class="text-2xl font-bold">{{ title }}</h2>
        <p class="text-muted-foreground">{{ description }}</p>
      </div>
      <div class="space-y-6">
        <slot />
      </div>
    </div>
    <div
      v-if="showActions"
      class="sticky bottom-0 bg-base-100 border-t border-base-300 mt-6"
    >
      <div class="flex justify-end p-4">
        <slot name="actions" />
      </div>
    </div>
  </div>
</template>
