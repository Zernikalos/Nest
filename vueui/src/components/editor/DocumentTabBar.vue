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
    class="document-tab-bar flex-shrink-0 mb-[var(--island-gap)] border border-base-300 island-radius overflow-hidden bg-base-200/80"
    role="tablist"
    aria-label="Open documents"
  >
    <div class="document-tab-bar__scroll flex items-stretch overflow-x-auto min-h-9">
      <div
        v-for="doc in openedDocuments"
        :key="doc.uri"
        role="tab"
        tabindex="0"
        :aria-selected="activeUri === doc.uri"
        :class="cn(
          'document-tab group relative inline-flex items-center gap-1.5 h-9 max-w-[200px] flex-shrink-0 px-2.5 text-xs cursor-pointer',
          'text-muted-foreground hover:text-base-foreground transition-colors duration-150',
          'focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-inset focus-visible:ring-primary',
          activeUri === doc.uri
            ? 'bg-base-100 text-base-foreground'
            : 'hover:bg-base-300/60'
        )"
        @click="onTabClick(doc.uri)"
        @keydown.enter.prevent="onTabClick(doc.uri)"
        @keydown.space.prevent="onTabClick(doc.uri)"
      >
        <span
          v-if="activeUri === doc.uri"
          class="absolute inset-x-0 top-0 h-px bg-primary"
          aria-hidden
        />
        <span class="truncate min-w-0 font-medium">{{ labelForUri(doc.uri, doc.title) }}</span>
        <button
          type="button"
          :class="cn(
            'document-tab-close flex-shrink-0 rounded p-0.5 -mr-0.5',
            'hover:bg-base-300 focus-visible:outline-none focus-visible:ring-1',
            activeUri === doc.uri ? 'opacity-70 hover:opacity-100' : 'opacity-0 group-hover:opacity-70 group-hover:hover:opacity-100'
          )"
          aria-label="Close"
          @click="onClose($event, doc.uri)"
        >
          <span class="block w-3 h-3 leading-none text-muted-foreground hover:text-base-foreground">×</span>
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.document-tab-bar__scroll {
  scrollbar-width: thin;
}
.document-tab-bar__scroll::-webkit-scrollbar {
  height: 4px;
}
.document-tab-bar__scroll::-webkit-scrollbar-thumb {
  background: var(--base-300, hsl(var(--muted)));
  border-radius: 2px;
}
</style>
