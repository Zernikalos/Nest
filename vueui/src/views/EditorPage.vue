<script setup lang="ts">
defineOptions({ name: 'EditorPage' });
import { RouterView, RouterLink } from 'vue-router';
import NestEditorProvider from '@/components/editor/NestEditorProvider.vue';
import EditorLayout from '@/components/editor/EditorLayout.vue';
import DocumentTabBar from '@/components/editor/DocumentTabBar.vue';
import { cn } from '@/lib/utils';
</script>

<template>
  <div class="p-3 flex flex-col h-full">
    <NestEditorProvider>
      <DocumentTabBar />
      <nav class="inline-flex h-8 items-center justify-center island-radius bg-base-200 p-0.5 text-muted-foreground mb-2">
        <RouterLink
          to="/editor/form"
          :class="cn(
            'inline-flex items-center justify-center whitespace-nowrap island-radius px-2 py-0.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none',
            'hover:text-base-foreground',
            'data-[active]:bg-base-100 data-[active]:text-base-foreground data-[active]:shadow data-[active]:ring-1 data-[active]:ring-base-300'
          )"
          active-class="!bg-base-100 !text-base-foreground !shadow !ring-1 !ring-base-300 !border-b-2 !border-b-primary"
        >
          Form
        </RouterLink>
        <RouterLink
          to="/editor/code"
          :class="cn(
            'inline-flex items-center justify-center whitespace-nowrap island-radius px-2 py-0.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none',
            'hover:text-base-foreground',
            'data-[active]:bg-base-100 data-[active]:text-base-foreground data-[active]:shadow data-[active]:ring-1 data-[active]:ring-base-300'
          )"
          active-class="!bg-base-100 !text-base-foreground !shadow !ring-1 !ring-base-300 !border-b-2 !border-b-primary"
        >
          Code
        </RouterLink>
        <RouterLink
          to="/editor/viewer"
          :class="cn(
            'inline-flex items-center justify-center whitespace-nowrap island-radius px-2 py-0.5 text-sm font-medium transition-colors duration-200 focus-visible:outline-none',
            'hover:text-base-foreground',
            'data-[active]:bg-base-100 data-[active]:text-base-foreground data-[active]:shadow data-[active]:ring-1 data-[active]:ring-base-300'
          )"
          active-class="!bg-base-100 !text-base-foreground !shadow !ring-1 !ring-base-300 !border-b-2 !border-b-primary"
        >
          Viewer
        </RouterLink>
      </nav>
      <div class="flex-1 min-h-0 island-radius overflow-hidden">
        <EditorLayout>
          <RouterView />
        </EditorLayout>
      </div>
    </NestEditorProvider>
  </div>
</template>
