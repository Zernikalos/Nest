<script setup lang="ts">
defineOptions({ name: 'DocumentTabBar' });
import { computed } from 'vue';
import { nodeIdToDocumentUri } from '@ide-core';
import { useEditorStore, useEditorSlice } from '@ide-core/vue';
import ObjectTypeIcon from '@/components/editor/ObjectTypeIcon.vue';
import EditorTabBarActions from '@/components/editor/EditorTabBarActions.vue';
import { cn } from '@/lib/utils';

const editor = useEditorStore();
const scene = useEditorSlice('scene');
const documents = useEditorSlice('documents');

const openedNodes = computed(() => scene.value.openedNodes);
const activeNode = computed(() => scene.value.activeNode);
const activeUri = computed(() => documents.value.activeUri);

const otherDocuments = computed(() =>
  documents.value.openedDocuments.filter((doc) => !doc.uri.startsWith('zobject://'))
);

const tabClass = (active: boolean) =>
  cn(
    'open-node-tab group inline-flex flex-shrink-0 cursor-pointer items-center gap-1.5 island-radius-t px-3 py-1.5 text-sm font-normal transition-colors duration-200',
    'border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
    active
      ? 'border-primary bg-base-100 text-base-foreground shadow'
      : 'border-transparent text-muted-foreground hover:bg-base-300 hover:text-base-foreground'
  );

function onTabClick(nodeId: string) {
  editor.openZObject(nodeId);
}

function onClose(e: Event, nodeId: string) {
  e.stopPropagation();
  editor.closeDocument(nodeIdToDocumentUri(nodeId));
}

function labelForUri(uri: string, title?: string): string {
  if (title) return title;
  return uri;
}

function onOtherTabClick(uri: string) {
  editor.setActiveDocument(uri);
}

function onOtherClose(e: Event, uri: string) {
  e.stopPropagation();
  editor.closeDocument(uri);
}

function onScrollWheel(e: WheelEvent) {
  const el = e.currentTarget as HTMLElement;
  if (el.scrollWidth <= el.clientWidth) return;
  if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
  e.preventDefault();
  el.scrollLeft += e.deltaY;
}
</script>

<template>
  <div
    v-if="openedNodes.length > 0 || otherDocuments.length > 0"
    class="open-nodes-tab-bar editor-tab-bar flex min-h-9 w-full min-w-0 flex-shrink-0 items-stretch overflow-hidden border-b border-base-300 bg-base-200/80 island-radius-t"
    role="tablist"
    aria-label="Open documents"
  >
    <div
      class="editor-tab-bar__scroll relative min-w-0 flex-1 overflow-x-auto overflow-y-hidden"
      @wheel="onScrollWheel"
    >
      <div class="editor-tab-bar__track inline-flex items-center gap-0.5 px-1 pb-1 pt-1">
        <div
          v-for="node in openedNodes"
          :key="node.id"
          role="tab"
          tabindex="0"
          :aria-selected="activeNode === node.id"
          :class="tabClass(activeNode === node.id)"
          @click="onTabClick(node.id)"
        >
          <ObjectTypeIcon :type="node.iconType ?? ''" :size="14" class="flex-shrink-0" />
          <span class="max-w-[120px] truncate">{{ node.label }}</span>
          <button
            type="button"
            class="open-node-tab-close rounded p-0.5 opacity-0 transition-opacity hover:bg-base-300 focus-visible:outline-none group-hover:opacity-100"
            :aria-label="`Close ${node.label}`"
            @click="onClose($event, node.id)"
          >
            <span class="block h-3 w-3 leading-none text-muted-foreground">×</span>
          </button>
        </div>
        <div
          v-for="doc in otherDocuments"
          :key="doc.uri"
          role="tab"
          tabindex="0"
          :aria-selected="activeUri === doc.uri"
          :class="tabClass(activeUri === doc.uri)"
          @click="onOtherTabClick(doc.uri)"
        >
          <span class="max-w-[120px] truncate">{{ labelForUri(doc.uri, doc.title) }}</span>
          <button
            type="button"
            class="open-node-tab-close rounded p-0.5 opacity-0 transition-opacity hover:bg-base-300 group-hover:opacity-100"
            :aria-label="`Close ${doc.uri}`"
            @click="onOtherClose($event, doc.uri)"
          >
            <span class="block h-3 w-3 leading-none text-muted-foreground">×</span>
          </button>
        </div>
      </div>
    </div>
    <EditorTabBarActions />
  </div>
</template>

<style scoped>
.editor-tab-bar__scroll {
  overscroll-behavior-x: contain;
}
</style>