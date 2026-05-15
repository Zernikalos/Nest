<script setup lang="ts">
defineOptions({ name: 'EditorPage' });
import { RouterView } from 'vue-router';
import NestEditorProvider from '@/components/editor/NestEditorProvider.vue';
import EditorLayout from '@/components/editor/EditorLayout.vue';
import DocumentTabBar from '@/components/editor/DocumentTabBar.vue';
</script>

<template>
  <div class="p-3 flex flex-col h-full min-h-0">
    <NestEditorProvider>
      <DocumentTabBar />
      <div class="flex-1 min-h-0 island-radius overflow-hidden flex flex-col">
        <EditorLayout>
          <RouterView />
        </EditorLayout>
      </div>
    </NestEditorProvider>
  </div>
</template>
