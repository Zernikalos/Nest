<script setup lang="ts">
defineOptions({ name: 'EditorPage' });
import { RouterView, RouterLink } from 'vue-router';
import NestEditorProvider from '@/components/editor/NestEditorProvider.vue';
import EditorLayout from '@/components/editor/EditorLayout.vue';
import DocumentTabBar from '@/components/editor/DocumentTabBar.vue';
import { cn } from '@/lib/utils';
</script>

<template>
  <div class="p-6 flex flex-col h-full">
    <h1 class="text-2xl font-bold tracking-tight mb-2">Editor</h1>
    <NestEditorProvider>
      <DocumentTabBar />
      <nav class="inline-flex h-9 items-center justify-center rounded-lg bg-base-200 p-1 text-muted-foreground mb-4 mt-2">
        <RouterLink
          to="/editor/form"
          :class="cn(
            'inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-colors focus-visible:outline-none',
            'hover:text-base-foreground',
            'data-[active]:bg-base-100 data-[active]:text-base-foreground data-[active]:shadow'
          )"
          active-class="!bg-base-100 !text-base-foreground !shadow"
        >
          Form
        </RouterLink>
        <RouterLink
          to="/editor/code"
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-colors hover:text-base-foreground focus-visible:outline-none"
          active-class="!bg-base-100 !text-base-foreground !shadow"
        >
          Code
        </RouterLink>
        <RouterLink
          to="/editor/viewer"
          class="inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium transition-colors hover:text-base-foreground focus-visible:outline-none"
          active-class="!bg-base-100 !text-base-foreground !shadow"
        >
          Viewer
        </RouterLink>
      </nav>
      <div class="flex-1 min-h-0">
        <EditorLayout>
          <RouterView />
        </EditorLayout>
      </div>
    </NestEditorProvider>
  </div>
</template>
