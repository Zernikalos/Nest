<script setup lang="ts">
defineOptions({ name: 'EditorEmptyState' });

withDefaults(
  defineProps<{
    title: string;
    description?: string;
  }>(),
  { description: '' }
);
</script>

<template>
  <div class="editor-empty-state">
    <slot name="icon" />
    <span class="editor-empty-state__title">{{ title }}</span>
    <p v-if="description" class="editor-empty-state__desc">{{ description }}</p>
  </div>
</template>

<style scoped>
.editor-empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  padding: 1.5rem;
  text-align: center;
  gap: 0.5rem;
}
.editor-empty-state__title {
  font-weight: 600;
  color: var(--base-foreground);
}
.editor-empty-state__desc {
  font-size: 0.875rem;
  margin: 0;
  color: var(--neutral);
}
</style>
