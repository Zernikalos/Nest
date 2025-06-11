<template>
  <div class="card mb-4">
    <!-- Title -->
    <div v-if="title" class="px-4 pt-4 pb-2 border-b border-primary/60">
      <h2 class="card-title text-base-content/80 text-lg font-semibold leading-tight">
        {{ title }}
      </h2>
    </div>
    <!-- Body -->
    <div class="card-body p-4">
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{ title?: string }>()
const { title } = props
</script>
