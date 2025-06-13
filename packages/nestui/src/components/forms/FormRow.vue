<template>
  <div class="grid grid-cols-2 items-center gap-x-0 py-1">
    <label class="label justify-self-start p-0">
      <span class="label-text text-base-content/80">{{ label }}</span>
    </label>
    <div class="w-full">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{ label: string }>();
</script>
