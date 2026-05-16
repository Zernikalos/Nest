<script setup lang="ts">
defineOptions({ name: 'OpenNodesTabBar' });
import { computed, ref, watch, onMounted, onBeforeUnmount, nextTick } from 'vue';
import { nodeIdToDocumentUri } from '@ide-core';
import { useEditorStore, useEditorSlice } from '@ide-core/vue';
import ObjectTypeIcon from '@/components/editor/ObjectTypeIcon.vue';
import EditorTabBarActions from '@/components/editor/EditorTabBarActions.vue';
import { cn } from '@/lib/utils';
import {
  saveEditorTabBarScrollLeft,
  restoreEditorTabBarScroll,
} from '@/composables/useEditorTabBarScroll';

const editor = useEditorStore();
const scene = useEditorSlice('scene');
const documents = useEditorSlice('documents');

const tabsScrollEl = ref<HTMLElement | null>(null);
const thumbWidthPx = ref(0);
const thumbOffsetPx = ref(0);
const hasOverflow = ref(false);

let resizeObserver: ResizeObserver | null = null;

const openedNodes = computed(() => scene.value.openedNodes);
const activeNode = computed(() => scene.value.activeNode);

function syncThumb() {
  const el = tabsScrollEl.value;
  if (!el) return;

  const { scrollWidth, clientWidth, scrollLeft } = el;
  const overflow = scrollWidth > clientWidth + 1;
  hasOverflow.value = overflow;

  if (!overflow) {
    thumbWidthPx.value = 0;
    thumbOffsetPx.value = 0;
    return;
  }

  const trackWidth = clientWidth;
  thumbWidthPx.value = Math.max(16, (clientWidth / scrollWidth) * trackWidth);
  const maxScroll = scrollWidth - clientWidth;
  const scrollRatio = maxScroll > 0 ? scrollLeft / maxScroll : 0;
  thumbOffsetPx.value = scrollRatio * (trackWidth - thumbWidthPx.value);
}

function onTabClick(nodeId: string) {
  editor.openZObject(nodeId);
}

function onClose(e: Event, nodeId: string) {
  e.stopPropagation();
  const uri = nodeIdToDocumentUri(nodeId);
  const remaining = documents.value.openedDocuments.filter((d) => d.uri !== uri);
  if (remaining.length === 0) return;
  editor.closeDocument(uri);
}

const tabClass = (active: boolean) =>
  cn(
    'open-node-tab group inline-flex flex-shrink-0 cursor-pointer items-center gap-1.5 island-radius-t px-3 py-1.5 text-sm font-normal transition-colors duration-200',
    'border-b-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary',
    active
      ? 'border-primary bg-base-100 text-base-foreground shadow'
      : 'border-transparent text-muted-foreground hover:bg-base-300 hover:text-base-foreground'
  );

function onScrollWheel(e: WheelEvent) {
  const el = e.currentTarget as HTMLElement;
  if (el.scrollWidth <= el.clientWidth) return;
  if (Math.abs(e.deltaY) <= Math.abs(e.deltaX)) return;
  e.preventDefault();
  el.scrollLeft += e.deltaY;
}

onMounted(() => {
  const el = tabsScrollEl.value;
  if (!el) return;
  restoreEditorTabBarScroll(el);
  syncThumb();
  el.addEventListener('scroll', syncThumb, { passive: true });
  resizeObserver = new ResizeObserver(() => syncThumb());
  resizeObserver.observe(el);
});

onBeforeUnmount(() => {
  const el = tabsScrollEl.value;
  if (el) {
    saveEditorTabBarScrollLeft(el.scrollLeft);
    el.removeEventListener('scroll', syncThumb);
  }
  resizeObserver?.disconnect();
});

watch(openedNodes, () => nextTick(syncThumb));
</script>

<template>
  <div
    v-if="openedNodes.length > 0"
    class="open-nodes-tab-bar editor-tab-bar flex min-h-9 w-full min-w-0 flex-shrink-0 items-stretch overflow-hidden border-b border-base-300 bg-base-200/80 island-radius-t"
    role="tablist"
    aria-label="Open editors"
  >
    <div
      ref="tabsScrollEl"
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
          @keydown.enter.prevent="onTabClick(node.id)"
          @keydown.space.prevent="onTabClick(node.id)"
        >
          <ObjectTypeIcon :type="node.iconType ?? ''" :size="14" class="flex-shrink-0" />
          <span class="max-w-[120px] truncate">{{ node.label }}</span>
          <button
            type="button"
            class="open-node-tab-close rounded p-0.5 opacity-0 transition-opacity hover:bg-base-300 focus-visible:outline-none focus-visible:ring-1 group-hover:opacity-100"
            :aria-label="`Close ${node.label}`"
            @click="onClose($event, node.id)"
          >
            <span class="block h-3 w-3 leading-none text-muted-foreground">×</span>
          </button>
        </div>
      </div>
      <div
        v-if="hasOverflow"
        class="pointer-events-none absolute bottom-0 left-0 right-0 h-0.5 bg-base-300"
        aria-hidden="true"
      >
        <div
          class="absolute top-0 h-full rounded-full bg-primary/60 transition-[width,transform] duration-75"
          :style="{ width: `${thumbWidthPx}px`, transform: `translateX(${thumbOffsetPx}px)` }"
        />
      </div>
    </div>

    <EditorTabBarActions />
  </div>
</template>

<style scoped>
.editor-tab-bar__scroll {
  overscroll-behavior-x: contain;
  scrollbar-width: thin;
  scrollbar-color: transparent transparent;
}

.editor-tab-bar__scroll:hover {
  scrollbar-color: hsl(var(--muted-foreground) / 0.35) transparent;
}

.editor-tab-bar__scroll::-webkit-scrollbar {
  height: 3px;
}

.editor-tab-bar__scroll::-webkit-scrollbar-track {
  margin-top: 2px;
  background: transparent;
  border-radius: 999px;
}

.editor-tab-bar__scroll::-webkit-scrollbar-thumb {
  background: transparent;
  border-radius: 999px;
  transition: background 0.2s ease;
}

.editor-tab-bar__scroll:hover::-webkit-scrollbar-thumb {
  background: hsl(var(--muted-foreground) / 0.35);
}
</style>
