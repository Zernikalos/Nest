<script setup lang="ts">
defineOptions({ name: 'DocumentTabBar' });
import { computed } from 'vue';
import { useIdeCore } from '@/composables/useIdeCore';
import { cn } from '@/lib/utils';

const {
  documentViewModel,
  handleSetActiveDocument,
  handleCloseDocument,
} = useIdeCore();

const openedDocuments = computed(() => documentViewModel.value.openedDocuments);
const activeUri = computed(() => documentViewModel.value.activeUri);

function labelForUri(uri: string, title?: string): string {
  if (title) return title;
  if (uri.startsWith('zobject://')) return uri.slice('zobject://'.length);
  return uri;
}

function onTabClick(uri: string) {
  handleSetActiveDocument(uri);
}

function onClose(e: Event, uri: string) {
  e.stopPropagation();
  handleCloseDocument(uri);
}
</script>

<template>
  <div
    v-if="openedDocuments.length > 0"
    class="document-tab-bar flex items-center gap-0.5 island-radius-t border border-b-0 border-base-300 bg-base-200 px-1 pt-1 min-h-9"
  >
    <div
      v-for="doc in openedDocuments"
      :key="doc.uri"
      role="tab"
      tabindex="0"
      :class="cn(
        'document-tab inline-flex items-center gap-1.5 rounded-t-md px-3 py-1.5 text-sm font-medium transition-colors duration-200 cursor-pointer focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary border-b-2',
        activeUri === doc.uri
          ? 'bg-base-100 text-base-foreground shadow border-primary'
          : 'text-muted-foreground hover:bg-base-300 hover:text-base-foreground border-transparent'
      )"
      @click="onTabClick(doc.uri)"
      @keydown.enter.prevent="onTabClick(doc.uri)"
      @keydown.space.prevent="onTabClick(doc.uri)"
    >
      <span class="truncate max-w-[120px]">
        {{ labelForUri(doc.uri, doc.title) }}
      </span>
      <button
        type="button"
        class="document-tab-close rounded p-0.5 hover:bg-base-300 focus-visible:outline-none focus-visible:ring-1"
        aria-label="Close"
        @click="onClose($event, doc.uri)"
      >
        <span class="inline-block w-3.5 h-3.5 leading-none text-muted-foreground hover:text-base-foreground">×</span>
      </button>
    </div>
  </div>
</template>

<style scoped>
.document-tab-bar {
  flex-shrink: 0;
}
</style>
