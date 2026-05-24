<script setup lang="ts">
defineOptions({ name: 'EditorPage' });
import { RouterView } from 'vue-router';
import NestEditorProvider from '@/components/editor/NestEditorProvider.vue';
import EditorLayout from '@/components/editor/EditorLayout.vue';
</script>

<template>
  <div class="island-inset flex flex-col h-full min-h-0">
    <NestEditorProvider>
      <div class="flex min-h-0 flex-1 flex-col overflow-hidden">
        <EditorLayout>
          <RouterView />
        </EditorLayout>
      </div>
    </NestEditorProvider>
  </div>
</template>
